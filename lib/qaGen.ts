import { RNG, hashSeed } from "./rng";
import type { Question, Choice } from "./types";
import { enrichQuestion } from "./advancedQuestions";

const DIFF = ["Easy", "Medium", "Hard"] as const;

function mkChoices(rng: RNG, correct: number, spread: number, unit = ""): { choices: Choice[]; answer: string } {
  const set = new Set<number>([correct]);
  let guard = 0;
  while (set.size < 4 && guard < 50) {
    guard++;
    const delta = rng.int(1, spread) * (rng.bool() ? 1 : -1);
    const cand = Math.round((correct + delta) * 100) / 100;
    if (cand !== correct && cand > (correct < 0 ? -Infinity : -0.0001)) set.add(cand);
  }
  while (set.size < 4) set.add(correct + set.size * spread);
  const opts = rng.shuffle([...set]);
  const keys = ["A", "B", "C", "D"];
  const choices = opts.map((v, i) => ({
    key: keys[i],
    text: unit ? `${fmt(v)}${unit}` : fmt(v),
  }));
  const answer = keys[opts.indexOf(correct)];
  return { choices, answer };
}

function fmt(n: number) {
  if (Number.isInteger(n)) return n.toLocaleString("en-IN");
  return (Math.round(n * 100) / 100).toString();
}

type Gen = (rng: RNG, id: string, diff: (typeof DIFF)[number]) => Question;

// ---------- PERCENTAGES ----------
const gPercentage: Gen = (rng, id, difficulty) => {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const base = rng.int(4, 12) * 50;
    const pct = rng.pick([12.5, 15, 20, 24, 25, 30, 36, 40]);
    const val = (base * pct) / 100;
    const { choices, answer } = mkChoices(rng, val, 20);
    return {
      id, topic: "Percentages", subtopic: "Percentage of a number", section: "QA-MCQ", difficulty,
      stem: `What is ${pct}% of ${base}?`,
      choices, answer,
      solution: [
        `${pct}% of ${base} = (${pct}/100) × ${base}`,
        `= ${pct} × ${base} / 100 = ${pct * base} / 100`,
        `= ${val}`,
      ],
      whyMethod: "Convert the percent to a fraction of 100, then multiply by the base.",
      commonMistake: "Forgetting to divide by 100 and reporting pct × base directly.",
      faster: `${pct}% = ${pct / 100}; multiply mentally: ${base} × ${pct / 100} = ${val}.`,
    };
  } else if (kind === 1) {
    const original = rng.int(4, 20) * 50;
    const pct = rng.pick([10, 15, 20, 25, 30]);
    const inc = rng.bool();
    const res = inc ? original * (1 + pct / 100) : original * (1 - pct / 100);
    const { choices, answer } = mkChoices(rng, res, 40);
    return {
      id, topic: "Percentages", subtopic: "Increase / decrease", section: "QA-MCQ", difficulty,
      stem: `A quantity ${original} is ${inc ? "increased" : "decreased"} by ${pct}%. Find the new value.`,
      choices, answer,
      solution: [
        `Change = ${pct}% of ${original} = ${(original * pct) / 100}`,
        `New value = ${original} ${inc ? "+" : "−"} ${(original * pct) / 100} = ${res}`,
      ],
      whyMethod: "A p% change multiplies the value by (1 ± p/100).",
      commonMistake: "Applying the percent to the wrong base or mixing up increase vs decrease.",
      faster: `Use multiplier ${inc ? 1 + pct / 100 : 1 - pct / 100}: ${original} × ${inc ? 1 + pct / 100 : 1 - pct / 100} = ${res}.`,
    };
  } else {
    const a = rng.int(20, 60);
    const b = rng.int(70, 140);
    const pct = Math.round((a / b) * 10000) / 100;
    const { choices, answer } = mkChoices(rng, pct, 10, "%");
    return {
      id, topic: "Percentages", subtopic: "Express as percentage", section: "QA-MCQ", difficulty,
      stem: `${a} is what percent of ${b}? (round to 2 decimals)`,
      choices, answer,
      solution: [`Percentage = (part / whole) × 100`, `= (${a} / ${b}) × 100`, `= ${pct}%`],
      whyMethod: "'What percent of' means divide the part by the whole and scale to 100.",
      commonMistake: "Dividing whole by part (inverting the ratio).",
    };
  }
};

