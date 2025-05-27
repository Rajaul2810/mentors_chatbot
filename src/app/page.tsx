import Chatbot from "./components/Chatbot";
import Link from "next/link";
import { FaPen, FaGraduationCap, FaClock, FaRocket } from "react-icons/fa";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8 font-sans animate-fade-in">
              Mentors&apos; AI Assistant
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto font-sans leading-relaxed">
              Your intelligent companion for personalized learning and expert mentorship
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* IELTS Writing Card */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="h-full bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-700 dark:to-indigo-800 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                      <FaPen className="text-white text-3xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">IELTS Writing Assessment</h3>
                    <p className="text-white/90 text-lg mb-8">
                      Advanced AI-powered analysis for IELTS writing tasks
                    </p>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {['Task Response Analysis', 'Coherence Evaluation', 'Language Feedback'].map((item, index) => (
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

            {/* Learning Features Card */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="h-full bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 h-full flex flex-col">
                  <h3 className="text-3xl font-bold text-white mb-8">Start Learning Today</h3>
                  
                  <div className="space-y-6 flex-grow">
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
                  </div>
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
