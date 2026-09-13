import type { Question } from "./types";
import { VOCAB, IDIOMS } from "./vocab";
import { RNG, hashSeed } from "./rng";
import { enrichQuestion } from "./advancedQuestions";

export type RCQuestion = {
  q: string;
  choices: { key: string; text: string }[];
  answer: string;
  explanation: string;
};

export type Passage = {
  id: string;
  title: string;
  source: string;
  paragraphs: string[];
  questions: RCQuestion[];
};

export const PASSAGES: Passage[] = [
  {
    id: "rc-behaviour",
    title: "The Economics of Small Choices",
    source: "IPMAT-style RC (Behavioural Economics)",
    paragraphs: [
      "For decades, classical economics assumed that people are rational agents who weigh costs and benefits and then act to maximise their self-interest. Yet everyday behaviour tells a messier story. Shoppers buy items they do not need because they are 'on sale'; savers under-invest for retirement despite knowing the arithmetic of compounding; and diners eat more from larger plates without registering the difference. Behavioural economics emerged precisely to explain such systematic departures from the rational ideal.",
      "Central to the field is the idea of a 'nudge'—a small change in the way choices are presented that steers behaviour without forbidding any option or significantly altering incentives. Placing fruit at eye level in a cafeteria is a nudge; banning desserts is not. The power of nudges lies in their respect for freedom: people remain free to choose, but the default path is gently tilted toward outcomes that most would endorse on reflection.",
      "Critics, however, warn that nudging can slide into manipulation. If a government or corporation designs defaults that serve its own ends, the line between guidance and coercion blurs. Proponents reply that choices are never presented in a vacuum—some arrangement is unavoidable—so the honest question is not whether to influence behaviour but how to do so transparently and in the chooser's genuine interest.",
    ],
    questions: [
      {
        q: "The primary purpose of the passage is to:",
        choices: [
          { key: "A", text: "argue that classical economics is entirely wrong" },
          { key: "B", text: "introduce behavioural economics and the concept of nudging along with its debate" },
          { key: "C", text: "prove that nudging is a form of manipulation" },
          { key: "D", text: "recommend banning unhealthy foods in cafeterias" },
        ],
        answer: "B",
        explanation: "The passage introduces why behavioural economics arose, explains nudges, and presents the criticism/defence debate—so it is expository, not a one-sided argument. B captures this.",
      },
      {
        q: "According to the passage, a 'nudge' is best described as:",
        choices: [
          { key: "A", text: "a ban on undesirable options" },
          { key: "B", text: "a large financial incentive" },
          { key: "C", text: "a small change in how choices are presented that preserves freedom of choice" },
          { key: "D", text: "a law that forces healthy behaviour" },
        ],
        answer: "C",
        explanation: "Paragraph 2 defines a nudge as a small presentation change that steers behaviour 'without forbidding any option'—directly matching C.",
      },
      {
        q: "The author would most likely agree that:",
        choices: [
          { key: "A", text: "influencing choices is unavoidable, so it should be done transparently" },
          { key: "B", text: "people always act to maximise self-interest" },
          { key: "C", text: "defaults should always serve the designer's interest" },
          { key: "D", text: "nudging should be outlawed" },
        ],
        answer: "A",
        explanation: "The final paragraph states some arrangement is 'unavoidable' and the honest question is how to influence 'transparently and in the chooser's genuine interest'—matching A.",
      },
    ],
  },
  {
    id: "rc-language",
    title: "How Languages Shape Thought",
    source: "IPMAT-style RC (Linguistics)",
    paragraphs: [
      "Does the language we speak shape the way we think? The strong version of this idea, once associated with Benjamin Lee Whorf, held that language determines thought so completely that speakers of different tongues inhabit different mental worlds. That claim has largely been abandoned; people clearly conceive of ideas for which their language has no single word. Yet a softer version has survived rigorous testing and now enjoys respectable evidence.",
      "Consider colour. Languages carve the spectrum differently: some treat blue and green as one category, others split blue into distinct 'light' and 'dark' terms. Experiments show that speakers whose language marks a boundary detect differences across that boundary slightly faster. The effect is modest, but it is real and replicable, suggesting that habitual categories can sharpen certain perceptions.",
      "The lesson is one of influence, not imprisonment. Language does not lock us into a fixed way of seeing; rather, it nudges attention, making some distinctions habitual and others effortful. Thought and language interact continuously, each reshaping the other, which is why learning a new language can feel like acquiring not just new words but new angles of vision.",
    ],
    questions: [
      {
        q: "The passage suggests that the 'strong version' of Whorf's idea has been:",
        choices: [
          { key: "A", text: "confirmed by colour experiments" },
          { key: "B", text: "largely abandoned" },
          { key: "C", text: "never tested" },
          { key: "D", text: "adopted by most linguists" },
        ],
        answer: "B",
        explanation: "The first paragraph says the strong version 'has largely been abandoned'—directly stated.",
      },
      {
        q: "The colour experiments are used in the passage mainly to:",
        choices: [
          { key: "A", text: "disprove that language affects thought" },
          { key: "B", text: "provide replicable evidence for the softer version of the hypothesis" },
          { key: "C", text: "show that all languages categorise colour identically" },
          { key: "D", text: "argue that blue and green are the same" },
        ],
        answer: "B",
        explanation: "The colour example gives 'modest but real and replicable' evidence supporting the surviving softer claim (B).",
      },
      {
        q: "The phrase 'influence, not imprisonment' primarily conveys that language:",
        choices: [
          { key: "A", text: "completely controls thought" },
          { key: "B", text: "has no effect on thought" },
          { key: "C", text: "shapes attention without rigidly determining thought" },
          { key: "D", text: "prevents people from learning new ideas" },
        ],
        answer: "C",
        explanation: "The final paragraph contrasts 'nudges attention' with 'lock us into'—language guides but does not determine, matching C.",
      },
    ],
  },
  {
    id: "rc-cities",
    title: "The Quiet Revolution of Cities",
    source: "IPMAT-style RC (Urban Studies)",
    paragraphs: [
      "For most of human history, cities were the exception. The overwhelming majority of people lived and worked on the land, and urban centres, however glittering, held only a small fraction of humanity. That balance has now decisively tipped: more than half the world's population lives in cities, and the share keeps climbing. This shift is among the most consequential in human history, yet it often unfolds too gradually to feel like an event.",
      "Cities concentrate not only people but possibility. By packing talent, capital, and infrastructure into small areas, they lower the cost of collaboration and speed the exchange of ideas. Economists note that doubling a city's size tends to raise productivity per person—a pattern called 'agglomeration'. The same density that spreads disease and strains housing also multiplies opportunity, which is why, despite their problems, cities keep drawing newcomers.",
      "The challenge of the coming decades is therefore not to halt urban growth but to shape it. Well-planned density can be green, humane, and affordable; unplanned sprawl can be none of these. Whether the urban century becomes a triumph or a crisis depends less on how many people move to cities than on how wisely those cities are built.",
    ],
    questions: [
      {
        q: "The term 'agglomeration' in the passage refers to:",
        choices: [
          { key: "A", text: "the spread of disease in dense areas" },
          { key: "B", text: "the tendency of larger cities to raise per-person productivity" },
          { key: "C", text: "the decline of rural populations" },
          { key: "D", text: "unplanned urban sprawl" },
        ],
        answer: "B",
        explanation: "Paragraph 2 defines agglomeration via 'doubling a city's size tends to raise productivity per person'.",
      },
      {
        q: "The author's central argument is that:",
        choices: [
          { key: "A", text: "urban growth should be stopped" },
          { key: "B", text: "cities are entirely harmful" },
          { key: "C", text: "the key issue is shaping urban growth wisely, not halting it" },
          { key: "D", text: "rural life is superior to city life" },
        ],
        answer: "C",
        explanation: "The last paragraph explicitly says the challenge is 'not to halt urban growth but to shape it'.",
      },
      {
        q: "The tone of the passage can best be described as:",
        choices: [
          { key: "A", text: "alarmed and pessimistic" },
          { key: "B", text: "balanced and analytical" },
          { key: "C", text: "nostalgic and sentimental" },
          { key: "D", text: "sarcastic and dismissive" },
        ],
        answer: "B",
        explanation: "The author weighs both benefits (opportunity, productivity) and costs (disease, sprawl) evenhandedly—balanced and analytical.",
      },
    ],
  },
];

