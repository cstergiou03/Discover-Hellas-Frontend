import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/experienceRecord.css";

function Records({ data }) {
    const navigate = useNavigate();

    const googleMapsLink = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
    
    const photosTable = data.photos
    ? data.photos
          .split("data:image/jpeg;base64,")
          .filter((photo) => photo.trim() !== "")
          .map((photo) =>
              "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
          )
    : [];


    
    return (
        <div className="experience-record">
            <div className="record-column">{data.name}</div>
            <div className="record-column">{data.description}</div>
            <div className="record-column">
                {photosTable.length > 0 ? (
                    <img
                        src={photosTable[1]}
                        className="record-image"
                    />
                ) : null}
            </div>
            <div className="record-column">
                <button
                    onClick={() => navigate(`/admin/edit-destination/${data.destination_id}`)}
                    className="more-btn"
                >
                    Περισσότερα
                </button>
            </div>
        </div>
    );
}

export default Records;
