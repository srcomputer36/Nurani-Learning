/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Quiz, QuizResult } from '../models/quiz.model';

interface QuizState {
  quizzes: Quiz[];
  results: QuizResult[];
  addQuiz: (quiz: Quiz) => void;
  addResult: (result: QuizResult) => void;
  getBestScore: (quizId: string) => number;
}

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'কালিমা ও ঈমান',
    description: 'কালেমা এবং ঈমান বিষয়ক সাধারণ জ্ঞান।',
    category: 'দ্বীনিয়াহ',
    durationMinutes: 5,
    questions: [
      {
        id: '1',
        text: 'কালেমা তৈয়্যবা কোনটি?',
        options: [
          'লা ইলাহা ইল্লাল্লাহু মুহাম্মাদুর রাসুলুল্লাহ',
          'সুবহানাল্লাহ',
          'আলহামদুলিল্লাহ',
          'আল্লাহু আকবার'
        ],
        correctAnswer: 0
      },
      {
        id: '2',
        text: 'ইসলামের স্তম্ভ কয়টি?',
        options: ['৩টি', '৪টি', '৫টি', '৬টি'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'q2',
    title: 'পবিত্রতা ও ওযু',
    description: 'ওযুর ফরজ এবং পবিত্রতা নিয়ে কিছু প্রশ্ন।',
    category: 'ফিকহ',
    durationMinutes: 5,
    questions: [
      {
        id: '3',
        text: 'ওযুর ফরজ কয়টি?',
        options: ['২টি', '৩টি', '৪টি', '৫টি'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'q3',
    title: 'নুরানী কায়দা - হরফ',
    description: 'আরবি হরফ এবং উচ্চারণ সম্পর্কিত কুইজ।',
    category: 'কায়দা',
    durationMinutes: 10,
    questions: [
      {
        id: 'q3-1',
        text: 'আরবি হরফ কয়টি?',
        options: ['২৮টি', '২৯টি', '৩০টি', '৩১টি'],
        correctAnswer: 1
      },
      {
        id: 'q3-2',
        text: 'নুখতাহীন হরফ কয়টি?',
        options: ['১২টি', '১৩টি', '১৪টি', '১৫টি'],
        correctAnswer: 1
      }
    ]
  }
];

export const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: JSON.parse(localStorage.getItem('quizzes') || JSON.stringify(DEFAULT_QUIZZES)),
  results: JSON.parse(localStorage.getItem('quiz_results') || '[]'),
  
  addQuiz: (quiz) => {
    const newQuizzes = [...get().quizzes, quiz];
    set({ quizzes: newQuizzes });
    localStorage.setItem('quizzes', JSON.stringify(newQuizzes));
  },
  
  addResult: (result) => {
    const newResults = [...get().results, result];
    set({ results: newResults });
    localStorage.setItem('quiz_results', JSON.stringify(newResults));
  },
  
  getBestScore: (quizId) => {
    const quizResults = get().results.filter(r => r.quizId === quizId);
    if (quizResults.length === 0) return 0;
    return Math.max(...quizResults.map(r => r.score));
  }
}));
