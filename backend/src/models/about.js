// About Section Content Model
const aboutContent = {
  personalInfo: {
    name: "Sidney",
    title: "Digital Detective & Full-Stack Developer",
    location: "Yokohama, Japan",
    email: "sidney@detective-agency.dev",
    bio: "A passionate developer who approaches every project like a detective solving a mystery. Combining technical expertise with creative problem-solving to create meaningful digital experiences.",
    avatar: "/images/avatar.jpg"
  },
  
  timeline: [
    {
      id: "timeline-1",
      year: "2018",
      title: "The Beginning",
      description: "Started programming journey, inspired by the complexity of detective mysteries",
      icon: "Book",
      color: "dazai-brown",
      isActive: true
    },
    {
      id: "timeline-2",
      year: "2020", 
      title: "Design Awakening",
      description: "Discovered the art of UI/UX design, finding beauty in simplicity",
      icon: "Heart",
      color: "dazai-gold",
      isActive: true
    },
    {
      id: "timeline-3",
      year: "2022",
      title: "Marketing Mind", 
      description: "Learned the psychology of user behavior and market strategies",
      icon: "Award",
      color: "dazai-dark",
      isActive: true
    },
    {
      id: "timeline-4",
      year: "2024",
      title: "The Present",
      description: "Combining all skills to create meaningful digital experiences",
      icon: "Coffee",
      color: "dazai-muted",
      isActive: true
    }
  ],
  
  characteristics: [
    {
      id: "char-1",
      title: "Strategic Thinking",
      description: "Like Dazai planning his moves, I approach every project with careful consideration",
      percentage: 95,
      isActive: true
    },
    {
      id: "char-2",
      title: "Creative Problem Solving",
      description: "Finding elegant solutions to complex challenges, much like solving mysteries",
      percentage: 92,
      isActive: true
    },
    {
      id: "char-3",
      title: "Attention to Detail",
      description: "Every pixel, every line of code matters - the devil is in the details",
      percentage: 89,
      isActive: true
    },
    {
      id: "char-4",
      title: "User Empathy",
      description: "Understanding users like understanding characters in a story",
      percentage: 94,
      isActive: true
    }
  ]
};

module.exports = aboutContent; 