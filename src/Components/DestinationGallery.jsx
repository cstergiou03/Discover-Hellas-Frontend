import React, { useState } from "react";
import "../Style/destinationGallery.css";

function DestinationGallery({ photos }){
    const photosPerPage = 6; // Αριθμός φωτογραφιών ανά σελίδα
    const [currentPage, setCurrentPage] = useState(0);

    // Υπολογισμός των φωτογραφιών που θα εμφανιστούν
    const startIndex = currentPage * photosPerPage;
    const currentPhotos = photos.slice(startIndex, startIndex + photosPerPage);

    const hasNextPage = startIndex + photosPerPage < photos.length;
    const hasPreviousPage = currentPage > 0; // Έλεγχος για να δούμε αν υπάρχει προηγούμενη σελίδα

    const nextPage = () => {
        if (hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="gallery-container">
            <div className="photo-grid">
                {currentPhotos.map((photo, index) => (
                    <div key={index} className="photo-item">
                        <img src={photo.src} alt={`Photo ${index + 1}`} />
                    </div>
                ))}
            </div>
            <div className="navigation-buttons">
                <button
                    className="load-more-button"
                    onClick={previousPage}
                    disabled={!hasPreviousPage}
                >
                    Previous
                </button>
                <button
                    className="load-more-button"
                    onClick={nextPage}
                    disabled={!hasNextPage}
                >
                    Load More
                </button>
            </div>
        </div>
    );
};

export default DestinationGallery;