// ---------- PROFIT & LOSS ----------
const gProfitLoss: Gen = (rng, id, difficulty) => {
  const cp = rng.int(4, 40) * 25;
  const pct = rng.pick([10, 12, 15, 20, 25, 30, 40]);
  const profit = rng.bool();
  const sp = profit ? cp * (1 + pct / 100) : cp * (1 - pct / 100);
  const { choices, answer } = mkChoices(rng, sp, 50);
  return {
    id, topic: "Profit & Loss", subtopic: profit ? "Selling price from profit%" : "Selling price from loss%", section: "QA-MCQ", difficulty,
    stem: `An article costs ₹${cp}. It is sold at a ${pct}% ${profit ? "profit" : "loss"}. Find the selling price.`,
    choices, answer,
    solution: [
      `${profit ? "Profit" : "Loss"} = ${pct}% of ₹${cp} = ₹${(cp * pct) / 100}`,
      `SP = CP ${profit ? "+" : "−"} ${profit ? "profit" : "loss"} = ₹${cp} ${profit ? "+" : "−"} ₹${(cp * pct) / 100} = ₹${sp}`,
    ],
    whyMethod: "SP = CP × (1 ± profit%/loss%). Profit and loss are always on cost price unless stated otherwise.",
    commonMistake: "Computing the percentage on selling price instead of cost price.",
    faster: `Multiplier ${profit ? 1 + pct / 100 : 1 - pct / 100} × ₹${cp} = ₹${sp}.`,
  };
};

// ---------- SIMPLE INTEREST ----------
const gSI: Gen = (rng, id, difficulty) => {
  const p = rng.int(4, 40) * 500;
  const r = rng.pick([4, 5, 6, 8, 10, 12]);
  const t = rng.int(2, 5);
  const si = (p * r * t) / 100;
  const { choices, answer } = mkChoices(rng, si, 120);
  return {
    id, topic: "Interest", subtopic: "Simple Interest", section: "QA-MCQ", difficulty,
    stem: `Find the simple interest on ₹${p} at ${r}% per annum for ${t} years.`,
    choices, answer,
    solution: [`SI = P × R × T / 100`, `= ${p} × ${r} × ${t} / 100`, `= ₹${si}`],
    whyMethod: "Simple interest grows linearly: the same interest is added each year.",
    commonMistake: "Using compound interest formula, or forgetting to divide by 100.",
  };
};

// ---------- COMPOUND INTEREST ----------
const gCI: Gen = (rng, id, difficulty) => {
  const p = rng.int(4, 20) * 1000;
  const r = rng.pick([10, 20, 5, 25]);
  const t = rng.int(2, 3);
  const amt = p * Math.pow(1 + r / 100, t);
  const ci = amt - p;
  const { choices, answer } = mkChoices(rng, Math.round(ci), 300);
  const steps = [`A = P(1 + R/100)^T = ${p}(1 + ${r}/100)^${t}`];
  let run = p;
  for (let i = 1; i <= t; i++) {
    run = run * (1 + r / 100);
    steps.push(`After year ${i}: ₹${Math.round(run)}`);
  }
  steps.push(`CI = A − P = ₹${Math.round(amt)} − ₹${p} = ₹${Math.round(ci)}`);
  return {
    id, topic: "Interest", subtopic: "Compound Interest", section: "QA-MCQ", difficulty,
    stem: `Find the compound interest on ₹${p} at ${r}% p.a. compounded annually for ${t} years. (nearest ₹)`,
    choices, answer, solution: steps,
    whyMethod: "Each year interest is charged on the growing amount, so we multiply by (1+R/100) each year.",
    commonMistake: "Reporting the amount A instead of the interest CI = A − P.",
    faster: `For 2 yrs, CI = P[2r + r²/100]/100 shortcut using r = ${r}.`,
  };
};

