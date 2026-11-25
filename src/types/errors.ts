export type ErrorKind = 'not_found' | 'rate_limit' | 'network' | 'unknown';

export interface AppError {
  kind: ErrorKind;
  status?: number;
  message: string;
  resetAt?: Date;
}
