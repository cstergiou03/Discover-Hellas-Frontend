import "../Style/pageTopDestination.css";
import Header from "./Header.jsx";

function PageTopDestination({ data }) {

    console.log(data);
    return (
        <div className="main-container">
            <Header />
            <img src={data.photos} className="photo" alt="destination" /> {/* Χρησιμοποιήστε το photo prop */}
            <div className="title-container">
                <h2 className="title">{data.name}</h2>
            </div>
        </div>
    );
}

export default PageTopDestination;
