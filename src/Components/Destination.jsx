import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import PhotoAlbum from "react-photo-album";

function Destination() {
    const { destinationId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URLs για τις φωτογραφίες
    const photosString =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg,https://i.natgeofe.com/k/c41b4f59-181c-4747-ad20-ef69987c8d59/eiffel-tower-night_2x3.jpg,https://media.architecturaldigest.com/photos/66a951edce728792a48166e6/1:1/w_5304,h_5304,c_limit/GettyImages-955441104.jpg,https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg,https://hips.hearstapps.com/hmg-prod/images/paris-skyline-with-eiffel-tower-on-a-sunny-day-wide-royalty-free-image-1722542465.jpg,https://images.skyscrapercenter.com/building/eiffeltower_overall2_mg.jpg,https://hips.hearstapps.com/hmg-prod/images/the-eiffel-tower-in-paris-royalty-free-image-1722454333.jpg?crop=0.67406xw:1xh;center,top&resize=640:*";

    // Μετατροπή string σε array αντικειμένων
    const photos = photosString.split(",").map((url) => ({
        src: url.trim(),
        width: 800,
        height: 600,
    }));
    

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

    return (
        <div>
            <PageTopDestination data={data} />
            <DestinationInfo data={data} />
            <div style={{ margin: "40px 0" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Φωτογραφίες</h2>
                <PhotoAlbum photos={photos} columns={4} />
            </div>
            <Footer />
        </div>
    );
}

export default Destination;
