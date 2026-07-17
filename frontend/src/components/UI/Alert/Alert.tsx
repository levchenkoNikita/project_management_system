"use client";

import { useEffect } from "react";
import "@/styles/Alert.css";

type AlertProps = {
    message: string;
    variant?: "error" | "success";
    onClose?: () => void;
};

export default function Alert({
    message,
    variant = "error",
    onClose,
}: AlertProps) {
    useEffect(() => {
        if (!onClose) return;
        const timer = window.setTimeout(onClose, 5000);
        return () => window.clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div
            className={`alert alert--${variant} alert--top`}
            role="alert"
            aria-live="assertive"
        >
            <p className="alert__message">{message}</p>
            {onClose ? (
                <button
                    type="button"
                    className="alert__close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            ) : null}
        </div>
    );
}
