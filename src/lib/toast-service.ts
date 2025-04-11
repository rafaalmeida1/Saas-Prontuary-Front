import { toast } from '@/components/ui/use-toast';
import { ApiError } from './api';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
}

const DEFAULT_DURATIONS = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

/**
 * Show a success toast notification
 */
export function success(message: string, options: Omit<ToastOptions, 'title'> = {}) {
  toast({
    title: 'Success',
    description: message,
    duration: options.duration || DEFAULT_DURATIONS.success,
    variant: 'default',
    ...options
  });
}

/**
 * Show an error toast notification
 */
export function error(message: string, options: Omit<ToastOptions, 'title'> = {}) {
  toast({
    title: 'Error',
    description: message,
    duration: options.duration || DEFAULT_DURATIONS.error,
    variant: 'destructive',
    ...options
  });
}

/**
 * Show a warning toast notification
 */
export function warning(message: string, options: Omit<ToastOptions, 'title'> = {}) {
  toast({
    title: 'Warning',
    description: message,
    duration: options.duration || DEFAULT_DURATIONS.warning,
    variant: 'default',
    ...options
  });
}

/**
 * Show an info toast notification
 */
export function info(message: string, options: Omit<ToastOptions, 'title'> = {}) {
  toast({
    title: 'Info',
    description: message,
    duration: options.duration || DEFAULT_DURATIONS.info,
    variant: 'default',
    ...options
  });
}

/**
 * Handle API errors and show appropriate toast notifications
 */
export function handleError(error: unknown, customMessage?: string) {
  if (error instanceof ApiError) {
    toast({
      title: 'Error',
      description: error.message,
      duration: DEFAULT_DURATIONS.error,
      variant: 'destructive',
    });
  } else if (error instanceof Error) {
    toast({
      title: 'Error',
      description: customMessage || error.message,
      duration: DEFAULT_DURATIONS.error,
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Error',
      description: customMessage || 'An unexpected error occurred',
      duration: DEFAULT_DURATIONS.error,
      variant: 'destructive',
    });
  }
}

/**
 * Show a custom toast notification
 */
export function custom(options: ToastOptions & { title: string }) {
  const { title, description, duration, variant, ...rest } = options;
  toast({
    title,
    description,
    duration: duration || DEFAULT_DURATIONS.success,
    variant: variant || 'default',
    ...rest
  });
}

/**
 * Show a toast notification for a promise
 */
export function promise<T>(
  promise: Promise<T>,
  options: {
    loading: string;
    success: string;
    error: string;
  }
) {
  const loadingToast = toast({
    title: 'Loading',
    description: options.loading,
    duration: DEFAULT_DURATIONS.success,
  });

  promise
    .then(() => {
      loadingToast.dismiss();
      toast({
        title: 'Success',
        description: options.success,
        duration: DEFAULT_DURATIONS.success,
      });
    })
    .catch((error) => {
      loadingToast.dismiss();
      toast({
        title: 'Error',
        description: options.error,
        duration: DEFAULT_DURATIONS.error,
        variant: 'destructive',
      });
    });
}