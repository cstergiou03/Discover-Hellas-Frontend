import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import DestinationsGallery from "./DestinationGallery"; // Νέο Component

function Destination() {
    const { destinationId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URLs για τις φωτογραφίες
    const photosString =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://i.guim.co.uk/img/media/6b1583be26c8c0b639d7a3a59b375ceda6c430cf/1343_143_1912_2870/master/1912.jpg?width=700&quality=85&auto=format&fit=max&s=435d8878ec02fed104cdefe090aae8af," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://i.guim.co.uk/img/media/6b1583be26c8c0b639d7a3a59b375ceda6c430cf/1343_143_1912_2870/master/1912.jpg?width=700&quality=85&auto=format&fit=max&s=435d8878ec02fed104cdefe090aae8af," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://i.guim.co.uk/img/media/6b1583be26c8c0b639d7a3a59b375ceda6c430cf/1343_143_1912_2870/master/1912.jpg?width=700&quality=85&auto=format&fit=max&s=435d8878ec02fed104cdefe090aae8af," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://i.guim.co.uk/img/media/6b1583be26c8c0b639d7a3a59b375ceda6c430cf/1343_143_1912_2870/master/1912.jpg?width=700&quality=85&auto=format&fit=max&s=435d8878ec02fed104cdefe090aae8af," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg," +
    "https://i.guim.co.uk/img/media/6b1583be26c8c0b639d7a3a59b375ceda6c430cf/1343_143_1912_2870/master/1912.jpg?width=700&quality=85&auto=format&fit=max&s=435d8878ec02fed104cdefe090aae8af";


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
            <DestinationsGallery photos={photos} />
            <Footer />
        </div>
    );
}

export default Destination;
