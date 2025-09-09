const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET - Retrieve hero content
router.get('/', async (req, res) => {
  try {
    const [heroContent] = await pool.query(`
      SELECT * FROM hero_content 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (heroContent.length === 0) {
      return res.json({
        success: true,
        data: {
          title: 'Sidney - Digital Detective',
          subtitle: 'Full-Stack Developer • UX Designer • Marketing Strategist',
          description: 'Solving digital mysteries with code, design, and strategy. Every project is a case to crack, every user a witness to delight.'
        }
      });
    }

    const hero = heroContent[0];

    // Get hero quotes
    const [quotes] = await pool.query(`
      SELECT * FROM hero_quotes 
      WHERE hero_content_id = ? AND is_active = TRUE 
      ORDER BY display_order ASC, created_at ASC
    `, [hero.id]);

    // Get hero CTA buttons
    const [ctaButtons] = await pool.query(`
      SELECT * FROM hero_cta_buttons 
      WHERE hero_content_id = ? AND is_active = TRUE 
      ORDER BY display_order ASC, created_at ASC
    `, [hero.id]);

    const heroWithDetails = {
      ...hero,
      quotes,
      cta_buttons: ctaButtons
    };

    res.json({
      success: true,
      data: heroWithDetails
    });

  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve hero content',
      message: error.message
    });
  }
});

module.exports = router;
