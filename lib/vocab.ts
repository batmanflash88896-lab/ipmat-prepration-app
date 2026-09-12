export type VocabWord = {
  word: string;
  pos: string;
  meaning: string;
  sentence: string;
  synonyms: string[];
  antonyms: string[];
  root?: string;
  tip?: string;
};

// Curated high-frequency IPMAT/CAT-level vocabulary
export const VOCAB: VocabWord[] = [
  { word: "Ubiquitous", pos: "adjective", meaning: "Present, appearing, or found everywhere.", sentence: "Smartphones have become ubiquitous in modern classrooms.", synonyms: ["omnipresent", "pervasive", "universal"], antonyms: ["rare", "scarce"], root: "Latin 'ubique' = everywhere", tip: "Think 'you-bik'—it's everywhere you look." },
  { word: "Ephemeral", pos: "adjective", meaning: "Lasting for a very short time.", sentence: "The beauty of a rainbow is ephemeral, fading within minutes.", synonyms: ["transient", "fleeting", "momentary"], antonyms: ["permanent", "enduring"], root: "Greek 'ephemeros' = lasting a day", tip: "An 'ephemeral' mayfly lives about a day." },
  { word: "Pragmatic", pos: "adjective", meaning: "Dealing with things sensibly and realistically.", sentence: "She took a pragmatic approach to budgeting instead of dreaming big.", synonyms: ["practical", "realistic", "sensible"], antonyms: ["idealistic", "impractical"], tip: "A pragmatist asks 'does it work?'" },
  { word: "Meticulous", pos: "adjective", meaning: "Showing great attention to detail; very careful.", sentence: "The accountant was meticulous, checking every figure twice.", synonyms: ["thorough", "scrupulous", "precise"], antonyms: ["careless", "sloppy"], tip: "Meticulous people leave no detail behind." },
  { word: "Ambiguous", pos: "adjective", meaning: "Open to more than one interpretation; unclear.", sentence: "His ambiguous reply left everyone guessing his real opinion.", synonyms: ["vague", "equivocal", "unclear"], antonyms: ["clear", "explicit"], root: "Latin 'ambi' = both ways", tip: "Ambi = both; it points both ways." },
  { word: "Candid", pos: "adjective", meaning: "Truthful and straightforward; frank.", sentence: "In a candid interview, the CEO admitted the mistake.", synonyms: ["frank", "honest", "forthright"], antonyms: ["evasive", "guarded"], tip: "A candid photo is unposed—honest." },
  { word: "Prudent", pos: "adjective", meaning: "Acting with care and thought for the future.", sentence: "It is prudent to keep an emergency fund.", synonyms: ["wise", "judicious", "cautious"], antonyms: ["reckless", "rash"], tip: "A prudent investor plans ahead." },
  { word: "Verbose", pos: "adjective", meaning: "Using or expressed in more words than needed.", sentence: "The report was so verbose that readers lost the point.", synonyms: ["wordy", "long-winded", "prolix"], antonyms: ["concise", "terse"], root: "Latin 'verbum' = word", tip: "Verbose = too many verbs/words." },
  { word: "Resilient", pos: "adjective", meaning: "Able to recover quickly from difficulties.", sentence: "Resilient students bounce back after a bad mock score.", synonyms: ["tough", "hardy", "buoyant"], antonyms: ["fragile", "brittle"], tip: "A rubber band is resilient—it snaps back." },
  { word: "Frugal", pos: "adjective", meaning: "Sparing or economical with money or food.", sentence: "Her frugal habits let her save half her salary.", synonyms: ["thrifty", "economical", "sparing"], antonyms: ["extravagant", "wasteful"], tip: "Frugal folks pinch pennies wisely." },
  { word: "Astute", pos: "adjective", meaning: "Having sharp judgement; shrewd.", sentence: "An astute negotiator reads the room before speaking.", synonyms: ["shrewd", "perceptive", "sharp"], antonyms: ["obtuse", "naive"], tip: "Astute = a-'tuned' mind." },
  { word: "Diligent", pos: "adjective", meaning: "Showing careful and persistent effort.", sentence: "Diligent revision beats last-minute cramming.", synonyms: ["hardworking", "assiduous", "industrious"], antonyms: ["lazy", "negligent"], tip: "Diligence is daily-gence—everyday effort." },
  { word: "Innovative", pos: "adjective", meaning: "Featuring new methods; original and creative.", sentence: "The startup's innovative app changed how people study.", synonyms: ["inventive", "novel", "groundbreaking"], antonyms: ["conventional", "outdated"], tip: "Innovate = 'in-new'—bringing in the new." },
  { word: "Lucid", pos: "adjective", meaning: "Expressed clearly; easy to understand.", sentence: "The teacher gave a lucid explanation of probability.", synonyms: ["clear", "coherent", "intelligible"], antonyms: ["confusing", "murky"], root: "Latin 'lucidus' = bright", tip: "Lucid = lit up, crystal clear." },
  { word: "Tenacious", pos: "adjective", meaning: "Holding firmly; persistent and determined.", sentence: "Her tenacious effort finally cracked the tough topic.", synonyms: ["persistent", "dogged", "determined"], antonyms: ["yielding", "irresolute"], tip: "Tenacious = tightly holds on (tenere)." },
  { word: "Cogent", pos: "adjective", meaning: "Clear, logical, and convincing.", sentence: "She made a cogent argument for extra practice tests.", synonyms: ["convincing", "compelling", "persuasive"], antonyms: ["weak", "unconvincing"], tip: "A cogent case 'cogs' logically together." },
  { word: "Nuance", pos: "noun", meaning: "A subtle difference in meaning or expression.", sentence: "Good readers catch the nuance between 'imply' and 'infer'.", synonyms: ["subtlety", "shade", "distinction"], antonyms: ["obviousness"], tip: "Nuance = a new-ance, a fine shade." },
  { word: "Paradox", pos: "noun", meaning: "A statement that seems contradictory yet may be true.", sentence: "'Less is more' is a classic paradox.", synonyms: ["contradiction", "puzzle", "anomaly"], antonyms: ["consistency"], tip: "Para = beside; a truth beside expectation." },
  { word: "Scrutinize", pos: "verb", meaning: "To examine closely and critically.", sentence: "Always scrutinize the answer options before choosing.", synonyms: ["inspect", "examine", "probe"], antonyms: ["glance", "skim"], tip: "Scrutinize with a mental magnifying glass." },
  { word: "Mitigate", pos: "verb", meaning: "To make less severe or painful.", sentence: "Deep breathing can mitigate exam anxiety.", synonyms: ["alleviate", "lessen", "ease"], antonyms: ["aggravate", "intensify"], tip: "Mitigate = make it 'mighty' less." },
  { word: "Alleviate", pos: "verb", meaning: "To make suffering or a problem less severe.", sentence: "A good plan alleviates the pressure of the syllabus.", synonyms: ["relieve", "ease", "soothe"], antonyms: ["worsen", "aggravate"], tip: "Alleviate lifts the weight ('leviare' = lighten)." },
  { word: "Redundant", pos: "adjective", meaning: "Not needed; superfluous.", sentence: "Cut redundant words to make sentences crisp.", synonyms: ["superfluous", "excess", "unnecessary"], antonyms: ["essential", "necessary"], tip: "Redundant = a repeat that adds nothing." },
  { word: "Concur", pos: "verb", meaning: "To agree.", sentence: "The panel concurred with the proposed timetable.", synonyms: ["agree", "assent", "accord"], antonyms: ["disagree", "dissent"], tip: "Con + cur = run together in agreement." },
  { word: "Impede", pos: "verb", meaning: "To delay or block progress.", sentence: "Poor time management can impede your mock scores.", synonyms: ["hinder", "obstruct", "hamper"], antonyms: ["facilitate", "aid"], tip: "Impede traps the 'feet' (pes = foot)." },
  { word: "Substantiate", pos: "verb", meaning: "To provide evidence to support a claim.", sentence: "Substantiate your RC answer with a line from the passage.", synonyms: ["prove", "verify", "corroborate"], antonyms: ["disprove", "refute"], tip: "Give it substance—back it up." },
  { word: "Placate", pos: "verb", meaning: "To make someone less angry; to appease.", sentence: "The manager placated the upset customer with a refund.", synonyms: ["appease", "pacify", "mollify"], antonyms: ["provoke", "anger"], tip: "Placate = bring peace (placare)." },
  { word: "Austere", pos: "adjective", meaning: "Severe or strict in manner; plain and simple.", sentence: "The monk led an austere life with few possessions.", synonyms: ["severe", "spartan", "stern"], antonyms: ["lavish", "indulgent"], tip: "Austere rooms are bare, no frills." },
  { word: "Gregarious", pos: "adjective", meaning: "Fond of company; sociable.", sentence: "Her gregarious nature made group study lively.", synonyms: ["sociable", "outgoing", "convivial"], antonyms: ["reclusive", "introverted"], tip: "Gregarious = loves the 'group' (grex)." },
  { word: "Obsolete", pos: "adjective", meaning: "No longer produced or used; out of date.", sentence: "Rote learning is becoming obsolete in adaptive apps.", synonyms: ["outdated", "antiquated", "defunct"], antonyms: ["current", "modern"], tip: "Obsolete = 'oh-so-old'." },
  { word: "Empirical", pos: "adjective", meaning: "Based on observation or experiment, not theory.", sentence: "Empirical data from mocks guides your study plan.", synonyms: ["observed", "experiential", "factual"], antonyms: ["theoretical", "conjectural"], tip: "Empirical = evidence you can see/measure." },
];

