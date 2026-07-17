import TasksView from "@/components/Tasks/TasksView";

type TasksPageProps = {
    params: Promise<{ project_id: string }>;
};

export default async function TasksPage({ params }: TasksPageProps) {
    const { project_id } = await params;
    return <TasksView projectId={project_id} />;
}
