// Lightweight client-side "AI" doubt solver: parses common IPMAT question
// patterns, computes verified answers, and returns structured tutoring.

export type TutorReply = {
  kind: "solution" | "tip" | "chat";
  title: string;
  steps: string[];
  whyMethod?: string;
  commonMistake?: string;
  faster?: string;
  confidence: "Confirmed" | "Likely" | "Interpretation";
  related?: string[];
};

function round(n: number, d = 2) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

// Safe arithmetic evaluator for expressions like "12.5% of 480", "18*24", "(230+540)/4"
function tryArithmetic(qRaw: string): TutorReply | null {
  let q = qRaw.toLowerCase().trim();

  // percent of
  let m = q.match(/([\d.]+)\s*%\s*of\s*([\d.]+)/);
  if (m) {
    const p = parseFloat(m[1]), b = parseFloat(m[2]);
    const val = round((p * b) / 100);
    return {
      kind: "solution", confidence: "Confirmed",
      title: `${p}% of ${b}`,
      steps: [`${p}% of ${b} = (${p}/100) × ${b}`, `= ${p * b} / 100`, `= ${val}`],
      whyMethod: "Convert percent to a fraction of 100, then multiply by the base.",
      commonMistake: "Forgetting to divide by 100.",
      faster: `${p}% = ${p / 100}; ${b} × ${p / 100} = ${val}.`,
      related: ["Try: '20% of 750'", "Try: 'increase 400 by 15%'"],
    };
  }

  // increase/decrease by %
  m = q.match(/(increase|decrease)\s*([\d.]+)\s*by\s*([\d.]+)\s*%/);
  if (m) {
    const inc = m[1] === "increase";
    const base = parseFloat(m[2]), p = parseFloat(m[3]);
    const val = round(inc ? base * (1 + p / 100) : base * (1 - p / 100));
    return {
      kind: "solution", confidence: "Confirmed",
      title: `${inc ? "Increase" : "Decrease"} ${base} by ${p}%`,
      steps: [`Change = ${p}% of ${base} = ${round((base * p) / 100)}`, `Result = ${base} ${inc ? "+" : "−"} ${round((base * p) / 100)} = ${val}`],
      whyMethod: `Use the multiplier ${inc ? 1 + p / 100 : 1 - p / 100}.`,
      commonMistake: "Applying the percent to the wrong base.",
    };
  }

  // simple interest
  m = q.match(/(?:simple interest|si).*?([\d.]+).*?([\d.]+)\s*%.*?([\d.]+)\s*(?:year|yr)/);
  if (m) {
    const P = parseFloat(m[1]), R = parseFloat(m[2]), T = parseFloat(m[3]);
    const si = round((P * R * T) / 100);
    return {
      kind: "solution", confidence: "Likely",
      title: `Simple Interest`,
      steps: [`SI = P × R × T / 100`, `= ${P} × ${R} × ${T} / 100`, `= ${si}`],
      whyMethod: "Simple interest is linear over time.",
      commonMistake: "Confusing with compound interest.",
    };
  }

  // plain arithmetic expression
  if (/^[\d\s+\-*/().%^]+$/.test(q)) {
    try {
      const expr = q.replace(/\^/g, "**").replace(/%/g, "/100");
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict";return (${expr})`)();
      if (typeof val === "number" && isFinite(val)) {
        return {
          kind: "solution", confidence: "Confirmed",
          title: `Evaluate ${qRaw.trim()}`,
          steps: [`${qRaw.trim()} = ${round(val, 4)}`],
          whyMethod: "Direct arithmetic evaluation with standard operator precedence.",
        };
      }
    } catch {}
  }

  // linear equation ax + b = c
  m = q.replace(/\s/g, "").match(/^([\d.]*)x([+\-][\d.]+)?=([\-\d.]+)$/);
  if (m) {
    const a = m[1] === "" ? 1 : parseFloat(m[1]);
    const b = m[2] ? parseFloat(m[2]) : 0;
    const c = parseFloat(m[3]);
    const x = round((c - b) / a, 4);
    return {
      kind: "solution", confidence: "Confirmed",
      title: `Solve ${qRaw.trim()}`,
      steps: [`${a}x = ${c} ${b >= 0 ? "−" : "+"} ${Math.abs(b)} = ${c - b}`, `x = ${c - b} / ${a} = ${x}`],
      whyMethod: "Isolate x: move the constant, then divide by the coefficient.",
      commonMistake: "Sign error when moving the constant across.",
    };
  }

  return null;
}

const CONCEPT_TIPS: { keys: string[]; reply: TutorReply }[] = [
  {
    keys: ["compound interest", "ci"],
    reply: {
      kind: "tip", confidence: "Confirmed", title: "Compound Interest — key idea",
      steps: ["A = P(1 + R/100)^T", "CI = A − P", "2-yr shortcut: CI = P[2R + R²/100]/100", "CI − SI (2 yr) = P(R/100)²"],
      whyMethod: "Interest compounds on the growing balance each period.",
      commonMistake: "Reporting the amount A instead of the interest CI.",
      related: ["Ask: 'CI on 10000 at 10% for 2 years'"],
    },
  },
  {
    keys: ["time and work", "time & work", "work"],
    reply: {
      kind: "tip", confidence: "Confirmed", title: "Time & Work — key idea",
      steps: ["Rates add: 1/a + 1/b per day", "Together time = ab/(a+b)", "Use LCM as total work units for multi-person problems"],
      whyMethod: "Work rates are additive; times are not.",
      commonMistake: "Averaging the individual times.",
    },
  },
  {
    keys: ["permutation", "combination", "npr", "ncr"],
    reply: {
      kind: "tip", confidence: "Confirmed", title: "P vs C — the deciding question",
      steps: ["Ask: does ORDER matter?", "Yes → nPr = n!/(n−r)!", "No → nCr = n!/(r!(n−r)!)", "Circular: (n−1)!"],
      whyMethod: "Order distinguishes permutations from combinations.",
      commonMistake: "Using permutations when order is irrelevant.",
    },
  },
  {
    keys: ["reading comprehension", "rc", "varc"],
    reply: {
      kind: "tip", confidence: "Confirmed", title: "RC strategy",
      steps: ["Read for structure & tone, not detail", "Every answer must be provable from a line", "Kill extreme/out-of-scope options", "Inference = text + one small step"],
      whyMethod: "IPMAT RC rewards evidence-based reading.",
      commonMistake: "Bringing outside knowledge into the answer.",
    },
  },
];

export function solveDoubt(q: string): TutorReply {
  const arith = tryArithmetic(q);
  if (arith) return arith;

  const lower = q.toLowerCase();
  for (const c of CONCEPT_TIPS) {
    if (c.keys.some((k) => lower.includes(k))) return c.reply;
  }

  // Fallback: structured guidance
  return {
    kind: "chat", confidence: "Interpretation",
    title: "Let's break it down",
    steps: [
      "I can compute things like '12.5% of 480', 'increase 400 by 15%', '18*24', or 'solve 3x+5=20'.",
      "For concept help, mention a topic like 'compound interest', 'time and work', 'permutation', or 'RC'.",
      "For a full worked question, paste the numbers and what's asked — I'll verify the arithmetic step by step.",
    ],
    whyMethod: "Giving me the exact numbers lets me verify the answer deterministically.",
    related: ["Try: '25% of 960'", "Try: 'compound interest'", "Try: 'solve 5x-3=22'"],
  };
}
