'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaStop, FaMicrophone, FaPlay } from 'react-icons/fa';
import WritingProgess from '../components/WritingProgess';
import UserInfoModal from '../components/UserInfoModal';
import SpeakingResult from '../components/SpeakingResult';

// Fix: Correct SpeechRecognitionEvent typing to match browser API
interface SpeechRecognitionResult {
  0: {
    transcript: string;
  };
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResult[];
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface Question {
  title: string;
  id: string;
  subtopics: string[];
}

interface AssessmentCriteria {
  score: number;
}

interface AssessmentData {
  detailedFeedback: {
    fluencyAndCoherence: AssessmentCriteria;
    pronunciation: AssessmentCriteria;
    lexicalResource: AssessmentCriteria;
    grammaticalRangeAndAccuracy: AssessmentCriteria;
  };
  score: {
    overallBandScore: number;
    fluencyAndCoherence: number;
    pronunciation: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
  };
  feedback: string;
  AiSuggestions: string;
  AiMotivation: string;
  AiGenerateSpeaking: string;
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

const IELTSSpeaking = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssessmentData | null>(null);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");

  // --- Manual stop, real-time transcript, continuous listening until stopped by user ---
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    transcriptRef.current = "";
    setTranscript("");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let combined = "";
      const results = Array.from(event.results);
      for (let i = 0; i < results.length; ++i) {
        const result = results[i];
        const transcriptPiece = result[0]?.transcript || "";
        combined += transcriptPiece;
      }
      transcriptRef.current = combined.trim();
      setTranscript(combined.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event, event?.error);
      if (event?.error === "no-speech") {
        setError("No speech was detected. Please make sure your microphone is working and try again.");
      } else {
        setError(`Speech recognition error: ${event?.error || "Unknown error"}`);
      }
      setIsRecording(false);
    };

    // Do NOT set isRecording to false onend, so it only stops when user clicks stop
    recognition.onend = () => {
      // If user stopped, isRecording will be set to false in stopRecognition
      // If onend fires unexpectedly (e.g. silence), try to restart if still isRecording
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          // Sometimes throws if already started, ignore
        }
      }
    };

    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      setIsRecording(false);
      setTranscript(transcriptRef.current.trim());
    }
  };

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
  console.log('process.env.BACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!userInfo) return; // Don't fetch if no user info
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speaking/question`, {
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
        console.log('speaking question', data);
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
      const submissionData = localStorage.getItem('speakingSubmissions');
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
    const submissionData = localStorage.getItem('speakingSubmissions');
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
      const formatedQuestion = question?.title + " " + (question?.subtopics?.join(" ") || "");
      console.log('formatedQuestion', formatedQuestion);
      const submitData = {
        message: transcript,
        questionId: question?.id,
        questionTitle: formatedQuestion,
        mysqlUserId: Number(userInfo.phone), // Using phone as mysqlUserId
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        taskType: "Task 2"
      };

      const responseData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speaking`, {
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
            fluencyAndCoherence: submission.fluencyAndCoherence,
            pronunciation: submission.pronunciation,
            lexicalResource: submission.lexicalResource,
            grammaticalRangeAndAccuracy: submission.grammaticalRangeAndAccuracy
          },
          score: submission.score,
          feedback: submission.feedback,
          AiSuggestions: submission.AiSuggestions,
          AiMotivation: submission.AiMotivation,
          AiGenerateSpeaking: submission.AiGenerateSpeaking,
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
      localStorage.setItem('speakingSubmissions', JSON.stringify({
        date: today,
        count: currentCount + 1
      }));

    } catch (error: any) {
      if (typeof error?.message === 'string' && error.message.includes('429')) {
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
      const submissionData = localStorage.getItem('speakingSubmissions');
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
    <div className="px-4 py-4 bg-blue-50">
      <UserInfoModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={handleUserInfoSave}
      />
      <div className="">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">

          <div className='my-1'>
            <h1 className="text-2xl font-bold text-gray-600 text-center">Mentors&apos; Speaking Practice</h1>
            <div className='text-gray-400 text-center'>Submissions left today: {getRemainingSubmissions()}</div>
          </div>
          <WritingProgess ieltsModule='speaking' />


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
                <span>Always speak loudly and clearly. Use noise free environment.</span>
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
                    Speak about the following topic: <span className='font-bold'>{question?.title || 'Loading question...'}</span>
                  </p>
                  <ul className='text-gray-600 dark:text-gray-300 list-decimal flex flex-wrap'>
                    {question?.subtopics?.map((subtopic, index) => (
                      <li className='mr-10' key={index}>{subtopic}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
                  <div className="max-w-full mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                      <div className="flex justify-center gap-4 mb-8">
                        <button
                          onClick={isRecording ? stopRecognition : startRecognition}
                          className={`
                relative group
                ${isRecording
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                            }
                text-white px-6 py-3 rounded-full
                transform transition-all duration-300
                hover:scale-105 hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
                        >
                          <div className="flex items-center gap-2">
                            {isRecording ? <FaStop /> : <FaMicrophone />}
                            <span>{isRecording ? 'Stop' : 'Start Speaking'}</span>
                          </div>
                          {isRecording && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                          )}
                        </button>

                        <button
                          onClick={handleSubmit}
                          disabled={!transcript || isProcessing}
                          className={`
                bg-indigo-500 hover:bg-indigo-600
                text-white px-6 py-3 rounded-full
                transform transition-all duration-300
                hover:scale-105 hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
              `}
                        >

                          {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
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
                              <FaPlay />
                              </>
                            )}
                            </>
                          )}
                          <span>Evaluate</span>
                        </button>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Transcript:</h2>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {transcript || "Start speaking to see your transcript here..."}
                        </p>
                      </div>
                    </div>
                  </div>
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
              <SpeakingResult data={response} />
            </div>
          )}

          {isSubmitted && (
            <div className="mt-6">
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2' onClick={() => window.location.reload()}>
                <FaArrowLeft />
                Back to Speaking Practice
              </button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default IELTSSpeaking;
