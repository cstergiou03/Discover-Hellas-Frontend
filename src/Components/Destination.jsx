import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import DestinationsGallery from "./DestinationGallery";
import GoogleMapReact from 'google-map-react';

function Destination() {
    const { destinationId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://olympus-riviera.onrender.com/api/destination/${destinationId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [destinationId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const photosTable = data.photos
    ? data.photos
          .split("data:image/jpeg;base64,")
          .filter((photo) => photo.trim() !== "")
          .map((photo) =>
              "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
          ) // Αφαιρούμε οποιοδήποτε κόμμα στο τέλος
    : [];

    const handleDirectionsClick = () => {
        const latitude = data.latitude;
        const longitude = data.longitude;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${latitude},${longitude}`;

        window.open(googleMapsUrl, "_blank");
    };

    const handleApiLoaded = (map, maps) => {
        new maps.Marker({
            position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }, // Μετατροπή σε float για το Google Maps
            map,
            title: data.name,
        });
    };

    return (
        <div>
            <PageTopDestination data={data} />
            <DestinationInfo data={data} />
            <DestinationsGallery data={photosTable} />
            <div className="event-map-and-info">
                <div className="event-map-container">
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                        }}
                        defaultZoom={10}
                        defaultCenter={{
                            lat: parseFloat(data.latitude),
                            lng: parseFloat(data.longitude),
                        }}
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        yesIWantToUseGoogleMapApiInternals
                    />
                </div>

                <div className="event-info-right">
                    <button className="guide-button" onClick={handleDirectionsClick}>
                        Οδηγίες
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Destination;
