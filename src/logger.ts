/**
 * Minimal, level-gated logger for the panel. Wraps `console` so the browser bundle stays
 * tiny — no Pino in the iframe (Pino's NDJSON/transports/redaction belong on a Node/EBS
 * backend). The {@link setTransmit} seam lets a future backend receive forwarded logs.
 *
 * @packageDocumentation
 */

/** Severity levels, ordered from least to most important. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const ORDER = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const satisfies Record<LogLevel, number>;

/** Minimum level to emit; dev builds widen to `debug`. */
const MIN_LEVEL: LogLevel = import.meta.env.DEV ? 'debug' : 'info';

/** Sink signature for forwarding logs to a backend. */
export type Transmit = (level: LogLevel, message: string, args: readonly unknown[]) => void;

let transmit: Transmit | null = null;

/**
 * Registers (or clears, with `null`) a sink that receives every emitted log line — e.g. to
 * POST diagnostics to an EBS. No-op until a sink is set.
 */
export const setTransmit = (sink: Transmit | null): void => {
  transmit = sink;
};

const emit = (level: LogLevel, message: string, args: readonly unknown[]): void => {
  if (ORDER[level] < ORDER[MIN_LEVEL]) return;
  console[level](`[ravens-team] ${message}`, ...args);
  transmit?.(level, message, args);
};

/** Panel logger — use instead of `console` so level gating and forwarding stay centralized. */
export const logger = {
  debug: (message: string, ...args: readonly unknown[]): void => emit('debug', message, args),
  info: (message: string, ...args: readonly unknown[]): void => emit('info', message, args),
  warn: (message: string, ...args: readonly unknown[]): void => emit('warn', message, args),
  error: (message: string, ...args: readonly unknown[]): void => emit('error', message, args),
} as const;
