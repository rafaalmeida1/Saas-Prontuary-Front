import { toast } from '@/components/ui/use-toast';
import { ApiError } from './api';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

const DEFAULT_DURATIONS = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

class ToastService {
  /**
   * Show a success toast notification
   */
  success(message: string, options: Omit<ToastOptions, 'title'> = {}) {
    toast({
      title: options.title || 'Success',
      description: message,
      duration: options.duration || DEFAULT_DURATIONS.success,
      variant: 'default',
    });
  }

  /**
   * Show an error toast notification
   */
  error(message: string, options: Omit<ToastOptions, 'title'> = {}) {
    toast({
      title: options.title || 'Error',
      description: message,
      duration: options.duration || DEFAULT_DURATIONS.error,
      variant: 'destructive',
    });
  }

  /**
   * Show a warning toast notification
   */
  warning(message: string, options: Omit<ToastOptions, 'title'> = {}) {
    toast({
      title: options.title || 'Warning',
      description: message,
      duration: options.duration || DEFAULT_DURATIONS.warning,
      variant: 'destructive',
    });
  }

  /**
   * Show an info toast notification
   */
  info(message: string, options: Omit<ToastOptions, 'title'> = {}) {
    toast({
      title: options.title || 'Information',
      description: message,
      duration: options.duration || DEFAULT_DURATIONS.info,
    });
  }

  /**
   * Handle API errors and show appropriate toast notifications
   * @param error Error object to handle
   * @param customMessage Optional custom message to display
   */
  handleError(error: unknown, customMessage?: string) {
    if (error instanceof ApiError) {
      // Special handling for different error status codes
      if (error.status === 401 || error.status === 403) {
        this.error(
          customMessage || 'Session expired. Please log in again.',
          { title: 'Authentication Error' }
        );
        return;
      }
      
      if (error.status >= 500) {
        this.error(
          customMessage || 'Server error. Please try again later.',
          { title: 'Server Error' }
        );
        return;
      }
      
      this.error(
        customMessage || error.message,
        { title: 'Error' }
      );
      return;
    }
    
    // Generic error handling
    const message = 
      customMessage || 
      (error instanceof Error ? error.message : 'An unexpected error occurred');
    
    this.error(message);
  }
}

export const toastService = new ToastService(); 