// ---------- RATIO & PROPORTION ----------
const gRatio: Gen = (rng, id, difficulty) => {
  const a = rng.int(2, 7), b = rng.int(2, 7);
  const k = rng.int(4, 15);
  const total = (a + b) * k;
  const share = a * k;
  const { choices, answer } = mkChoices(rng, share, 20);
  return {
    id, topic: "Ratio & Proportion", subtopic: "Dividing in a ratio", section: "QA-MCQ", difficulty,
    stem: `₹${total} is divided between two people in the ratio ${a}:${b}. What is the first person's share?`,
    choices, answer,
    solution: [
      `Total parts = ${a} + ${b} = ${a + b}`,
      `Value of 1 part = ₹${total} / ${a + b} = ₹${k}`,
      `First share = ${a} × ₹${k} = ₹${share}`,
    ],
    whyMethod: "Convert the ratio to 'parts', find the value of one part, then scale.",
    commonMistake: "Dividing by only one term of the ratio instead of the sum of terms.",
  };
};

// ---------- AVERAGES ----------
const gAverage: Gen = (rng, id, difficulty) => {
  const n = rng.int(4, 6);
  const nums = Array.from({ length: n }, () => rng.int(10, 90));
  const sum = nums.reduce((x, y) => x + y, 0);
  const avg = Math.round((sum / n) * 100) / 100;
  const { choices, answer } = mkChoices(rng, avg, 8);
  return {
    id, topic: "Averages", subtopic: "Average of a set", section: "QA-MCQ", difficulty,
    stem: `Find the average of ${nums.join(", ")}. (2 decimals)`,
    choices, answer,
    solution: [`Sum = ${nums.join(" + ")} = ${sum}`, `Average = Sum / n = ${sum} / ${n} = ${avg}`],
    whyMethod: "Average = total of values ÷ number of values.",
    commonMistake: "Dividing by the wrong count of terms.",
  };
};

// ---------- TIME SPEED DISTANCE ----------
const gTSD: Gen = (rng, id, difficulty) => {
  const kind = rng.int(0, 1);
  if (kind === 0) {
    const speed = rng.int(4, 12) * 5;
    const time = rng.int(2, 6);
    const dist = speed * time;
    const { choices, answer } = mkChoices(rng, dist, 40, " km");
    return {
      id, topic: "Time, Speed & Distance", subtopic: "Distance = speed × time", section: "QA-MCQ", difficulty,
      stem: `A car travels at ${speed} km/h for ${time} hours. How far does it go?`,
      choices, answer,
      solution: [`Distance = Speed × Time`, `= ${speed} × ${time} = ${dist} km`],
      whyMethod: "The three quantities relate by D = S × T; identify what's given and solve.",
      commonMistake: "Mixing units (e.g. minutes with km/h without converting).",
    };
  } else {
    const dist = rng.int(6, 30) * 10;
    const speed = rng.pick([20, 25, 40, 50, 60]);
    const time = Math.round((dist / speed) * 100) / 100;
    const { choices, answer } = mkChoices(rng, time, 3, " h");
    return {
      id, topic: "Time, Speed & Distance", subtopic: "Time = distance / speed", section: "QA-MCQ", difficulty,
      stem: `A train covers ${dist} km at ${speed} km/h. How long does it take? (hours)`,
      choices, answer,
      solution: [`Time = Distance / Speed`, `= ${dist} / ${speed} = ${time} h`],
      whyMethod: "Rearrange D = S × T to T = D / S.",
      commonMistake: "Inverting the formula (multiplying instead of dividing).",
    };
  }
};

