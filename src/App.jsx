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
import ProviderProfilePanel from "./ProviderComponents/ProviderProfilePanel";
import UserProfilePanel from "./Components/UserProfilePanel";
import AdminMainPanel from "./AdminComponents/AdminMainPanel";
import AmenityView from "./AdminComponents/AmenityView";
import CreateAmenityAdminPanel from "./AdminComponents/CreateAmenityAdminPanel";
import EventView from "./AdminComponents/EventView";
import DestinationView from "./AdminComponents/DestinationView";
import DestinationEditView from "./AdminComponents/DestinationEditView";
import CategoryView from "./AdminComponents/CategoryView";
import PlanView from "./Components/PlanView";
import AdminProfilePanel from "./AdminComponents/AdminProfilePanel";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPanel />} />
                <Route path="/destination/:destinationId" element={<Destination />} />
                <Route path="/map" element={<MapMain />} />
                <Route path="/calendar" element={<MyCalendar />} />
                <Route path="/event/:eventId" element={<Event />} />
                <Route path="/destination/" element={<ExperienceMain />} />
                <Route path="/destinations/:categoryId" element={<ExperienceMain />} />
                <Route path="/amenity" element={<AmenityMain />}/>
                <Route path="/amenity/:amenityId" element={<Amenity />}/>
                <Route path="/planView/:planId" element={<PlanView />}/>
                <Route path="/planView" element={<PlanView />}/>

                <Route path="/register" element={<RegisterPanel/>} />
                <Route path="/profile" element={<UserProfilePanel/>} />

                <Route path="/provider" element={<ProviderMainPanel/>} />
                <Route path="/provider/create-amenity" element={<CreateAmenityPanel/>} />
                <Route path="/provider/edit-amenity/:amenityId" element={<EditAmenityPanel/>} />
                <Route path="/provider/create-event" element={<CreateEventPanel/>}/>
                <Route path="/provider/edit-event/:eventId" element={<EditEventPanel/>} />
                <Route path="/provider/profile" element={<ProviderProfilePanel/>} />

                <Route path="/admin" element={<AdminMainPanel/>} />
                <Route path="/admin/edit-amenity/:amenityId" element={<AmenityView/>} />
                <Route path="/admin/edit-event/:eventId" element={<EventView/>} />
                <Route path="/admin/create-amenity" element={<CreateAmenityAdminPanel/>} />
                <Route path="/admin/create-destination" element={<DestinationView/>} />
                <Route path="/admin/edit-destination/:destinationID" element={<DestinationEditView/>} />
                <Route path="/admin/create-category" element={<CategoryView/>} />
                <Route path="/admin/profile" element={<AdminProfilePanel/>} />
            </Routes>
        </Router>
    );
}

export default App;