import { useState, useRef } from "react";
import { Mic, Loader } from "lucide-react";

function HomePage() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recogRef = useRef(null);

  const ensureRecognizer = () => {
    if (recogRef.current) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser 🥲");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US"; // tweak for your locale
    recog.interimResults = false; // only final result
    recog.continuous = false; // stop automatically when user stops

    recog.onresult = (e) => {
      const txt = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(txt);
      speak(txt); // 3) TTS it back to the user
    };

    recog.onend = () => setListening(false); // UI‑flip when done
    recog.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recogRef.current = recog;
  };

  const toggleMic = () => {
    ensureRecognizer();
    const recog = recogRef.current;
    if (!recog) return;

    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      recog.start();
      setListening(true);
    }
  };

  const speak = (txt) => {
    if (!txt) return;
    const utter = new SpeechSynthesisUtterance(txt);
    utter.lang = "en-US"; // match your locale
    window.speechSynthesis.speak(utter); // plays through system speakers
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <button
        onClick={toggleMic}
        className={`p-4 rounded-full focus:outline-none ${
          listening ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {listening ? (
          <Loader className="animate-spin h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>

      {/* live transcript */}
      <p className="mt-6 text-xl text-center max-w-xl break-words">
        {transcript || "Click the mic and start talking…"}
      </p>
    </div>
  );
}

export default HomePage;
