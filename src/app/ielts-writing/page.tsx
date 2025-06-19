'use client';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import WritingProgess from '../components/WritingProgess';
import AssessmentResult from '../components/AssessmentResult';
import UserInfoModal from '../components/UserInfoModal';


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
  ReWriteCorrectWords: string;
  ReWriteCorrectSentences: string;
  topic: string;
  content: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

const IELTSWriting = () => {
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssessmentData | null>(null);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      setShowUserModal(true);
    }
  }, []);

  const handleUserInfoSave = (info: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(info));
    setUserInfo(info);
    setShowUserModal(false);
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!userInfo) return; // Don't fetch if no user info

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing/question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mysqlUserId: Number(userInfo.phone), // Using phone as mysqlUserId
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone
          })
        });
        const data = await response.json();
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

    if (userInfo) {
      fetchQuestion();
      checkDailySubmissions();
    }
  }, [userInfo]);

  const handleSubmit = async () => {
    if (!userInfo) {
      setShowUserModal(true);
      return;
    }

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
      const submitData = {
        message: answer,
        questionId: question?.id,
        questionTitle: question?.title,
        mysqlUserId: Number(userInfo.phone), // Using phone as mysqlUserId
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        taskType: "Task 1"
      };

      const responseData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!responseData.ok) {
        if (responseData.status === 429) {
          throw new Error("You have reached your daily submission limit. Please try again tomorrow. 429");
        } else {
          throw new Error("Failed to submit your answer. Please try again. 400");
        }
      }

      const data = await responseData.json();
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
          ReWriteCorrectWords: submission.ReWriteCorrectWords,
          ReWriteCorrectSentences: submission.ReWriteCorrectSentences,
          topic: submission.topic,
          content: submission.content
        });
      }

      setIsSubmitted(true);
      localStorage.setItem('writingSubmissions', JSON.stringify({
        date: today,
        count: currentCount + 1
      }));


    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        setError('You have reached your daily submission limit. Please try again tomorrow.');
      } else {
        console.error('Error submitting answer:', error);
        setError('Failed to submit your answer. Please try again.');
      }
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
    <div className="px-4 py-4 bg-amber-50">
      <UserInfoModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={handleUserInfoSave}
      />
      <div className="">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">

          <div className='my-1'>
            <h1 className="text-2xl font-bold text-gray-600 text-center">Mentors&apos; Writing Practice</h1>
            <div className='text-gray-400 text-center'>Submissions left today: {getRemainingSubmissions()}</div>
          </div>
          <WritingProgess ieltsModule='writing' />


          <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6'>
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Note *:</h2>
            <ul className='list-disc text-gray-600 dark:text-gray-300 text-xs'>
              <li>
                <span>আপনি প্রতিদিন মাত্র ২টি সাবমিশন করতে পারবেন। তাই ভালোভাবে প্রস্তুতি নিয়ে সময় নিয়ে সাবমিট করুন।</span>
              </li>
              <li>
                <span>চ্যাটজিপিটি, ক্লড ইত্যাদি কোন AI টুল ব্যবহার করে উত্তর লিখবেন না।</span>
              </li>
              <li>
                <span>আপনার উত্তর কমপক্ষে ১০০টি শব্দ হতে হবে। ১০০ শব্দের কম লিখলে আপনি সাবমিট বাটনে ক্লিক করতে পারবেন না।</span>
              </li>
              <li>
                <span>সাবমিট করার পর দয়া করে আপনার উত্তর ভালোভাবে পর্যালোচনা করুন। আপনি কোথায় ভুল করেছেন তা বোঝার চেষ্টা করুন।</span>
              </li>
              <li>
                <span>সাবমিট করার পর অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করবেন না। প্রথমে ফলাফল ভালোভাবে দেখুন, তারপর পৃষ্ঠা থেকে বের হোন।</span>
              </li>
            </ul>
          </div>
          {
            !isSubmitted && (
              <>
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
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <div>Word count: {answer.split(/\s+/).filter(word => word.length > 0).length}</div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={getRemainingSubmissions() <= 0 || isLoading || answer.trim().length === 0 || answer.trim().split(/\s+/).length < 100}
                    className={`
                flex items-center gap-2
                ${getRemainingSubmissions() <= 0 || answer.trim().split(/\s+/).length < 100
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
              </>
            )
          }

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

          {isSubmitted && (
            <div className="mt-6">
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2' onClick={() => window.location.reload()}>
                  <FaArrowLeft />
                  Back to Writing Practice
              </button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default IELTSWriting;
