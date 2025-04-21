import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6 font-sans">Mentors AI Assistant</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-sans">
            Your personal AI assistant for all your learning and mentorship needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6 font-sans">Get Instant Answers to Your Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you need information about courses, batch details, or technical guidance,
              our AI mentor is here to help you 24/7.
            </p>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-600">
              <h3 className="text-xl font-medium text-blue-600 dark:text-blue-400 mb-4">How can our AI help you?</h3>
              <ul className="space-y-3">
                <li className="flex items-center"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">✓</span> Course and mock interview information</li>
                <li className="flex items-center"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">✓</span> Batch schedules and details</li>
                <li className="flex items-center"><span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">✓</span> Technical guidance and resources</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-2xl shadow-2xl p-8 text-white transform transition-all hover:scale-[1.02]">
            <div className="border-2 border-white/20 rounded-xl p-8 backdrop-blur-sm bg-white/10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Start Learning Today</h3>
              <p className="mb-8 text-lg">Access personalized mentorship and guidance with our AI-powered platform.</p>
              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <span className="text-lg">Expert-designed curriculum</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <span className="text-lg">24/7 learning support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <span className="text-lg">Career advancement tools</span>
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