// ---- Para-jumbles ----
export type ParaJumble = {
  id: string;
  intro: string;
  sentences: { key: string; text: string }[];
  answer: string[]; // correct order of keys
  explanation: string;
};

export const PARA_JUMBLES: ParaJumble[] = [
  {
    id: "pj1",
    intro: "Arrange the sentences into a coherent paragraph:",
    sentences: [
      { key: "A", text: "This habit, repeated daily, compounds into remarkable expertise over months." },
      { key: "B", text: "Most experts are not born; they are built through deliberate practice." },
      { key: "C", text: "Deliberate practice means working at the edge of your ability, on your weaknesses." },
      { key: "D", text: "Each session, they target a specific weakness rather than mindlessly repeating what they already know." },
    ],
    answer: ["B", "C", "D", "A"],
    explanation: "B is the topic sentence (a general claim). C defines the key term 'deliberate practice'. D elaborates how it is done ('Each session...'). A concludes with the long-term payoff ('This habit... compounds').",
  },
  {
    id: "pj2",
    intro: "Arrange the sentences into a coherent paragraph:",
    sentences: [
      { key: "A", text: "Yet the results were startling: the plants exposed to music grew noticeably faster." },
      { key: "B", text: "A curious gardener once decided to test an old wives' tale." },
      { key: "C", text: "She played classical music to one set of seedlings and left another in silence." },
      { key: "D", text: "Skeptics still debate the cause, but the experiment sparked dozens of follow-up studies." },
    ],
    answer: ["B", "C", "A", "D"],
    explanation: "B introduces the gardener and her test. C describes the setup. A gives the surprising result ('Yet the results...'). D closes with the aftermath and debate.",
  },
  {
    id: "pj3",
    intro: "Arrange the sentences into a coherent paragraph:",
    sentences: [
      { key: "A", text: "Over time, however, the river carved a canyon deep enough to swallow a skyscraper." },
      { key: "B", text: "At first, the stream seemed too gentle to change the hard rock beneath it." },
      { key: "C", text: "The lesson is clear: persistence, not force, shapes the greatest landscapes." },
      { key: "D", text: "Each tiny grain it carried scratched the stone almost imperceptibly." },
    ],
    answer: ["B", "D", "A", "C"],
    explanation: "B sets the scene (gentle stream). D explains the slow mechanism. A reveals the dramatic long-term outcome ('Over time, however'). C draws the moral conclusion ('The lesson is clear').",
  },
];

