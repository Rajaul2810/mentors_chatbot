// "use client";
// import { useState, useRef} from "react";
// import { FaMicrophone, FaStop, FaPlay } from "react-icons/fa";

// interface SpeechRecognitionEvent extends Event {
//   results: {
//     [key: number]: {
//       [key: number]: {
//         transcript: string;
//       };
//     };
//   };
// }

// interface SpeechRecognitionErrorEvent extends Event {
//   error: string;
// }

// interface SpeechRecognition extends EventTarget {
//   lang: string;
//   interimResults: boolean;
//   maxAlternatives: number;
//   start: () => void;
//   stop: () => void;
//   onresult: (event: SpeechRecognitionEvent) => void;
//   onerror: (event: SpeechRecognitionErrorEvent) => void;
// }

// declare global {
//   interface Window {
//     SpeechRecognition?: new () => SpeechRecognition;
//     webkitSpeechRecognition?: new () => SpeechRecognition;
//   }
// }

// interface EvaluationResponse {
//   feedback: string;
// }

// export default function SpeakingPractice() {
//   const [transcript, setTranscript] = useState("");
//   const [evaluated, setEvaluated] = useState<EvaluationResponse | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   const startRecognition = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       const result = event.results[0][0].transcript;
//       setTranscript(result);
//     };

//     recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//       console.error("Speech recognition error:", event);
//       setIsRecording(false);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//     setIsRecording(true);
//   };

//   const stopRecognition = () => {
//     recognitionRef.current?.stop();
//     setIsRecording(false);
//   };

//   // const evaluateSpeaking = async () => {
//   //   setIsProcessing(true);
//   //   try {
//   //     const res = await fetch("/api/evaluate", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ transcript })
//   //     });
//   //     const data = await res.json();
//   //     setEvaluated(data);
//   //   } catch (error) {
//   //     console.error("Evaluation error:", error);
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
//             Speaking Practice
//           </h1>

//           <div className="flex justify-center gap-4 mb-8">
//             <button
//               onClick={isRecording ? stopRecognition : startRecognition}
//               className={`
//                 relative group
//                 ${isRecording 
//                   ? 'bg-red-500 hover:bg-red-600' 
//                   : 'bg-blue-500 hover:bg-blue-600'
//                 }
//                 text-white px-6 py-3 rounded-full
//                 transform transition-all duration-300
//                 hover:scale-105 hover:shadow-lg
//                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//               `}
//             >
//               <div className="flex items-center gap-2">
//                 {isRecording ? <FaStop /> : <FaMicrophone />}
//                 <span>{isRecording ? 'Stop' : 'Start Speaking'}</span>
//               </div>
//               {isRecording && (
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
//               )}
//             </button>

//             <button
//               onClick={() => {}}
//               disabled={!transcript || isProcessing}
//               className={`
//                 bg-indigo-500 hover:bg-indigo-600
//                 text-white px-6 py-3 rounded-full
//                 transform transition-all duration-300
//                 hover:scale-105 hover:shadow-lg
//                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
//                 disabled:opacity-50 disabled:cursor-not-allowed
//                 flex items-center gap-2
//               `}
//             >
//               {isProcessing ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <FaPlay />
//               )}
//               <span>Evaluate</span>
//             </button>
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
//             <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Transcript:</h2>
//             <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
//               {transcript || "Start speaking to see your transcript here..."}
//             </p>
//           </div>
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 animate-fade-in">
//             <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Evaluation:</h2>
//             <p className="text-gray-600 dark:text-gray-300">
//               Coming soon...
//             </p>
//           </div>

//           {/* {evaluated && (
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 animate-fade-in">
//               <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Evaluation:</h2>
//               <div className="prose dark:prose-invert max-w-none">
//                 <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
//                   {evaluated.feedback}
//                 </pre>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function SpeakingPractice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Speaking Practice
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enhance your speaking skills with our AI-powered evaluation system
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Coming Soon
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                We&apos;re working hard to bring you an advanced speaking practice platform. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
