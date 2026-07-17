"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getTaskStatusLabel, type TaskStatus } from "@/lib/types/models";
import "@/styles/StatusSelect.css";

type StatusSelectProps = {
    value: TaskStatus;
    options: TaskStatus[];
    onChange: (value: TaskStatus) => void;
    disabled?: boolean;
    id?: string;
    "aria-label"?: string;
};

export default function StatusSelect({
    value,
    options,
    onChange,
    disabled = false,
    id,
    "aria-label": ariaLabel = "Статус задачи",
}: StatusSelectProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    useEffect(() => {
        if (!open) return;

        function onPointerDown(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    function selectOption(next: TaskStatus) {
        onChange(next);
        setOpen(false);
    }

    return (
        <div
            className={`status-select${open ? " status-select--open" : ""}${disabled ? " status-select--disabled" : ""}`}
            ref={rootRef}
        >
            <button
                type="button"
                id={id}
                className="status-select__trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="status-select__value">
                    {getTaskStatusLabel(value)}
                </span>
                <span className="status-select__chevron" aria-hidden="true" />
            </button>

            {open ? (
                <ul
                    id={listId}
                    className="status-select__menu"
                    role="listbox"
                    aria-label={ariaLabel}
                >
                    {options.map((code) => {
                        const selected = code === value;
                        return (
                            <li key={code} role="option" aria-selected={selected}>
                                <button
                                    type="button"
                                    className={`status-select__option${selected ? " status-select__option--selected" : ""}`}
                                    onClick={() => selectOption(code)}
                                >
                                    {getTaskStatusLabel(code)}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
