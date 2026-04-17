"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import { type ExploreSuggestion, sendAudioChat, type ChatRequestMessage } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function VoicePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "food";

  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [explores, setExplores] = useState<ExploreSuggestion[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  async function uploadAudio(chunks: BlobPart[]) {
    if (chunks.length === 0) {
      setError("No audio captured. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blob = new Blob(chunks, { type: "audio/mpeg" });
      const audioFile = new File([blob], `voice-${Date.now()}.mp3`, {
        type: "audio/mpeg",
      });

      const messages: ChatRequestMessage[] = [
        {
          role: "user",
          content: `Context: We are making a decision in the ${slug} category.`,
        },
      ];

      const response = await sendAudioChat(audioFile, messages);
      setTranscript(response.transcript ?? null);
      setAssistantReply(response.message ?? null);
      setExplores(response.explores ?? []);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while uploading audio.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    if (loading) return;

    setError(null);
    setTranscript(null);
    setAssistantReply(null);
    setExplores([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("Audio recording failed. Please try again.");
        setListening(false);
        stopStream();
      };

      recorder.onstop = () => {
        setListening(false);
        const chunks = [...chunksRef.current];
        chunksRef.current = [];
        stopStream();
        void uploadAudio(chunks);
      };

      recorder.start();
      setListening(true);
    } catch {
      setError("Microphone access denied or unavailable.");
      setListening(false);
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      setListening(false);
      stopStream();
    }
  }

  function toggleListening() {
    if (listening) {
      stopRecording();
      return;
    }

    void startRecording();
  }

  return (
    <AppShell>
      <BackButton href="/home" />

      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <div className="text-xl font-semibold text-slate-900 dark:text-white">
          How can I help you decide?
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {loading
            ? "Uploading audio and waiting for response..."
            : listening
              ? "Listening... tap again to stop."
              : "Tap the mic to start speaking."}
        </p>

        <button
          onClick={toggleListening}
          disabled={loading}
          className={[
            "relative mt-8 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95",
            loading ? "cursor-not-allowed opacity-60" : "",
            listening
              ? "bg-red-500 shadow-red-500/30 hover:bg-red-600"
              : "bg-sky-600 shadow-sky-600/30 hover:bg-sky-700",
          ].join(" ")}
          aria-label={listening ? "Stop listening" : "Start listening"}
        >
          {listening ? (
            <span className="absolute inset-0 rounded-full border-4 border-red-300/50 animate-ping" />
          ) : null}
          {listening ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-9 w-9 fill-current"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-9 w-9 fill-none stroke-current"
              strokeWidth="1.8"
            >
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M6 11a6 6 0 0 0 12 0" />
              <path d="M12 17v4" />
              <path d="M8 21h8" />
            </svg>
          )}
        </button>

        {error ? (
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : null}

        {transcript ? (
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Transcript
            </div>
            <div>{transcript}</div>
          </div>
        ) : null}

        {assistantReply ? (
          <div className="mt-4 w-full max-w-sm rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-left text-sm text-slate-800 shadow-sm dark:border-sky-900 dark:bg-sky-950/30 dark:text-slate-100">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-500">
              Assistant
            </div>
            <div>{assistantReply}</div>
          </div>
        ) : null}

        {explores.length > 0 ? (
          <div className="mt-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Suggested options
            </div>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {explores.slice(0, 3).map((item) => (
                <div key={`${item.name}-${item.url ?? item.location ?? "item"}`}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
          <Link
            href={`/category/${slug}/guided`}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
          >
            Guided
          </Link>
          <Link
            href={`/category/${slug}/chat`}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
          >
            Chat
          </Link>
        </div>
      </div>
    </AppShell>
  );
}