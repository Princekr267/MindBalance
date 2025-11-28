const express = require('express');
const router = express.Router();

// Curated list of meditations
const meditations = [
  {
    id: 1,
    title: "Deep Breathing for Anxiety",
    category: "Anxiety",
    duration: "10 min",
    url: "https://www.youtube.com/watch?v=O-6f5wQXSu8", // Placeholder
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
    minScore: 7, // Recommended for high stress
    maxScore: 10
  },
  {
    id: 2,
    title: "Sleep Relaxation",
    category: "Sleep",
    duration: "15 min",
    url: "https://www.youtube.com/watch?v=aEqlQvczMJQ",
    image: "https://images.unsplash.com/photo-1511296933631-18b5f0bc0846?w=500&q=80",
    minScore: 6,
    maxScore: 10
  },
  {
    id: 3,
    title: "5-Minute Mindfulness",
    category: "Mindfulness",
    duration: "5 min",
    url: "https://www.youtube.com/watch?v=ssss7V1_eyA",
    image: "https://images.unsplash.com/photo-1559595500-e15296bdbb48?w=500&q=80",
    minScore: 0,
    maxScore: 10 // Good for everyone
  },
  {
    id: 4,
    title: "Focus & Clarity",
    category: "Focus",
    duration: "12 min",
    url: "https://www.youtube.com/watch?v=zSkFFW--Ma0",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500&q=80",
    minScore: 0,
    maxScore: 6 // Good for lower stress/maintenance
  },
  {
    id: 5,
    title: "Morning Gratitude",
    category: "Happiness",
    duration: "8 min",
    url: "https://www.youtube.com/watch?v=Komt033d59s",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    minScore: 0,
    maxScore: 5
  },
  {
    id: 6,
    title: "Stress Relief SOS",
    category: "Stress",
    duration: "3 min",
    url: "https://www.youtube.com/watch?v=F28MGLlpP90",
    image: "https://images.unsplash.com/photo-1444930612915-f7b557f32e69?w=500&q=80",
    minScore: 8,
    maxScore: 10
  }
];

// GET /api/meditations
// Optional query param: ?score=8
router.get('/', (req, res) => {
  const { score } = req.query;
  
  if (score) {
    const userScore = parseInt(score);
    // Filter meditations relevant to the score
    // Logic: Include if the score falls within the range OR if it's a general one (range 0-10)
    const recommended = meditations.filter(m => 
      userScore >= m.minScore && userScore <= m.maxScore
    );
    // Sort by relevance (narrower ranges first)
    recommended.sort((a, b) => (a.maxScore - a.minScore) - (b.maxScore - b.minScore));
    return res.json(recommended);
  }

  res.json(meditations);
});

module.exports = router;
