import type { Question } from "./types";
import { RNG, hashSeed } from "./rng";

const mcq = (q: Omit<Question, "section" | "difficulty"> & { section?: Question["section"] }): Question => ({
  ...q,
  section: q.section ?? "QA-MCQ",
  difficulty: "Hard",
});

/**
 * Original benchmark questions inspired by the reasoning depth and topic mix of
 * recent IPM aptitude papers. These are not copied previous-year questions.
 */
const QUANT_BANK: Question[] = [
  mcq({
    id: "benchmark-algebra-01", topic: "Algebra", subtopic: "Symmetric expressions",
    stem: "Positive real numbers x and y satisfy x + y = 7 and x² + y² = 29. What is x³ + y³?",
    choices: [{ key: "A", text: "91" }, { key: "B", text: "119" }, { key: "C", text: "133" }, { key: "D", text: "175" }], answer: "C",
    solution: ["Use x² + y² = (x + y)² − 2xy.", "29 = 49 − 2xy, so xy = 10.", "Now x³ + y³ = (x + y)³ − 3xy(x + y).", "Therefore x³ + y³ = 343 − 3 × 10 × 7 = 133."],
    whyMethod: "The expression is symmetric, so finding x and y individually wastes time. Work only with x + y and xy.",
    commonMistake: "Using x³ + y³ = (x + y)³ − 3xy; the final factor (x + y) is essential.",
    faster: "Once xy = 10, mentally compute 7³ − 30·7 = 343 − 210.",
    concept: "Symmetric polynomials can usually be reduced to the elementary quantities x + y and xy.",
    alternateMethod: "x and y are roots of t² − 7t + 10 = 0, hence {x,y} = {5,2}; then 125 + 8 = 133.",
    takeaway: "Before solving for variables, ask whether the requested expression is symmetric.",
  }),
  mcq({
    id: "benchmark-number-01", topic: "Number System", subtopic: "Remainders and cyclicity",
    stem: "What is the remainder when 7¹⁰³ + 3¹⁰³ is divided by 10?",
    choices: [{ key: "A", text: "0" }, { key: "B", text: "2" }, { key: "C", text: "4" }, { key: "D", text: "6" }], answer: "A",
    solution: ["Units digits repeat in cycles of 4.", "103 ≡ 3 (mod 4). Thus 7¹⁰³ has the units digit of 7³, which is 3.", "Similarly, 3¹⁰³ has the units digit of 3³, which is 7.", "The sum ends in 3 + 7 = 10, so the remainder modulo 10 is 0."],
    whyMethod: "A remainder modulo 10 depends only on the units-digit cycle; calculating powers is unnecessary.",
    commonMistake: "Using 103 mod 4 = 3 for one base but forgetting that each base has its own position in the cycle.",
    faster: "Since 7 ≡ −3 (mod 10) and the exponent is odd, 7¹⁰³ + 3¹⁰³ ≡ (−3)¹⁰³ + 3¹⁰³ = 0.",
    concept: "Replace large powers with modularly equivalent small bases and exploit parity whenever possible.",
    takeaway: "Look for cancellation before building a full cyclicity table.",
  }),
  mcq({
    id: "benchmark-pnc-01", topic: "Permutation & Combination", subtopic: "Restricted arrangements",
    stem: "How many 5-digit even numbers can be formed using 1, 2, 3, 4, 5 without repetition?",
    choices: [{ key: "A", text: "24" }, { key: "B", text: "36" }, { key: "C", text: "48" }, { key: "D", text: "60" }], answer: "C",
    solution: ["An even number must end in 2 or 4: 2 choices for the units digit.", "After fixing the units digit, arrange the remaining four non-zero digits in the first four positions.", "That gives 4! = 24 arrangements for each ending.", "Total = 2 × 24 = 48."],
    whyMethod: "Handle the most restrictive position—the last digit—first.",
    commonMistake: "Choosing any of five digits for the last place and dividing by two; parity restrictions should be counted directly.",
    faster: "Every permutation is a 5-digit number, and exactly 2 of the 5 possible final digits are even: 5! × 2/5 = 48.",
    concept: "In restricted arrangements, lock the constrained positions before arranging the rest.",
    takeaway: "Count by construction rather than trying to subtract invalid arrangements.",
  }),
  mcq({
    id: "benchmark-probability-01", topic: "Probability", subtopic: "Conditional probability",
    stem: "Two fair dice are rolled. Given that at least one die shows 4, what is the probability that the sum is at least 9?",
    choices: [{ key: "A", text: "2/11" }, { key: "B", text: "3/11" }, { key: "C", text: "4/11" }, { key: "D", text: "5/18" }], answer: "C",
    solution: ["Condition on the reduced sample space: outcomes with at least one 4.", "These are (4,1)…(4,6) and (1,4)…(6,4), with (4,4) counted twice, so 11 outcomes.", "A sum of at least 9 occurs for (4,5), (5,4), and (4,6), (6,4).", "There are 4 favourable outcomes, so the probability is 4/11."],
    whyMethod: "Conditional probability changes the denominator. Rebuild the sample space after applying the condition.",
    commonMistake: "Using 36 as the denominator even though the phrase ‘given that’ restricts possible outcomes.",
    faster: "Union count for at least one 4 is 6 + 6 − 1 = 11; inspect the four qualifying pairs.",
    concept: "For equally likely outcomes, P(A|B) = |A ∩ B| / |B|.",
    takeaway: "Underline every ‘given that’—it almost always changes the denominator.",
  }),
  mcq({
    id: "benchmark-geometry-01", topic: "Geometry", subtopic: "Similar triangles",
    stem: "In triangle ABC, D lies on AB and E lies on AC such that DE ∥ BC. If AD:DB = 2:3 and the area of triangle ADE is 32, what is the area of trapezium DBCE?",
    choices: [{ key: "A", text: "96" }, { key: "B", text: "128" }, { key: "C", text: "168" }, { key: "D", text: "200" }], answer: "C",
    solution: ["AD:AB = 2:(2+3) = 2:5.", "Triangles ADE and ABC are similar, so their areas are in the square of the side ratio: 4:25.", "If 4 parts = 32, one part = 8 and area(ABC) = 25 × 8 = 200.", "Trapezium DBCE = 200 − 32 = 168."],
    whyMethod: "Parallel lines create similar triangles, and areas scale as the square of corresponding side ratios.",
    commonMistake: "Using the linear ratio 2:5 for areas instead of squaring it.",
    faster: "Small:whole area = (2/5)² = 4/25; whole = 32 × 25/4 = 200.",
    concept: "For similar figures, lengths scale by k, areas by k², and volumes by k³.",
    takeaway: "Whenever a line is parallel to one side of a triangle, test for similarity immediately.",
  }),
  mcq({
    id: "benchmark-arithmetic-01", topic: "Time & Work", subtopic: "Variable efficiency",
    stem: "A can finish a job in 18 days and B in 24 days. They work together for 6 days, after which A leaves. In how many more days will B finish the remaining work?",
    choices: [{ key: "A", text: "8" }, { key: "B", text: "9" }, { key: "C", text: "10" }, { key: "D", text: "12" }], answer: "C",
    solution: ["Take total work as LCM(18,24) = 72 units.", "A's rate is 4 units/day and B's is 3 units/day.", "Together they complete 7 × 6 = 42 units; remaining work = 72 − 42 = 30 units.", "B needs 30/3 = 10 more days."],
    whyMethod: "The unit-work method removes fractions and makes the change in workforce transparent.",
    commonMistake: "Adding 18 and 24, or averaging the completion times. Work rates—not times—are additive.",
    faster: "Together complete 6(1/18+1/24)=7/12; remainder 5/12; B needs (5/12)×24=10 days.",
    concept: "Work = rate × time. When a worker joins or leaves, split the timeline into phases.",
    takeaway: "Choose total work as an LCM when individual times are integers.",
  }),
  mcq({
    id: "benchmark-sequence-01", topic: "Algebra", subtopic: "Progressions",
    stem: "The 3rd, 7th and 15th terms of an arithmetic progression form three consecutive terms of a geometric progression. If the common difference of the AP is non-zero, what is the common ratio of the GP?",
    choices: [{ key: "A", text: "3/2" }, { key: "B", text: "2" }, { key: "C", text: "13/5" }, { key: "D", text: "3" }], answer: "C",
    solution: ["Let the AP have first term a and common difference d.", "The three terms are a+2d, a+6d, and a+14d.", "For consecutive GP terms, (a+6d)² = (a+2d)(a+14d).", "Expanding and cancelling gives 36d² = 16ad + 28d², hence a = d/2.", "The ratio is (a+6d)/(a+2d) = (6.5d)/(2.5d) = 13/5."],
    whyMethod: "Three numbers are consecutive GP terms exactly when the square of the middle equals the product of the extremes.",
    commonMistake: "Assuming the indices 3, 7, 15 imply the GP ratio directly; the values, not indices, form the GP.",
    concept: "Translate progression language into algebraic term formulas before manipulating it.",
    takeaway: "For x, y, z in GP, use y² = xz—it avoids introducing another variable.",
  }),
];

