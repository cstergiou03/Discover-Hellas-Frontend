import React, { useState } from "react";
import "../Style/experienceRecord.css";

function PlanRecord({ record, entity, onDelete, onShowInstructions, onUpdate, planId }) {
    const [date, setDate] = useState(record.date.split("T")[0]);
    const [hour, setHour] = useState(record.date.split("T")[1]?.split(":")[0] || "00");
    const [minute, setMinute] = useState(record.date.split("T")[1]?.split(":")[1] || "00");

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleHourChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 23) {
            setHour(value);
        }
    };

    const handleMinuteChange = (e) => {
        const value = e.target.value;
        if (value === "00" || value === "15" || value === "30" || value === "45") {
            setMinute(value);
        }
    };

    // Συνάρτηση για το PUT request διαγραφής
    const handleDelete = () => {
        onDelete(record.entity_id); // Κλήση του handleDelete που περνάει από το PlanView
    };   
    
    const handleUpdate = () => {
        const updatedDate = `${date}T${hour}:${minute}:00`;
        const updatedEntity = {
            entity_id: record.entity_id,
            date: updatedDate,
        };
        onUpdate(updatedEntity); // Κλήση του handleUpdate που περνάει από το PlanView
    };                  

    return (
        <div className="experience-record">
            <div className="record-column">
                {entity ? entity.name : "Unknown Entity"}
            </div>

            <div className="record-column">
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="date-input"
                />
                <input
                    type="number"
                    value={hour}
                    onChange={handleHourChange}
                    min="00"
                    max="23"
                    step="1"
                    className="time-input"
                    placeholder="HH"
                />
                <select
                    value={minute}
                    onChange={handleMinuteChange}
                    className="minute-input"
                >
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                </select>
                <button onClick={handleUpdate} className="more-btn">
                    OK
                </button>
            </div>

            <button
                onClick={() => onShowInstructions(record.entity_id)}
                className="more-btn"
            >
                Οδηγίες
            </button>

            <button
                onClick={() => handleDelete(record.entity_id)}
                className="more-btn"
            >
                Διαγραφή
            </button>
        </div>
    );
}

export default PlanRecord;
