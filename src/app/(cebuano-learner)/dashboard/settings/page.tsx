"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [sessionLimit, setSessionLimit] = useState<number>(30);
  const [newDailyCap, setNewDailyCap] = useState<number>(30);
  const [dailyReviewCap, setDailyReviewCap] = useState<number>(300);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/user/settings", { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (res.ok) {
          const data = (await res.json()) as {
            sessionLimit: number;
            newDailyCap: number;
            dailyReviewCap: number;
          };
          setSessionLimit(data.sessionLimit);
          setNewDailyCap(data.newDailyCap);
          setDailyReviewCap(data.dailyReviewCap);
        }
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function handleSave() {
    const res = await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionLimit: Math.max(1, sessionLimit),
        newDailyCap: Math.max(0, newDailyCap),
        dailyReviewCap: Math.max(1, dailyReviewCap),
      }),
    });
    if (res.status === 401) {
      alert("Please log in to save settings");
      window.location.href = "/login";
      return;
    }
    if (res.ok) {
      alert("Settings saved");
    } else {
      alert("Failed to save settings");
    }
  }

  if (!loaded) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Session cards limit
          </label>
          <input
            type="number"
            className="w-full rounded-md border px-3 py-2"
            value={sessionLimit}
            onChange={(e) => setSessionLimit(Number(e.target.value))}
            min={1}
          />
          <p className="text-xs text-muted-foreground">
            Default: 30 cards per session.
          </p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">New cards per day</label>
          <input
            type="number"
            className="w-full rounded-md border px-3 py-2"
            value={newDailyCap}
            onChange={(e) => setNewDailyCap(Number(e.target.value))}
            min={0}
          />
          <p className="text-xs text-muted-foreground">
            Default: 30 new cards daily.
          </p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Daily review cap</label>
          <input
            type="number"
            className="w-full rounded-md border px-3 py-2"
            value={dailyReviewCap}
            onChange={(e) => setDailyReviewCap(Number(e.target.value))}
            min={1}
          />
          <p className="text-xs text-muted-foreground">
            Default: 300 total reviews per day.
          </p>
        </div>
        <div>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white"
            onClick={handleSave}
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
