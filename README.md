# Bisaya Flashcards

A modern learning experience for Cebuano/Bisaya vocabulary built with Next.js, Tailwind, shadcn/ui, and MongoDB. Learners review curated flashcards with an adaptive spaced repetition algorithm, track their progress over time, and manage their own accounts.

## Features

- Email + password authentication with secure password hashing.
- Adaptive spaced repetition powered by an SM-2 inspired scheduler.
- Progress tracking (reviews completed, daily streak, due cards).
- Clean Architecture layering (domain, application, infrastructure, presentation).
- Prisma ORM with MongoDB + seed script that imports `src/app/data/cebuano_words.json`.
- Responsive UI using Tailwind v4 and shadcn/ui primitives.

## Tech Stack

- **Framework**: Next.js 15 (App Router, server actions, React 19).
- **UI**: Tailwind CSS v4, shadcn/ui components, Geist fonts.
- **Auth**: NextAuth.js with credentials provider.
- **Data**: MongoDB + Prisma Client.
- **Languages/Tooling**: TypeScript, Zod, bcryptjs.

## Project Structure

```
src/
├─ app/                 # App Router routes & pages
├─ application/         # Use cases, DTOs, application services
├─ domain/              # Entities, value objects, domain services & repos
├─ infrastructure/      # Prisma client, repositories, auth wiring, IoC
└─ presentation/        # UI components, actions, hooks, providers
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env.local` and update `DATABASE_URL` + `NEXTAUTH_SECRET`.

3. **Prisma setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed flashcards** (optional but recommended)
   ```bash
   npx ts-node src/infrastructure/prisma/seed-flashcards.ts
   ```
   > If you prefer, compile the script with `ts-node/register` or transpile it before running. It loads the vocabulary dataset into MongoDB.

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to access the marketing page, authentication, and dashboard.

## Scripts

| Script            | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start Next.js in development mode (Turbopack) |
| `npm run build`   | Build the production bundle                   |
| `npm run start`   | Start the production server                   |
| `npm run lint`    | Run ESLint across the project                 |

## Next Steps & Ideas

- Add mobile-friendly gestures (swipe) for rating flashcards.
- Introduce spaced repetition analytics (ease factor history, retention curves).
- Enable custom decks or tagging to group vocabulary by topic.
- Provide audio pronunciations or sentence examples per flashcard.

Happy learning! :)
