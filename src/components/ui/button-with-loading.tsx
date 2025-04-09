"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { 
  Check, 
  AlertCircle,
  type LucideIcon
} from "lucide-react";

type ButtonWithLoadingProps = React.ComponentPropsWithRef<typeof Button> & {
  isLoading?: boolean;
  loadingText?: string;
  isSuccess?: boolean;
  isError?: boolean;
  successText?: string;
  errorText?: string;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  onSuccess?: () => void;
  onError?: () => void;
  fullWidth?: boolean;
};

export function ButtonWithLoading({
  children,
  isLoading = false,
  loadingText,
  isSuccess = false,
  isError = false,
  successText = "Concluído",
  errorText = "Erro",
  successIcon = <Check className="h-4 w-4 mr-2" />,
  errorIcon = <AlertCircle className="h-4 w-4 mr-2" />,
  onSuccess,
  onError,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonWithLoadingProps) {
  // Set state effects
  React.useEffect(() => {
    if (isSuccess && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onSuccess]);

  React.useEffect(() => {
    if (isError && onError) {
      const timer = setTimeout(() => {
        onError();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isError, onError]);

  // Calculate button state
  const isDisabled = disabled || isLoading || isSuccess || isError;

  // Determine button content based on state
  let buttonContent = children;
  let buttonVariant = props.variant || "default";

  if (isLoading) {
    buttonContent = (
      <>
        <ButtonLoading />
        {loadingText || children}
      </>
    );
  } else if (isSuccess) {
    buttonContent = (
      <>
        {successIcon}
        {successText}
      </>
    );
    buttonVariant = "success" as any;
  } else if (isError) {
    buttonContent = (
      <>
        {errorIcon}
        {errorText}
      </>
    );
    buttonVariant = "destructive";
  }

  return (
    <Button
      className={cn(fullWidth && "w-full", className)}
      disabled={isDisabled}
      variant={buttonVariant}
      {...props}
    >
      {buttonContent}
    </Button>
  );
}