// ---------- TIME & WORK ----------
const gWork: Gen = (rng, id, difficulty) => {
  const a = rng.int(6, 20), b = rng.int(6, 20);
  const together = Math.round(((a * b) / (a + b)) * 100) / 100;
  const { choices, answer } = mkChoices(rng, together, 4, " days");
  return {
    id, topic: "Time & Work", subtopic: "Combined work", section: "QA-MCQ", difficulty,
    stem: `A can do a job in ${a} days and B in ${b} days. Working together, how long will they take? (2 decimals)`,
    choices, answer,
    solution: [
      `A's 1-day work = 1/${a}, B's 1-day work = 1/${b}`,
      `Together per day = 1/${a} + 1/${b} = ${a + b}/${a * b}`,
      `Time = ${a * b}/${a + b} = ${together} days`,
    ],
    whyMethod: "Add per-day work rates, then invert to get total time.",
    commonMistake: "Averaging the two times — rates add, times don't.",
    faster: `Together time = (a×b)/(a+b) = (${a}×${b})/(${a}+${b}) = ${together}.`,
  };
};

// ---------- NUMBER SYSTEM (HCF/LCM) ----------
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
const gNumber: Gen = (rng, id, difficulty) => {
  const a = rng.int(6, 40), b = rng.int(6, 40);
  const g = gcd(a, b);
  const l = (a * b) / g;
  const wantLcm = rng.bool();
  const val = wantLcm ? l : g;
  const { choices, answer } = mkChoices(rng, val, wantLcm ? 30 : 5);
  return {
    id, topic: "Number System", subtopic: wantLcm ? "LCM" : "HCF", section: "QA-MCQ", difficulty,
    stem: `Find the ${wantLcm ? "LCM" : "HCF"} of ${a} and ${b}.`,
    choices, answer,
    solution: [
      `HCF(${a}, ${b}) = ${g} (largest common factor)`,
      `LCM × HCF = product of numbers ⇒ LCM = ${a}×${b}/${g} = ${l}`,
      `Answer: ${val}`,
    ],
    whyMethod: "Use the identity LCM × HCF = a × b once you find either one.",
    commonMistake: "Swapping HCF and LCM — HCF ≤ both numbers, LCM ≥ both numbers.",
  };
};

// ---------- ALGEBRA (linear) ----------
const gAlgebra: Gen = (rng, id, difficulty) => {
  const x = rng.int(2, 12);
  const a = rng.int(2, 9), b = rng.int(1, 20);
  const c = a * x + b;
  const { choices, answer } = mkChoices(rng, x, 5);
  return {
    id, topic: "Algebra", subtopic: "Linear equations", section: "QA-MCQ", difficulty,
    stem: `Solve for x: ${a}x + ${b} = ${c}.`,
    choices, answer,
    solution: [`${a}x = ${c} − ${b} = ${c - b}`, `x = ${c - b} / ${a} = ${x}`],
    whyMethod: "Isolate the variable: move constants across, then divide by the coefficient.",
    commonMistake: "Sign errors when moving the constant to the other side.",
  };
};

