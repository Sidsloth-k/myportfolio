const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET - Retrieve all characters (simplified - return default data for now)
router.get('/', async (req, res) => {
  try {
    // Return default character data since we don't have character tables yet
    const charactersData = [
      {
        id: "char-dazai",
        name: "Osamu Dazai",
        description: "Former Port Mafia executive turned Armed Detective Agency member",
        personality: "Mysterious, playful, and deeply intelligent",
        abilities: ["No Longer Human - Nullification"],
        image_url: "/images/characters/dazai.svg",
        quotes: [
          {
            quote_text: "The longer you live, the more you realize that in this reality only pain, suffering and futility exist.",
            context: "Life Philosophy"
          },
          {
            quote_text: "I want to be a writer who stirs people's hearts.",
            context: "Dreams and Aspirations"
          }
        ]
      },
      {
        id: "char-chuuya",
        name: "Chuuya Nakahara",
        description: "Port Mafia executive with gravity manipulation abilities",
        personality: "Hot-tempered, loyal, and proud",
        abilities: ["For the Tainted Sorrow - Gravity Manipulation"],
        image_url: "/images/characters/chuuya.svg",
        quotes: [
          {
            quote_text: "Being a fool who stands at the top is infinitely better than being a wise man who stands at the bottom.",
            context: "Leadership Philosophy"
          }
        ]
      },
      {
        id: "char-atsushi",
        name: "Atsushi Nakajima",
        description: "Armed Detective Agency member with tiger transformation ability",
        personality: "Kind-hearted, determined, and self-doubting",
        abilities: ["Beast Beneath the Moonlight - Tiger Transformation"],
        image_url: "/images/characters/atsushi.svg",
        quotes: [
          {
            quote_text: "I have to save people. That's the reason I was born.",
            context: "Life Purpose"
          }
        ]
      },
      {
        id: "char-akutagawa",
        name: "Ryunosuke Akutagawa",
        description: "Port Mafia member with dark fabric manipulation abilities",
        personality: "Ruthless, dedicated, and seeking recognition",
        abilities: ["Rashomon - Dark Fabric Manipulation"],
        image_url: "/images/characters/akutagawa.svg",
        quotes: [
          {
            quote_text: "Those who fail to protect what matters will lose everything.",
            context: "Protection Philosophy"
          }
        ]
      },
      {
        id: "char-ranpo",
        name: "Ranpo Edogawa",
        description: "Armed Detective Agency's greatest detective",
        personality: "Childish, brilliant, and observant",
        abilities: ["Super Deduction - Enhanced Analytical Skills"],
        image_url: "/images/characters/ranpo.svg",
        quotes: [
          {
            quote_text: "The truth is something you have to reach for yourself.",
            context: "Detective Work"
          }
        ]
      },
      {
        id: "char-yosano",
        name: "Akiko Yosano",
        description: "Armed Detective Agency doctor with healing abilities",
        personality: "Strong-willed, caring, and fierce",
        abilities: ["Thou Shalt Not Die - Healing Powers"],
        image_url: "/images/characters/yosano.svg",
        quotes: [
          {
            quote_text: "A doctor who doesn't value life isn't worth calling a doctor.",
            context: "Medical Ethics"
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: charactersData
    });

  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve characters',
      message: error.message
    });
  }
});

// GET - Retrieve character quotes
router.get('/quotes', async (req, res) => {
  try {
    // For now, return a simple quote rotation system
    const quotes = [
      {
        id: "quote-1",
        character_name: "Osamu Dazai",
        quote_text: "The longer you live, the more you realize that in this reality only pain, suffering and futility exist.",
        context: "Life Philosophy",
        is_active: true
      },
      {
        id: "quote-2",
        character_name: "Chuuya Nakahara",
        quote_text: "Being a fool who stands at the top is infinitely better than being a wise man who stands at the bottom.",
        context: "Leadership Philosophy",
        is_active: true
      },
      {
        id: "quote-3",
        character_name: "Atsushi Nakajima",
        quote_text: "I have to save people. That's the reason I was born.",
        context: "Life Purpose",
        is_active: true
      }
    ];

    res.json({
      success: true,
      data: quotes
    });

  } catch (error) {
    console.error('Error fetching character quotes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve character quotes',
      message: error.message
    });
  }
});

module.exports = router;