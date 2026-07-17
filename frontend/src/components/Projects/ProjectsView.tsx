"use client";

import Link from "next/link";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "@/lib/api/Projects/Projects";
import type { Project } from "@/lib/types/models";
import { tasksRoute } from "@/lib/utils/consts";
import { getProjectBackground } from "@/lib/utils/projectBackground";
import Loader from "@/components/UI/Loader/Loader";
import "@/styles/ProjectsPage.css";

type ModalMode = "create" | "edit" | null;

export default function ProjectsView() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [titleDraft, setTitleDraft] = useState("");

    const loadProjects = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось загрузить проекты"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    function openCreateModal() {
        setEditingProject(null);
        setTitleDraft("");
        setModalMode("create");
    }

    function openEditModal(project: Project, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        setEditingProject(project);
        setTitleDraft(project.title);
        setModalMode("edit");
    }

    function closeModal() {
        setModalMode(null);
        setEditingProject(null);
        setTitleDraft("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const title = titleDraft.trim();
        if (!title || saving) return;

        setSaving(true);
        setError("");
        try {
            if (modalMode === "create") {
                const project = await createProject(title);
                setProjects((prev) => [project, ...prev]);
            } else if (modalMode === "edit" && editingProject) {
                await updateProject(editingProject.id, title);
                setProjects((prev) =>
                    prev.map((item) =>
                        item.id === editingProject.id
                            ? { ...item, title }
                            : item
                    )
                );
            }
            setModalMode(null);
            setEditingProject(null);
            setTitleDraft("");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Не удалось сохранить проект"
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(project: Project, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const confirmed = window.confirm(
            `Удалить проект «${project.title}»? Все задачи проекта также будут удалены.`
        );
        if (!confirmed) return;

        setError("");
        try {
            await deleteProject(project.id);
            setProjects((prev) => prev.filter((item) => item.id !== project.id));
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Не удалось удалить проект"
            );
        }
    }

    return (
        <section className="projects-page">
            <div className="container">
                {loading ? (
                    <div className="projects-page__loader">
                        <Loader label="Загружаем проекты..." />
                    </div>
                ) : (
                    <>
                        <div className="projects-page__header">
                            <div>
                                <p className="projects-page__eyebrow">Workspace</p>
                                <h1 className="projects-page__title">
                                    Мои проекты
                                </h1>
                            </div>
                            {projects.length > 0 ? (
                                <button
                                    type="button"
                                    className="projects-page__create"
                                    onClick={openCreateModal}
                                >
                                    Создать проект
                                </button>
                            ) : null}
                        </div>

                        {error ? (
                            <p className="projects-page__error">{error}</p>
                        ) : null}

                        {projects.length === 0 ? (
                            <div className="projects-page__empty">
                                <h2 className="projects-page__empty-title">
                                    У вас пока нет проектов
                                </h2>
                                <p className="projects-page__empty-text">
                                    Создайте первый проект, чтобы начать работу с
                                    задачами.
                                </p>
                                <button
                                    type="button"
                                    className="projects-page__create"
                                    onClick={openCreateModal}
                                >
                                    Создать первый проект
                                </button>
                            </div>
                        ) : (
                            <div className="projects-grid">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="project-card"
                                        style={{
                                            background: getProjectBackground(
                                                project.id
                                            ),
                                        }}
                                    >
                                        <div className="project-card__actions">
                                            <button
                                                type="button"
                                                className="project-card__action"
                                                onClick={(event) =>
                                                    openEditModal(project, event)
                                                }
                                                aria-label="Изменить название"
                                                title="Изменить название"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                type="button"
                                                className="project-card__action project-card__action--danger"
                                                onClick={(event) =>
                                                    void handleDelete(
                                                        project,
                                                        event
                                                    )
                                                }
                                                aria-label="Удалить проект"
                                                title="Удалить проект"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <Link
                                            href={tasksRoute(project.id)}
                                            className="project-card__link"
                                        >
                                            <h2 className="project-card__title">
                                                {project.title}
                                            </h2>
                                        </Link>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="project-card project-card--create"
                                    onClick={openCreateModal}
                                >
                                    <span>+ Новый проект</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalMode ? (
                <div
                    className="project-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                    onClick={closeModal}
                >
                    <form
                        className="project-modal__panel"
                        onClick={(event) => event.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <h2
                            id="project-modal-title"
                            className="project-modal__title"
                        >
                            {modalMode === "create"
                                ? "Новый проект"
                                : "Изменить проект"}
                        </h2>
                        <p className="project-modal__text">
                            {modalMode === "create"
                                ? "Укажите название — оно будет видно на карточке workspace."
                                : "Введите новое название проекта."}
                        </p>
                        <input
                            className="project-modal__input"
                            type="text"
                            name="title"
                            value={titleDraft}
                            onChange={(event) =>
                                setTitleDraft(event.target.value)
                            }
                            placeholder="Название проекта"
                            maxLength={100}
                            required
                            autoFocus
                        />
                        <div className="project-modal__actions">
                            <button
                                type="button"
                                className="project-modal__cancel"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="project-modal__submit"
                                disabled={saving || !titleDraft.trim()}
                            >
                                {saving
                                    ? "Сохранение..."
                                    : modalMode === "create"
                                      ? "Создать"
                                      : "Сохранить"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </section>
    );
}
