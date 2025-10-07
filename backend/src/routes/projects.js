const express = require('express');
const router = express.Router();
const pool = require('../database/config');
const { LRUCache } = require('lru-cache');
const { normalizeTechnologies } = require('../services/TechnologyProficiencyService');

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60, // 1 minute
});

// GET - Retrieve all projects with basic information
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'projects_full_list';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    const { rows } = await pool.query(`
      WITH p AS (
        SELECT id, title, category, type, description, subtitle, long_description,
               timeline, team, role, budget, client, cover_image_url, highlight
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
                     jsonb_build_object('id', t2.id, 'name', t2.name, 'category', t2.category,
                       'level', pt2.level, 'icon', t2.icon) AS obj,
                     t2.name AS name
                   FROM project_technologies pt2
                   JOIN technologies t2 ON t2.id = pt2.technology_id
                   WHERE pt2.project_id = pt.project_id
                 ) j
               ) AS technologies,
               (
                 SELECT array_agg(name ORDER BY name)
                 FROM (
                   SELECT DISTINCT t2.name AS name
                   FROM project_technologies pt2
                   JOIN technologies t2 ON t2.id = pt2.technology_id
                   WHERE pt2.project_id = pt.project_id
                 ) n
               ) AS technologies_names
        FROM project_technologies pt
        GROUP BY pt.project_id
      ),
      imgs AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'url', url, 'caption', caption, 'type', type, 'order', "order")
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
    `);

    // Normalize technology proficiency
    const enriched = rows.map(r => ({
      ...r,
      technologies: normalizeTechnologies(r.technologies || []),
    }));

    cache.set(cacheKey, enriched);
    res.json({ success: true, data: enriched });

  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects',
      message: error.message,
      details: error.sql || 'No SQL details'
    });
  }
});

// GET - Retrieve project categories for filtering
router.get('/categories', async (req, res) => {
  try {
    const { rows: categories } = await pool.query(`
      SELECT DISTINCT 
        p.category,
        COUNT(p.id) as project_count
      FROM projects p
      WHERE p.is_active = TRUE
      GROUP BY p.category
      ORDER BY project_count DESC, p.category ASC
    `);

    const categoryData = categories.map(cat => ({
      id: cat.category.toLowerCase(),
      name: cat.category,
      count: parseInt(cat.project_count),
      label: cat.category
    }));

    res.json({
      success: true,
      data: categoryData
    });

  } catch (error) {
    console.error('❌ Error fetching project categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve project categories',
      message: error.message
    });
  }
});

// GET - Retrieve a specific project with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `project_full_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });

    const { rows } = await pool.query(`
      WITH p AS (
        SELECT id, title, category, type, description, subtitle, long_description,
               timeline, team, role, budget, client, cover_image_url, highlight
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
                     jsonb_build_object('id', t2.id, 'name', t2.name, 'category', t2.category,
                       'level', pt2.level, 'icon', t2.icon) AS obj,
                     t2.name AS name
                   FROM project_technologies pt2
                   JOIN technologies t2 ON t2.id = pt2.technology_id
                   WHERE pt2.project_id = pt.project_id
                 ) j
               ) AS technologies,
               (
                 SELECT array_agg(name ORDER BY name)
                 FROM (
                   SELECT DISTINCT t2.name AS name
                   FROM project_technologies pt2
                   JOIN technologies t2 ON t2.id = pt2.technology_id
                   WHERE pt2.project_id = pt.project_id
                 ) n
               ) AS technologies_names
        FROM project_technologies pt
        WHERE pt.project_id = $1
        GROUP BY pt.project_id
      ),
      imgs AS (
        SELECT project_id,
               jsonb_agg(jsonb_build_object('id', id, 'url', url, 'caption', caption, 'type', type, 'order', "order")
                 ORDER BY "order", id) AS images
        FROM project_images WHERE project_id = $1 GROUP BY project_id
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
             COALESCE(stats.stats, '[]') AS stats,
             COALESCE(metrics.metrics, '[]') AS metrics,
             COALESCE(tms.testimonials, '[]') AS testimonials,
             COALESCE(phases.roadmap, '[]') AS roadmap,
             COALESCE(skills.skills, '[]') AS skills
      FROM p
      LEFT JOIN links   ON links.project_id = p.id
      LEFT JOIN techs   ON techs.project_id = p.id
      LEFT JOIN imgs    ON imgs.project_id  = p.id
      LEFT JOIN stats   ON stats.project_id = p.id
      LEFT JOIN metrics ON metrics.project_id = p.id
      LEFT JOIN tms     ON tms.project_id = p.id
      LEFT JOIN phases  ON phases.project_id = p.id
      LEFT JOIN skills  ON skills.project_id  = p.id;
    `, [id]);

    if (!rows.length) return res.status(404).json({ success: false, error: 'Project not found' });

    const row = rows[0];
    const enriched = {
      ...row,
      technologies: normalizeTechnologies(row.technologies || []),
    };

    cache.set(cacheKey, enriched);
    res.json({ success: true, data: enriched });

  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve project',
      message: error.message
    });
  }
});

// POST - Create a new project (minimal fields; admin only in future)
router.post('/', async (req, res) => {
  try {
    const { title, category, type, description, cover_image_url, highlight } = req.body;
    const insert = await pool.query(
      `INSERT INTO projects (title, category, type, description, cover_image_url, highlight)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, category, type, description, cover_image_url || null, highlight || null]
    );
    res.status(201).json({ success: true, message: 'Project created', data: insert.rows[0] });

  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      message: error.message
    });
  }
});

// PUT - Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const keys = Object.keys(payload).filter(k => payload[k] !== undefined);
    if (!keys.length) return res.status(400).json({ success: false, error: 'No fields to update' });
    const sets = keys.map((k, i) => `${k} = $${i + 1}`);
    const values = keys.map(k => payload[k]);
    values.push(id);
    const upd = await pool.query(`UPDATE projects SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`, values);
    if (!upd.rowCount) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project updated', data: upd.rows[0] });

  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
      message: error.message
    });
  }
});

// DELETE - Soft delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const upd = await pool.query(`UPDATE projects SET is_active = FALSE, updated_at = NOW() WHERE id = $1`, [id]);
    if (!upd.rowCount) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });

  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      message: error.message
    });
  }
});

module.exports = router;