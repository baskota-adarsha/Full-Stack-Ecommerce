// src/utils/errorFactory.ts
import { AppError } from "../middlewares/errorHandler";

export const createError = (message: string, status: number): AppError => {
  const err: AppError = new Error(message);
  err.status = status;
  return err;
};
