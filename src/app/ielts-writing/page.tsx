'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaRegClock, FaChartBar, FaLink, FaBook, FaSpellCheck, FaArrowLeft } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';

interface AssessmentCriteria {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  examples?: string[];
}

interface AssessmentData {
  taskAchievement: AssessmentCriteria;
  coherenceAndCohesion: AssessmentCriteria;
  lexicalResource: AssessmentCriteria;
  grammaticalRangeAndAccuracy: AssessmentCriteria;
  overallBandScore: number;
  generalFeedback: string;
}

const IELTSWriting = () => {
  const [answer, setAnswer] = useState('');
  // const [timeLeft, setTimeLeft] = useState(60); // 60 minutes for task 1
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssessmentData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('https://chatbotbackend.mentorslearning.com/api/writing/question');
        const data = await response.json();
        //console.log(data);
        // Ensure we're getting a string value for the question
        if (data.question) {
          setQuestion(data.question?.question);
        } else {
          console.error('Invalid question format:', data);
          setQuestion('Error loading question. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        setQuestion('Error loading question. Please try again.');
      }
    };

    // Check localStorage for today's submission count
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
      const responseData = await fetch('https://chatbotbackend.mentorslearning.com/api/writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: answer, question: question })
      });

      if (!responseData.ok) {
        throw new Error('Network response was not ok');
      }
      //console.log('responseData', responseData);
      const data = await responseData.json();
      //console.log('api response', data);
      const cleanedJsonString = data?.response?.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^"|"$/g, '');
      const jsonData = JSON.parse(cleanedJsonString);
      //console.log('jsonData', jsonData);
      setResponse(jsonData as AssessmentData);

      // Update localStorage with new submission count
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

  //console.log('state response', response);
  // Get remaining submissions for display
  const getRemainingSubmissions = () => {
    if (typeof window === 'undefined') return 2; // Default value for server-side rendering

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
          <div className="flex justify-between items-center mb-4">

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">IELTS Writing Task 1</h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaRegClock className="text-xl" />
              <span className="font-semibold">60 minutes </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Question:</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {question || 'Loading question...'}
            </p>
          </div>

          <div className="mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              placeholder="Write your answer here..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {response && (
            <div className="mt-6">
              <AssessmentResult data={response} />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div>Word count: {answer.split(/\s+/).filter(word => word.length > 0).length}</div>
              <div>Submissions left today: {getRemainingSubmissions()}</div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={getRemainingSubmissions() <= 0 || isLoading}
              className={`
                flex items-center gap-2
                ${getRemainingSubmissions() <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }
                text-white font-semibold py-3 px-6 rounded-xl
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssessmentResult: React.FC<{ data: AssessmentData }> = ({ data }) => {
  console.log('criteria', data);
  const getScoreColor = (score: number | undefined): string => {
    if (!score) return 'text-gray-600';
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number | undefined): string => {
    if (!score) return 'bg-gray-100';
    if (score >= 7) return 'bg-green-100';
    if (score >= 5) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const renderCriteria = (criteria: AssessmentCriteria, title: string, icon: React.ReactNode) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${getScoreBgColor(criteria?.score)}`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <span className={`ml-auto font-bold ${getScoreColor(criteria?.score)}`}>
          {criteria?.score ?? 'N/A'}
        </span>
      </div>
      <div className="space-y-3">
        {criteria?.strengths?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-1">Strengths</h4>
            <ul className="space-y-1">
              {criteria.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <IoMdCheckmarkCircle className="text-green-500 mt-1 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}
        {criteria?.examples && criteria.examples.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-1">Examples</h4>
            <ul className="space-y-1">
              {criteria.examples.map((example, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}
        {criteria?.improvements?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-1">Areas for Improvement</h4>
            <ul className="space-y-1">
              {criteria.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <IoMdCloseCircle className="text-red-500 mt-1 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
        {criteria?.feedback && (
          <p className="text-sm text-gray-600 dark:text-gray-300">{criteria.feedback}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overall Band Score</h2>
          <div className={`text-4xl font-bold ${getScoreColor(data?.overallBandScore)}`}>
            {data?.overallBandScore ?? 'N/A'}
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{data?.generalFeedback || 'No feedback available'}</p>
      </div>

      {/* Assessment Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCriteria(data?.taskAchievement || {}, 'Task Achievement',
          <FaChartBar className={`text-xl ${getScoreColor(data?.taskAchievement?.score)}`} />
        )}
        {renderCriteria(data?.coherenceAndCohesion || {}, 'Coherence & Cohesion',
          <FaLink className={`text-xl ${getScoreColor(data?.coherenceAndCohesion?.score)}`} />
        )}
        {renderCriteria(data?.lexicalResource || {}, 'Lexical Resource',
          <FaBook className={`text-xl ${getScoreColor(data?.lexicalResource?.score)}`} />
        )}
        {renderCriteria(data?.grammaticalRangeAndAccuracy || {}, 'Grammar',
          <FaSpellCheck className={`text-xl ${getScoreColor(data?.grammaticalRangeAndAccuracy?.score)}`} />
        )}
      </div>
    </div>
  );
};

export default IELTSWriting;