const SA_BANK: Question[] = [
  {
    id: "benchmark-sa-01", topic: "Algebra", subtopic: "Roots and identities", section: "QA-SA", difficulty: "Hard",
    stem: "If α and β are the roots of 3x² − 11x + 6 = 0, find 18(1/α + 1/β).",
    answer: "33", answerValue: 33,
    solution: ["For ax²+bx+c=0, α+β=−b/a=11/3 and αβ=c/a=2.", "1/α+1/β=(α+β)/(αβ)=(11/3)/2=11/6.", "Therefore 18(1/α+1/β)=18×11/6=33."],
    whyMethod: "Use Vieta's relations; solving separately for both roots introduces unnecessary arithmetic.", commonMistake: "Writing the reciprocal sum as 1/(α+β).", faster: "18 × (−b/c) = 18 × 11/6 = 33.",
    concept: "The reciprocal sum of quadratic roots is (α+β)/(αβ)=−b/c, provided neither root is zero.", takeaway: "Translate root expressions into α+β and αβ before solving the equation.",
  },
  {
    id: "benchmark-sa-02", topic: "Number System", subtopic: "Chinese remainder reasoning", section: "QA-SA", difficulty: "Hard",
    stem: "Find the least positive integer n such that n leaves remainder 5 when divided by 8 and remainder 2 when divided by 7.",
    answer: "37", answerValue: 37,
    solution: ["Numbers congruent to 5 modulo 8 are 5, 13, 21, 29, 37, …", "Check these modulo 7: 5, 6, 0, 1, 2.", "The first that leaves remainder 2 on division by 7 is 37."],
    whyMethod: "Because the moduli are small and coprime, listing one progression is faster than formal CRT machinery.", commonMistake: "Adding the remainders or multiplying 5 and 2.", faster: "Write n=5+8k. Then 5+k≡2 (mod 7), so k≡4 and n=37.",
    concept: "A congruence describes an arithmetic progression; simultaneous congruences ask for an intersection of progressions.", takeaway: "Parameterise the congruence with the larger step, then reduce the coefficient modulo the other divisor.",
  },
  {
    id: "benchmark-sa-03", topic: "Geometry", subtopic: "Inradius", section: "QA-SA", difficulty: "Hard",
    stem: "A right triangle has legs 9 and 12. Find the radius of its incircle.",
    answer: "3", answerValue: 3,
    solution: ["The hypotenuse is √(9²+12²)=15.", "For a right triangle, inradius r=(a+b−c)/2.", "Thus r=(9+12−15)/2=3."],
    whyMethod: "The right-triangle inradius identity avoids separately finding area and semiperimeter.", commonMistake: "Using (a+b+c)/2, which is the semiperimeter, not the inradius.",
    alternateMethod: "Area=54 and semiperimeter=18. Since area=rs, r=54/18=3.", concept: "Every triangle satisfies area = inradius × semiperimeter.", takeaway: "For a right triangle, remember r=(sum of legs−hypotenuse)/2.",
  },
];

