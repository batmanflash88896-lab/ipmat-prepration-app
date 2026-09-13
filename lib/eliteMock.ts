import { RNG, hashSeed } from "./rng";
import type { Choice, Question } from "./types";
import { enrichQuestion } from "./advancedQuestions";

const keys = ["A", "B", "C", "D"];

function numberChoices(rng: RNG, correct: number, offsets: number[], format: (n: number) => string = String) {
  const values = [correct, ...offsets.map((offset) => correct + offset)];
  const unique = Array.from(new Set(values));
  while (unique.length < 4) unique.push(correct + unique.length * 2 + 1);
  const shuffled = rng.shuffle(unique.slice(0, 4));
  return {
    choices: shuffled.map((value, i) => ({ key: keys[i], text: format(value) })),
    answer: keys[shuffled.indexOf(correct)],
  };
}

function hard(question: Question): Question {
  return enrichQuestion({ ...question, difficulty: "Hard", source: question.source ?? "Aptivo Elite · above-PYQ original" });
}

export function buildEliteQuantSet(seed: number, count: number, section: "QA-MCQ" | "QA-SA" = "QA-MCQ"): Question[] {
  return Array.from({ length: count }, (_, index) => {
    const rng = new RNG(hashSeed("elite-quant", seed, index, section));
    return section === "QA-SA" ? eliteSA(rng, seed, index) : eliteMCQ(rng, seed, index);
  });
}

