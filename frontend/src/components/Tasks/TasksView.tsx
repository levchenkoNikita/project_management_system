"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    createTask,
    deleteTask,
    getTask,
    getTasks,
    updateTask,
} from "@/lib/api/Tasks/Tasks";
import { getProjects } from "@/lib/api/Projects/Projects";
import {
    getTaskStatusLabel,
    getValidNextStatuses,
    normalizeTaskStatus,
    TASK_STATUS_ORDER,
    type Task,
} from "@/lib/types/models";
import { PROJECTS_ROUTE } from "@/lib/utils/consts";
import { getProjectBackground } from "@/lib/utils/projectBackground";
import { truncateToSentence } from "@/lib/utils/text";
import Loader from "@/components/UI/Loader/Loader";
import StatusSelect from "@/components/UI/StatusSelect/StatusSelect";
import "@/styles/TasksPage.css";

type TasksViewProps = {
    projectId: string;
};

type CreateDraft = {
    title: string;
    description: string;
    status: number;
};

type EditDraft = {
    title: string;
    description: string;
    status: number;
};

const CREATE_STATUS_OPTIONS = [0, 1, 2, 3, 4];

type ViewMode = "list" | "board";

export default function TasksView({ projectId }: TasksViewProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projectTitle, setProjectTitle] = useState("Проект");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createDraft, setCreateDraft] = useState<CreateDraft>({
        title: "",
        description: "",
        status: 0,
    });

    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");
    const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
    const [savingDetail, setSavingDetail] = useState(false);
    const [deletingDetail, setDeletingDetail] = useState(false);

    const background = getProjectBackground(projectId);

    const nextStatuses = useMemo(() => {
        if (!selectedTask) return [];
        return getValidNextStatuses(selectedTask.status);
    }, [selectedTask]);

    const boardRows = useMemo(() => {
        return TASK_STATUS_ORDER.map((status) => ({
            status,
            label: getTaskStatusLabel(status),
            tasks: tasks.filter(
                (task) => normalizeTaskStatus(task.status) === status
            ),
        }));
    }, [tasks]);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [tasksData, projectsData] = await Promise.all([
                getTasks(projectId),
                getProjects().catch(() => []),
            ]);
            setTasks(tasksData);
            const project = projectsData.find(
                (item) => String(item.id) === String(projectId)
            );
            if (project?.title) {
                setProjectTitle(project.title);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось загрузить задачи"
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    useEffect(() => {
        if (selectedTaskId === null) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                closeDetail();
            }
        }

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedTaskId]);

    function closeDetail() {
        setSelectedTaskId(null);
        setSelectedTask(null);
        setEditDraft(null);
        setDetailError("");
        setDetailLoading(false);
    }

    async function openTask(taskId: number) {
        setSelectedTaskId(taskId);
        setSelectedTask(null);
        setEditDraft(null);
        setDetailError("");
        setDetailLoading(true);

        try {
            const task = await getTask(projectId, taskId);
            setSelectedTask(task);
            const next = getValidNextStatuses(task.status);
            setEditDraft({
                title: task.title,
                description: task.description ?? "",
                status: next[0] ?? normalizeTaskStatus(task.status),
            });
        } catch (err) {
            setDetailError(
                err instanceof Error
                    ? err.message
                    : "Не удалось загрузить задачу"
            );
        } finally {
            setDetailLoading(false);
        }
    }

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const title = createDraft.title.trim();
        if (!title || creating) return;

        setCreating(true);
        setError("");
        try {
            const task = await createTask(projectId, {
                title,
                description: createDraft.description.trim(),
                status: createDraft.status,
            });
            setTasks((prev) => [task, ...prev]);
            setShowCreateModal(false);
            setCreateDraft({ title: "", description: "", status: 0 });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось создать задачу"
            );
        } finally {
            setCreating(false);
        }
    }

    async function handleSaveDetail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedTask || !editDraft || savingDetail) return;

        const title = editDraft.title.trim();
        if (!title) {
            setDetailError("Название задачи обязательно");
            return;
        }

        setSavingDetail(true);
        setDetailError("");
        try {
            await updateTask(projectId, selectedTask.id, {
                title,
                description: editDraft.description.trim(),
                status: editDraft.status,
            });

            const refreshed = await getTask(projectId, selectedTask.id);
            setSelectedTask(refreshed);
            setTasks((prev) =>
                prev.map((item) =>
                    item.id === refreshed.id ? refreshed : item
                )
            );
            const next = getValidNextStatuses(refreshed.status);
            setEditDraft({
                title: refreshed.title,
                description: refreshed.description ?? "",
                status: next[0] ?? normalizeTaskStatus(refreshed.status),
            });
        } catch (err) {
            setDetailError(
                err instanceof Error
                    ? err.message
                    : "Не удалось обновить задачу"
            );
        } finally {
            setSavingDetail(false);
        }
    }

    async function handleDeleteDetail() {
        if (!selectedTask || deletingDetail) return;

        const confirmed = window.confirm(
            `Удалить задачу «${selectedTask.title}»?`
        );
        if (!confirmed) return;

        setDeletingDetail(true);
        setDetailError("");
        try {
            await deleteTask(projectId, selectedTask.id);
            setTasks((prev) =>
                prev.filter((item) => item.id !== selectedTask.id)
            );
            setSelectedTaskId(null);
            setSelectedTask(null);
            setEditDraft(null);
        } catch (err) {
            setDetailError(
                err instanceof Error
                    ? err.message
                    : "Не удалось удалить задачу"
            );
        } finally {
            setDeletingDetail(false);
        }
    }

    return (
        <section className="tasks-page" style={{ backgroundImage: background }}>
            <div className="container tasks-page__inner">
                {loading ? (
                    <div className="tasks-page__loader">
                        <Loader label="Загружаем задачи..." />
                    </div>
                ) : (
                    <>
                        <div className="tasks-page__header">
                            <div>
                                <Link
                                    href={PROJECTS_ROUTE}
                                    className="tasks-page__back"
                                >
                                    ← К проектам
                                </Link>
                                <h1 className="tasks-page__title">
                                    {projectTitle}
                                </h1>
                                <p className="tasks-page__subtitle">
                                    Задачи проекта
                                </p>
                            </div>
                            <div className="tasks-page__header-actions">
                                {tasks.length > 0 ? (
                                    <div
                                        className="tasks-view-toggle"
                                        role="group"
                                        aria-label="Вид отображения задач"
                                    >
                                        <button
                                            type="button"
                                            className={`tasks-view-toggle__btn${viewMode === "list" ? " tasks-view-toggle__btn--active" : ""}`}
                                            onClick={() => setViewMode("list")}
                                        >
                                            Список
                                        </button>
                                        <button
                                            type="button"
                                            className={`tasks-view-toggle__btn${viewMode === "board" ? " tasks-view-toggle__btn--active" : ""}`}
                                            onClick={() => setViewMode("board")}
                                        >
                                            Канбан
                                        </button>
                                    </div>
                                ) : null}
                                {tasks.length > 0 ? (
                                    <button
                                        type="button"
                                        className="tasks-page__create"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        Создать задачу
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        {error ? (
                            <p className="tasks-page__error">{error}</p>
                        ) : null}

                        {tasks.length === 0 ? (
                            <div className="tasks-page__empty">
                                <h2 className="tasks-page__empty-title">
                                    В этом проекте пока нет задач
                                </h2>
                                <p className="tasks-page__empty-text">
                                    Создайте первую задачу, чтобы начать работу.
                                </p>
                                <button
                                    type="button"
                                    className="tasks-page__create"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    Создать первую задачу
                                </button>
                            </div>
                        ) : viewMode === "list" ? (
                            <div className="tasks-grid">
                                {tasks.map((task) => (
                                    <button
                                        key={task.id}
                                        type="button"
                                        className="task-card"
                                        onClick={() => void openTask(task.id)}
                                    >
                                        <span className="task-card__status">
                                            {getTaskStatusLabel(task.status)}
                                        </span>
                                        <h2 className="task-card__title">
                                            {task.title}
                                        </h2>
                                        <p className="task-card__description">
                                            {truncateToSentence(task.description)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="tasks-board">
                                {boardRows.map((row, index) => (
                                    <section
                                        key={row.status}
                                        className="tasks-board__row"
                                    >
                                        {index > 0 ? (
                                            <div
                                                className="tasks-board__divider"
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        <div className="tasks-board__row-header">
                                            <h2 className="tasks-board__row-title">
                                                {row.label}
                                            </h2>
                                            <span className="tasks-board__row-count">
                                                {row.tasks.length}
                                            </span>
                                        </div>
                                        {row.tasks.length > 0 ? (
                                            <div className="tasks-grid">
                                                {row.tasks.map((task) => (
                                                    <button
                                                        key={task.id}
                                                        type="button"
                                                        className="task-card"
                                                        onClick={() =>
                                                            void openTask(task.id)
                                                        }
                                                    >
                                                        <span className="task-card__status">
                                                            {getTaskStatusLabel(
                                                                task.status
                                                            )}
                                                        </span>
                                                        <h2 className="task-card__title">
                                                            {task.title}
                                                        </h2>
                                                        <p className="task-card__description">
                                                            {truncateToSentence(
                                                                task.description
                                                            )}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="tasks-board__empty">
                                                Нет задач в этом статусе
                                            </p>
                                        )}
                                    </section>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {showCreateModal ? (
                <div
                    className="task-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-task-title"
                    onClick={() => {
                        if (!creating) setShowCreateModal(false);
                    }}
                >
                    <form
                        className="task-modal__panel"
                        onClick={(event) => event.stopPropagation()}
                        onSubmit={handleCreate}
                    >
                        <h2
                            id="create-task-title"
                            className="task-modal__title"
                        >
                            Новая задача
                        </h2>
                        <label className="task-modal__field">
                            <span>Название</span>
                            <input
                                type="text"
                                value={createDraft.title}
                                onChange={(event) =>
                                    setCreateDraft((prev) => ({
                                        ...prev,
                                        title: event.target.value,
                                    }))
                                }
                                maxLength={100}
                                required
                                autoFocus
                            />
                        </label>
                        <label className="task-modal__field">
                            <span>Описание</span>
                            <textarea
                                value={createDraft.description}
                                onChange={(event) =>
                                    setCreateDraft((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                                rows={4}
                            />
                        </label>
                        <label className="task-modal__field">
                            <span>Статус</span>
                            <StatusSelect
                                value={createDraft.status}
                                options={CREATE_STATUS_OPTIONS}
                                onChange={(status) =>
                                    setCreateDraft((prev) => ({
                                        ...prev,
                                        status,
                                    }))
                                }
                                aria-label="Статус новой задачи"
                            />
                        </label>
                        <div className="task-modal__actions">
                            <button
                                type="button"
                                className="task-modal__cancel"
                                onClick={() => setShowCreateModal(false)}
                                disabled={creating}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="task-modal__submit"
                                disabled={creating || !createDraft.title.trim()}
                            >
                                {creating ? "Создание..." : "Создать"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {selectedTaskId !== null ? (
                <div
                    className="task-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="task-overlay-title"
                    onClick={closeDetail}
                >
                    <div
                        className="container task-overlay__shell"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="task-overlay__panel">
                            {detailLoading ? (
                                <div className="task-overlay__loader">
                                    <Loader label="Загружаем задачу..." />
                                </div>
                            ) : null}

                            {!detailLoading && detailError && !selectedTask ? (
                                <div className="task-overlay__error-state">
                                    <p>{detailError}</p>
                                    <button
                                        type="button"
                                        className="tasks-page__create"
                                        onClick={closeDetail}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            ) : null}

                            {!detailLoading && selectedTask && editDraft ? (
                                <form
                                    className="task-overlay__form"
                                    onSubmit={handleSaveDetail}
                                >
                                    <div className="task-overlay__header">
                                        <div>
                                            <span className="task-overlay__status">
                                                Текущий:{" "}
                                                {getTaskStatusLabel(
                                                    selectedTask.status
                                                )}
                                            </span>
                                            <h2
                                                id="task-overlay-title"
                                                className="task-overlay__title"
                                            >
                                                Редактирование задачи
                                            </h2>
                                        </div>
                                        <button
                                            type="button"
                                            className="task-overlay__close"
                                            onClick={closeDetail}
                                            aria-label="Закрыть"
                                            disabled={
                                                savingDetail || deletingDetail
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="task-overlay__body">
                                        {detailError ? (
                                            <p className="tasks-page__error">
                                                {detailError}
                                            </p>
                                        ) : null}

                                        <label className="task-overlay__field">
                                            <span className="task-overlay__label">
                                                Название
                                            </span>
                                            <input
                                                type="text"
                                                value={editDraft.title}
                                                onChange={(event) =>
                                                    setEditDraft((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  title: event
                                                                      .target
                                                                      .value,
                                                              }
                                                            : prev
                                                    )
                                                }
                                                maxLength={100}
                                                required
                                            />
                                        </label>

                                        <label className="task-overlay__field">
                                            <span className="task-overlay__label">
                                                Описание
                                            </span>
                                            <textarea
                                                value={editDraft.description}
                                                onChange={(event) =>
                                                    setEditDraft((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  description:
                                                                      event
                                                                          .target
                                                                          .value,
                                                              }
                                                            : prev
                                                    )
                                                }
                                                rows={8}
                                            />
                                        </label>

                                        <div className="task-overlay__field">
                                            <span className="task-overlay__label">
                                                Новый статус
                                            </span>
                                            <StatusSelect
                                                value={editDraft.status}
                                                options={nextStatuses}
                                                onChange={(status) =>
                                                    setEditDraft((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  status,
                                                              }
                                                            : prev
                                                    )
                                                }
                                                disabled={
                                                    savingDetail ||
                                                    deletingDetail
                                                }
                                                aria-label="Новый статус задачи"
                                            />
                                            <span className="task-overlay__hint">
                                                Бэкенд принимает только допустимый
                                                следующий статус по процессу.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="task-overlay__footer">
                                        <button
                                            type="button"
                                            className="task-overlay__delete"
                                            onClick={() =>
                                                void handleDeleteDetail()
                                            }
                                            disabled={
                                                savingDetail || deletingDetail
                                            }
                                        >
                                            {deletingDetail
                                                ? "Удаление..."
                                                : "Удалить"}
                                        </button>
                                        <button
                                            type="submit"
                                            className="task-overlay__save"
                                            disabled={
                                                savingDetail ||
                                                deletingDetail ||
                                                !editDraft.title.trim()
                                            }
                                        >
                                            {savingDetail
                                                ? "Сохранение..."
                                                : "Сохранить"}
                                        </button>
                                    </div>
                                </form>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
