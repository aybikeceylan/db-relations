# DB Relations

Minimal Express + PostgreSQL + Prisma starter in TypeScript.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a PostgreSQL database and update `.env` if needed.
3. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Apply the migration:
   ```bash
   npm run prisma:migrate
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`