function eliteMCQ(rng: RNG, seed: number, index: number): Question {
  const id = `elite-mcq-${seed}-${index}`;
  switch (index % 8) {
    case 0: {
      const sum = rng.int(7, 13);
      const product = rng.int(6, Math.floor((sum * sum - 1) / 4));
      const squareSum = sum * sum - 2 * product;
      const value = sum ** 3 - 3 * product * sum;
      const option = numberChoices(rng, value, [-sum * product, sum * product, 2 * sum]);
      return hard({ id, topic: "Algebra", subtopic: "Symmetric identities", section: "QA-MCQ", difficulty: "Hard", stem: `Real numbers x and y satisfy x + y = ${sum} and x² + y² = ${squareSum}. Find x³ + y³.`, ...option, solution: [`x²+y²=(x+y)²−2xy, so ${squareSum}=${sum ** 2}−2xy.`, `Hence xy=${product}.`, `x³+y³=(x+y)³−3xy(x+y).`, `The value is ${sum}³−3×${product}×${sum}=${value}.`], whyMethod: "The target is symmetric, so use x+y and xy rather than solving for x and y.", commonMistake: "Dropping the factor (x+y) in the cubic identity.", faster: `Substitute directly into s³−3ps with s=${sum}, p=${product}.`, concept: "Every symmetric polynomial in two variables can be rewritten using their sum and product.", takeaway: "Do not solve for individual roots when the requested expression is symmetric." });
    }
    case 1: {
      const base = rng.pick([3, 7]);
      const exponent = 4 * rng.int(15, 35) + rng.pick([1, 3]);
      const units = Number((BigInt(base) ** BigInt(exponent) + BigInt(10 - base) ** BigInt(exponent + 2)) % 10n);
      const unitOptions = rng.shuffle([0, 2, 4, 6]);
      const option = { choices: unitOptions.map((value, i) => ({ key: keys[i], text: String(value) })), answer: keys[unitOptions.indexOf(units)] };
      return hard({ id, topic: "Number System", subtopic: "Power cyclicity", section: "QA-MCQ", difficulty: "Hard", stem: `What is the units digit of ${base}^${exponent} + ${10 - base}^${exponent + 2}?`, ...option, solution: [`Units digits repeat every four powers.`, `${exponent} ≡ ${exponent % 4} (mod 4), while ${exponent + 2} ≡ ${(exponent + 2) % 4} (mod 4).`, `Evaluating the two cycle positions and adding gives a units digit of ${units}.`], whyMethod: "Only residues modulo 10 matter; reduce exponents by the cycle length.", commonMistake: "Reducing the base but not the exponent, or treating exponent remainder 0 as power 0.", concept: "Powers modulo 10 are periodic because there are finitely many residues.", takeaway: "Write the four-term units cycle before substituting a large exponent." });
    }
    case 2: {
      const a = rng.pick([12, 18, 24]);
      const b = rng.pick([24, 36, 48]);
      const together = rng.pick([3, 4, 6]);
      const remainingDays = Math.round((b * (1 - together / a - together / b)) * 100) / 100;
      const option = numberChoices(rng, remainingDays, [-2, 2, together]);
      return hard({ id, topic: "Time & Work", subtopic: "Changing workforce", section: "QA-MCQ", difficulty: "Hard", stem: `A can complete a project in ${a} days and B in ${b} days. They work together for ${together} days; then A leaves. How many additional days does B need?`, ...option, solution: [`Their combined ${together}-day work is ${together}(1/${a}+1/${b}).`, `Remaining work = 1−${together}/${a}−${together}/${b}.`, `At B's rate 1/${b}, remaining time = ${b}(1−${together}/${a}−${together}/${b})=${remainingDays} days.`], whyMethod: "Split the work into phases because the active workforce changes.", commonMistake: "Averaging completion times or continuing to use the combined rate after A leaves.", faster: "Use B-equivalent days: subtract B's own days worked and the work contributed by A from B's solo time.", concept: "Work rates add; completion times do not.", takeaway: "Draw a timeline whenever workers join or leave." });
    }
    case 3: {
      const first = rng.pick([15, 20, 25, 30]);
      const second = rng.pick([10, 20, 25]);
      const net = Math.round(((1 + first / 100) * (1 - second / 100) - 1) * 10000) / 100;
      const option = numberChoices(rng, net, [-5, 5, first - second], (n) => `${n}%`);
      return hard({ id, topic: "Percentages", subtopic: "Successive change", section: "QA-MCQ", difficulty: "Hard", stem: `A value rises by ${first}% and then falls by ${second}%. What is the net percentage change from its original value?`, ...option, solution: [`Use a base of 100. After the rise it becomes ${100 + first}.`, `After the fall it becomes ${100 + first}×${100 - second}/100=${100 + net}.`, `Net change = ${net}%.`], whyMethod: "Successive percentages act on different bases, so multiply change factors.", commonMistake: `Subtracting ${second} from ${first}; that ignores the changed base.`, faster: `Net %= a−b−ab/100 = ${first}−${second}−(${first}×${second})/100.`, concept: "A p% change corresponds to multiplication by 1±p/100.", takeaway: "Successive changes multiply; they do not simply add." });
    }
    case 4: {
      const evenDigits = 2;
      const correct = evenDigits * 24;
      const option = numberChoices(rng, correct, [-12, 12, 24]);
      return hard({ id, topic: "Permutation & Combination", subtopic: "Restricted numbers", section: "QA-MCQ", difficulty: "Hard", stem: "How many five-digit even numbers can be formed using 1, 2, 3, 4 and 5 exactly once?", ...option, solution: ["The final digit must be 2 or 4: two choices.", "The remaining four digits can be arranged in 4! ways.", "Total = 2×4! = 48."], whyMethod: "Fix the most constrained position first.", commonMistake: "Using 5!/2 without justifying the parity split for the available digits.", concept: "Restricted arrangements are easiest when constraints are handled before free positions.", takeaway: "For divisibility questions, begin with the units digit." });
    }
    case 5: {
      const sideRatio = rng.pick([2, 3, 4]);
      const wholeRatio = sideRatio + rng.pick([2, 3]);
      const smallArea = sideRatio * sideRatio * rng.int(5, 12);
      const totalArea = smallArea * wholeRatio * wholeRatio / (sideRatio * sideRatio);
      const answerValue = totalArea - smallArea;
      const option = numberChoices(rng, answerValue, [-smallArea, smallArea, totalArea - answerValue]);
      return hard({ id, topic: "Geometry", subtopic: "Similarity and area", section: "QA-MCQ", difficulty: "Hard", stem: `A line parallel to one side of a triangle cuts a smaller similar triangle whose corresponding side ratio to the whole triangle is ${sideRatio}:${wholeRatio}. If the smaller triangle's area is ${smallArea}, find the area outside it but inside the original triangle.`, ...option, solution: [`Area ratio = (${sideRatio}/${wholeRatio})² = ${sideRatio ** 2}:${wholeRatio ** 2}.`, `Whole area = ${smallArea}×${wholeRatio ** 2}/${sideRatio ** 2}=${totalArea}.`, `Required area = ${totalArea}−${smallArea}=${answerValue}.`], whyMethod: "Areas of similar figures scale as the square of their side ratio.", commonMistake: "Using the linear side ratio directly for areas.", concept: "Similarity preserves angles; lengths scale by k and areas by k².", takeaway: "Square a similarity ratio before comparing areas." });
    }
    case 6: {
      const n = rng.int(7, 11);
      const r = 3;
      const allCommittees = n * (n - 1) * (n - 2) / 6;
      const correct = allCommittees - (n - 2);
      const option = numberChoices(rng, correct, [-n, n, n * 2]);
      return hard({ id, topic: "Permutation & Combination", subtopic: "Selection under condition", section: "QA-MCQ", difficulty: "Hard", stem: `A committee of 3 is chosen from ${n} students. Two particular students refuse to serve together. How many committees are possible?`, ...option, solution: [`All committees = C(${n},3).`, `Invalid committees containing both particular students: choose the third from ${n - 2}, giving ${n - 2}.`, `Valid = C(${n},3)−${n - 2} = ${correct}.`], whyMethod: "Count all arrangements, then subtract the clearly defined forbidden set.", commonMistake: "Subtracting only one invalid committee; the third member can vary.", concept: "Complement counting is powerful when the restriction is simpler than the valid cases.", takeaway: "Define exactly what remains free after fixing the forbidden pair." });
    }
    default: {
      const total = 11;
      const correct = 4;
      const optionValues = rng.shuffle(["2/11", "3/11", "4/11", "5/18"]);
      const choices = optionValues.map((text, i) => ({ key: keys[i], text }));
      return hard({ id, topic: "Probability", subtopic: "Conditional sample space", section: "QA-MCQ", difficulty: "Hard", stem: "Two fair dice are rolled. Given that at least one die shows 4, what is the probability that their sum is at least 9?", choices, answer: keys[optionValues.indexOf(`${correct}/${total}`)], solution: ["Given at least one 4, the reduced sample space has 6+6−1=11 ordered outcomes.", "Sums at least 9 occur for (4,5), (5,4), (4,6), (6,4): four outcomes.", "Required probability = 4/11."], whyMethod: "The condition changes the denominator; rebuild the sample space.", commonMistake: "Keeping 36 as the denominator after conditioning.", concept: "For equally likely outcomes, P(A|B)=|A∩B|/|B|.", takeaway: "Underline ‘given that’ because it almost always changes the denominator." });
    }
  }
}

