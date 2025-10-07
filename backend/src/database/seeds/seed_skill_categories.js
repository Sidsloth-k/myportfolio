const pool = require('../config');

async function upsertSkillCategory(client, { name, description, color, icon, display_order }) {
  const upsert = await client.query(`
    INSERT INTO skill_categories (name, description, color, icon, display_order, is_active)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    ON CONFLICT (name) DO UPDATE SET 
      description = EXCLUDED.description,
      color = EXCLUDED.color,
      icon = EXCLUDED.icon,
      display_order = EXCLUDED.display_order,
      updated_at = NOW()
    RETURNING id
  `, [name, description || null, color || null, icon || null, display_order || 0]);
  return upsert.rows[0].id;
}

async function main() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Seed skill categories
    const categories = [
      {
        name: 'Frontend',
        description: 'Frontend development and user interface skills',
        color: '#3B82F6',
        icon: 'Code',
        display_order: 1
      },
      {
        name: 'Backend',
        description: 'Backend development and server-side skills',
        color: '#10B981',
        icon: 'Server',
        display_order: 2
      },
      {
        name: 'Database',
        description: 'Database management and data skills',
        color: '#8B5CF6',
        icon: 'Database',
        display_order: 3
      },
      {
        name: 'Design',
        description: 'User experience and visual design skills',
        color: '#F59E0B',
        icon: 'Palette',
        display_order: 4
      },
      {
        name: 'Marketing',
        description: 'Digital marketing and growth strategies',
        color: '#EF4444',
        icon: 'TrendingUp',
        display_order: 5
      },
      {
        name: 'Language',
        description: 'Programming languages and frameworks',
        color: '#06B6D4',
        icon: 'Star',
        display_order: 6
      }
    ];

    for (const category of categories) {
      await upsertSkillCategory(client, category);
    }

    await client.query('COMMIT');
    console.log('✅ Skill categories seeded successfully');
    process.exit(0);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', e.message);
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

main();
