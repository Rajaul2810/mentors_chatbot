import Chatbot from "./components/Chatbot";
import Link from "next/link";
import { FaPen, FaGraduationCap, FaClock, FaRocket, FaMicrophone, FaBrain, FaGlobe } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="relative inline-block mb-4 px-4 py-2 rounded-full">
              <div className="relative px-4 py-2 bg-blue-100 dark:bg-gray-900 rounded-full">
                <span className="text-blue-600 dark:text-blue-300 font-medium flex items-center gap-2">
                  <FaBrain className="animate-pulse text-amber-500" /> AI-Powered Learning Platform
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8 font-sans animate-fade-in">
              Mentors&apos; Intelligence <span className="text-red-500 text-lg">(Beta)</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto font-sans leading-relaxed">
              Your intelligent companion for personalized learning and expert mentorship
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* IELTS Writing Card */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="h-full bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-700 dark:to-indigo-800 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                      <FaPen className="text-white text-3xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">AI Writing Tool</h3>
                    <p className="text-white/90 text-lg mb-4">
                    AI writing tool to improve general and IELTS writing with feedback, corrections, and smart suggestions.
                    </p>
                  </div>

                  <div className="space-y-4 mb-4 flex-grow">
                    {[ 'Smart Suggestions', 'Grammar Correction', 'Vocabulary Improvement', 'Progress Tracking'].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/90">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/20">
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/ielts-writing"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Practice
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Speaking Practice Card */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="h-full bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-800 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                      <FaMicrophone className="text-white text-3xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">AI Speaking Tool</h3>
                    <p className="text-white/90 text-lg mb-4">
                    AI-powered general and IELTS speaking practice with real-time feedback and progress tracking.
                    </p>
                  </div>

                  <div className="space-y-4 mb-4 flex-grow">
                    {['Fluency Check', 'Grammar Correction', 'Vocabulary Improvement', 'Progress Tracking'].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/90">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/20">
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/speaking"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Speaking
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Learning Features Card */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="h-full bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 h-full flex flex-col">
                  <h3 className="text-3xl font-bold text-white mb-8">Start Learning Today</h3>

                  <div className="space-y-4  flex-grow">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-lg">
                        <FaGraduationCap className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl">Expert Curriculum</h4>
                        <p className="text-white/80">Professionally designed learning paths</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-lg">
                        <FaClock className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl">24/7 Support</h4>
                        <p className="text-white/80">Round-the-clock learning assistance</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-lg">
                        <FaRocket className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl">Career Growth</h4>
                        <p className="text-white/80">Advanced career development tools</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-lg">
                        <FaGlobe className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl">Study Abroad Support</h4>
                        <p className="text-white/80">Professional guidance for study abroad</p>
                      </div>
                    </div>

                  </div>
                  <Link
                    href="https://www.mentorslearning.com"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Learning
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Chatbot />
    </main>
  );
}
