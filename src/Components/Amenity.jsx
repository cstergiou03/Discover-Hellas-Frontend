import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import DestinationsGallery from "./DestinationGallery";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
};

function Amenity() {
    const { amenityId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapKey, setMapKey] = useState(Date.now());

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://discover-hellas-springboot-backend.onrender.com/api/amenity/get/${amenityId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

                // Επεξεργασία των φωτογραφιών εδώ
                if (data.photos) {
                    const photosTable = data.photos
                        .split("data:image/jpeg;base64,")
                        .filter((photo) => photo.trim() !== "")
                        .map((photo) =>
                            "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                        );

                    data.photosTable = photosTable;
                } else {
                    data.photosTable = [];
                }

                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [amenityId]);

    useEffect(() => {
        if (data) {
            // Change the key only when the data is loaded
            setMapKey(Date.now());
        }
    }, [data]);

    console.log(data);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleDirectionsClick = () => {
        const latitude = data.latitude;
        const longitude = data.longitude;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${latitude},${longitude}`;

        window.open(googleMapsUrl, "_blank");
    };

    const handleApiLoaded = (map, maps) => {
        new maps.Marker({
            position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
            map,
            title: data.name,
        });
    };

    return (
        <div>
            <PageTopDestination data={data} />
            <DestinationInfo data={data} />
            <DestinationsGallery data={data.photosTable} /> {/* Ενημερώνουμε το Gallery */}
            <div className="event-map-and-info">
                {/* <div className="event-map-container">
                    <GoogleMapReact
                        key={mapKey}
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
                </div> */}
                    <div className="event-map-container">
                        {isLoaded ? (
                            <GoogleMap
                                key={mapKey}
                                mapContainerStyle={containerStyle}
                                center={{
                                    lat: parseFloat(data.latitude) || defaultCenter.lat,
                                    lng: parseFloat(data.longitude) || defaultCenter.lng,
                                }}
                                zoom={9}
                            >
                                {data.latitude && data.longitude && (
                                    <MarkerF
                                        position={{
                                            lat: parseFloat(data.latitude),
                                            lng: parseFloat(data.longitude),
                                        }}
                                    />
                                )}
                            </GoogleMap>
                        ) : (
                            <div>Loading map...</div>
                        )}
                    </div>

                    <div className="event-info-right">
                        <div className="event-info-container">
                            <h1>Πληροφορίες</h1>
                            <p><strong>Τηλέφωνο Επικοινωνίας:</strong> {data.phone}</p>
                            <p><strong>Email:</strong> {data.email}</p>
                        </div>
                        <button className="guide-button" onClick={handleDirectionsClick}>
                            Οδηγίες
                        </button>
                    </div>
                </div>
            <Footer />
        </div>
    );
}

export default Amenity;
