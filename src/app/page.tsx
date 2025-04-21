import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">Mentors Learning AI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI assistant for all your learning and mentorship needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Get Instant Answers to Your Questions</h2>
            <p className="text-lg text-gray-600 mb-6">
              Whether you need information about courses, batch details, or technical guidance,
              our AI mentor is here to help you 24/7.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-medium text-blue-600 mb-3">How can our AI help you?</h3>
              <ul className="space-y-2">
                <li className="flex items-center"><span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2">✓</span> Course and mock interview information</li>
                <li className="flex items-center"><span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2">✓</span> Batch schedules and details</li>
                <li className="flex items-center"><span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2">✓</span> Technical guidance and resources</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
            <div className="border-2 border-white/20 rounded-lg p-6 backdrop-blur-sm bg-white/10">
              <h3 className="text-2xl font-bold mb-4">Start Learning Today</h3>
              <p className="mb-6">Access personalized mentorship and guidance with our AI-powered platform.</p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xl">🎓</span>
                  </div>
                  <span>Expert-designed curriculum</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <span>24/7 learning support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xl">🚀</span>
                  </div>
                  <span>Career advancement tools</span>
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
