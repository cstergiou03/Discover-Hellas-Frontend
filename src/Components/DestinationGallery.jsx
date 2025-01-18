import { useState } from "react";
import "../Style/destinationGallery.css";

function DestinationGallery({ data }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Αποθήκευση της επιλεγμένης φωτογραφίας
    const photosPerPage = 6;

    // Επεξεργασία φωτογραφιών
    const photos = Array.isArray(data)
        ? data // Αν τα δεδομένα είναι ήδη πίνακας, τα χρησιμοποιούμε άμεσα
        : data.photosTable || []; // Χρησιμοποιούμε το photosTable αν έχει προετοιμαστεί

    // Υπολογισμός του εύρους της τρέχουσας σελίδας
    const startIndex = currentPage * photosPerPage;
    const currentPhotos = photos.slice(startIndex, startIndex + photosPerPage);

    // Αριθμός κενών για την τρέχουσα σελίδα (αν οι φωτογραφίες είναι λιγότερες)
    const emptyPhotos = Array(photosPerPage - currentPhotos.length).fill(null);

    // Έλεγχοι για τα κουμπιά περιήγησης
    const hasNextPage = startIndex + photosPerPage < photos.length;
    const hasPreviousPage = currentPage > 0;

    // Μετάβαση στην επόμενη σελίδα
    const nextPage = () => {
        if (hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Μετάβαση στην προηγούμενη σελίδα
    const previousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Ανοίγουμε το modal με την επιλεγμένη φωτογραφία
    const openModal = (photo) => {
        setSelectedPhoto(photo);
    };

    // Κλείνουμε το modal
    const closeModal = () => {
        setSelectedPhoto(null);
    };

    return (
        <div className="gallery-container">
            <div className="photo-grid">
                {currentPhotos.concat(emptyPhotos).map((photo, index) => (
                    <div
                        key={index}
                        className="photo-item"
                        onClick={() => photo && openModal(photo)} // Άνοιγμα modal αν υπάρχει φωτογραφία
                    >
                        {photo ? (
                            <img src={photo} alt={`Photo ${index + 1}`} />
                        ) : (
                            <div className="empty-photo" />
                        )}
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

            {/* Modal για εμφάνιση μεγαλύτερης φωτογραφίας */}
            {selectedPhoto && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedPhoto} alt="Selected" />
                        <button className="close-modal" onClick={closeModal}>
                            &times; {/* Κουμπί κλεισίματος */}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DestinationGallery;
