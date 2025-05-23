'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import WritingProgess from '../components/WritingProgess';
import AssessmentResult from '../components/AssessmentResult';

interface Question {
  title: string;
  id: string;
}

interface AssessmentCriteria {
  score: number;
}

interface AssessmentData {
  detailedFeedback: {
    taskAchievement: AssessmentCriteria;
    coherenceAndCohesion: AssessmentCriteria;
    lexicalResource: AssessmentCriteria;
    grammaticalRangeAndAccuracy: AssessmentCriteria;
  };
  score: {
    overallBandScore: number;
    taskAchievement: number;
    coherenceAndCohesion: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
  };
  feedback: string;
  AiSuggestions: string;
  AiMotivation: string;
  AiGenerateWriting: string;
  TotalVocabularyError: string;
  TotalSentenceError: string;
  TotalGrammerError: string;
  ReWriteImprovementVersion: string;
  listofWords: {
    mistake: string[];
    correct: string[];
  };
  listofSentences: {
    mistake: string[];
    correct: string[];
  };
}

const IELTSWriting = () => {
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssessmentData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('https://chatbotbackend.mentorslearning.com/api/writing/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mysqlUserId: 1,
            name: "Hira",
            email: "hira@gmail.com",
            phone: "03001234567"
          })
        });
        const data = await response.json();
        //console.log('question', data);
        if (data.question) {
          setQuestion(data.question);
        } else {
          console.error('Invalid question format:', data);
          setQuestion(null);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        setQuestion(null);
      }
    };

    const checkDailySubmissions = () => {
      const today = new Date().toDateString();
      const submissionData = localStorage.getItem('writingSubmissions');
      if (submissionData) {
        const { date, count } = JSON.parse(submissionData);
        if (date === today && count >= 2) {
          setError('You have reached your daily submission limit. Please try again tomorrow.');
        }
      }
    };

    fetchQuestion();
    checkDailySubmissions();
  }, []);

  const handleSubmit = async () => {
    const today = new Date().toDateString();
    const submissionData = localStorage.getItem('writingSubmissions');
    let currentCount = 0;

    if (submissionData) {
      const { date, count } = JSON.parse(submissionData);
      if (date === today) {
        currentCount = count;
        if (currentCount >= 2) {
          setError('You have reached your daily submission limit. Please try again tomorrow.');
          return;
        }
      }
    }

    setIsLoading(true);
    setError('');

    try {
      //console.log('question', question);
      const submitData = {
        message: answer,
        questionId: question?.id,
        questionTitle: question?.title,
        mysqlUserId: 1,
        name: "Hira",
        email: "hira@gmail.com",
        phone: "03001234567",
        taskType: "Task 1"
      };

      const responseData = await fetch('https://chatbotbackend.mentorslearning.com/api/writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!responseData.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await responseData.json();
      //console.log('api response', data);
      const submission = data?.submission;
      if (submission) {
        setResponse({
          detailedFeedback: {
            taskAchievement: submission.taskAchievement,
            coherenceAndCohesion: submission.coherenceAndCohesion,
            lexicalResource: submission.lexicalResource,
            grammaticalRangeAndAccuracy: submission.grammaticalRangeAndAccuracy
          },
          score: submission.score,
          feedback: submission.feedback,
          AiSuggestions: submission.AiSuggestions,
          AiMotivation: submission.AiMotivation,
          AiGenerateWriting: submission.AiGenerateWriting,
          TotalVocabularyError: submission.TotalVocabularyError,
          TotalSentenceError: submission.TotalSentenceError,
          TotalGrammerError: submission.TotalGrammerError,
          ReWriteImprovementVersion: submission.ReWriteImprovementVersion,
          listofWords: submission.listofWords,
          listofSentences: submission.listofSentences
        });
      }

      localStorage.setItem('writingSubmissions', JSON.stringify({
        date: today,
        count: currentCount + 1
      }));

    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit your answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingSubmissions = () => {
    if (typeof window === 'undefined') return 2;

    const today = new Date().toDateString();
    try {
      const submissionData = localStorage.getItem('writingSubmissions');
      if (submissionData) {
        const { date, count } = JSON.parse(submissionData);
        if (date === today) {
          return Math.max(0, 2 - count);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    return 2;
  };

  return (
    <div className="px-4 py-8">
      <div className="">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <FaArrowLeft className="text-xl" />
            <span>Back</span>
          </Link>
          <div className='my-4'>
            <h1 className="text-2xl font-bold text-gray-600 text-center">Mentors&apos; Writing Practice</h1>
            <div className='text-gray-400 text-center'>Submissions left today: {getRemainingSubmissions()}</div>
          </div>
          <WritingProgess />

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Question:</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Write about the following topic: <span className='font-bold'>{question?.title || 'Loading question...'}</span>
            </p>
          </div>

          <div className="mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-64 p-4 border-2 border-blue-900 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Write your answer here..."
              disabled={isLoading}
              spellCheck="false"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              data-gramm="false"
              data-gramm-editor="false"
              data-enable-grammarly="false"
              onPaste={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div>Word count: {answer.split(/\s+/).filter(word => word.length > 0).length}</div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={getRemainingSubmissions() <= 0 || isLoading || answer.trim().length === 0}
              className={`
                flex items-center gap-2
                ${getRemainingSubmissions() <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-700 hover:to-indigo-700'
                }
                text-white font-semibold py-2 px-10 rounded-xl
                shadow-lg hover:shadow-xl
                transform hover:scale-[1.02]
                transition-all duration-200 ease-in-out
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <FaPaperPlane className='text-xl' />
                </>
              )}
            </button>
          </div>

          {response && (
            <div className="mt-6">
              <AssessmentResult data={response} />
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default IELTSWriting;