function eliteSA(rng: RNG, seed: number, index: number): Question {
  const id = `elite-sa-${seed}-${index}`;
  switch (index % 5) {
    case 0: {
      const a = rng.int(2, 5), sum = rng.int(5, 11), product = rng.int(2, 9);
      const scale = a * product;
      const value = a * sum;
      return hard({ id, topic: "Algebra", subtopic: "Vieta's relations", section: "QA-SA", difficulty: "Hard", stem: `The roots α, β of x² − ${sum}x + ${product} = 0 are non-zero. Find ${scale}(1/α + 1/β).`, answer: String(value), answerValue: value, solution: [`α+β=${sum}, αβ=${product}.`, `1/α+1/β=(α+β)/(αβ)=${sum}/${product}.`, `${scale}×${sum}/${product}=${value}.`], whyMethod: "Use root sum and product; individual roots are irrelevant.", commonMistake: "Replacing the reciprocal sum with 1/(α+β).", concept: "The reciprocal-root sum is −b/c for ax²+bx+c=0.", takeaway: "Translate root expressions into sum and product before solving." });
    }
    case 1: {
      const modA = rng.pick([7, 8, 9]), remA = rng.int(1, modA - 1), modB = rng.pick([5, 11]);
      let value = remA;
      while (value % modB !== 2) value += modA;
      return hard({ id, topic: "Number System", subtopic: "Simultaneous remainders", section: "QA-SA", difficulty: "Hard", stem: `Find the least positive integer n such that n leaves remainder ${remA} when divided by ${modA} and remainder 2 when divided by ${modB}.`, answer: String(value), answerValue: value, solution: [`Write n=${remA}+${modA}k.`, `Impose ${remA}+${modA}k ≡ 2 (mod ${modB}).`, `The least non-negative k satisfying this gives n=${value}.`], whyMethod: "Parameterise one congruence, then test it in the other.", commonMistake: "Adding or multiplying the two remainders.", concept: "Simultaneous congruences locate an intersection of arithmetic progressions.", takeaway: "Use the progression with the larger step and test residues." });
    }
    case 2: {
      const k = rng.int(2, 5);
      const legs = [3 * k, 4 * k], hyp = 5 * k, value = k;
      return hard({ id, topic: "Geometry", subtopic: "Right-triangle inradius", section: "QA-SA", difficulty: "Hard", stem: `A right triangle has legs ${legs[0]} and ${legs[1]}. Find its inradius.`, answer: String(value), answerValue: value, solution: [`Hypotenuse = ${hyp} by the 3-4-5 ratio.`, `For a right triangle, r=(a+b−c)/2.`, `r=(${legs[0]}+${legs[1]}−${hyp})/2=${value}.`], whyMethod: "Use the right-triangle inradius identity.", alternateMethod: `Area=${legs[0] * legs[1] / 2}, semiperimeter=${(legs[0] + legs[1] + hyp) / 2}; r=Area/s=${value}.`, concept: "For any triangle, area equals inradius times semiperimeter.", takeaway: "Recognise scaled Pythagorean triples before using the distance formula." });
    }
    case 3: {
      const n = rng.int(8, 15);
      const value = n * (n + 1) * (2 * n + 1) / 6;
      return hard({ id, topic: "Algebra", subtopic: "Series", section: "QA-SA", difficulty: "Hard", stem: `Evaluate 1² + 2² + 3² + ... + ${n}².`, answer: String(value), answerValue: value, solution: [`Use Σk²=n(n+1)(2n+1)/6.`, `Substitute n=${n}: ${n}×${n + 1}×${2 * n + 1}/6.`, `The value is ${value}.`], whyMethod: "This is the standard sum-of-squares series, not an arithmetic progression.", commonMistake: "Using n(n+1)/2, which sums the integers rather than their squares.", concept: "Polynomial sequences have closed-form cumulative sums of one higher degree.", takeaway: "Identify the sequence type before selecting a sum formula." });
    }
    default: {
      const value = rng.int(3, 7);
      const power = 3 * value - 2;
      const rhs = 2 ** power;
      return hard({ id, topic: "Algebra", subtopic: "Exponential equations", section: "QA-SA", difficulty: "Hard", stem: `If 2^x × 4^(x−1) = ${rhs}, find x.`, answer: String(value), answerValue: value, solution: [`Write 4^(x−1)=2^(2x−2).`, `Then 2^x×2^(2x−2)=2^(3x−2).`, `${rhs}=2^${power}, so 3x−2=${power} and x=${value}.`], whyMethod: "Convert every term to a common base so equality reduces to equality of exponents.", commonMistake: "Multiplying exponents when multiplying powers with the same base; exponents must be added.", concept: "For a positive base other than 1, equal powers have equal exponents.", takeaway: "In exponential equations, search for a common base before taking logarithms." });
    }
  }
}

