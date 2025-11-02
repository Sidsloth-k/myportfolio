/**
 * Project Query Builders
 * Contains all SQL queries for project operations
 */

class ProjectQueries {
  /**
   * Build query to fetch all projects with all related data
   */
  static getAllProjectsQuery() {
    return `
      WITH p AS (
        SELECT id, title, category, type, description, subtitle, long_description,
               timeline, team, role, budget, client, cover_image_url, highlight, highlight_background_color,
               created_at, updated_at, is_active
        FROM projects
        WHERE is_active = TRUE
        ORDER BY id ASC
      ),
      links AS (
        SELECT project_id,
               jsonb_build_object('live', live, 'github', github, 'documentation', documentation,
                 'case_study', case_study, 'demo', demo) AS links
        FROM project_links
      ),
      techs AS (
        SELECT pt.project_id,
               (
                 SELECT jsonb_agg(obj ORDER BY name)
                 FROM (
                   SELECT DISTINCT
                     jsonb_build_object('id', s2.id, 'name', s2.name, 'category', s2.category,
                       'level', pt2.level, 'icon', s2.icon) AS obj,
                     s2.name AS name
                   FROM project_technologies pt2
                   JOIN skills s2 ON s2.id = pt2.skill_id
                   WHERE pt2.project_id = pt.project_id
                 ) j
               ) AS technologies,
               (
                 SELECT array_agg(name ORDER BY name)
                 FROM (
                   SELECT DISTINCT s2.name AS name
                   FROM project_technologies pt2
                   JOIN skills s2 ON s2.id = pt2.skill_id
                   WHERE pt2.project_id = pt.project_id
                 ) n
               ) AS technologies_names
        FROM project_technologies pt
        GROUP BY pt.project_id
      ),
      imgs AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'url', url, 'caption', caption, 'type', type, 'order', "order", 'alt_text', alt)
                 ORDER BY "order", id) AS images
        FROM project_images GROUP BY project_id
      ),
      feats AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'title', title, 'description', description,
                 'icon_key', icon_key, 'status', status, 'impact', impact, 'order', "order")
                 ORDER BY "order", id) AS features
        FROM project_features GROUP BY project_id
      ),
      phases AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object(
                 'id', id,
                 'phase', phase,
                 'description', description,
                 'duration', duration,
                 'status', status,
                 'deliverables', deliverables,
                 'challenges', challenges,
                 'solutions', solutions,
                 'order', "order",
                 'progress_percent', (
                   CASE 
                     WHEN LOWER(status) LIKE 'completed%' THEN 100
                     WHEN LOWER(status) LIKE 'in%progress%' THEN 50
                     WHEN LOWER(status) LIKE 'not%started%' THEN 0
                     ELSE 0
                   END
                 )
               ) ORDER BY "order", id) AS roadmap
        FROM project_roadmap_phases GROUP BY project_id
      ),
      stats AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('key', key, 'value', value, 'is_list_stat', is_list_stat, 'order', "order")
                 ORDER BY "order", id) AS stats
        FROM project_stats GROUP BY project_id
      ),
      metrics AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('key', key, 'value', value, 'order', "order") ORDER BY "order", id) AS metrics
        FROM project_metrics GROUP BY project_id
      ),
      tms AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'name', name, 'role', role, 'company', company,
                 'quote', quote, 'rating', rating, 'order', "order") ORDER BY "order", id) AS testimonials
        FROM project_testimonials GROUP BY project_id
      ),
      skills AS (
        SELECT sp.project_id,
               (
                 SELECT jsonb_agg(obj ORDER BY name)
                 FROM (
                   SELECT DISTINCT
                     jsonb_build_object('id', s2.id, 'name', s2.name, 'contribution', sp2.contribution, 'complexity', sp2.complexity) AS obj,
                     s2.name AS name
                   FROM skill_projects sp2
                   JOIN skills s2 ON s2.id = sp2.skill_id
                   WHERE sp2.project_id = sp.project_id
                 ) k
               ) AS skills
        FROM skill_projects sp
        GROUP BY sp.project_id
      )
      SELECT p.*, 
             COALESCE(links.links, '{}'::jsonb) AS links,
             COALESCE(techs.technologies_names, '{}') AS technologies_names,
             COALESCE(techs.technologies, '[]') AS technologies,
             COALESCE(imgs.images, '[]') AS images,
             COALESCE(feats.features, '[]') AS features,
             COALESCE(phases.roadmap, '[]') AS roadmap,
             COALESCE(stats.stats, '[]') AS stats,
             COALESCE(metrics.metrics, '[]') AS metrics,
             COALESCE(tms.testimonials, '[]') AS testimonials,
             COALESCE(skills.skills, '[]') AS skills
      FROM p
      LEFT JOIN links   ON links.project_id = p.id
      LEFT JOIN techs   ON techs.project_id = p.id
      LEFT JOIN imgs    ON imgs.project_id  = p.id
      LEFT JOIN feats   ON feats.project_id = p.id
      LEFT JOIN phases  ON phases.project_id = p.id
      LEFT JOIN stats   ON stats.project_id = p.id
      LEFT JOIN metrics ON metrics.project_id = p.id
      LEFT JOIN tms     ON tms.project_id = p.id
      LEFT JOIN skills  ON skills.project_id = p.id
      ORDER BY p.id ASC;
    `;
  }

