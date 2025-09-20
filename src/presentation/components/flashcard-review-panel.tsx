"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Loader2, Volume2 } from "lucide-react";
import {
  FlashcardDto,
  fetchDueFlashcards,
  fetchProgress,
  submitReview,
} from "@/presentation/actions/flashcards";
import {
  Difficulty,
  difficultyLabels,
} from "@/domain/value-objects/difficulty-rating";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Progress } from "@/presentation/components/ui/progress";
import { useCases } from "@/infrastructure/container";
import { audio } from "@elevenlabs/elevenlabs-js/api/resources/dubbing";

const difficultyOrder: Difficulty[] = ["again", "hard", "good", "easy"];

interface FlashcardReviewPanelProps {
  initialFlashcards: FlashcardDto[];
  initialProgress: {
    totalLearned: number;
    dueToday: number;
    streak: number;
  };
}

export function FlashcardReviewPanel({
  initialFlashcards,
  initialProgress,
}: FlashcardReviewPanelProps) {
  const [cards, setCards] = useState<FlashcardDto[]>(initialFlashcards);
  const [progress, setProgress] = useState(initialProgress);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [wordExplain, setWordExplain] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedCardIdRef = useRef<string | null>(null);

  function getAudioUrlFromWord(word: string) {
    const slug = word.trim().toLowerCase().replace(/\s+/g, "-");
    return `/audio/words/${slug}.mp3`;
  }

  useEffect(() => {
    const fetchWordExplain = async () => {
      const wordExplain = await useCases
        .getWordExplainWithAI()
        .execute({ word: currentCard.cebuano });

      setWordExplain(wordExplain);
    };

    fetchWordExplain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCard = cards[0];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentCard?.id]);

  useEffect(() => {
    if (!currentCard?.id) return;
    if (autoPlayedCardIdRef.current === currentCard.id) return;
    autoPlayedCardIdRef.current = currentCard.id;
    handlePlayAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard?.id]);

  const completionPercent = useMemo(() => {
    if (progress.totalLearned === 0) {
      return 0;
    }

    const completedToday = Math.max(
      progress.totalLearned - progress.dueToday,
      0
    );
    return Math.max(
      0,
      Math.min(100, (completedToday / Math.max(progress.totalLearned, 1)) * 100)
    );
  }, [progress]);

  async function refreshState() {
    const [nextCards, nextProgress] = await Promise.all([
      fetchDueFlashcards(10),
      fetchProgress(),
    ]);
    setCards(nextCards);
    setProgress(nextProgress);
    setShowAnswer(false);

    const wordExplain = await useCases
      .getWordExplainWithAI()
      .execute({ word: currentCard.cebuano });

    setWordExplain(wordExplain);
  }

  async function handleReveal() {
    const wordExplain = await useCases
      .getWordExplainWithAI()
      .execute({ word: currentCard.cebuano });

    setWordExplain(wordExplain);

    setShowAnswer(true);
  }

  function handleReview(rating: Difficulty) {
    if (!currentCard) {
      return;
    }

    startTransition(async () => {
      await submitReview({ flashcardId: currentCard.id, rating });
      await refreshState();
    });
  }

  function handlePlayAudio() {
    if (!currentCard) return;
    const audioUrl = getAudioUrlFromWord(currentCard.cebuano);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    void audio.play();
  }

  if (!currentCard) {
    return (
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>No cards due</CardTitle>
          <CardDescription>
            Great job! You are up to date. Check back later or explore the word
            list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total reviews</span>
            <span>{progress.totalLearned}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Current streak</span>
            <span>{progress.streak} days</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Tip: You may have reached today ’s limit of 10 new cards. New cards
            become available tomorrow.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="min-h-[320px]">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl font-semibold">
                {currentCard.cebuano}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Play audio"
                onClick={handlePlayAudio}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>What is the English meaning?</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{currentCard.partOfSpeech}</Badge>
            <Badge variant="outline">{currentCard.level}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-4">
          <div className="rounded-lg border border-dashed p-6 text-center text-lg">
            {showAnswer ? (
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-primary">
                  {currentCard.english}
                </span>
                <span className="text-muted-foreground">{wordExplain}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                Reveal the English translation
              </span>
            )}
          </div>
          {!showAnswer ? (
            <Button disabled={isPending} onClick={handleReveal} size="lg">
              Reveal answer
            </Button>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {difficultyOrder.map((rating) => (
                <Button
                  key={rating}
                  variant={
                    rating === "again"
                      ? "destructive"
                      : rating === "easy"
                      ? "default"
                      : "secondary"
                  }
                  disabled={isPending}
                  onClick={() => handleReview(rating)}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {difficultyLabels[rating]}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Cards remaining</span>
          <span>{cards.length}</span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your progress</CardTitle>
          <CardDescription>
            Spaced repetition adapts based on your answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Reviews completed</div>
            <div className="text-2xl font-semibold">
              {progress.totalLearned}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Due today</span>
              <span>{progress.dueToday}</span>
            </div>
            <Progress value={completionPercent} />
          </div>
          <div className="space-y-2">
            <div className="font-medium">Current streak</div>
            <div className="text-2xl font-semibold">{progress.streak} days</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
