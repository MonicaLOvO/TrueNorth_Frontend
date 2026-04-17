"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import {
  type ChatRequestMessage,
  type ExploreSuggestion,
  sendChatAudio,
} from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { saveRecentExplores } from "@/lib/recent-explores";
import { Mic, Square } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type UiMessage = { role: "assistant" | "user"; text: string };

function pickRecorderMimeType(): { mimeType?: string } {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") {
    return {};
  }
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return { mimeType: mime };
    }
  }
  return {};
}

function extensionForMime(mime: string): string {
  if (mime.includes("mp4")) {
    return "m4a";
  }
  return "webm";
}

function normalizeUrl(url: string | null) {
  if (!url) {
    return null;
  }
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

function cleanText(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  return value
    .replace(/\*\*/g, "")
    .replace(/^[\s>*•-]+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function VoicePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "food";
  const category = CATEGORIES.find((item) => item.slug === slug);

  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explores, setExplores] = useState<ExploreSuggestion[]>([]);
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      role: "assistant",
      text: category
        ? `Hi! Tap the mic, ask your question out loud, and I will reply. We are in ${category.title}.`
        : "Hi! Tap the mic and ask your question out loud.",
    },
  ]);
  const [apiMessages, setApiMessages] = useState<ChatRequestMessage[]>(() =>
    category
      ? [
          {
            role: "user",
            content: `Context: We are making a decision in the ${category.title} category.`,
          },
        ]
      : [],
  );
  const apiMessagesRef = useRef(apiMessages);
  apiMessagesRef.current = apiMessages;

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      stopTracks();
    };
  }, [stopTracks]);

  const uploadRecording = useCallback(async (blob: Blob) => {
      if (!blob.size) {
        return;
      }

      setLoading(true);
      setError(null);

      const mime = blob.type || "audio/webm";
      const filename = `recording.${extensionForMime(mime)}`;

      try {
        const response = await sendChatAudio({
          audio: blob,
          filename,
          messages: apiMessagesRef.current,
        });

        const transcript = response.transcript?.trim() || "(no speech detected)";
        const reply =
          cleanText(response.message)?.trim() ||
          "I did not get a useful reply back from the backend.";

        setMessages((prev) => [
          ...prev,
          { role: "user", text: transcript },
          { role: "assistant", text: reply },
        ]);
        setApiMessages((prev) => [
          ...prev,
          { role: "user", content: transcript },
          { role: "assistant", content: response.message },
        ]);
        setExplores(response.explores ?? []);

        if ((response.explores ?? []).length > 0) {
          saveRecentExplores(response.explores, {
            source: "chat",
            categorySlug: slug,
          });
        }
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Something went wrong while sending your recording.";
        setError(message);
      } finally {
        setLoading(false);
      }
  }, [slug]);

  const startListening = useCallback(async () => {
    if (listening || loading) {
      return;
    }
    setError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const { mimeType } = pickRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        stopTracks();
        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        void uploadRecording(blob);
      };

      recorderRef.current = recorder;
      recorder.start();
      setListening(true);
    } catch {
      setError("Microphone permission is required for voice chat.");
    }
  }, [listening, loading, stopTracks, uploadRecording]);

  const stopListening = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      setListening(false);
      return;
    }
    recorder.stop();
    recorderRef.current = null;
    setListening(false);
  }, []);

  return (
    <AppShell>
      <BackButton href={`/category/${slug}/guided`} />

      <div className="mb-4 mt-5">
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {category ? `${category.emoji} ${category.title} voice` : "Voice"}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {listening
            ? "Recording… tap stop when you are done."
            : loading
              ? "Sending audio to the assistant…"
              : "Tap the mic to record a question."}
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={[
              "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
              message.role === "assistant"
                ? "border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                : "ml-auto bg-sky-600 text-white shadow-sm shadow-sky-600/20",
            ].join(" ")}
          >
            {message.text}
          </div>
        ))}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {explores.length > 0 ? (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Suggested options
          </div>
          <div className="mt-2 space-y-3">
            {explores.slice(0, 3).map((explore) => {
              const websiteUrl = normalizeUrl(explore.url);
              return (
                <div
                  key={`${explore.name}-${explore.url ?? explore.location ?? "card"}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="text-base font-semibold">
                    {cleanText(explore.name) ?? explore.name}
                  </div>
                  {cleanText(explore.description) ? (
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {cleanText(explore.description)}
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {websiteUrl ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                      >
                        Open website
                      </a>
                    ) : null}
                    <Link
                      href="/explore"
                      className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            if (listening) {
              stopListening();
            } else {
              void startListening();
            }
          }}
          disabled={loading}
          className={[
            "flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 disabled:opacity-60",
            listening
              ? "bg-red-500 shadow-red-500/30 hover:bg-red-600"
              : "bg-sky-600 shadow-sky-600/30 hover:bg-sky-700",
          ].join(" ")}
          aria-label={listening ? "Stop recording" : "Start recording"}
        >
          {listening ? <Square size={28} fill="currentColor" /> : <Mic size={32} strokeWidth={2} />}
        </button>

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
