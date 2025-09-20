"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";

type WordItem = {
  id: number;
  english: string;
  cebuano: string;
  pos?: string;
  level?: string;
};

function toSlugAudio(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, "-");
}

function getAudioUrl(word: string) {
  return `/audio/words/${toSlugAudio(word)}.mp3`;
}

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const url = getAudioUrl(word);
    const audio = new Audio(url);
    audioRef.current = audio;
    void audio.play();
  }

  function setupRound() {
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const distractors = sample(
      pool.filter((w) => w.id !== correct.id),
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

  useEffect(() => {
    if (!answer) return;
    playAudioFor(answer.cebuano);
  }, [answer, round]);

  function handleSelect(id: number) {
    if (!answer || answered) return;
    setSelectedId(id);
    setStreak((s) => (id === answer.id ? s + 1 : 0));
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
            const isCorrect = answer && w.id === answer.id;
            const isSelected = selectedId === w.id;
            const variant = answered
              ? isCorrect
                ? "default"
                : isSelected
                ? "destructive"
                : "secondary"
              : "secondary";
            return (
              <Button
                key={w.id}
                variant={variant as any}
                onClick={() => handleSelect(w.id)}
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
