"use client";

import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import {
  PhraseDto,
  fetchDuePhrases,
  fetchPhraseProgress,
} from "@/presentation/actions/phrases";
import { AchievementToastContainer } from "@/presentation/components/achievement-toast";
// import { Difficulty } from "@/domain/value-objects/difficulty-rating";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Badge } from "@/presentation/components/ui/badge";

interface PhraseLearningPanelProps {
  userId: string;
  initialPhrases: PhraseDto[];
  initialProgress: {
    totalLearned: number;
    dueToday: number;
    streak: number;
  };
}

type LearningPhase = "learning" | "practice" | "completed";
type PracticeStep = "select" | "validate";

interface PracticePhrase {
  phrase: PhraseDto;
  words: string[];
  shuffledWords: string[];
  selectedWords: string[];
  isCorrect: boolean | null;
}

interface WordPosition {
  word: string;
  isCorrectPosition: boolean;
  correctIndex: number;
  actualIndex: number;
}

export function PhraseLearningPanel({
  userId,
  initialPhrases,
  initialProgress,
}: PhraseLearningPanelProps) {
  const [phrases, setPhrases] = useState<PhraseDto[]>(initialPhrases);
  const [, setProgress] = useState(initialProgress);
  const [phase, setPhase] = useState<LearningPhase>("learning");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [practiceStep, setPracticeStep] = useState<PracticeStep>("select");
  const [practicePhrases, setPracticePhrases] = useState<PracticePhrase[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  // const [, startTransition] = useTransition();
  const [newlyUnlockedAchievements] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      category: string;
      unlockedAt: Date;
    }>
  >([]);

  const currentPhrase = phrases[currentPhraseIndex];
  const currentPractice = practicePhrases[currentPracticeIndex];

  async function refreshState() {
    const [nextPhrases, nextProgress] = await Promise.all([
      fetchDuePhrases(userId),
      fetchPhraseProgress(userId),
    ]);
    setPhrases(nextPhrases);
    setProgress(nextProgress);
  }

  function splitPhraseIntoWords(phrase: string): string[] {
    return phrase.trim().split(/\s+/);
  }

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function validatePhraseOrder(selected: string[], correct: string[]): boolean {
    return (
      selected.length === correct.length &&
      selected.every((word, index) => word === correct[index])
    );
  }

  function analyzeWordPositions(
    selected: string[],
    correct: string[]
  ): WordPosition[] {
    return selected.map((word, actualIndex) => {
      const correctIndex = correct.findIndex(
        (correctWord) => correctWord === word
      );
      return {
        word,
        isCorrectPosition: actualIndex === correctIndex,
        correctIndex,
        actualIndex,
      };
    });
  }

  function startPractice() {
    const practiceData: PracticePhrase[] = phrases.map((phrase) => {
      const words = splitPhraseIntoWords(phrase.cebuano);
      return {
        phrase,
        words,
        shuffledWords: shuffleArray(words),
        selectedWords: [],
        isCorrect: null,
      };
    });

    setPracticePhrases(practiceData);
    setCurrentPracticeIndex(0);
    setPhase("practice");
    setPracticeStep("select");
  }

  function selectWord(word: string) {
    if (practiceStep !== "select") return;

    setPracticePhrases((prev) => {
      const updated = [...prev];
      const practice = updated[currentPracticeIndex];

      if (!practice || practice.selectedWords.includes(word)) {
        return prev;
      }

      updated[currentPracticeIndex] = {
        ...practice,
        selectedWords: [...practice.selectedWords, word],
        // Reset validation state when words are modified
        isCorrect: null,
      };

      return updated;
    });
  }

  function removeWord(word: string) {
    setPracticePhrases((prev) => {
      const updated = [...prev];
      const practice = updated[currentPracticeIndex];

      if (!practice) {
        return prev;
      }

      updated[currentPracticeIndex] = {
        ...practice,
        selectedWords: practice.selectedWords.filter((w) => w !== word),
        // Reset validation state when words are modified
        isCorrect: null,
      };

      return updated;
    });
    // Reset practice step to allow re-selection
    setPracticeStep("select");
  }

  function checkAnswer() {
    let hasCurrentPractice = false;

    setPracticePhrases((prev) => {
      const updated = [...prev];
      const practice = updated[currentPracticeIndex];

      if (!practice) {
        return prev;
      }

      hasCurrentPractice = true;

      const isCorrect = validatePhraseOrder(
        practice.selectedWords,
        practice.words
      );

      updated[currentPracticeIndex] = {
        ...practice,
        isCorrect,
      };

      return updated;
    });

    if (hasCurrentPractice) {
      setPracticeStep("validate");
    }
  }

  function nextPractice() {
    if (currentPracticeIndex < practicePhrases.length - 1) {
      setCurrentPracticeIndex((prev) => prev + 1);
      setPracticeStep("select");
    } else {
      setPhase("completed");
    }
  }

  function resetPractice() {
    setPracticePhrases((prev) => {
      const updated = [...prev];
      const practice = updated[currentPracticeIndex];

      if (!practice) {
        return prev;
      }

      updated[currentPracticeIndex] = {
        ...practice,
        selectedWords: [],
        isCorrect: null,
      };

      return updated;
    });
    setPracticeStep("select");
  }

  // async function submitReview(rating: Difficulty) {
  //   if (!currentPractice) return;

  //   startTransition(async () => {
  //     const result = await submitPhraseReview({
  //       userId,
  //       phraseId: currentPractice.phrase.id,
  //       rating,
  //       dailyReviewCap: 300,
  //     });

  //     if (result.success && result.newlyUnlockedAchievements) {
  //       setNewlyUnlockedAchievements(result.newlyUnlockedAchievements);
  //     }
  //   });
  // }

  function continueLearning() {
    setPhase("learning");
    setCurrentPhraseIndex(0);
    void refreshState();
  }

  if (phrases.length === 0) {
    return (
      <>
        <AchievementToastContainer
          achievements={newlyUnlockedAchievements}
          onClose={() => {}}
        />
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No phrases available</h3>
                <p className="text-muted-foreground">
                  Check back later for new phrases to learn!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (phase === "learning") {
    return (
      <>
        <AchievementToastContainer
          achievements={newlyUnlockedAchievements}
          onClose={() => {}}
        />
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Learn Phrases</h2>
              <Badge variant="outline">
                {currentPhraseIndex + 1} of {phrases.length}
              </Badge>
            </div>
            <Progress
              value={((currentPhraseIndex + 1) / phrases.length) * 100}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentPhrase.cebuano}</CardTitle>
              <CardDescription className="text-lg">
                {currentPhrase.english}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPhraseIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentPhraseIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentPhraseIndex < phrases.length - 1) {
                  setCurrentPhraseIndex((prev) => prev + 1);
                } else {
                  startPractice();
                }
              }}
            >
              {currentPhraseIndex < phrases.length - 1
                ? "Next"
                : "Start Practice"}
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (phase === "practice") {
    return (
      <>
        <AchievementToastContainer
          achievements={newlyUnlockedAchievements}
          onClose={() => {}}
        />
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Practice Assembly</h2>
              <Badge variant="outline">
                {currentPracticeIndex + 1} of {practicePhrases.length}
              </Badge>
            </div>
            <Progress
              value={
                ((currentPracticeIndex + 1) / practicePhrases.length) * 100
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentPractice.phrase.english}
              </CardTitle>
              <CardDescription>
                Assemble the Cebuano phrase using the word blocks below. After
                checking your answer, words in the correct position will be
                highlighted in green, and words in the wrong position will be
                highlighted in red.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Selected words area */}
                <div className="min-h-[60px] rounded-lg border-2 border-dashed border-gray-300 p-4">
                  <div className="flex flex-wrap gap-2">
                    {currentPractice.selectedWords.map((word, index) => {
                      const wordPositions = analyzeWordPositions(
                        currentPractice.selectedWords,
                        currentPractice.words
                      );
                      const position = wordPositions[index];
                      const isCorrectPosition =
                        position?.isCorrectPosition ?? false;

                      // Show color indicators after validation
                      const shouldShowColors =
                        currentPractice.isCorrect !== null;

                      return (
                        <Badge
                          key={`selected-${index}`}
                          variant="secondary"
                          className={`cursor-pointer ${
                            shouldShowColors && isCorrectPosition
                              ? "bg-green-100 text-green-800 border-green-300"
                              : shouldShowColors && !isCorrectPosition
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => removeWord(word)}
                        >
                          {word}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Available words */}
                <div className="space-y-2">
                  <h4 className="font-medium">Available words:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPractice.shuffledWords
                      .filter(
                        (word) => !currentPractice.selectedWords.includes(word)
                      )
                      .map((word, index) => (
                        <Badge
                          key={`available-${index}`}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => selectWord(word)}
                        >
                          {word}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Validation result */}
                {currentPractice.isCorrect !== null && (
                  <div
                    className={`rounded-lg p-4 ${
                      currentPractice.isCorrect
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {currentPractice.isCorrect ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {currentPractice.isCorrect ? "Correct!" : "Incorrect"}
                      </span>
                    </div>
                    {!currentPractice.isCorrect && (
                      <div className="mt-2 space-y-2">
                        {/* <p className="text-sm">
                          Correct order: {currentPractice.words.join(" ")}
                        </p> */}
                        <div className="text-sm">
                          <p className="font-medium mb-1">Word positions:</p>
                          <div className="flex flex-wrap gap-1">
                            {analyzeWordPositions(
                              currentPractice.selectedWords,
                              currentPractice.words
                            ).map((position, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded text-xs ${
                                  position.isCorrectPosition
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {position.word}{" "}
                                {position.isCorrectPosition ? "✓" : "✗"}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={resetPractice}
                disabled={practiceStep === "select"}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <div className="flex gap-2">
                {practiceStep === "select" && (
                  <Button
                    onClick={checkAnswer}
                    disabled={currentPractice.selectedWords.length === 0}
                  >
                    Check Answer
                  </Button>
                )}
                {practiceStep === "validate" && (
                  <Button onClick={nextPractice}>
                    {currentPracticeIndex < practicePhrases.length - 1
                      ? "Next"
                      : "Finish"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  if (phase === "completed") {
    return (
      <>
        <AchievementToastContainer
          achievements={newlyUnlockedAchievements}
          onClose={() => {}}
        />
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">Great job!</h3>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve completed all the phrase exercises. Keep
                  practicing to improve your Cebuano!
                </p>
                <div className="flex gap-4">
                  <Button onClick={continueLearning}>Learn More Phrases</Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return null;
}
