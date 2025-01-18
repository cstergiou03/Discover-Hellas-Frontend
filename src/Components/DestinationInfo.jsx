import "../Style/destinationInfo.css";
import DestinationDesc from "./DestinationDesc.jsx";
import DestinationWeather from "./DestinationWeather.jsx";

function DestinationInfo({ data }) {
    const photosTable = data.photos
        ? data.photos
              .split("data:image/jpeg;base64,")
              .filter((photo) => photo.trim() !== "")
              .map((photo) =>
                  "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
              )
        : [];

    // Ensure there are at least two photos available
    const firstPhoto = photosTable.length > 0 ? photosTable[1] : null;
    const secondPhoto = photosTable.length > 1 ? photosTable[2] : null;

    const hasPhotos = firstPhoto || secondPhoto;

    return (
        <div className="destination-info-container">
            {/* Check if there are photos or not */}
            {hasPhotos ? (
                <>
                    {/* First Row: Left: Description, Right: First Photo */}
                    <div className="destination-info-row">
                        <div className="destination-info-left-column">
                            <DestinationDesc description={data.description} />
                        </div>
                        <div className="destination-info-right-column">
                            {firstPhoto ? (
                                <img src={firstPhoto} alt="Destination" className="destination-info-photo" />
                            ) : (
                                <div className="destination-info-white-placeholder" />
                            )}
                        </div>
                    </div>
                    
                    {/* Second Row: Left: Second Photo, Right: Weather Component */}
                    <div className="destination-info-row">
                        <div className="destination-info-left-column">
                            {secondPhoto ? (
                                <img src={secondPhoto} alt="Destination" className="destination-info-photo" />
                            ) : (
                                <div className="destination-info-white-placeholder" />
                            )}
                        </div>
                        <div className="destination-info-right-column">
                            <DestinationWeather longitude={data.longitude} latitude={data.latitude} />
                        </div>
                    </div>
                </>
            ) : (
                // No photos available: Display the description and weather side by side
                <div className="destination-info-row no-photos">
                    <div className="destination-info-left-column">
                        <DestinationDesc description={data.description} />
                    </div>
                    <div className="destination-info-right-column">
                        <DestinationWeather longitude={data.longitude} latitude={data.latitude} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DestinationInfo;
