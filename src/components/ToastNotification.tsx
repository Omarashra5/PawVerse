import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function ToastNotification({
  toasts,
  removeToast,
}: ToastNotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onDismiss={() => removeToast(toast.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
  key?: string;
}) {
  // Auto dismiss after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
      className="pointer-events-auto flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-950/95 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-xl"
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex-shrink-0">{getIcon()}</div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="ml-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
