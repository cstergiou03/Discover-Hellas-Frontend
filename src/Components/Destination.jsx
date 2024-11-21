import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Destination() {
    const { destinationId } = useParams(); // Παίρνει το destinationId από το URL
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://olympus-riviera.onrender.com/api/admin/destination/${destinationId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setData(data); // Αποθηκεύει τα δεδομένα
            } catch (err) {
                setError(err.message); // Αποθηκεύει το σφάλμα, αν υπάρξει
            } finally {
                setLoading(false); // Ορίζει ότι ολοκληρώθηκε το φόρτωμα
            }
        };

        fetchData();
    }, [destinationId]); // Εξαρτάται από το destinationId
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{data.name}</h1>
            <img src={data.photos} alt={data.name} style={{ width: "100%" }} />
            <p>{data.description}</p>
            <p>
                <strong>Location:</strong> {data.latitude}, {data.longitude}
            </p>
            <a href={data.link_360_view} target="_blank" rel="noopener noreferrer">
                View in 360°
            </a>
        </div>
    );
}

export default Destination;