const LR_BANK: Question[] = [
  mcq({
    id: "benchmark-lr-01", topic: "Logical Reasoning", subtopic: "Conditional ordering", section: "LRDI",
    stem: "Five talks P, Q, R, S and T are scheduled one per slot. P is before R; Q is immediately after S; and T is neither first nor last. Which arrangement is possible?",
    choices: [{ key: "A", text: "Q S P T R" }, { key: "B", text: "S Q T R P" }, { key: "C", text: "P T S Q R" }, { key: "D", text: "P R T Q S" }], answer: "C",
    solution: ["Translate Q immediately after S into the fixed block [S,Q].", "A and D reverse this block, so both are impossible.", "B places R before P, violating P before R.", "C has P before R, contains [S,Q], and places T second, so every rule holds."],
    whyMethod: "Convert adjacency conditions into blocks before testing looser ordering conditions.",
    commonMistake: "Reading ‘Q immediately after S’ as merely Q somewhere after S.",
    faster: "Eliminate A and D from the reversed block, B from P/R; C remains.",
    concept: "In arrangement sets, hard constraints such as adjacency and fixed positions have the highest elimination power.",
    takeaway: "Test the most restrictive rule first, not the rules in sentence order.",
  }),
  mcq({
    id: "benchmark-lr-02", topic: "Logical Reasoning", subtopic: "Syllogisms", section: "LRDI",
    stem: "Statements: All mentors are readers. Some readers are founders. No founder is careless. Which conclusion must follow?",
    choices: [{ key: "A", text: "Some mentors are founders" }, { key: "B", text: "No mentor is careless" }, { key: "C", text: "Some readers are not careless" }, { key: "D", text: "All readers are careful" }], answer: "C",
    solution: ["Some readers are founders establishes at least one object in both sets.", "No founder is careless means every founder lies outside the careless set.", "Therefore that existing reader-founder is a reader who is not careless.", "Nothing forces mentors to overlap founders, so A and B do not follow; D overgeneralises from some readers."],
    whyMethod: "Track existence words (‘some’) separately from universal containment (‘all’ and ‘no’).",
    commonMistake: "Combining ‘all mentors are readers’ and ‘some readers are founders’ to conclude some mentors are founders; the subsets need not overlap.",
    concept: "A valid syllogistic conclusion must hold in every set diagram satisfying the statements.",
    takeaway: "Never reverse an ‘all’ statement, and never invent overlap between two subsets of the same larger set.",
  }),
  mcq({
    id: "benchmark-di-01", topic: "Data Interpretation", subtopic: "Weighted growth", section: "LRDI",
    stem: "A firm has 120 employees in Division A and 80 in Division B. A grows by 25% while B falls by 10%. What is the percentage change in total employees?",
    choices: [{ key: "A", text: "8% increase" }, { key: "B", text: "10% increase" }, { key: "C", text: "11% increase" }, { key: "D", text: "15% increase" }], answer: "C",
    solution: ["Original total = 120 + 80 = 200.", "A gains 25% of 120 = 30 employees.", "B loses 10% of 80 = 8 employees.", "Net gain = 22, so new total = 222 and percentage increase = 22/200 × 100 = 11%."],
    whyMethod: "Percentage changes on unequal bases must be converted to absolute changes before combining.",
    commonMistake: "Averaging +25% and −10% to get +7.5%; the divisions have different sizes.",
    concept: "The overall rate is a weighted average of component rates, weighted by their original shares.",
    alternateMethod: "Overall change = 0.6(25%) + 0.4(−10%) = 15% − 4% = 11%.",
    takeaway: "When subgroup sizes differ, never take a simple average of their percentages.",
  }),
];
const VERBAL_BANK: Question[] = [
  mcq({
    id: "benchmark-cr-01", topic: "Critical Reasoning", subtopic: "Necessary assumption", section: "VARC",
    stem: "A city claims that extending library hours will improve students’ examination scores because students will have more time to study. Which assumption is necessary?",
    choices: [{ key: "A", text: "Every student prefers libraries to studying at home" }, { key: "B", text: "At least some students who need additional study time will use the extended hours" }, { key: "C", text: "Libraries are quieter than every other study space" }, { key: "D", text: "Examination scores depend only on hours studied" }], answer: "B",
    solution: ["The proposal creates extra library time and predicts improved scores through its use.", "If no relevant student uses the added hours, the proposed cause cannot produce the claimed effect.", "Therefore some students needing study time must actually use the extension.", "A, C and D are much stronger than the argument requires."],
    whyMethod: "Use the negation test: negate an option and ask whether the argument collapses.",
    commonMistake: "Choosing an extreme statement because it strongly supports the claim. A necessary assumption is the minimum bridge, not the strongest praise.",
    faster: "Negate B: no student needing more study time uses the extended hours. The causal chain immediately breaks.",
    concept: "A necessary assumption links the evidence to the conclusion and must be true for the reasoning to work.",
    takeaway: "Prefer the modest bridge over absolute words such as every, only, and always.",
  }),
  mcq({
    id: "benchmark-verbal-01", topic: "Verbal Ability", subtopic: "Sentence completion", section: "VARC",
    stem: "Far from being a ______ account, the historian’s narrative repeatedly pauses to question whether its own sources deserve belief.",
    choices: [{ key: "A", text: "credulous" }, { key: "B", text: "meticulous" }, { key: "C", text: "lucid" }, { key: "D", text: "chronological" }], answer: "A",
    solution: ["‘Far from’ signals contrast between the blank and the behaviour described later.", "The historian questions whether sources deserve belief, which shows scepticism.", "The opposite is credulous—too ready to believe.", "Meticulous and lucid may be positive qualities, while chronological concerns ordering, not belief."],
    whyMethod: "Identify the sentence's logic marker before evaluating vocabulary.",
    commonMistake: "Choosing ‘meticulous’ because questioning sources sounds careful; ‘far from’ requires the opposite quality.",
    concept: "Contrast markers such as although, yet, and far from determine the semantic direction of a blank.",
    takeaway: "Predict the meaning in your own words before looking at the options.",
  }),
];

