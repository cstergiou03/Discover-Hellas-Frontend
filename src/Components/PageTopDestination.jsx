import "../Style/pageTopDestination.css";
import Header from "./Header.jsx";

function PageTopDestination({ data }) {
    const photosTable = (() => {
        if (!data.photos) return [];

        if (data.photos.includes("data:image/jpeg;base64,")) {
            return data.photos
                .split("data:image/jpeg;base64,")
                .filter((photo) => photo.trim() !== "")
                .map((photo) =>
                    "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                );
        } else {
            return data.photos.split(",").map((photo) => photo.trim());
        }
    })();

    return (
        <div className="main-container">
            <Header />
            {photosTable.length > 0 ? (
                <img src={photosTable[0]} className="photo" alt="destination" />
            ) : (
                <div className="no-photo">No photo available</div>
            )}
            <div className="title-container">
                <h2 className="title">{data.name}</h2>
            </div>
        </div>
    );
}

export default PageTopDestination;
