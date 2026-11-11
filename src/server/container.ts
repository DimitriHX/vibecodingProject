import "server-only";
import { serverEnv } from "./config/env";
import { DevToArticleProvider } from "./providers/devto-article-provider";
import { InMemoryFocusSessionRepository } from "./repositories/in-memory-focus-session-repository";
import { InMemoryTaskRepository } from "./repositories/in-memory-task-repository";
import { createSeedData } from "./repositories/seed";
import { ArticleService } from "./services/article-service";
import { FocusSessionService } from "./services/focus-session-service";
import { StatsService } from "./services/stats-service";
import { TaskService } from "./services/task-service";
import { systemClock } from "./shared/clock";
import { uuidGenerator } from "./shared/id-generator";

export interface Container {
  taskService: TaskService;
  focusSessionService: FocusSessionService;
  statsService: StatsService;
  articleService: ArticleService;
}

/**
 * Composition root: the only place that knows concrete implementations.
 * Swap InMemory* for a Supabase adapter here without touching services or routes.
 */
function createContainer(): Container {
  const seed = createSeedData(systemClock.now(), uuidGenerator);
  const taskRepository = new InMemoryTaskRepository(seed.tasks);
  const sessionRepository = new InMemoryFocusSessionRepository(seed.sessions);

  const taskService = new TaskService(taskRepository, systemClock, uuidGenerator);

  return {
    taskService,
    focusSessionService: new FocusSessionService(sessionRepository, taskService, systemClock, uuidGenerator),
    statsService: new StatsService(taskRepository, sessionRepository, systemClock),
    articleService: new ArticleService(new DevToArticleProvider(serverEnv.devTo), serverEnv.devTo.perPage),
  };
}

// Kept on globalThis so pages and Route Handlers share one instance (and it survives HMR).
const globalForContainer = globalThis as typeof globalThis & { __focusflowContainer?: Container };

export function getContainer(): Container {
  globalForContainer.__focusflowContainer ??= createContainer();
  return globalForContainer.__focusflowContainer;
}
