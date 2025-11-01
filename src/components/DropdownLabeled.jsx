import "./DropdownLabeled.css";

export default function DropdownLabeled({ dropdownId, label, choices, ref }) {
    return (
        <div className="dropdown-labeled">
            <label htmlFor={dropdownId}>{label}</label>
            <div>
                <select id={dropdownId} ref={ref}>
                    {choices.map((value, index) => (
                        <option
                            key={`keyOption${dropdownId}${index}`}
                            value={value[0]}
                        >
                            {value[1]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
