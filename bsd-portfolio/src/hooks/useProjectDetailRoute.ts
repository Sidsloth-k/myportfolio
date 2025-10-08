import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UiProject } from '../utils/projects';

type DetailDeps = {
  projects: UiProject[];
  findProjectInState: (idNum: number) => UiProject | any | null;
  fetchProjectDetail: (idNum: number) => Promise<UiProject | null>;
  lastDetailFetchMsRef: React.MutableRefObject<number>;
};

export function useProjectDetailRoute({ projects, findProjectInState, fetchProjectDetail, lastDetailFetchMsRef }: DetailDeps) {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!params.id) {
      setSelectedProject(null);
      setDetailLoading(false);
      return;
    }
    const projectId = Number(params.id);
    if (!Number.isFinite(projectId)) return;

    const existing = findProjectInState(projectId);
    if (existing) {
      setSelectedProject(existing);
      const needsEnrich = (!existing.technologies || (Array.isArray(existing.technologies) && existing.technologies.length > 0 && typeof existing.technologies[0] === 'string'))
        || !existing.images || !existing.roadmap || !existing.metrics || !existing.testimonials;
      if (needsEnrich) {
        (async () => {
          const detail = await fetchProjectDetail(projectId);
          if (detail) setSelectedProject(detail);
        })();
      }
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    (async () => {
      try {
        const detail = await fetchProjectDetail(projectId);
        const minimumDetailMs = 800;
        const bufferMs = 300;
        const delay = Math.max(minimumDetailMs, Math.min(4000, lastDetailFetchMsRef.current + bufferMs));
        setTimeout(() => {
          if (!cancelled) {
            if (detail) setSelectedProject(detail);
            else navigate('/projects');
            setDetailLoading(false);
          }
        }, delay);
      } catch (error) {
        console.error('Error fetching project detail:', error);
        if (!cancelled) {
          navigate('/projects');
          setDetailLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [params.id, navigate, findProjectInState, fetchProjectDetail, lastDetailFetchMsRef]);

  return { selectedProject, setSelectedProject, detailLoading } as const;
}


