const express = require('express');
const router = express.Router();
// focusing on projects only for now

// GET - Retrieve about content (simplified for now)
router.get('/', async (req, res) => {
  try {
    const aboutData = {
      title: "Sidney - Digital Detective",
      subtitle: "Full-Stack Developer • UX Designer • Marketing Strategist",
      description: "Solving digital mysteries with code, design, and strategy. Every project is a case to crack, every user a witness to delight.",
      personal_story: "From the shadows of Port Mafia to the light of the Armed Detective Agency, my journey in development mirrors the complexity of human nature itself.",
      personal_details: {
        fuel_of_choice: "Coffee & Contemplation",
        favorite_genre: "Mystery & Psychological Thriller",
        first_language: "JavaScript (and sarcasm)",
        based_in: "Digital Realm",
        detective_since: "2019",
        secret_weakness: "Perfectionism"
      },
      detective_philosophy: [
        {
          quote_text: "Every bug is a mystery waiting to be solved.",
          context: "Debugging Philosophy"
        },
        {
          quote_text: "The best code is like a good mystery novel - complex yet elegant.",
          context: "Development Approach"
        }
      ],
      detective_quirks: [
        { quirk_text: "Always tests edge cases first" },
        { quirk_text: "Refactors code while thinking" },
        { quirk_text: "Debugs with classical music" }
      ],
      fun_stats: [
        { stat_name: "Coffee Cups", stat_value: "∞" },
        { stat_name: "Bugs Solved", stat_value: "2,847" },
        { stat_name: "Code Reviews", stat_value: "1,293" },
        { stat_name: "Late Night Deploys", stat_value: "567" }
      ]
    };

    res.json({ success: true, data: aboutData });

  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve about content' });
  }
});

module.exports = router;