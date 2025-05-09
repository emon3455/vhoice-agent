// HomePage.jsx
import { useState, useRef } from "react";
import { Mic, Loader, Volume2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config – replace with your real key or proxy --------------------- */
const GOOGLE_API_KEY = "AIzaSyCb_qFX6qfqbyA0jUMq5EFx2KQIZPsGTKc";
/* Preferred TTS voice */
const VOICE_NAME = "bn-IN-Wavenet-A";   // any Google voice you like
/* ------------------------------------------------------------------ */

function HomePage() {
  /* -------- state / refs -------- */
  const [listening, setListening]   = useState(false);
  const [thinking, setThinking]     = useState(false);
  const [transcript, setTranscript] = useState("");
  const audioRef  = useRef(null);
  const recogRef  = useRef(null);
  const mediaRef  = useRef(null);   // for fallback recorder

  /* -------- helpers -------- */
  /* ----‑‑ A)  Get the text --------------------------------------- */
  const ensureRecognizer = () => {
    if (recogRef.current) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;                // fallback later

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = e => {
      const txt = Array.from(e.results).map(r => r[0].transcript).join("");
      handleTranscript(txt);
    };
    recog.onend   = () => setListening(false);
    recog.onerror = err => {
      console.error("SpeechRecognition error", err);
      setListening(false);
    };
    recogRef.current = recog;
  };

  const startListening = async () => {
    setTranscript("");
    /* Native SpeechRecognition path */
    ensureRecognizer();
    if (recogRef.current) {
      recogRef.current.start();
      setListening(true);
      return;
    }
    /* ---- Fallback for Safari / iOS ----------------------------- */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        setListening(false);
        const blob = new Blob(chunks, { type: "audio/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const base64Audio = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );
        /* Send to Google STT */
        const sttRes = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 48000,
                languageCode: "en-US"
              },
              audio: { content: base64Audio }
            })
          }
        ).then(r => r.json());

        const txt =
          sttRes?.results?.[0]?.alternatives?.[0]?.transcript || "";
        handleTranscript(txt);
      };
      recorder.start();
      mediaRef.current = recorder;
      setListening(true);
      /* Stop after 10 s or when user taps again */
      setTimeout(() => recorder.state === "recording" && recorder.stop(), 10000);
    } catch (err) {
      console.error("MediaRecorder fallback error", err);
    }
  };

  const stopListening = () => {
    if (recogRef.current && listening) recogRef.current.stop();
    if (mediaRef.current && mediaRef.current.state === "recording")
      mediaRef.current.stop();
    setListening(false);
  };

  const handleTranscript = txt => {
    setTranscript(txt);
    if (txt) speak(txt);
  };

  /* ----‑‑ B)  Make MP3 & play it --------------------------------- */
  const speak = async txt => {
    setThinking(true);
    try {
      const ttsRes = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text: txt },
            voice: { languageCode: "en-US", name: VOICE_NAME },
            audioConfig: { audioEncoding: "MP3" }
          })
        }
      ).then(r => r.json());

      const mp3 = ttsRes.audioContent; // base64 string
      if (!mp3) throw new Error("No audio returned");

      const audioBlob = new Blob([Uint8Array.from(atob(mp3), c => c.charCodeAt(0))], {
        type: "audio/mpeg"
      });
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      await audioRef.current.play();
    } catch (err) {
      console.error("TTS error", err);
    } finally {
      setThinking(false);
    }
  };

  /* -------- UI -------- */
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      {/* mic button */}
      <button
        onClick={listening ? stopListening : startListening}
        className={`p-5 rounded-full shadow-lg focus:outline-none transition 
          ${listening ? "bg-red-600" : thinking ? "bg-yellow-500" : "bg-green-600"}`}
      >
        {listening ? (
          <Loader className="animate-spin h-8 w-8" />
        ) : thinking ? (
          <Volume2 className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>

      {/* transcript */}
      <p className="mt-6 text-xl text-center break-words min-h-[3rem]">
        {transcript || "Tap the mic and talk…"}
      </p>

      {/* the actual audio element (hidden controls) */}
      <audio ref={audioRef} className="mt-4" controls hidden />
    </div>
  );
}

export default HomePage;