// ---- VARC question builder for daily & mock use ----
export function buildVocabQuestion(rng: RNG, id: string): Question {
  const w = rng.pick(VOCAB);
  const others = rng.shuffle(VOCAB.filter((v) => v.word !== w.word)).slice(0, 3);
  const opts = rng.shuffle([
    { text: w.meaning, correct: true },
    ...others.map((o) => ({ text: o.meaning, correct: false })),
  ]);
  const keys = ["A", "B", "C", "D"];
  const choices = opts.map((o, i) => ({ key: keys[i], text: o.text }));
  const answer = keys[opts.findIndex((o) => o.correct)];
  return {
    id, topic: "Vocabulary", subtopic: "Word meaning", section: "VARC", difficulty: "Medium",
    stem: `Choose the meaning closest to: "${w.word}" (${w.pos})`,
    choices, answer,
    solution: [
      `"${w.word}" means: ${w.meaning}`,
      `Example: ${w.sentence}`,
      `Synonyms: ${w.synonyms.join(", ")}. Antonyms: ${w.antonyms.join(", ")}.`,
    ],
    whyMethod: w.tip || "Match the word to its core sense; eliminate opposites first.",
    commonMistake: "Choosing an antonym or a distractor that merely 'sounds' related.",
  };
}

export function buildIdiomQuestion(rng: RNG, id: string): Question {
  const it = rng.pick(IDIOMS);
  const others = rng.shuffle(IDIOMS.filter((x) => x.phrase !== it.phrase)).slice(0, 3);
  const opts = rng.shuffle([
    { text: it.meaning, correct: true },
    ...others.map((o) => ({ text: o.meaning, correct: false })),
  ]);
  const keys = ["A", "B", "C", "D"];
  const choices = opts.map((o, i) => ({ key: keys[i], text: o.text }));
  const answer = keys[opts.findIndex((o) => o.correct)];
  return {
    id, topic: "Idioms & Phrases", subtopic: "Idiom meaning", section: "VARC", difficulty: "Medium",
    stem: `What does the idiom mean: "${it.phrase}"?`,
    choices, answer,
    solution: [`"${it.phrase}" means: ${it.meaning}`, `Example: ${it.sentence}`],
    whyMethod: "Idioms are non-literal; recall the fixed figurative meaning, not the words.",
    commonMistake: "Taking the idiom literally.",
  };
}

export function buildSynAntQuestion(rng: RNG, id: string): Question {
  const w = rng.pick(VOCAB.filter((v) => v.synonyms.length && v.antonyms.length));
  const wantSyn = rng.bool();
  const correct = wantSyn ? rng.pick(w.synonyms) : rng.pick(w.antonyms);
  const pool = wantSyn ? w.antonyms.concat(rng.pick(VOCAB).synonyms) : w.synonyms.concat(rng.pick(VOCAB).antonyms);
  const distract = rng.shuffle(pool.filter((x) => x !== correct)).slice(0, 3);
  const opts = rng.shuffle([{ text: correct, correct: true }, ...distract.map((d) => ({ text: d, correct: false }))]);
  const keys = ["A", "B", "C", "D"];
  const choices = opts.map((o, i) => ({ key: keys[i], text: o.text }));
  const answer = keys[opts.findIndex((o) => o.correct)];
  return {
    id, topic: "Vocabulary", subtopic: wantSyn ? "Synonyms" : "Antonyms", section: "VARC", difficulty: "Medium",
    stem: `Select the ${wantSyn ? "SYNONYM" : "ANTONYM"} of "${w.word}".`,
    choices, answer,
    solution: [
      `"${w.word}" means ${w.meaning}`,
      `${wantSyn ? "Synonym" : "Antonym"}: ${correct}`,
      `(Synonyms: ${w.synonyms.join(", ")}; Antonyms: ${w.antonyms.join(", ")})`,
    ],
    whyMethod: wantSyn ? "A synonym shares the same core meaning." : "An antonym reverses the core meaning.",
    commonMistake: wantSyn ? "Picking the antonym by mistake." : "Picking the synonym by mistake.",
  };
}

export function buildVARCSet(seed: number, count: number): Question[] {
  const out: Question[] = [];
  const builders = [buildVocabQuestion, buildIdiomQuestion, buildSynAntQuestion];
  for (let i = 0; i < count; i++) {
    const rng = new RNG(hashSeed("varc", seed, i));
    out.push(enrichQuestion(builders[i % builders.length](rng, `varc-${seed}-${i}`)));
  }
  return out;
}
