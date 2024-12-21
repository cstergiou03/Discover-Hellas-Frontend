import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPanel from "./Components/MainPanel";
import Destination from "./Components/Destination";
import Amenity from "./Components/Amenity";
import MapMain from "./Components/MapMain";
import MyCalendar from "./Components/MyCalendar";
import Event from "./Components/Event";
import ExperienceMain from "./Components/ExperienceMain";
import RegisterPanel from "./Components/RegisterPanel";
import AmenityMain from "./Components/AmenityMain";
import ProviderMainPanel from "./ProviderComponents/ProviderMainPanel";
import CreateAmenityPanel from "./ProviderComponents/CreateAmenityPanel";
import CreateEventPanel from "./ProviderComponents/CreateEventPanel";
import EditAmenityPanel from "./ProviderComponents/EditAmenityPanel";
import EditEventPanel from "./ProviderComponents/EditEventPanel";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPanel />} />
                <Route path="/destination/:destinationId" element={<Destination />} />
                <Route path="/map" element={<MapMain />} />
                <Route path="/calendar" element={<MyCalendar />} />
                <Route path="/event/:eventId" element={<Event />} />
                <Route path="/experience/" element={<ExperienceMain/>}/>
                <Route path="/experience/:categoryId" element={<ExperienceMain/>}/>
                <Route path="/amenity" element={<AmenityMain/>}/>
                <Route path="/amenity/:amenityId" element={<Amenity/>}/>

                <Route path="/register" element={<RegisterPanel/>} />
                <Route path="/provider" element={<ProviderMainPanel/>} />
                <Route path="/provider/create-amenity" element={<CreateAmenityPanel/>} />
                <Route path="/provider/edit-amenity/:amenityId" element={<EditAmenityPanel/>} />
                <Route path="/provider/create-event" element={<CreateEventPanel/>}/>
                <Route path="/provider/edit-event/:eventId" element={<EditEventPanel/>} />
            </Routes>
        </Router>
    );
}

export default App;