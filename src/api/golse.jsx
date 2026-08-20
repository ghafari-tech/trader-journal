const API_URL = "https://trade.piqagram.ir/app/goal/add/";
const API_KEY = "YOUR_API_KEY";

const seedData = [
  {
    id: "G1",
    title: "رسیدن به ۱۵٪ سود ماهانه",
    progress: 62,
  },
  {
    id: "G2",
    title: "حداکثر ۱٪ ریسک در هر معامله",
    progress: 88,
  },
  {
    id: "G3",
    title: "نوشتن ژورنال برای ۱۰۰٪ معاملات",
    progress: 74,
  },
  {
    id: "G4",
    title: "کاهش Overtrading به زیر ۵ معامله در روز",
    progress: 45,
  },
  {
    id: "G5",
    title: "کاهش Overtrading به زیر ۵ معامله در روز",
    progress: 45,
  },
];

const addGoal = async (goal) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      title: goal.title,
      progress: goal.progress,
    }),
  });

  if (!response.ok) {
    throw new Error(`Goal API Error: ${response.status}`);
  }

  const data = await response.json();

  return {
    id: data.id ?? goal.id,
    title: data.title ?? goal.title,
    progress: data.progress ?? goal.progress,
  };
};

export const goals = await Promise.all(
  seedData.map((goal) => addGoal(goal))
);