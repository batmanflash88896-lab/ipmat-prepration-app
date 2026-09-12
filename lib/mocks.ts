export type MockDef = {
  slug: string;
  exam: string;
  title: string;
  badge: string;
  color: string;
  durationMin: number;
  sections: { name: string; type: "QA-MCQ" | "QA-SA" | "VARC"; count: number }[];
  pattern: string;
  pyq?: boolean;
  year?: number;
};

// Patterns modelled on the actual IPMAT / JIPMAT structures
export const MOCKS: MockDef[] = [
  {
    slug: "ipmat-indore-1",
    exam: "IPMAT Indore",
    title: "IPMAT Indore — Full Mock 1",
    badge: "IIM Indore",
    color: "#FF6B35",
    durationMin: 120,
    pattern: "3 sections: QA (MCQ), QA (Short Answer), VARC (MCQ). No section switching in the real exam.",
    sections: [
      { name: "Quantitative Ability (MCQ)", type: "QA-MCQ", count: 20 },
      { name: "Quantitative Ability (Short Answer)", type: "QA-SA", count: 10 },
      { name: "Verbal Ability (MCQ)", type: "VARC", count: 20 },
    ],
  },
  {
    slug: "ipmat-indore-2",
    exam: "IPMAT Indore",
    title: "IPMAT Indore — Full Mock 2",
    badge: "IIM Indore",
    color: "#FF6B35",
    durationMin: 120,
    pattern: "Balanced difficulty with a heavier short-answer QA block.",
    sections: [
      { name: "Quantitative Ability (MCQ)", type: "QA-MCQ", count: 20 },
      { name: "Quantitative Ability (Short Answer)", type: "QA-SA", count: 10 },
      { name: "Verbal Ability (MCQ)", type: "VARC", count: 20 },
    ],
  },
  {
    slug: "ipmat-rohtak-1",
    exam: "IPMAT Rohtak",
    title: "IPMAT Rohtak — Full Mock 1",
    badge: "IIM Rohtak",
    color: "#7267F0",
    durationMin: 120,
    pattern: "3 sections all MCQ: Quantitative Ability, Logical Reasoning (modelled via QA), Verbal Ability.",
    sections: [
      { name: "Quantitative Ability", type: "QA-MCQ", count: 20 },
      { name: "Logical Reasoning", type: "QA-MCQ", count: 15 },
      { name: "Verbal Ability", type: "VARC", count: 20 },
    ],
  },
  {
    slug: "jipmat-1",
    exam: "JIPMAT",
    title: "JIPMAT — Full Mock 1",
    badge: "IIM Jammu / Bodh Gaya",
    color: "#4FC3F7",
    durationMin: 150,
    pattern: "3 sections all MCQ: Quantitative Aptitude, Data Interpretation & Logical Reasoning, Verbal Ability & Reading Comprehension.",
    sections: [
      { name: "Quantitative Aptitude", type: "QA-MCQ", count: 20 },
      { name: "DI & Logical Reasoning", type: "QA-MCQ", count: 15 },
      { name: "Verbal Ability & RC", type: "VARC", count: 20 },
    ],
  },
  {
    slug: "ipmat-indore-pyq-2023",
    exam: "IPMAT Indore",
    title: "IPMAT Indore — PYQ Pattern 2023",
    badge: "PYQ 2023",
    color: "#FFC15E",
    durationMin: 120,
    pyq: true,
    year: 2023,
    pattern: "Previous-year pattern practice modelled on the 2023 paper structure with source metadata retained.",
    sections: [
      { name: "Quantitative Ability (MCQ)", type: "QA-MCQ", count: 20 },
      { name: "Quantitative Ability (Short Answer)", type: "QA-SA", count: 10 },
      { name: "Verbal Ability (MCQ)", type: "VARC", count: 20 },
    ],
  },
  {
    slug: "sectional-qa-1",
    exam: "Sectional",
    title: "QA Sectional — Speed Builder",
    badge: "Sectional",
    color: "#78F2C0",
    durationMin: 40,
    pattern: "Focused quantitative sectional to build speed and accuracy under time pressure.",
    sections: [
      { name: "Quantitative Ability", type: "QA-MCQ", count: 25 },
    ],
  },
  {
    slug: "sectional-varc-1",
    exam: "Sectional",
    title: "VARC Sectional — Verbal Sprint",
    badge: "Sectional",
    color: "#FF5D8F",
    durationMin: 30,
    pattern: "Verbal ability sectional covering vocabulary, idioms and usage.",
    sections: [
      { name: "Verbal Ability", type: "VARC", count: 25 },
    ],
  },
];

export function mockBySlug(slug: string) {
  return MOCKS.find((m) => m.slug === slug);
}
