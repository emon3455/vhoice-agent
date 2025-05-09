import { useState, useRef } from "react";
import { Mic, Loader, Volume2 } from "lucide-react";

/* ----------------------------- Config ----------------------------- */
const GOOGLE_API_KEY = "AIzaSyCb_qFX6qfqbyA0jUMq5EFx2KQIZPsGTKc";   // safest
const VOICE_NAME     = "en-US-Neural2-J";
/* ----------------------------------------------------------------- */

export default function HomePage() {
  /* state & refs */
  const [phase, setPhase]         = useState("idle"); // idle | listen | think | talk
  const [transcript, setTranscript] = useState("");
  const audioRef  = useRef(null);

  /* --------------- helpers --------------- */
  const base64ToDataURI = (b64, mime="audio/mp3") =>
    `data:${mime};base64,${b64}`;

  const speak = async txt => {
    setPhase("think");
    try {
      const { audioContent } = await fetch(
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

      if (!audioContent) throw new Error("TTS returned empty audio");

      /* ---- iOS‑safe playback sequence ---- */
      const el = audioRef.current;
      el.pause();
      el.src = base64ToDataURI(audioContent);
      el.load();                     //  *critical* on WebKit
      setPhase("talk");

      try {
        await el.play();             // returns a promise – catch it!
      } catch (err) {
        console.warn("⚠️ play() prevented:", err);
        // fallback to native TTS if user muted autoplay
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(txt));
      }
    } catch (err) {
      console.error("TTS error:", err);
    } finally {
      setPhase("idle");
    }
  };

  const onResult = txt => {
    setTranscript(txt);
    if (txt) speak(txt);
  };

  /* ----‑ Simplest mic handler *just* for demo -------------------- */
  const handleMic = async () => {
    if (phase === "listen") return;            // already listening

    setPhase("listen");
    setTranscript("");

    const rec = new (window.webkitSpeechRecognition ||
      window.SpeechRecognition)();

    if (!rec) {
      alert("Native STT missing – add fallback STT here.");
      setPhase("idle");
      return;
    }

    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = e =>
      onResult(
        Array.from(e.results).map(r => r[0].transcript).join("")
      );
    rec.onerror = e => {
      console.error("STT error", e);
      setPhase("idle");
    };
    rec.onend = () => setPhase("idle");
    rec.start();
  };

  /* --------------- UI --------------- */
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <button
        onClick={handleMic}
        className={`p-5 rounded-full transition shadow-lg focus:outline-none
          ${phase === "listen" ? "bg-red-600"
            : phase === "think" ? "bg-yellow-500"
            : "bg-green-600"}`}
      >
        {phase === "listen" ? (
          <Loader className="animate-spin h-8 w-8" />
        ) : phase === "think" ? (
          <Volume2 className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>

      {/* transcript */}
      <p className="mt-6 text-xl text-center break-words min-h-[3rem]">
        {transcript || "Tap the mic and talk…"}
      </p>

      {/* AUDIO element – don’t hide it on iOS */}
      <audio
        ref={audioRef}
        playsInline       // <‑‑ crucial for iOS
        preload="none"
        className="mt-4 w-full max-w-md"
        controls          // keep controls visible for quick mute‑debug
      />
    </div>
  );
}