const vocabulary = [
  ["equivocal", "deliberately ambiguous", "unequivocal", "ornamental", "impulsive"],
  ["parsimonious", "extremely economical", "extravagant", "talkative", "uncertain"],
  ["intransigent", "unwilling to compromise", "transparent", "temporary", "enthusiastic"],
  ["sanguine", "optimistic in difficulty", "resentful", "careless", "secretive"],
  ["trenchant", "sharp and effective", "lengthy but empty", "politely vague", "historically inaccurate"],
  ["anodyne", "unlikely to provoke offence", "deeply divisive", "scientifically proven", "needlessly complex"],
  ["recondite", "difficult and little known", "obvious", "practical", "widely celebrated"],
  ["perfunctory", "done with minimal effort", "meticulous", "creative", "legally binding"],
  ["iconoclastic", "challenging established beliefs", "strictly traditional", "emotionally neutral", "financially prudent"],
  ["profligate", "recklessly wasteful", "cautiously frugal", "quietly persuasive", "morally uncertain"],
  ["pellucid", "transparently clear", "deliberately obscure", "highly emotional", "needlessly hostile"],
  ["obdurate", "stubbornly resistant", "easily persuaded", "deeply informed", "openly generous"],
  ["diffident", "lacking self-confidence", "aggressively certain", "carelessly prepared", "socially prominent"],
  ["deleterious", "causing harm", "producing balance", "offering proof", "reducing expense"],
  ["liminal", "occupying a threshold state", "fully completed", "legally forbidden", "widely imitated"],
] as const;

const assumptionScenarios = [
  ["a college extends library hours", "students now have more time to study there", "students needing extra study time use the extended hours"],
  ["a city adds late-night buses", "workers will have easier commutes", "workers who lack transport use the new services"],
  ["a school offers optional tutorials", "mathematics scores will rise", "students who need support attend the tutorials"],
  ["a firm introduces mentoring", "new-employee retention will improve", "new employees participate in mentoring"],
  ["a museum opens on Mondays", "annual attendance will increase", "some potential visitors prefer or can use Monday access"],
  ["a clinic launches text reminders", "missed appointments will fall", "patients receive and read the reminders"],
  ["a town builds protected cycle lanes", "commuting by bicycle will rise", "safety concerns deter at least some potential cyclists"],
  ["a university records every lecture", "course completion will improve", "students who miss class watch the recordings"],
  ["a bank simplifies its application", "more eligible customers will apply", "complexity currently deters some eligible customers"],
  ["a company permits remote Fridays", "employee satisfaction will improve", "employees value or use that flexibility"],
  ["a library removes late fees", "book borrowing will increase", "late-fee concerns deter some potential borrowers"],
  ["a district provides free breakfast", "morning attendance will improve", "lack of breakfast contributes to some absences"],
  ["a platform adds captions", "lesson completion will rise", "some learners benefit from or require captions"],
  ["a park installs lighting", "evening use will increase", "poor visibility discourages some evening visitors"],
  ["a college expands counselling hours", "student use of counselling will rise", "limited appointment access suppresses current demand"],
] as const;

