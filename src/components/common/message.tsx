import * as React from "react"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/common/alert"
import { cn } from "@/lib/utils"

export type MessageType = 'error' | 'success' | 'info' | '';

interface MessageProps {
  message: string;
  type: MessageType;
  title?: string;
  className?: string;
  icon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Message = React.forwardRef<
  HTMLDivElement,
  MessageProps
>(({ 
  message, 
  type, 
  title, 
  className, 
  icon = true, 
  dismissible = type === 'error', // Error messages are dismissible by default
  onDismiss,
  ...props 
}, ref) => {
  const [dismissed, setDismissed] = React.useState(false);
  const prevMessageRef = React.useRef<string>("");
  
  // Reset dismissed state when message changes
  React.useEffect(() => {
    // Only reset if the message is different and not empty
    if (message && message !== prevMessageRef.current) {
      setDismissed(false);
      prevMessageRef.current = message;
    }
  }, [message]);

  if (!message || type === '' || dismissed) return null;

  // Determine styling based on message type
  const styles = {
    error: {
      variant: "destructive" as const,
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700 dark:text-red-300",
      icon: <AlertCircle className="h-4 w-4" />
    },
    success: {
      variant: "default" as const,
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle className="h-4 w-4" />
    },
    info: {
      variant: "default" as const,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
      icon: <Info className="h-4 w-4" />
    }
  };

  const style = styles[type];
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Alert
      ref={ref}
      variant={style.variant}
      className={cn(style.bg, style.border, style.text, "relative", className)}
      {...props}
    >
      {icon && style.icon}
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Dismiss message"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
});

Message.displayName = "Message"; 