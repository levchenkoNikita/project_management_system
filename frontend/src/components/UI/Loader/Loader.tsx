import "@/styles/Loader.css";

type LoaderProps = {
    label?: string;
};

export default function Loader({ label = "Загрузка..." }: LoaderProps) {
    return (
        <div className="loader" role="status" aria-live="polite" aria-label={label}>
            <div className="loader__spinner" />
            <span className="loader__label">{label}</span>
        </div>
    );
}