  /**
   * Build query to fetch a single project with all related data
   */
  static getProjectByIdQuery() {
    return `
      WITH p AS (
        SELECT id, title, category, type, description, subtitle, long_description,
               timeline, team, role, budget, client, cover_image_url, highlight, highlight_background_color,
               created_at, updated_at, is_active
        FROM projects WHERE id = $1 AND is_active = TRUE
      ),
      links AS (
        SELECT project_id,
               jsonb_build_object('live', live, 'github', github, 'documentation', documentation,
                 'case_study', case_study, 'demo', demo) AS links
        FROM project_links WHERE project_id = $1
      ),
      techs AS (
        SELECT pt.project_id,
               (
                 SELECT jsonb_agg(obj ORDER BY name)
                 FROM (
                   SELECT DISTINCT
                     jsonb_build_object('id', s2.id, 'name', s2.name, 'category', s2.category,
                       'level', pt2.level, 'icon', s2.icon) AS obj,
                     s2.name AS name
                   FROM project_technologies pt2
                   JOIN skills s2 ON s2.id = pt2.skill_id
                   WHERE pt2.project_id = pt.project_id
                 ) j
               ) AS technologies,
               (
                 SELECT array_agg(name ORDER BY name)
                 FROM (
                   SELECT DISTINCT s2.name AS name
                   FROM project_technologies pt2
                   JOIN skills s2 ON s2.id = pt2.skill_id
                   WHERE pt2.project_id = pt.project_id
                 ) n
               ) AS technologies_names
        FROM project_technologies pt
        WHERE pt.project_id = $1
        GROUP BY pt.project_id
      ),
      imgs AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'url', url, 'caption', caption, 'type', type, 'order', "order", 'alt_text', alt)
                 ORDER BY "order", id) AS images
        FROM project_images WHERE project_id = $1 GROUP BY project_id
      ),
      feats AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'title', title, 'description', description,
                 'icon_key', icon_key, 'status', status, 'impact', impact, 'order', "order")
                 ORDER BY "order", id) AS features
        FROM project_features WHERE project_id = $1 GROUP BY project_id
      ),
      stats AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('key', key, 'value', value, 'is_list_stat', is_list_stat, 'order', "order")
                 ORDER BY "order", id) AS stats
        FROM project_stats WHERE project_id = $1 GROUP BY project_id
      ),
      metrics AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('key', key, 'value', value, 'order', "order") ORDER BY "order", id) AS metrics
        FROM project_metrics WHERE project_id = $1 GROUP BY project_id
      ),
      tms AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'name', name, 'role', role, 'company', company,
                 'quote', quote, 'rating', rating, 'order', "order") ORDER BY "order", id) AS testimonials
        FROM project_testimonials WHERE project_id = $1 GROUP BY project_id
      ),
      skills AS (
        SELECT sp.project_id,
               jsonb_agg(jsonb_build_object('id', s.id, 'name', s.name, 'contribution', sp.contribution, 'complexity', sp.complexity)
                 ORDER BY s.name) AS skills
        FROM skill_projects sp JOIN skills s ON s.id = sp.skill_id
        WHERE sp.project_id = $1
        GROUP BY sp.project_id
      ),
      phases AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object(
                 'id', id,
                 'phase', phase,
                 'description', description,
                 'duration', duration,
                 'status', status,
                 'deliverables', deliverables,
                 'challenges', challenges,
                 'solutions', solutions,
                 'order', "order",
                 'progress_percent', (
                   CASE 
                     WHEN LOWER(status) LIKE 'completed%' THEN 100
                     WHEN LOWER(status) LIKE 'in%progress%' THEN 50
                     WHEN LOWER(status) LIKE 'not%started%' THEN 0
                     ELSE 0
                   END
                 )
               ) ORDER BY "order", id) AS roadmap
        FROM project_roadmap_phases WHERE project_id = $1 GROUP BY project_id
      )
      SELECT p.*, 
             COALESCE(links.links, '{}'::jsonb) AS links,
             COALESCE(techs.technologies_names, '{}') AS technologies_names,
             COALESCE(techs.technologies, '[]') AS technologies,
             COALESCE(imgs.images, '[]') AS images,
             COALESCE(feats.features, '[]') AS features,
             COALESCE(stats.stats, '[]') AS stats,
             COALESCE(metrics.metrics, '[]') AS metrics,
             COALESCE(tms.testimonials, '[]') AS testimonials,
             COALESCE(phases.roadmap, '[]') AS roadmap,
             COALESCE(skills.skills, '[]') AS skills
      FROM p
      LEFT JOIN links   ON links.project_id = p.id
      LEFT JOIN techs   ON techs.project_id = p.id
      LEFT JOIN imgs    ON imgs.project_id  = p.id
      LEFT JOIN feats   ON feats.project_id = p.id
      LEFT JOIN stats   ON stats.project_id = p.id
      LEFT JOIN metrics ON metrics.project_id = p.id
      LEFT JOIN tms     ON tms.project_id = p.id
      LEFT JOIN phases  ON phases.project_id = p.id
      LEFT JOIN skills  ON skills.project_id  = p.id;
    `;
  }

  /**
   * Build query to get project categories
   */
  static getCategoriesQuery() {
    return `
      SELECT DISTINCT 
        p.category,
        COUNT(p.id) as project_count
      FROM projects p
      WHERE p.is_active = TRUE
      GROUP BY p.category
      ORDER BY project_count DESC, p.category ASC
    `;
  }

  /**
   * Build query to get project types
   */
  static getTypesQuery() {
    return `
      SELECT DISTINCT 
        p.type,
        COUNT(p.id) as project_count
      FROM projects p
      WHERE p.is_active = TRUE
      GROUP BY p.type
      ORDER BY project_count DESC, p.type ASC
    `;
  }
}

module.exports = ProjectQueries;