export type Idiom = {
  phrase: string;
  meaning: string;
  sentence: string;
  options?: string[];
};

export const IDIOMS: Idiom[] = [
  { phrase: "A blessing in disguise", meaning: "A good thing that seemed bad at first.", sentence: "Missing that bus was a blessing in disguise—I met my mentor at the stop." },
  { phrase: "Bite the bullet", meaning: "To endure a painful situation bravely.", sentence: "I bit the bullet and finally started the geometry chapter I feared." },
  { phrase: "Burn the midnight oil", meaning: "To work late into the night.", sentence: "She burned the midnight oil before the IPMAT mock." },
  { phrase: "Cut corners", meaning: "To do something badly to save time or money.", sentence: "Don't cut corners on revision or accuracy drops." },
  { phrase: "The ball is in your court", meaning: "It is your turn to make a decision or act.", sentence: "I've shared the plan; now the ball is in your court." },
  { phrase: "Hit the nail on the head", meaning: "To describe exactly what is causing a situation.", sentence: "Your feedback hit the nail on the head about my timing issue." },
  { phrase: "Once in a blue moon", meaning: "Very rarely.", sentence: "He solves DI wrong only once in a blue moon now." },
  { phrase: "Let the cat out of the bag", meaning: "To reveal a secret carelessly.", sentence: "She let the cat out of the bag about the surprise test." },
  { phrase: "On the same page", meaning: "In agreement; sharing understanding.", sentence: "Before the group mock, make sure everyone is on the same page." },
  { phrase: "A piece of cake", meaning: "Something very easy.", sentence: "After enough practice, percentages became a piece of cake." },
  { phrase: "Beat around the bush", meaning: "To avoid the main topic.", sentence: "Stop beating around the bush and state your answer." },
  { phrase: "Break the ice", meaning: "To ease tension in a first meeting.", sentence: "A quick poll broke the ice at the start of class." },
];
