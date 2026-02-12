"use client";

import { createContext, FC, ReactNode, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  txSignature?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, txSignature?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", txSignature?: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type, txSignature }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success": return "border-green-500/50";
      case "error": return "border-red-500/50";
      case "warning": return "border-yellow-500/50";
      case "info": return "border-seek-purple/50";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-seek-card border ${getBorderColor(toast.type)} rounded-xl p-4 shadow-lg backdrop-blur-sm animate-slide-up flex items-start gap-3`}
            onClick={() => dismiss(toast.id)}
          >
            <span className="text-lg shrink-0">{getIcon(toast.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{toast.message}</p>
              {toast.txSignature && (
                <a
                  href={`https://explorer.solana.com/tx/${toast.txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-seek-teal hover:underline mt-1 block"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on Explorer →
                </a>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-500 hover:text-white text-xs shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
