export type MockSection = {
  name: string;
  type: "QA-MCQ" | "QA-SA" | "VARC" | "LRDI";
  count: number;
  durationMin?: number;
};

export type MockDef = {
  slug: string;
  exam: string;
  title: string;
  badge: string;
  color: string;
  durationMin: number;
  sections: MockSection[];
  pattern: string;
  benchmark?: boolean;
  year?: number;
  difficulty: "Moderate" | "Hard" | "Elite";
  marking: string;
  sourceNote: string;
};

/**
 * Full-length structures follow the widely reported 2025–26 formats. Question
 * content is original: benchmark sets reproduce topic mix and reasoning depth,
 * never a copied or falsely labelled official paper.
 */
export const MOCKS: MockDef[] = [
  {
    slug: "ipmat-indore-elite-1", exam: "IPMAT Indore", title: "Indore Elite Benchmark 01", badge: "IIM Indore pattern", color: "#FF6B35",
    durationMin: 120, difficulty: "Elite", marking: "+4 correct · −1 MCQ · no penalty SA",
    pattern: "Full 90-question mastery simulation calibrated above the IPMAT Indore 2023 level, with three 40-minute sections: QA-SA, QA-MCQ and VARC.",
    sourceNote: "Original above-PYQ questions calibrated against the supplied IPMAT Indore 2023 paper; structure follows the reported Indore format.",
    sections: [
      { name: "Quantitative Ability — Short Answer", type: "QA-SA", count: 15, durationMin: 40 },
      { name: "Quantitative Ability — MCQ", type: "QA-MCQ", count: 30, durationMin: 40 },
      { name: "Verbal Ability & RC", type: "VARC", count: 45, durationMin: 40 },
    ],
  },
  {
    slug: "ipmat-indore-2024-benchmark", exam: "IPMAT Indore", title: "Indore 2024 Pattern Benchmark", badge: "2024 pattern", color: "#F7B955",
    durationMin: 120, difficulty: "Hard", benchmark: true, year: 2024, marking: "+4 correct · −1 MCQ · no penalty SA",
    pattern: "A fresh, original 90-question paper calibrated to the 2024-style section split—not a reproduction of the paper.",
    sourceNote: "Original benchmark based on publicly reported 2024 exam structure. No recalled question is presented as official.",
    sections: [
      { name: "Quantitative Ability — Short Answer", type: "QA-SA", count: 15, durationMin: 40 },
      { name: "Quantitative Ability — MCQ", type: "QA-MCQ", count: 30, durationMin: 40 },
      { name: "Verbal Ability", type: "VARC", count: 45, durationMin: 40 },
    ],
  },
  {
    slug: "ipmat-indore-2025-benchmark", exam: "IPMAT Indore", title: "Indore 2025 Pattern Benchmark", badge: "2025 pattern", color: "#E97451",
    durationMin: 120, difficulty: "Elite", benchmark: true, year: 2025, marking: "+4 correct · −1 MCQ · no penalty SA",
    pattern: "A high-difficulty original benchmark reflecting the algebra, number-system and inference pressure associated with recent papers.",
    sourceNote: "Pattern-informed original content. It is not an IIM-issued or verbatim previous-year paper.",
    sections: [
      { name: "Quantitative Ability — Short Answer", type: "QA-SA", count: 15, durationMin: 40 },
      { name: "Quantitative Ability — MCQ", type: "QA-MCQ", count: 30, durationMin: 40 },
      { name: "Verbal Ability", type: "VARC", count: 45, durationMin: 40 },
    ],
  },
  {
    slug: "ipmat-rohtak-elite-1", exam: "IPMAT Rohtak", title: "Rohtak Full Simulation 01", badge: "IIM Rohtak pattern", color: "#8B7CF6",
    durationMin: 120, difficulty: "Hard", marking: "+4 correct · −1 incorrect",
    pattern: "Full 120-question simulation: 40 QA, 40 Logical Reasoning and 40 Verbal questions with a flexible overall timer.",
    sourceNote: "Original questions following the publicly reported IPMAT Rohtak 2025–26 format.",
    sections: [
      { name: "Quantitative Ability", type: "QA-MCQ", count: 40 },
      { name: "Logical Reasoning", type: "LRDI", count: 40 },
      { name: "Verbal Ability", type: "VARC", count: 40 },
    ],
  },
  {
    slug: "jipmat-elite-1", exam: "JIPMAT", title: "JIPMAT Full Simulation 01", badge: "NTA JIPMAT pattern", color: "#45C4A0",
    durationMin: 150, difficulty: "Hard", marking: "+4 correct · −1 incorrect",
    pattern: "Full 100-question simulation: 33 QA, 33 DI-LR and 34 VARC questions in 150 minutes.",
    sourceNote: "Original questions aligned to the publicly reported NTA JIPMAT 2025–26 structure.",
    sections: [
      { name: "Quantitative Aptitude", type: "QA-MCQ", count: 33 },
      { name: "Data Interpretation & Logical Reasoning", type: "LRDI", count: 33 },
      { name: "Verbal Ability & Reading Comprehension", type: "VARC", count: 34 },
    ],
  },
  {
    slug: "sectional-qa-elite", exam: "Sectional", title: "QA Elite Sectional", badge: "40-minute sectional", color: "#FF6B35",
    durationMin: 40, difficulty: "Elite", marking: "+4 correct · −1 incorrect",
    pattern: "Thirty difficult mixed QA questions for algebra, modern maths, number systems and geometry.",
    sourceNote: "Original Aptivo sectional.", sections: [{ name: "Quantitative Ability", type: "QA-MCQ", count: 30 }],
  },
  {
    slug: "sectional-lrdi-elite", exam: "Sectional", title: "LRDI Decision Sprint", badge: "40-minute sectional", color: "#45C4A0",
    durationMin: 40, difficulty: "Hard", marking: "+4 correct · −1 incorrect",
    pattern: "Forty reasoning questions focused on set construction, constraints, deductions and weighted data.",
    sourceNote: "Original Aptivo sectional.", sections: [{ name: "Logical Reasoning & DI", type: "LRDI", count: 40 }],
  },
];

export function mockBySlug(slug: string) {
  return MOCKS.find((mock) => mock.slug === slug);
}
