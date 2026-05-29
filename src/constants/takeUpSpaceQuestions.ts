import type { TakeUpSpaceMode } from "@/types/takeUpSpace";

type QuestionText = string | Record<TakeUpSpaceMode, string>;

export interface TakeUpSpaceQuestion {
  field: "situation" | "action" | "cost" | "need" | "choice_text" | "teaching";
  question: QuestionText;
  framing: QuestionText;
  framingLine2?: string;
  optional?: true;
}

export const TAKE_UP_SPACE_QUESTIONS: TakeUpSpaceQuestion[] = [
  {
    field: "situation",
    question: "What is happening right now?",
    framing:
      "Not an analysis. Just what is in front of you. The situation as it is, without explaining or justifying it yet.",
  },
  {
    field: "action",
    question: {
      in_the_moment: "What am I being pulled toward?",
      looking_back: "What did I do — or start to do?",
    },
    framing: {
      in_the_moment:
        "The impulse or the familiar pattern. You do not have to have chosen it yet.",
      looking_back: "Name it plainly. No harshness required.",
    },
  },
  {
    field: "cost",
    question: "What is this costing me — or what did it cost me?",
    framing:
      "Not whether you are being too much. What is the actual cost — even if you can only partly name it right now.",
  },
  {
    field: "need",
    question: "What do I actually need here?",
    framing:
      "Not what is practical. Not what is cool or low-maintenance. What do you actually need in this situation — the real answer, even if it feels like too much to say out loud.",
    framingLine2:
      "If a person you loved was in this situation, what would you want for them?",
  },
  {
    field: "choice_text",
    question: "What do I choose — or what did I choose?",
    framing:
      "There is no wrong answer here. The practice is noticing, not performing the right outcome.",
  },
  {
    field: "teaching",
    question: "What is one thing this moment is teaching me?",
    framing:
      "Optional. One word or several paragraphs. Whatever feels worth keeping.",
    optional: true,
  },
];