// ---------- PERMUTATION & COMBINATION ----------
function fact(n: number): number { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
function nCr(n: number, r: number) { return fact(n) / (fact(r) * fact(n - r)); }
const gPnC: Gen = (rng, id, difficulty) => {
  const n = rng.int(5, 9), r = rng.int(2, 4);
  const comb = rng.bool();
  const val = comb ? nCr(n, r) : fact(n) / fact(n - r);
  const { choices, answer } = mkChoices(rng, val, Math.max(4, Math.round(val * 0.3)));
  return {
    id, topic: "Permutation & Combination", subtopic: comb ? "Combinations" : "Permutations", section: "QA-MCQ", difficulty,
    stem: comb
      ? `In how many ways can ${r} people be chosen from ${n}?`
      : `In how many ways can ${r} people be arranged in a row out of ${n}?`,
    choices, answer,
    solution: comb
      ? [`Order doesn't matter ⇒ use ${n}C${r}`, `= ${n}! / (${r}! × ${n - r}!) = ${val}`]
      : [`Order matters ⇒ use ${n}P${r}`, `= ${n}! / (${n - r})! = ${val}`],
    whyMethod: comb
      ? "Choosing (no order) uses combinations nCr."
      : "Arranging (order matters) uses permutations nPr.",
    commonMistake: "Using permutations when order doesn't matter (or vice versa).",
  };
};

// ---------- PROBABILITY ----------
const gProb: Gen = (rng, id, difficulty) => {
  const red = rng.int(2, 6), blue = rng.int(2, 6), green = rng.int(1, 4);
  const total = red + blue + green;
  const pick = rng.pick([["red", red], ["blue", blue], ["green", green]] as [string, number][]);
  const prob = Math.round((pick[1] / total) * 1000) / 1000;
  const { choices, answer } = mkChoices(rng, prob, 1);
  return {
    id, topic: "Probability", subtopic: "Single event", section: "QA-MCQ", difficulty,
    stem: `A bag has ${red} red, ${blue} blue and ${green} green balls. One ball is drawn at random. What is the probability it is ${pick[0]}? (3 decimals)`,
    choices, answer,
    solution: [
      `Total balls = ${red} + ${blue} + ${green} = ${total}`,
      `Favourable (${pick[0]}) = ${pick[1]}`,
      `P = ${pick[1]}/${total} = ${prob}`,
    ],
    whyMethod: "Probability = favourable outcomes ÷ total equally-likely outcomes.",
    commonMistake: "Forgetting to include every colour in the total.",
  };
};

// ---------- MENSURATION / GEOMETRY ----------
const gGeometry: Gen = (rng, id, difficulty) => {
  const kind = rng.int(0, 1);
  if (kind === 0) {
    const l = rng.int(5, 25), w = rng.int(4, 20);
    const area = l * w;
    const { choices, answer } = mkChoices(rng, area, 30, " sq units");
    return {
      id, topic: "Geometry & Mensuration", subtopic: "Area of rectangle", section: "QA-MCQ", difficulty,
      stem: `Find the area of a rectangle with length ${l} and width ${w}.`,
      choices, answer,
      solution: [`Area = length × width`, `= ${l} × ${w} = ${area}`],
      whyMethod: "Rectangle area is the product of its two side lengths.",
      commonMistake: "Computing perimeter (2(l+w)) instead of area.",
    };
  } else {
    const r = rng.int(3, 14);
    const area = Math.round(3.14159 * r * r * 100) / 100;
    const { choices, answer } = mkChoices(rng, area, 40, " sq units");
    return {
      id, topic: "Geometry & Mensuration", subtopic: "Area of circle", section: "QA-MCQ", difficulty,
      stem: `Find the area of a circle of radius ${r}. (use π = 3.14159, 2 decimals)`,
      choices, answer,
      solution: [`Area = πr²`, `= 3.14159 × ${r}² = 3.14159 × ${r * r}`, `= ${area}`],
      whyMethod: "Circle area is π times the square of the radius.",
      commonMistake: "Using diameter instead of radius, or using 2πr (circumference).",
    };
  }
};

// ---------- DATA INTERPRETATION (short-answer style) ----------
const gDI: Gen = (rng, id, difficulty) => {
  const months = ["Jan", "Feb", "Mar", "Apr"];
  const sales = months.map(() => rng.int(20, 90) * 10);
  const total = sales.reduce((a, b) => a + b, 0);
  const maxIdx = sales.indexOf(Math.max(...sales));
  const pct = Math.round((sales[maxIdx] / total) * 10000) / 100;
  const { choices, answer } = mkChoices(rng, pct, 8, "%");
  return {
    id, topic: "Data Interpretation", subtopic: "Percentage share", section: "QA-MCQ", difficulty,
    stem: `Monthly sales (₹'000): ${months.map((m, i) => `${m}=${sales[i]}`).join(", ")}. What percent of total sales came from ${months[maxIdx]}? (2 dp)`,
    choices, answer,
    solution: [
      `Total = ${sales.join(" + ")} = ${total}`,
      `${months[maxIdx]} share = ${sales[maxIdx]}/${total} × 100 = ${pct}%`,
    ],
    whyMethod: "Share of a category = its value ÷ grand total, expressed as a percent.",
    commonMistake: "Dividing by a single month instead of the grand total.",
  };
};

// ----- QA SHORT ANSWER (IPMAT Indore has a QA-SA section) -----
const gSA: Gen = (rng, id, difficulty) => {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const n = rng.int(6, 15);
    const sum = (n * (n + 1)) / 2;
    return {
      id, topic: "Number System", subtopic: "Sum of first n natural numbers", section: "QA-SA", difficulty,
      stem: `Find the sum of the first ${n} natural numbers.`,
      answer: String(sum), answerValue: sum,
      solution: [`Sum = n(n+1)/2`, `= ${n}×${n + 1}/2 = ${sum}`],
      whyMethod: "Gauss pairing gives the closed form n(n+1)/2 instantly.",
      commonMistake: "Off-by-one: using n² or (n-1)n/2.",
    };
  } else if (kind === 1) {
    const a = rng.int(3, 12);
    const val = a * a;
    return {
      id, topic: "Algebra", subtopic: "Squares", section: "QA-SA", difficulty,
      stem: `Evaluate ${a}².`,
      answer: String(val), answerValue: val,
      solution: [`${a}² = ${a} × ${a} = ${val}`],
      whyMethod: "Squaring is the number multiplied by itself.",
      commonMistake: "Doubling instead of squaring.",
    };
  } else {
    const p = rng.int(4, 20) * 100;
    const r = rng.pick([5, 10, 20]);
    const t = 2;
    const val = (p * r * t) / 100;
    return {
      id, topic: "Interest", subtopic: "Simple Interest (SA)", section: "QA-SA", difficulty,
      stem: `Simple interest on ₹${p} at ${r}% p.a. for ${t} years is ₹____.`,
      answer: String(val), answerValue: val,
      solution: [`SI = PRT/100 = ${p}×${r}×${t}/100 = ${val}`],
      whyMethod: "Direct application of the SI formula.",
      commonMistake: "Adding principal to give the amount instead of interest.",
    };
  }
};

