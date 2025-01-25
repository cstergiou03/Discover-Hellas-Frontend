import React from 'react';
import "../Style/destinationCards.css";

const destinations = [
    {
        destination_id: "dest_aa9f857e",
        name: "This is a river 4",
        photos: "https://www.americanrivers.org/wp-content/uploads/2022/12/Gallatin-River-MT-S.-Bosse.jpeg",
    },
    {
        destination_id: "dest_bb1g968f",
        name: "Mountain View",
        photos: "https://www.americanrivers.org/wp-content/uploads/2022/12/Gallatin-River-MT-S.-Bosse.jpeg",
    },
    {
        destination_id: "dest_cc2h079g",
        name: "City Skyline",
        photos: "https://www.americanrivers.org/wp-content/uploads/2022/12/Gallatin-River-MT-S.-Bosse.jpeg",
    },
];

function DestinationCards() {
    return (
        <div>
            {/* Τίτλος */}
            <h1 className="destination-title">Προτάσεις Προορισμών</h1>

            {/* Κάρτες Προορισμών */}
            <div className="destination-cards-container">
                {destinations.map((destination) => (
                    <div key={destination.destination_id} className="destination-card">
                        <img
                            src={destination.photos || "/placeholder.svg?height=200&width=300"}
                            alt={destination.name}
                            className="destination-image"
                        />
                        <h2 className="destination-name">{destination.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DestinationCards;
