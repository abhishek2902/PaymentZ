import { ZodError } from 'zod';

const humanize = (path = []) =>
  path
    .join(' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const formatToastError = (input) => {
  const error = input?.error ?? input?._error ?? input;

  // Zod validation errors
  if (error instanceof ZodError || error?.name === 'ZodError') {
    const issues = error?.errors || error?.issues;

    if (Array.isArray(issues) && issues.length > 0) {
      return issues
        .map((issue) => {
          const field = issue.path?.length
            ? humanize(issue.path)
            : 'Field';
          return `${field} is required`;
        })
        .join(', ');
    }

    return 'Validation failed';
  }

  // Backend / Axios message
  if (typeof error?.message === 'string') {
    return error.message;
  }

  // Plain string
  if (typeof error === 'string') {
    return error;
  }

  return 'Something went wrong';
};