export const QA_GENERATORS: Record<string, Gen> = {
  percentages: gPercentage,
  "profit-loss": gProfitLoss,
  interest: rngPickGen([gSI, gCI]),
  "ratio-proportion": gRatio,
  averages: gAverage,
  tsd: gTSD,
  "time-work": gWork,
  "number-system": gNumber,
  algebra: gAlgebra,
  pnc: gPnC,
  probability: gProb,
  geometry: gGeometry,
  di: gDI,
  "qa-sa": gSA,
};

function rngPickGen(gens: Gen[]): Gen {
  return (rng, id, diff) => rng.pick(gens)(rng, id, diff);
}

// Build N questions for a topic + test seed
export function buildQATest(topicSlug: string, seed: number, count = 30): Question[] {
  const gen = QA_GENERATORS[topicSlug] || gPercentage;
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const rng = new RNG(hashSeed(topicSlug, seed, i, "q"));
    const difficulty = DIFF[Math.min(2, Math.floor(i / Math.ceil(count / 3)))];
    out.push(enrichQuestion(gen(rng, `${topicSlug}-${seed}-${i}`, difficulty)));
  }
  return out;
}

// Mixed QA test (for mocks) across many topics
export function buildMixedQA(seed: number, count: number, section: "QA-MCQ" | "QA-SA" = "QA-MCQ"): Question[] {
  const pool = section === "QA-SA"
    ? ["qa-sa"]
    : ["percentages", "profit-loss", "interest", "ratio-proportion", "averages", "tsd", "time-work", "number-system", "algebra", "pnc", "probability", "geometry", "di"];
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const rng = new RNG(hashSeed("mix", seed, i, section));
    const slug = pool[i % pool.length];
    const difficulty = DIFF[rng.int(0, 2)];
    out.push(enrichQuestion(QA_GENERATORS[slug](rng, `mix-${seed}-${i}`, difficulty)));
  }
  return out;
}
