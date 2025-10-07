import { useState, useEffect } from 'react';
import { useApiBaseUrl } from '../utils/projects';
import { Skill } from './useSkillsList';

export function useSkillDetail(skillId: number | null) {
  const baseUrl = useApiBaseUrl();
  const [skillDetail, setSkillDetail] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillId) {
      setSkillDetail(null);
      return;
    }

    const fetchSkillDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch(`${baseUrl}/api/skills/${skillId}`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch skill details');
        }
        
        setSkillDetail(json.data);
        
      } catch (err) {
        console.error('❌ Error fetching skill details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch skill details');
        setSkillDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillDetail();
  }, [skillId, baseUrl]);

  return { skillDetail, isLoading, error };
}
