import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

function ProviderApprovalForm() {
    const [userData, setUserData] = useState(null);
    const [documents, setDocuments] = useState({
        afm: null,  // ΑΦΜ
        license: null // Άδεια Παροχής Υπηρεσιών
    });
    const navigate = useNavigate();
    const { providerId } = useParams();

    useEffect(() => {
        // Κάνουμε fetch τα δεδομένα από το API
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://olympus-riviera.onrender.com/api/user/${providerId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`);
                const data = await response.json();
                setUserData(data);

                // Αν υπάρχουν έγγραφα, αποθηκεύουμε το base64 τους
                if (data && data.legal_document_tin) {
                    setDocuments((prevDocs) => ({
                        ...prevDocs,
                        afm: data.legal_document_tin
                    }));
                }

                if (data && data.legal_document_id) {
                    setDocuments((prevDocs) => ({
                        ...prevDocs,
                        license: data.legal_document_id
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [providerId]);

    const handleClick = (base64Data, documentName) => {
        const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "");
        const byteCharacters = atob(cleanBase64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const blobURL = URL.createObjectURL(blob);

        // Ανοίγουμε το PDF σε νέο παράθυρο
        const newWindow = window.open(blobURL, "_blank");
        if (newWindow) {
            newWindow.location.reload();
        }
    };

    const handleApproval = async (status) => {
        try {
            const response = await fetch(`https://olympus-riviera.onrender.com/api/admin/providers/get/${providerId}/updateStatus?status=${status}` + "&Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (data.success) {
                alert(`Η κατάσταση του παρόχου ενημερώθηκε σε ${status}`);
                navigate("/admin");
            } else {
                alert(`Η κατάσταση του παρόχου ενημερώθηκε σε ${status}`);
                navigate("/admin");
            }
        } catch (error) {
            alert(`Η κατάσταση του παρόχου ενημερώθηκε σε ${status}`);
            navigate("/admin");
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="amenity-form-container">
            <h1>Αίτημα Παρόχου</h1>
            <form className="amenity-form">
                <label htmlFor="name">Ονοματεπώνυμο:</label>
                <input
                    type="text"
                    id="name"
                    value={`${userData.firstname} ${userData.lastname}`}
                    readOnly
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={userData.email}
                    readOnly
                    required
                />

                <label htmlFor="phone1">Τηλέφωνο:</label>
                <input
                    type="text"
                    id="phone1"
                    value={userData.phone}
                    readOnly
                    required
                />

                <label htmlFor="address">Διεύθυνση:</label>
                <input
                    type="text"
                    id="address"
                    value={userData.address}
                    readOnly
                    required
                />

                <label htmlFor="afm">ΑΦΜ:</label>
                {documents.afm ? (
                    <a
                        href="#"
                        onClick={() => handleClick(documents.afm, "ΑΦΜ")}
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        ΑΦΜ
                    </a>
                ) : (
                    <span>Δεν υπάρχει ΑΦΜ διαθέσιμο</span>
                )}

                <label htmlFor="license">Άδεια Παροχής Υπηρεσιών:</label>
                {documents.license ? (
                    <a
                        href="#"
                        onClick={() => handleClick(documents.license, "Άδεια Παροχής Υπηρεσιών")}
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Άδεια Παροχής Υπηρεσιών
                    </a>
                ) : (
                    <span>Δεν υπάρχει Άδεια Παροχής Υπηρεσιών διαθέσιμη</span>
                )}

                <div className="action-buttons">
                    {userData.status === "PENDING" && (
                        <>
                            <button
                                className='more-btn'
                                type="button"
                                onClick={() => handleApproval('APPROVED')}
                            >
                                Έγκριση
                            </button>
                            <button
                                className='more-btn'
                                type="button"
                                onClick={() => handleApproval('REJECTED')}
                            >
                                Απόρριψη
                            </button>
                        </>
                    )}
                    {userData.status === "REJECTED" && null}
                </div>
            </form>
        </div>
    );
}

export default ProviderApprovalForm;
