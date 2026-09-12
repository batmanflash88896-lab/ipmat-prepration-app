export type VideoSegment = {
  heading: string;
  narration: string; // used for on-page + TTS
  onScreen: string[]; // bullet equations/examples
};

export type VideoLesson = {
  slug: string;
  title: string;
  topic: string;
  section: "QA" | "VARC";
  level: "Foundation" | "Core" | "Advanced";
  minutes: number;
  color: string;
  summary: string;
  learn: string[];
  traps: string[];
  segments: VideoSegment[];
  quizSeed: number;
  quizTopic: string; // slug used to generate the post-video quiz
  pyqNote?: string;
};

export const VIDEOS: VideoLesson[] = [
  {
    slug: "percentages-masterclass",
    title: "Percentages — The Master Skill",
    topic: "Percentages",
    section: "QA",
    level: "Foundation",
    minutes: 9,
    color: "#FF6B35",
    summary: "Build unshakeable percentage intuition — the single most reused skill across IPMAT QA and DI.",
    learn: [
      "Convert between percentages, fractions and decimals instantly",
      "Apply increase/decrease using multipliers",
      "Handle successive percentage changes without errors",
      "Spot percentage traps in Data Interpretation",
    ],
    traps: [
      "A 20% rise followed by a 20% fall does NOT return to the original (you lose 4%).",
      "Percentage change is always on the ORIGINAL base unless told otherwise.",
      "'Percentage points' ≠ 'percent' — 10% to 15% is +5 points but +50%.",
    ],
    segments: [
      {
        heading: "Why percentages rule QA",
        narration: "Welcome! Let's master percentages, the single most reused skill in IPMAT quant. Profit and loss, interest, and data interpretation are all percentages wearing costumes. If you own this topic, you unlock nearly half the paper.",
        onScreen: ["Percent = 'per hundred'", "12% = 12/100 = 0.12", "Used in: P&L, Interest, DI, Growth"],
      },
      {
        heading: "The fraction shortcuts",
        narration: "Memorise the common conversions. Twenty-five percent is one quarter. Twelve point five percent is one eighth. Sixteen point six-seven percent is one sixth. When you see these as fractions, mental math becomes lightning fast.",
        onScreen: ["50% = 1/2", "25% = 1/4", "20% = 1/5", "12.5% = 1/8", "16.67% = 1/6", "33.33% = 1/3"],
      },
      {
        heading: "The multiplier method",
        narration: "Never add and subtract in two steps. To increase by twenty percent, multiply by one point two. To decrease by twenty percent, multiply by zero point eight. For successive changes, just multiply the multipliers. This kills careless mistakes.",
        onScreen: ["+20% → ×1.2", "−20% → ×0.8", "Then ±: 1.2 × 0.8 = 0.96 → net −4%"],
      },
      {
        heading: "Worked example",
        narration: "A product costs one thousand rupees. Its price rises fifteen percent, then falls ten percent. New price? Multiply: one thousand times one point one five times zero point nine, giving one thousand and thirty-five rupees. Notice it did not return to a thousand.",
        onScreen: ["1000 × 1.15 × 0.90", "= 1000 × 1.035", "= ₹1035"],
      },
    ],
    quizSeed: 101,
    quizTopic: "percentages",
    pyqNote: "IPMAT Indore repeatedly tests successive percentage change and percentage in DI caselets.",
  },
  {
    slug: "profit-loss-decoded",
    title: "Profit & Loss — Decoded",
    topic: "Profit & Loss",
    section: "QA",
    level: "Core",
    minutes: 8,
    color: "#FFC15E",
    summary: "Master CP, SP, marked price and successive discounts with zero confusion about the base.",
    learn: ["Fix the base: profit/loss is always on CP", "Marked price and discount chains", "Convert profit% into an SP multiplier", "Dishonest dealer & false weights"],
    traps: ["Profit % is on cost price; discount % is on marked price — different bases!", "Two successive 10% discounts = 19% off, not 20%.", "'Gain 25%' means SP = 1.25 × CP, not CP = 1.25 × SP."],
    segments: [
      { heading: "The three prices", narration: "Every profit-loss problem has three prices: cost price, selling price, and often a marked price. Profit or loss is always measured on the cost price. Discount is always measured on the marked price. Keep these bases straight and the topic collapses.", onScreen: ["CP = cost price", "SP = selling price", "MP = marked price", "Profit% on CP, Discount% on MP"] },
      { heading: "The multiplier trick", narration: "Selling price equals cost price times one plus profit percent. A twenty-five percent profit means multiply cost by one point two five. For a discount, marked price times one minus discount percent gives the selling price.", onScreen: ["SP = CP × (1 + p/100)", "SP = MP × (1 − d/100)", "Gain 25%: SP = 1.25 × CP"] },
      { heading: "Successive discounts", narration: "Two discounts of ten percent are not twenty percent. Multiply the factors: zero point nine times zero point nine equals zero point eight one, so nineteen percent off. Chaining discounts always uses multiplication.", onScreen: ["0.9 × 0.9 = 0.81", "Net discount = 19%"] },
      { heading: "Worked example", narration: "An item marked at eight hundred rupees is sold at two successive discounts of ten and five percent. Selling price equals eight hundred times zero point nine times zero point nine five, which is six hundred eighty-four rupees.", onScreen: ["800 × 0.90 × 0.95", "= 800 × 0.855", "= ₹684"] },
    ],
    quizSeed: 202,
    quizTopic: "profit-loss",
    pyqNote: "Successive discounts and CP/SP base confusion are classic IPMAT & JIPMAT traps.",
  },
  {
    slug: "tsd-relative-speed",
    title: "Time, Speed & Distance + Relative Speed",
    topic: "Time, Speed & Distance",
    section: "QA",
    level: "Core",
    minutes: 10,
    color: "#FF5D8F",
    summary: "One equation, endless disguises. Master units, average speed, and relative speed for trains and boats.",
    learn: ["D = S × T and its rearrangements", "Average speed ≠ average of speeds", "Relative speed (same/opposite direction)", "Trains crossing poles and platforms"],
    traps: ["Average speed = total distance / total time, not the mean of the speeds.", "Convert km/h to m/s using ×5/18 before using seconds.", "For trains crossing a platform, add train length + platform length."],
    segments: [
      { heading: "The core relationship", narration: "Distance equals speed times time. Everything in this topic is a rearrangement of that one line. Time is distance over speed; speed is distance over time. The only thing that trips students is units.", onScreen: ["D = S × T", "T = D / S", "S = D / T"] },
      { heading: "Unit conversion", narration: "To convert kilometres per hour to metres per second, multiply by five over eighteen. To go the other way, multiply by eighteen over five. Do this first whenever seconds appear.", onScreen: ["km/h → m/s: × 5/18", "m/s → km/h: × 18/5", "72 km/h = 20 m/s"] },
      { heading: "Average speed", narration: "If you travel the same distance at two speeds, average speed is the harmonic mean: two times the product over the sum. Never just average the two numbers.", onScreen: ["Avg = 2ab/(a+b)", "e.g. 40 & 60 → 48 km/h", "NOT (40+60)/2 = 50"] },
      { heading: "Relative speed", narration: "Two objects moving toward each other: add their speeds. Moving the same direction: subtract. This single idea solves trains, boats, and races.", onScreen: ["Opposite: S₁ + S₂", "Same dir: S₁ − S₂", "Boats: down = b+s, up = b−s"] },
    ],
    quizSeed: 303,
    quizTopic: "tsd",
    pyqNote: "Boats-and-streams and relative speed appear frequently across all IPMAT variants.",
  },
  {
    slug: "interest-si-ci",
    title: "Simple & Compound Interest",
    topic: "Interest",
    section: "QA",
    level: "Core",
    minutes: 9,
    color: "#78F2C0",
    summary: "See CI as repeated percentage growth and never confuse it with SI again.",
    learn: ["SI grows linearly, CI grows multiplicatively", "The 2-year and 3-year CI shortcuts", "Difference between CI and SI", "Half-yearly and quarterly compounding"],
    traps: ["CI question often asks for interest, not the amount — subtract the principal!", "For half-yearly, halve the rate and double the time.", "The 2-year CI−SI difference equals P(r/100)²."],
    segments: [
      { heading: "Two kinds of growth", narration: "Simple interest adds the same amount every year. Compound interest charges interest on the growing balance, so it snowballs. Recognising which one applies is half the battle.", onScreen: ["SI = P·R·T/100", "A = P(1+R/100)^T", "CI = A − P"] },
      { heading: "The CI shortcuts", narration: "For two years, compound interest equals the principal times the quantity two r plus r squared over one hundred, all over a hundred. Memorise this to save time.", onScreen: ["2-yr CI = P[2r + r²/100]/100", "CI − SI (2 yr) = P(r/100)²"] },
      { heading: "Worked example", narration: "Ten thousand rupees at ten percent compounded annually for two years. Amount is ten thousand times one point one squared, which is twelve thousand one hundred. So compound interest is two thousand one hundred rupees.", onScreen: ["10000 × 1.1² = 12100", "CI = 12100 − 10000 = ₹2100", "SI would be ₹2000 → diff ₹100"] },
    ],
    quizSeed: 404,
    quizTopic: "interest",
    pyqNote: "The CI−SI difference formula is a recurring IPMAT time-saver.",
  },
  {
    slug: "vocab-rc-strategy",
    title: "Vocabulary & RC Strategy for VARC",
    topic: "Verbal Ability",
    section: "VARC",
    level: "Foundation",
    minutes: 8,
    color: "#7267F0",
    summary: "A repeatable system for reading comprehension and a smart way to grow vocabulary that sticks.",
    learn: ["Read for structure, not every word", "Answer RC from evidence in the passage", "Learn words with roots, usage and antonyms", "Eliminate extreme and out-of-scope options"],
    traps: ["Never bring outside knowledge into RC — answer only from the passage.", "Extreme words like 'always', 'never', 'entirely' are usually wrong in inference.", "Learn a word with a sentence; isolated word lists fade fast."],
    segments: [
      { heading: "How to read a passage", narration: "Read for the skeleton: what's the main point, how does each paragraph move the argument, and what is the author's tone. Do not memorise details; know where to find them. This is a treasure map, not a memory test.", onScreen: ["Find: main idea", "Track: paragraph roles", "Note: author's tone", "Locate, don't memorise"] },
      { heading: "Answering with evidence", narration: "For every RC answer, point to a line in the passage that proves it. If you cannot, it is a trap. Inference questions still need textual support — they just require one small logical step.", onScreen: ["Every answer → a line of proof", "Inference = text + one small step", "No proof? It's a distractor"] },
      { heading: "Building vocabulary that sticks", narration: "Learn each word four ways: its meaning, a sentence, its synonyms, and its antonyms. Attach a root or a memory hook. Our vocabulary builder does exactly this, one polished word at a time.", onScreen: ["Meaning + sentence", "Synonyms + antonyms", "Root / memory hook", "Spaced repetition"] },
      { heading: "Eliminating options", narration: "Cross out options that are too extreme, out of scope, or only half-right. In verbal, the best answer is often the safest, most defensible one — not the flashiest.", onScreen: ["Kill: extreme wording", "Kill: out of scope", "Kill: half-right", "Keep: defensible"] },
    ],
    quizSeed: 505,
    quizTopic: "vocab",
    pyqNote: "IPMAT VA heavily tests vocabulary, idioms and inference-based RC.",
  },
  {
    slug: "pnc-probability",
    title: "Permutations, Combinations & Probability",
    topic: "P&C + Probability",
    section: "QA",
    level: "Advanced",
    minutes: 11,
    color: "#4FC3F7",
    summary: "Decide order-matters vs order-doesn't in seconds, then turn counting into probability.",
    learn: ["Fundamental counting principle", "nPr vs nCr — the deciding question", "Arrangements with repetition & circular cases", "From counting to probability"],
    traps: ["If order matters use permutations; if not, combinations. Always ask this first.", "Circular arrangements of n objects = (n−1)!", "Probability = favourable / total — both must be counted the same way."],
    segments: [
      { heading: "Counting first", narration: "Every P and C problem is counting in disguise. The fundamental principle: if one task has m ways and another n ways, together they have m times n ways. Build from this.", onScreen: ["m ways × n ways = m·n", "Counting is the foundation"] },
      { heading: "The deciding question", narration: "Ask one question: does order matter? If yes, permutations, n P r. If no, combinations, n C r. Choosing a team is combinations; ranking a team is permutations.", onScreen: ["Order matters → nPr = n!/(n−r)!", "Order doesn't → nCr = n!/(r!(n−r)!)", "Team select = C, ranking = P"] },
      { heading: "Special arrangements", narration: "For letters with repeats, divide by the factorial of each repeat. For people around a circle, fix one and arrange the rest: n minus one factorial.", onScreen: ["Repeats: n!/(p!q!…)", "Circular: (n−1)!", "MISSISSIPPI = 11!/(4!4!2!)"] },
      { heading: "Into probability", narration: "Once you can count, probability is just favourable outcomes over total outcomes, provided every outcome is equally likely. Count the numerator and denominator the same way and you're done.", onScreen: ["P = favourable / total", "Equally likely outcomes", "Complement: P(not A) = 1 − P(A)"] },
    ],
    quizSeed: 606,
    quizTopic: "pnc",
    pyqNote: "IPMAT Indore's harder QA set often includes one P&C or probability question.",
  },
];

export function videoBySlug(slug: string) {
  return VIDEOS.find((v) => v.slug === slug);
}
