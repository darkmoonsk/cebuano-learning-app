"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonProps } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { WordItem } from "@/types/word-item";
import { getAudioUrlFor } from "@/presentation/lib/utils";

// uses shared getAudioUrlFor

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function ListeningGame({ words }: { words: WordItem[] }) {
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [choices, setChoices] = useState<WordItem[]>([]);
  const [answer, setAnswer] = useState<WordItem | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const answered = selectedId !== null;

  const pool = useMemo(() => {
    return words.filter((w) => w.cebuano && w.cebuano.trim().length > 0);
  }, [words]);

  function playAudioFor(word: string) {
    // Stop any currently playing audio completely
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeEventListener("canplaythrough", () => {});
      audioRef.current.removeEventListener("error", () => {});
      audioRef.current = null;
    }

    const url = getAudioUrlFor(word);
    const audio = new Audio(url);
    audioRef.current = audio;

    // Add error handling and ensure audio is ready
    const playHandler = () => {
      audio.play().catch((error) => {
        console.warn("Audio play failed:", error);
      });
    };

    const errorHandler = (error: Event) => {
      console.warn("Audio load failed:", error);
    };

    audio.addEventListener("canplaythrough", playHandler, { once: true });
    audio.addEventListener("error", errorHandler, { once: true });

    // Load the audio
    audio.load();
  }

  function setupRound() {
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const distractors = sample(
      pool.filter((w) => w.rank !== correct.rank),
      3
    );
    const nextChoices = sample([correct, ...distractors], 4);
    setChoices(nextChoices);
    setAnswer(correct);
    setSelectedId(null);
  }

  useEffect(() => {
    setupRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play audio when answer changes (but not on initial load)
  useEffect(() => {
    if (answer && round > 0) {
      // Small delay to ensure previous audio is completely stopped
      const timeoutId = setTimeout(() => {
        playAudioFor(answer.cebuano);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [answer]);

  function handleSelect(rank: number) {
    if (!answer || answered) return;
    setSelectedId(rank);
    setStreak((s) => (rank === answer.rank ? s + 1 : 0));
  }

  function handleNext() {
    setupRound();
    setRound((r) => r + 1);
  }

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle>Listening game</CardTitle>
        <CardDescription>
          Listen and choose the correct Cebuano word.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Streak</div>
          <div className="text-lg font-semibold">{streak}</div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => answer && playAudioFor(answer.cebuano)}
          >
            🔊 Play
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((w) => {
            const isCorrect = answer && w.rank === answer.rank;
            const isSelected = selectedId === w.rank;
            const variant = answered
              ? isCorrect
                ? "default"
                : isSelected
                  ? "destructive"
                  : "secondary"
              : "secondary";
            return (
              <Button
                key={w.rank}
                variant={variant as ButtonProps["variant"]}
                onClick={() => handleSelect(w.rank)}
                disabled={answered}
                className="py-6"
              >
                {w.cebuano}
              </Button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleNext} disabled={!answered}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
