export type Choice = { key: string; text: string };

export type Question = {
  id: string;
  topic: string;
  subtopic: string;
  section: "QA-MCQ" | "QA-SA" | "VARC";
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  choices?: Choice[]; // absent for short-answer
  answer: string; // correct choice key, or numeric string for SA
  answerValue?: number; // for QA-SA numeric verification
  solution: string[]; // step-by-step
  whyMethod?: string;
  commonMistake?: string;
  faster?: string;
  source?: string; // e.g. "IPMAT Indore 2023 (PYQ)"
};

export type TopicMeta = {
  slug: string;
  name: string;
  section: "QA" | "VARC";
  icon: string;
  color: string;
  subtopics: string[];
  blurb: string;
};
