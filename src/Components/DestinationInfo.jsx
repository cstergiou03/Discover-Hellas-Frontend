import "../Style/destinationInfo.css"
import DestinationDesc from "./DestinationDesc.jsx";
import DestinationWeather from "./DestinationWeather.jsx";

function DestinationInfo({ data }) {

    return (
        <div className="destinationInfo-container">
            <DestinationWeather data={data}></DestinationWeather>
            <DestinationDesc data={data}></DestinationDesc>
        </div>
    );
}

export default DestinationInfo;