const grammarSubjects = ["panel", "research team", "committee", "editorial board", "jury", "audit group", "review council", "faculty senate", "ethics board", "planning unit", "advisory body", "selection panel", "working group", "expert commission", "assessment team"];

export function buildEliteVarcSet(seed: number, count: number): Question[] {
  return Array.from({ length: count }, (_, index) => {
    const rng = new RNG(hashSeed("elite-varc", seed, index));
    const [word, meaning, ...wrong] = vocabulary[Math.floor(index / 3) % vocabulary.length];
    if (index % 3 === 0) {
      const options = rng.shuffle([meaning, ...wrong]);
      return hard({ id: `elite-varc-${seed}-${index}`, topic: "Vocabulary", subtopic: "Meaning in context", section: "VARC", difficulty: "Hard", stem: `In the sentence “The committee issued an ${word} statement that allowed both factions to claim victory,” ${word} most nearly means:`, choices: options.map((text, i) => ({ key: keys[i], text })), answer: keys[options.indexOf(meaning)], solution: [`The sentence shows that both opposing sides can interpret the statement in their favour.`, `That contextual clue points to “${meaning}.”`, `The other options do not explain the dual interpretation.`], whyMethod: "Infer the logical role of the word before recalling a dictionary definition.", commonMistake: "Choosing an option with the right tone but the wrong logical function.", concept: "Contextual vocabulary tests denotation and the sentence's argumentative structure.", takeaway: "Replace the word with each option and reread the complete sentence." });
    }
    if (index % 3 === 1) {
      const [action, claim, bridge] = assumptionScenarios[Math.floor(index / 3) % assumptionScenarios.length];
      const choices: Choice[] = [{ key: "A", text: "The change is the only possible cause of improvement." }, { key: "B", text: `At least some relevant people are affected: ${bridge}.` }, { key: "C", text: "No other condition changes during the period." }, { key: "D", text: "Every person benefits to exactly the same extent." }];
      return hard({ id: `elite-cr-${seed}-${index}`, topic: "Critical Reasoning", subtopic: "Necessary assumption", section: "VARC", difficulty: "Hard", stem: `An institution argues that if ${action}, outcomes will improve because ${claim}. Which assumption is necessary for the prediction?`, choices, answer: "B", solution: ["Identify the proposed change and the predicted outcome.", "If the relevant group never uses or is not affected by the change, the stated causal bridge fails.", `The minimum required bridge is that ${bridge}; the other options are stronger than necessary.`], whyMethod: "Apply the negation test: negate an option and see whether the argument collapses.", commonMistake: "Choosing a strong supporting statement rather than the minimum necessary bridge.", concept: "A necessary assumption connects evidence and conclusion without claiming more than required.", takeaway: "Be suspicious of absolute words such as every, only and no other." });
    }
    const subject = grammarSubjects[Math.floor(index / 3) % grammarSubjects.length];
    const options = [`Although the evidence was incomplete, the ${subject} reached a cautious conclusion.`, `Although the evidence was incomplete, but the ${subject} reached a cautious conclusion.`, `Despite the evidence was incomplete, the ${subject} reached a cautious conclusion.`, `The evidence being incomplete, but a cautious conclusion was reached by the ${subject}.`];
    return hard({ id: `elite-grammar-${seed}-${index}`, topic: "Grammar", subtopic: "Connectors and clause structure", section: "VARC", difficulty: "Hard", stem: `Choose the grammatically correct and stylistically clearest version of the sentence about the ${subject}.`, choices: options.map((text, i) => ({ key: keys[i], text })), answer: "A", solution: ["‘Although’ correctly introduces a finite concessive clause.", "Option B redundantly pairs although with but.", "‘Despite’ requires a noun phrase or gerund, so C is invalid; D is awkward and also misuses but."], whyMethod: "Check connector grammar first, then clarity and economy.", commonMistake: "Treating although...but as a valid paired conjunction in formal English.", concept: "Although takes a clause; despite takes a noun phrase or gerund.", takeaway: "Never use ‘but’ to complete an ‘although’ clause." });
  });
}
