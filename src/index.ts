import 'dotenv/config';

import express from 'express';

import { prisma } from './prisma';

const app = express();
const rawPort = Number(process.env.PORT ?? 3000);
const port = Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 3000;

app.disable('x-powered-by');
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Express + PostgreSQL + Prisma API is running.',
  });
});

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      ok: true,
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);

    res.status(503).json({
      ok: false,
      database: 'disconnected',
    });
  }
});

async function start() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment.');
  }

  await prisma.$connect();

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down...`);
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void start().catch((error) => {
  console.error('Failed to start server:', error);
  void prisma.$disconnect().finally(() => {
    process.exit(1);
  });
});