export function enrichQuestion(q: Question): Question {
  const concept = q.concept ?? `This question tests ${q.subtopic.toLowerCase()} within ${q.topic}. First identify the invariant or relationship that remains true before substituting values.`;
  return {
    ...q,
    concept,
    alternateMethod: q.alternateMethod ?? q.faster ?? "Reframe the same relationship with a second representation—fractions, ratios, a diagram, or a compact equation—and verify that it reaches the same result.",
    takeaway: q.takeaway ?? "Write the governing relationship first, keep units and bases explicit, and use the final ten seconds to check whether the answer is reasonable.",
  };
}

export function benchmarkQuestions(section: "QA-MCQ" | "QA-SA" | "LRDI" | "VARC", count: number, seed: number, source: string): Question[] {
  const bank = section === "QA-SA" ? SA_BANK : section === "LRDI" ? LR_BANK : section === "VARC" ? VERBAL_BANK : QUANT_BANK;
  const rng = new RNG(hashSeed("benchmark", section, seed));
  return rng.shuffle(bank).slice(0, Math.min(count, bank.length)).map((q, i) => enrichQuestion({ ...q, id: `${q.id}-${seed}-${i}`, source }));
}

export function buildLogicalReasoningSet(seed: number, count: number, source: string): Question[] {
  const questions: Question[] = [];
  for (let index = 0; index < count; index++) {
    const rng = new RNG(hashSeed("lr-generated", seed, index));
    if (index % 2 === 0) {
      const start = rng.int(2, 8);
      const jump = rng.int(2, 5);
      const sequence = [start];
      for (let n = 1; n < 5; n++) sequence.push(sequence[n - 1] + jump * n);
      const answerValue = sequence[4] + jump * 5;
      const distractors = [answerValue - jump, answerValue + jump, answerValue + 5];
      const options = rng.shuffle([{ value: answerValue, correct: true }, ...distractors.map((value) => ({ value, correct: false }))]);
      const keys = ["A", "B", "C", "D"];
      questions.push(enrichQuestion({
        id: `lr-series-${seed}-${index}`, topic: "Logical Reasoning", subtopic: "Second-order series", section: "LRDI", difficulty: "Hard",
        stem: `Find the next term: ${sequence.join(", ")}, ?`, choices: options.map((option, i) => ({ key: keys[i], text: String(option.value) })), answer: keys[options.findIndex((option) => option.correct)],
        solution: [`Successive differences are ${jump}, ${2 * jump}, ${3 * jump}, ${4 * jump}.`, `The differences themselves rise by ${jump}, so the next difference is ${5 * jump}.`, `Next term = ${sequence[4]} + ${5 * jump} = ${answerValue}.`],
        whyMethod: "When first differences are not constant, inspect whether those differences form a simple progression.", commonMistake: "Forcing a multiplication pattern without checking adjacent differences.",
        concept: "A sequence with constant second differences is generated by a quadratic rule.", takeaway: "Write a difference row under the sequence before guessing a pattern.", source,
      }));
    } else {
      const ahead = rng.int(4, 11);
      const behind = rng.int(5, 12);
      const total = ahead + behind + 1;
      questions.push(enrichQuestion({
        id: `lr-rank-${seed}-${index}`, topic: "Logical Reasoning", subtopic: "Ranks", section: "LRDI", difficulty: "Hard",
        stem: `Mira is ${ahead + 1}th from the front and ${behind + 1}th from the back in a queue. How many people are in the queue?`,
        choices: [{ key: "A", text: String(total - 1) }, { key: "B", text: String(total) }, { key: "C", text: String(total + 1) }, { key: "D", text: String(total + 2) }], answer: "B",
        solution: [`People ahead of Mira = ${ahead}; people behind = ${behind}.`, `Include Mira once: total = ${ahead} + 1 + ${behind} = ${total}.`, `Equivalently, front rank + back rank − 1 = ${ahead + 1} + ${behind + 1} − 1 = ${total}.`],
        whyMethod: "The person is included in both stated ranks, so subtract one when combining them.", commonMistake: "Adding both ranks directly and counting Mira twice.",
        concept: "Total in a single queue = rank from front + rank from back − 1.", takeaway: "Draw three blocks—ahead, person, behind—if rank wording feels ambiguous.", source,
      }));
    }
  }
  return questions;
}
