import React, { useState } from 'react';
import { FaChartBar, FaLink, FaBook, FaSpellCheck, FaChevronDown, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';

interface AssessmentCriteria {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  examples?: string[];
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


}

const AssessmentResult: React.FC<{ data: AssessmentData }> = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-blue-100 dark:border-blue-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-bl-full" />

        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaTrophy className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overall Band Score</h2>
            </div>

            <div className={`text-5xl font-bold ${getScoreColor(data?.score?.overallBandScore)} bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl`}>
              {data?.score?.overallBandScore ?? 'N/A'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaChartBar className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Task Achievement</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.score?.taskAchievement}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaLink className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Coherence & Cohesion</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.score?.coherenceAndCohesion}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaBook className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Lexical Resource</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.score?.lexicalResource}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaSpellCheck className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Grammar</span>
              </div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{data?.score?.grammaticalRangeAndAccuracy}</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
            <p className="text-gray-600 dark:text-gray-300">{data?.feedback || 'No feedback available'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-800/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
                    <FaLightbulb className="text-xl text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-200">Using AI</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{data?.AiGenerateWriting}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full md:w-auto flex items-center justify-center mt-2 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
            <FaChevronDown className={`transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderCriteria(data?.detailedFeedback?.taskAchievement || {}, 'Task Achievement',
            <FaChartBar className={`text-xl ${getScoreColor(data?.detailedFeedback?.taskAchievement?.score)}`} />
          )}
          {renderCriteria(data?.detailedFeedback?.coherenceAndCohesion || {}, 'Coherence & Cohesion',
            <FaLink className={`text-xl ${getScoreColor(data?.detailedFeedback?.coherenceAndCohesion?.score)}`} />
          )}
          {renderCriteria(data?.detailedFeedback?.lexicalResource || {}, 'Lexical Resource',
            <FaBook className={`text-xl ${getScoreColor(data?.detailedFeedback?.lexicalResource?.score)}`} />
          )}
          {renderCriteria(data?.detailedFeedback?.grammaticalRangeAndAccuracy || {}, 'Grammar',
            <FaSpellCheck className={`text-xl ${getScoreColor(data?.detailedFeedback?.grammaticalRangeAndAccuracy?.score)}`} />
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentResult; 