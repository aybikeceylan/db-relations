// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createLogger } = require("logger") as {
  createLogger: (path?: string) => {
    info: (...a: unknown[]) => void;
    error: (...a: unknown[]) => void;
  };
};
export const logger = createLogger();
