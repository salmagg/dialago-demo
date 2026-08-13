/**
 * Paste or edit lesson vocabulary here after each in-person class.
 * Each lesson groups words with plain-text definitions (read aloud via SpeechSynthesis).
 */
export type InPersonVocabItem = {
  word: string;
  definition: string;
};

export type InPersonLesson = {
  id: string;
  title: string;
  date?: string;
  vocabulary: InPersonVocabItem[];
};

export const IN_PERSON_LESSONS: InPersonLesson[] = [
  {
    id: 'lesson-2026-03-01',
    title: 'Week 1 — Greetings & introductions',
    date: '2026-03-01',
    vocabulary: [
      { word: 'pleased to meet you', definition: 'A polite phrase used when meeting someone for the first time.' },
      { word: 'how have you been?', definition: 'A friendly way to ask about someone’s life since you last saw them.' },
      { word: 'I’m from…', definition: 'Use this to tell people where you grew up or where your hometown is.' },
    ],
  },
  {
    id: 'lesson-2026-03-08',
    title: 'Week 2 — At the doctor’s office',
    date: '2026-03-08',
    vocabulary: [
      { word: 'appointment', definition: 'A scheduled time to see a doctor or other professional.' },
      { word: 'symptoms', definition: 'Physical feelings or signs that show you may be sick or hurt.' },
      { word: 'prescription', definition: 'Written instructions from a doctor for medicine you need to take.' },
      { word: 'follow-up', definition: 'A later visit or call to check whether treatment is working.' },
    ],
  },
];
