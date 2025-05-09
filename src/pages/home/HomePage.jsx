// HomePage_iOS.jsx – universal STT/TTS with iOS‑safe unlock + fallback
import { useState, useRef } from "react";
import { Mic, Loader, Volume2 } from "lucide-react";

/* ------------------ Config ------------------ */
const GOOGLE_API_KEY = "AIzaSyCb_qFX6qfqbyA0jUMq5EFx2KQIZPsGTKc";
const TTS_VOICE       = "bn-IN-Wavenet-A";
const STT_LANGUAGE    = "bn-BD";         // 🆕 Bangla so results match voice
/* -------------------------------------------- */

export default function HomePage() {
  /* refs / state */
  const [phase,      setPhase]      = useState("idle");  // idle | listen | think | talk
  const [transcript, setTranscript] = useState("");
  const audioRef                    = useRef(null);
  const unlocked                    = useRef(false);

  /* 0 · 1 s silent MP3 that Safari will play to unlock autoplay */
  const SILENT_MP3 =
    "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAABQaXPEAAAAMGluZgAAABRkYXRhAAAAAAA=";

  /* ---------- helpers ---------- */
  const unlockAudio = () => {
    if (unlocked.current) return;
    const el = audioRef.current;
    el.src = SILENT_MP3;
    el.play().catch(() => {/* ignore */});   // no await! 🔄 CHANGED
    el.pause();
    unlocked.current = true;
  };

  const b64toURI = (b64, mime = "audio/mp3") => `data:${mime};base64,${b64}`;

  /* -------------- STT -------------- */
  const nativeSTT = () => {
    return new Promise((resolve, reject) => {
      const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (!SR) return reject(new Error("native‑stt-absent"));

      const rec = new SR();
      rec.lang           = STT_LANGUAGE;
      rec.interimResults = false;
      rec.continuous     = false;

      rec.onresult = e =>
        resolve(Array.from(e.results).map(r => r[0].transcript).join(""));
      rec.onerror  = e => reject(e);
      rec.onend    = () => reject(new Error("empty"));   // nothing said
      rec.start();                                      // stays inside gesture 🔄
    });
  };

  /* ---------- 🆕 fallback STT via Google Cloud ---------- */
  const cloudSTT = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const media  = new MediaRecorder(stream, { mimeType: "audio/webm" });

    const chunks = [];
    media.ondataavailable = e => chunks.push(e.data);

    await new Promise(r => {
      media.start();
      setTimeout(() => { media.stop(); }, 6000);   // 6‑second gather
      media.onstop = r;
    });

    const blob    = new Blob(chunks, { type: "audio/webm" });
    const arrayB  = await blob.arrayBuffer();
    const base64  = btoa(String.fromCharCode(...new Uint8Array(arrayB)));

    const resp = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            encoding: "WEBM_OPUS",
            languageCode: STT_LANGUAGE,
            sampleRateHertz: 48000
          },
          audio: { content: base64 }
        })
      }
    ).then(r => r.json());

    const alt = resp.results?.[0]?.alternatives?.[0];
    return alt?.transcript || "";
  };

  /* ---------- main mic handler ---------- */
  const handleMic = async () => {
    if (phase === "listen") return;
    setTranscript("");
    setPhase("listen");

    unlockAudio();                    // keep synchronous 🔄

    let text = "";
    try {
      text = await nativeSTT();       // try fast built‑in path first
    } catch (err) {
      console.warn("native STT failed:", err.message);
      setPhase("listen");
      try {
        text = await cloudSTT();      // 🆕 fallback
      } catch (cloudErr) {
        console.error("cloud STT failed", cloudErr);
      }
    }

    if (!text) { setPhase("idle"); return; }
    setTranscript(text);
    speak(text);
  };

  /* -------------- TTS -------------- */
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
            voice: { languageCode: STT_LANGUAGE, name: TTS_VOICE },
            audioConfig: { audioEncoding: "MP3" }
          })
        }
      ).then(r => r.json());

      if (!audioContent) throw new Error("empty‑audio");

      const el = audioRef.current;
      el.pause();
      el.src = b64toURI(audioContent);
      el.load();                             // critical on iOS
      setPhase("talk");
      await el.play();
    } catch (err) {
      console.error("TTS/play error", err);
    } finally {
      setPhase("idle");
    }
  };

  /* -------------- UI -------------- */
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <button
        onClick={handleMic}
        className={`p-5 rounded-full shadow-lg focus:outline-none transition
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

      <p className="mt-6 text-xl text-center break-words min-h-[3rem]">
        {transcript || "Tap the mic and talk…"}
      </p>

      {/* keep controls visible while debugging on iPhone */}
      <audio
        ref={audioRef}
        playsInline
        preload="none"
        controls
        className="mt-4 w-full max-w-md"
      />
    </div>
  );
}
