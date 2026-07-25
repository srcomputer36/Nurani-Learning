/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Brain, ChevronRight, Timer, Trophy, CheckCircle2, XCircle, RefreshCw, Plus, X, Save } from 'lucide-react';
import { useQuizStore } from '../providers/quiz.store';
import { useSettingsStore } from '../providers/settings.store';
import { Quiz, Question } from '../models/quiz.model';
import { toast } from 'react-hot-toast';

export const ExamScreen = () => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  
  // State for new quiz form
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'ব্যবহারকারী',
    questions: [] as Question[]
  });

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  
  const { addResult, results, quizzes, addQuiz } = useQuizStore();
  const { darkMode } = useSettingsStore();

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsFinished(false);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < activeQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const score = newAnswers.reduce((acc, ans, idx) => {
        return ans === activeQuiz!.questions[idx].correctAnswer ? acc + 1 : acc;
      }, 0);
      
      addResult({
        quizId: activeQuiz!.id,
        score,
        totalQuestions: activeQuiz!.questions.length,
        completedAt: Date.now()
      });
      setIsFinished(true);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(o => !o)) {
      toast.error('সবগুলো ঘর পূরণ করুন');
      return;
    }
    
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { ...newQuestion, id: Math.random().toString() }]
    });
    
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    
    toast.success('প্রশ্ন যোগ হয়েছে');
  };

  const handleSaveQuiz = () => {
    if (!newQuiz.title || newQuiz.questions.length === 0) {
      toast.error('টাইটেল এবং অন্তত একটি প্রশ্ন যোগ করুন');
      return;
    }
    
    addQuiz({
      ...newQuiz,
      id: 'user-' + Date.now(),
      durationMinutes: 10
    });
    
    setShowAddQuiz(false);
    setNewQuiz({ title: '', description: '', category: 'ব্যবহারকারী', questions: [] });
    toast.success('কুইজ সংরক্ষিত হয়েছে');
  };

  if (showAddQuiz) {
    return (
      <div className={`min-h-screen pt-12 pb-32 px-6 transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-800'} font-bangla`}>নতুন কুইজ যোগ করুন</h2>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddQuiz(false)}
            className={`p-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'} rounded-xl`}
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`text-xs font-black ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-widest font-bangla`}>কুইজ টাইটেল</label>
            <input 
              type="text" 
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              className={`w-full p-4 ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100'} border rounded-2xl shadow-sm font-bangla`}
              placeholder="যেমন: সূরা ফাতিহা কুইজ"
            />
          </div>

          <div className={`${darkMode ? 'bg-gray-900 border-gray-800 shadow-gray-950/50' : 'bg-white border-gray-50 shadow-gray-100'} p-6 rounded-[2.5rem] shadow-xl border`}>
            <h3 className={`text-lg font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-6 font-bangla`}>প্রশ্ন যোগ করুন ({newQuiz.questions.length})</h3>
            
            <div className="space-y-4">
              <input 
                type="text" 
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className={`w-full p-4 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'} border rounded-2xl font-bangla`}
                placeholder="প্রশ্ন লিখুন"
              />
              
              <div className="grid grid-cols-1 gap-3">
                {newQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      className={`flex-1 p-3 text-sm border rounded-xl font-bangla ${darkMode ? 'bg-gray-800 text-white placeholder:text-gray-600' : 'bg-gray-50'} ${newQuestion.correctAnswer === idx ? 'border-primary ring-1 ring-primary' : (darkMode ? 'border-gray-700' : 'border-gray-100')}`}
                      placeholder={`অপশন ${idx + 1}`}
                    />
                    <button 
                      onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })}
                      className={`px-4 rounded-xl font-black text-[10px] ${newQuestion.correctAnswer === idx ? 'bg-primary text-white' : (darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400')}`}
                    >
                      সঠিক
                    </button>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddQuestion}
                className="w-full py-4 bg-secondary/10 text-secondary border-2 border-dashed border-secondary/30 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 font-bangla"
              >
                <Plus size={16} /> প্রশ্ন যোগ করুন
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveQuiz}
            className="w-full py-5 bg-primary text-white rounded-[2rem] font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 font-bangla"
          >
            <Save size={20} /> কুইজ সংরক্ষণ করুন
          </motion.button>
        </div>
      </div>
    );
  }

  if (activeQuiz && !isFinished) {
    const question = activeQuiz.questions[currentQuestionIndex];
    return (
      <div className={`min-h-screen pt-12 pb-32 px-6 transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'}`}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-800'} font-bangla`}>{activeQuiz.title}</h2>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-black uppercase tracking-widest font-bangla`}>
                প্রশ্ন {currentQuestionIndex + 1} / {activeQuiz.questions.length}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl shadow-sm border flex items-center gap-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <Timer size={16} className="text-secondary" />
            <span className={`text-sm font-black ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-bangla`}>০৫:০০</span>
          </div>
        </div>

        <div className={`h-2 rounded-full overflow-hidden mb-12 shadow-inner p-0.5 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <h3 className={`text-2xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-8 font-bangla leading-relaxed`}>
            {question.text}
          </h3>
          
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, backgroundColor: darkMode ? '#1e293b' : '#f0fdf4' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-6 border-2 rounded-3xl shadow-lg flex items-center justify-between group transition-colors ${darkMode ? 'bg-gray-900 border-gray-800 shadow-gray-950/50' : 'bg-white border-gray-50 shadow-gray-100/50'}`}
              >
                <span className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-bangla`}>{option}</span>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${darkMode ? 'border-gray-800 group-hover:border-primary' : 'border-gray-100 group-hover:border-primary'}`}>
                  <div className="w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (isFinished && activeQuiz) {
    const score = answers.reduce((acc, ans, idx) => {
      return ans === activeQuiz.questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);

    return (
      <div className={`min-h-screen pt-12 pb-32 px-6 flex flex-col items-center justify-center transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'}`}>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-40 h-40 rounded-[3rem] shadow-2xl flex items-center justify-center mb-8 relative transition-colors ${darkMode ? 'bg-gray-900 shadow-gray-950/50' : 'bg-white'}`}
        >
          <Trophy size={80} className="text-secondary" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg"
          >
            {percentage}%
          </motion.div>
        </motion.div>

        <h2 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-800'} mb-2 font-bangla`}>চমৎকার!</h2>
        <p className="text-gray-400 font-bold text-lg mb-12 font-bangla">আপনি পরিক্ষা শেষ করেছেন</p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className={`p-6 rounded-3xl shadow-sm border text-center transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="text-primary mb-1"><CheckCircle2 size={24} className="mx-auto" /></div>
            <div className={`text-2xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-800'} font-bangla`}>{score}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bangla">সঠিক উত্তর</div>
          </div>
          <div className={`p-6 rounded-3xl shadow-sm border text-center transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="text-red-400 mb-1"><XCircle size={24} className="mx-auto" /></div>
            <div className={`text-2xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-800'} font-bangla`}>{activeQuiz.questions.length - score}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bangla">ভুল উত্তর</div>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveQuiz(null);
              setIsFinished(false);
            }}
            className="flex-1 bg-primary text-white py-5 rounded-[2rem] font-black shadow-xl shadow-primary/20 font-bangla"
          >
            ফিরে যান
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartQuiz(activeQuiz)}
            className={`w-20 py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center transition-colors ${darkMode ? 'bg-gray-900 text-gray-600 shadow-gray-950/50' : 'bg-white text-gray-400 shadow-gray-100'}`}
          >
            <RefreshCw size={24} />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-12 pb-32 transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-warm'}`}>
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
            <GraduationCap size={22} fill="currentColor" />
          </div>
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em] font-bangla">শিক্ষা ও পরিক্ষা</span>
        </div>
        <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} font-bangla`}>পরিক্ষা কেন্দ্র</h1>
        <p className="text-gray-500 font-bold mt-2 font-bangla">আপনার মেধাকে যাচাই করার সময় এখন</p>
      </div>

      <div className="px-6 mb-6 flex items-center justify-between">
        <h3 className={`text-xl font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-bangla flex items-center gap-2`}>
          <div className="w-2 h-6 bg-accent rounded-full" />
          উপলব্ধ কুইজসমূহ
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddQuiz(true)}
          className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      <div className="px-6 space-y-6">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-[2rem] shadow-xl border flex items-center gap-6 transition-colors ${darkMode ? 'bg-gray-900 border-gray-800 shadow-gray-950/50' : 'bg-white border-gray-50 shadow-gray-100'}`}
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-secondary shadow-inner transition-colors ${darkMode ? 'bg-gray-800' : 'bg-warm'}`}>
              <Brain size={40} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] font-bangla">{quiz.category}</span>
                <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] font-bangla ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{quiz.durationMinutes} মিনিট</span>
              </div>
              <h3 className={`text-xl font-black ${darkMode ? 'text-gray-100' : 'text-gray-800'} font-bangla`}>{quiz.title}</h3>
              <p className={`text-xs font-bold mt-1 line-clamp-1 font-bangla ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{quiz.description || 'আপনার মেধা যাচাই করুন'}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className={`w-6 h-6 rounded-full bg-primary/20 border-2 ${darkMode ? 'border-gray-900' : 'border-white'}`} />
                  <div className={`w-6 h-6 rounded-full bg-secondary/20 border-2 ${darkMode ? 'border-gray-900' : 'border-white'}`} />
                  <div className={`w-6 h-6 rounded-full bg-accent/20 border-2 ${darkMode ? 'border-gray-900' : 'border-white'}`} />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartQuiz(quiz)}
                  className="bg-primary/10 text-primary px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 font-bangla"
                >
                  পরিক্ষা দিন <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="px-6 mt-12 mb-10">
          <div className="mb-6">
            <h3 className={`text-xl font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-bangla flex items-center gap-2`}>
              <div className="w-2 h-6 bg-secondary rounded-full" />
              সাম্প্রতিক ফলাফল
            </h3>
          </div>
          
          <div className="space-y-4">
            {results.slice(-3).reverse().map((result, idx) => (
              <div key={idx} className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50 border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-secondary shadow-sm transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-bangla`}>
                      {quizzes.find(q => q.id === result.quizId)?.title || 'এআই কুইজ'}
                    </h4>
                    <p className={`text-[9px] font-bold font-bangla uppercase tracking-widest ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {new Date(result.completedAt).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-primary font-bangla">
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div className={`text-[8px] font-black uppercase tracking-widest font-bangla ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>স্কোর</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
