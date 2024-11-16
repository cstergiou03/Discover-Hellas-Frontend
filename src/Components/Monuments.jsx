import "../Style/monuments.css";

function Monuments({ monuments }) {
    return (
        <div className="monuments-container">
            {monuments.map((monument, index) => (
                <div key={index} className="monument-card">
                    <img src={monument.imagePath} alt={monument.name} className="monument-image" />
                    <h3>{monument.name}</h3>
                    <div className="view-monument-button">
                        Read More
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Monuments;
