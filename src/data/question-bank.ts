// Canonical Fundamental. question bank, imported verbatim from
// Fundamental_Question_Bank_SKD_TIU_Kecukupan_Data_60_with_Difficulty.xlsx (Questions sheet).
// Do not edit records by hand; re-import from the source spreadsheet instead.
import raw from "./question-bank.json";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";
export type AnswerKey = "A" | "B" | "C" | "D" | "E";

export type BankQuestion = {
  id: string;
  question_id: string;
  exam: string;
  subtest: string;
  material: string;
  topic: string;
  question_type: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: AnswerKey;
  explanation: string;
  difficulty_initial: QuestionDifficulty;
  difficulty_current: QuestionDifficulty;
  difficulty_source: string;
  difficulty_note: string | null;
  estimated_time: number | null;
  source: string;
  source_question_number: number;
  review_status: string;
  source_note: string | null;
};

export const questionBank = raw as BankQuestion[];

export const findBankQuestion = (id: string) => questionBank.find((q) => q.id === id || q.question_id === id);

export const bankQuestionsFor = (f: { exam?: string; subtest?: string; material?: string; topic?: string }) =>
  questionBank.filter(
    (q) => (!f.exam || q.exam === f.exam) && (!f.subtest || q.subtest === f.subtest) && (!f.material || q.material === f.material) && (!f.topic || q.topic === f.topic),
  );
