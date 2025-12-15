"use client"

import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
    id: string;
    title?: string;
    description?: string;
    type?: ToastType;
};

type ToastContextValue = {
    toast: (opts: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(({ title, description, type = "info" }: Omit<Toast, "id">) => {
        const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
        const t: Toast = { id, title, description, type };
        setToasts((s) => [t, ...s]);
        setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={
                            "max-w-sm w-full rounded-md px-4 py-2 text-sm shadow-lg text-white " +
                            (t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-slate-700")
                        }
                    >
                        {t.title && <div className="font-semibold">{t.title}</div>}
                        {t.description && <div className="text-xs opacity-90">{t.description}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}

export default ToastProvider;
