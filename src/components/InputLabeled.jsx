import "./InputLabeled.css";

export default function InputLabeled({
    inputId,
    type,
    placeholder,
    autoComplete,
    label,
    ref,
}) {
    return (
        <div className="input-labeled">
            <label htmlFor={inputId}>{label}</label>
            <input
                id={inputId}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                ref={ref}
            />
        </div>
    );
}
