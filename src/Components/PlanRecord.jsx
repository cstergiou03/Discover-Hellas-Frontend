import React, { useState } from "react";
import "../Style/experienceRecord.css";

function PlanRecord({ record, entity, onDelete, onShowInstructions, onUpdate, planId }) {
    const [date] = useState(record.date.split("T")[0]);
    const [hour] = useState(record.date.split("T")[1]?.split(":")[0] || "00");
    const [minute] = useState(record.date.split("T")[1]?.split(":")[1] || "00");

    // Συνάρτηση για το DELETE request
    const handleDelete = () => {
        onDelete(record.entity_id); // Κλήση του handleDelete που περνάει από το PlanView
    };

    return (
        <div className="experience-record">
            <div className="record-column">
                {entity ? entity.name : "Unknown Entity"}
            </div>

            <div className="record-column">
                <span className="date-display">{date}</span>
                <span className="time-display">{`${hour}:${minute}`}</span>
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
