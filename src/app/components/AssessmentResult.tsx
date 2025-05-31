import React from 'react';
import { FaChartBar, FaLink, FaBook, FaSpellCheck, FaTrophy, FaLightbulb, FaArrowUp, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
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

const AssessmentResult: React.FC<{ data: AssessmentData }> = ({ data }) => {
  console.log('data s', data);
  const getScoreColor = (score: number | undefined): string => {
    if (!score) return 'text-gray-600';
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };



  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Question</h3>
            <p className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              {data?.topic}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Your Answer</h3>
            <p className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">
              {data?.content}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-blue-100 dark:border-blue-900 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-bl-full" />

        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaTrophy className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overall Predicted Score</h2>
            </div>

            <div className={`text-5xl font-bold ${getScoreColor(data?.score?.overallBandScore)} bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl`}>
              {data?.score?.overallBandScore ?? 'N/A'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaChartBar className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Vocabulary Error</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.TotalVocabularyError}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaLink className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sentence Error</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.TotalSentenceError}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaBook className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Grammer Error</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.TotalGrammerError}</div>
            </div>

            <div className={`bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg ${data?.AiGenerateWriting > '10%' ? 'bg-red-500' : 'bg-green-500'}`}>
              <div className="flex items-center gap-2 mb-1">
                <FaSpellCheck className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Using AI</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.AiGenerateWriting > '10%' ? 'Yes' : 'No'}</div>
            </div>
          </div>
          {
            data?.feedback && (
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap my-2">{data?.feedback}</div>
            )
          }

          {data?.ReWriteCorrectWords && data?.ReWriteCorrectSentences && (
            <div className="px-4 py-8 space-y-8">
              <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-800/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                <div className="relative">

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-lg">
                        <FaExclamationTriangle className="text-xl text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-xl font-bold text-gray-800 dark:text-white">Word Mistakes</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 leading-8 p-3 rounded-lg border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">
                      {data?.ReWriteCorrectWords}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-800/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg">
                      <FaExclamationCircle className="text-xl text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">Sentence Mistakes</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 leading-8 p-3 rounded-lg border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">
                    {data?.ReWriteCorrectSentences}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 my-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-800/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                  <FaArrowUp className="text-xl text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-base font-semibold text-gray-700 dark:text-gray-200">Improved Version</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{data?.ReWriteImprovementVersion}</p>
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-800/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                    <FaLightbulb className="text-xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-200">Suggestions</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{data?.AiSuggestions}</p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-800/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                    <FaLightbulb className="text-xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-200">Motivation</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{data?.AiMotivation}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssessmentResult; 