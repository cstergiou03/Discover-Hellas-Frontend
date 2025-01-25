import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Context/ProtectedRoute";

// Εισαγωγή των components
import MainPanel from "./Components/MainPanel";
import ExperienceMain from "./Components/ExperienceMain";
import Destination from "./Components/Destination";
import ActivityList from "./Components/ActivityList";
import Activity from "./Components/Activity";
import MapMain from "./Components/MapMain";
import MyCalendar from "./Components/MyCalendar";
import Event from "./Components/Event";
import AmenityMain from "./Components/AmenityMain";
import Amenity from "./Components/Amenity";
import PlanView from "./Components/PlanView";
import UserProfilePanel from "./Components/UserProfilePanel";
import Forbidden from "./Components/Forbidden";

// Εισαγωγή των components του Admin
import AdminMainPanel from "./AdminComponents/AdminMainPanel";
import AmenityView from "./AdminComponents/AmenityView";
import EventView from "./AdminComponents/EventView";
import ReviewView from "./AdminComponents/ReviewView";
import CreateAmenityAdminPanel from "./AdminComponents/CreateAmenityAdminPanel";
import DestinationView from "./AdminComponents/DestinationView";
import DestinationEditView from "./AdminComponents/DestinationEditView";
import ActivityView from "./AdminComponents/ActivityView";
import ActivityEditView from "./AdminComponents/ActivityEditView";
import CategoryView from "./AdminComponents/CategoryView";
import AdminProfilePanel from "./AdminComponents/AdminProfilePanel";
import ProviderApproval from "./AdminComponents/ProviderApproval"

// Εισαγωγή των components του Provider
import ProviderMainPanel from "./ProviderComponents/ProviderMainPanel";
import CreateAmenityPanel from "./ProviderComponents/CreateAmenityPanel";
import EditAmenityPanel from "./ProviderComponents/EditAmenityPanel";
import CreateEventPanel from "./ProviderComponents/CreateEventPanel";
import EditEventPanel from "./ProviderComponents/EditEventPanel";
import ProviderProfilePanel from "./ProviderComponents/ProviderProfilePanel";


function App() {

    return (
        <Router>
            {/* Ο AuthProvider τυλίγεται από τον Router */}
            <AuthProvider>
                <Routes>
                    {/* Ανοικτές διαδρομές */}
                    <Route path="/" element={<MainPanel />} />
                    <Route path="/destination/" element={<ExperienceMain />} />
                    <Route path="/destination/:destinationId" element={<Destination />} />
                    <Route path="/destinations/:categoryId" element={<ExperienceMain />} />
                    <Route path="/activity/" element={<ActivityList />} />
                    <Route path="/activity/:activityId" element={<Activity />} />
                    <Route path="/map" element={<MapMain />} />
                    <Route path="/calendar" element={<MyCalendar />} />
                    <Route path="/event/:eventId" element={<Event />} />
                    <Route path="/amenity" element={<AmenityMain />} />
                    <Route path="/amenity/:amenityId" element={<Amenity />} />
                    <Route path="/planView/:planId" element={<PlanView />} />
                    <Route path="/planView" element={<PlanView />} />
                    <Route path="/profile" element={<UserProfilePanel />} />

                    {/* Διαδρομές για Provider */}
                    <Route
                        path="/provider"
                        element={
                            <ProtectedRoute
                                allowedRoles={["PROVIDER"]}
                                disallowedRoles={["ADMIN","REGISTERED"]}>
                                <ProviderMainPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/create-amenity"
                        element={
                            <ProtectedRoute
                                allowedRoles={["PROVIDER"]}
                                disallowedRoles={["ADMIN","REGISTERED"]}>
                                <CreateAmenityPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/edit-amenity/:amenityId"
                        element={
                            <ProtectedRoute
                                allowedRoles={["PROVIDER"]}
                                disallowedRoles={["ADMIN","REGISTERED"]}>
                                <EditAmenityPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/create-event"
                        element={
                            <ProtectedRoute
                                allowedRoles={["PROVIDER"]}
                                disallowedRoles={["ADMIN","REGISTERED"]}>
                                <CreateEventPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/edit-event/:eventId"
                        element={
                            <ProtectedRoute
                                allowedRoles={["PROVIDER"]}
                                disallowedRoles={["ADMIN","REGISTERED"]}>
                                <EditEventPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/profile"
                        element={
                            <ProtectedRoute
                                allowedRoles={["PROVIDER"]}
                                disallowedRoles={["ADMIN","REGISTERED"]}>
                                <ProviderProfilePanel />
                            </ProtectedRoute>
                        }
                    />

                    {/* Διαδρομές για Admin */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <AdminMainPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/edit-amenity/:amenityId"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <AmenityView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/edit-event/:eventId"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <EventView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/edit-review/:reviewId"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <ReviewView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/create-amenity"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <CreateAmenityAdminPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/create-destination"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <DestinationView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/edit-destination/:destinationID"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <DestinationEditView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/create-activity"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <ActivityView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/edit-activity/:activityId"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <ActivityEditView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/create-category"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <CategoryView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/profile"
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <AdminProfilePanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                        path="/admin/provider-approval/" 
                        element={
                            <ProtectedRoute 
                                allowedRoles={["ADMIN"]}
                                disallowedRoles={["PROVIDER", "REGISTERED"]}>
                                <ProviderApproval />
                            </ProtectedRoute>
                        } 
                        />
                    <Route path="/forbidden" element={<Forbidden />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;


// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import MainPanel from "./Components/MainPanel";
// import Destination from "./Components/Destination";
// import Amenity from "./Components/Amenity";
// import MapMain from "./Components/MapMain";
// import MyCalendar from "./Components/MyCalendar";
// import Event from "./Components/Event";
// import ExperienceMain from "./Components/ExperienceMain";
// import AmenityMain from "./Components/AmenityMain";
// import ProviderMainPanel from "./ProviderComponents/ProviderMainPanel";
// import CreateAmenityPanel from "./ProviderComponents/CreateAmenityPanel";
// import CreateEventPanel from "./ProviderComponents/CreateEventPanel";
// import EditAmenityPanel from "./ProviderComponents/EditAmenityPanel";
// import EditEventPanel from "./ProviderComponents/EditEventPanel";
// import ProviderProfilePanel from "./ProviderComponents/ProviderProfilePanel";
// import UserProfilePanel from "./Components/UserProfilePanel";
// import AdminMainPanel from "./AdminComponents/AdminMainPanel";
// import AmenityView from "./AdminComponents/AmenityView";
// import CreateAmenityAdminPanel from "./AdminComponents/CreateAmenityAdminPanel";
// import EventView from "./AdminComponents/EventView";
// import DestinationView from "./AdminComponents/DestinationView";
// import DestinationEditView from "./AdminComponents/DestinationEditView";
// import ActivityView from "./AdminComponents/ActivityView";
// import ActivityEditView from "./AdminComponents/ActivityEditView";
// import CategoryView from "./AdminComponents/CategoryView";
// import PlanView from "./Components/PlanView";
// import AdminProfilePanel from "./AdminComponents/AdminProfilePanel";
// import ReviewView from "./AdminComponents/ReviewView";
// import Activity from "./Components/Activity"
// import ActivityList from "./Components/ActivityList";

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<MainPanel />} />
//                 <Route path="/destination/" element={<ExperienceMain />} />
//                 <Route path="/destination/:destinationId" element={<Destination />} />
//                 <Route path="/destinations/:categoryId" element={<ExperienceMain />} />
//                 <Route path="/activity/" element={<ActivityList />} />
//                 <Route path="/activity/:activityId" element={<Activity />} />
//                 <Route path="/map" element={<MapMain />} />
//                 <Route path="/calendar" element={<MyCalendar />} />
//                 <Route path="/event/:eventId" element={<Event />} />
//                 <Route path="/amenity" element={<AmenityMain />}/>
//                 <Route path="/amenity/:amenityId" element={<Amenity />}/>
//                 <Route path="/planView/:planId" element={<PlanView />}/>
//                 <Route path="/planView" element={<PlanView />}/>
//                 <Route path="/profile" element={<UserProfilePanel/>} />

//                 <Route path="/provider" element={<ProviderMainPanel/>} />
//                 <Route path="/provider/create-amenity" element={<CreateAmenityPanel/>} />
//                 <Route path="/provider/edit-amenity/:amenityId" element={<EditAmenityPanel/>} />
//                 <Route path="/provider/create-event" element={<CreateEventPanel/>}/>
//                 <Route path="/provider/edit-event/:eventId" element={<EditEventPanel/>} />
//                 <Route path="/provider/profile" element={<ProviderProfilePanel/>} />

//                 <Route path="/admin" element={<AdminMainPanel/>} />
//                 <Route path="/admin/edit-amenity/:amenityId" element={<AmenityView/>} />
//                 <Route path="/admin/edit-event/:eventId" element={<EventView/>} />
//                 <Route path="/admin/edit-review/:reviewId" element={<ReviewView/>} />
//                 <Route path="/admin/create-amenity" element={<CreateAmenityAdminPanel/>} />
//                 <Route path="/admin/create-destination" element={<DestinationView/>} />
//                 <Route path="/admin/edit-destination/:destinationID" element={<DestinationEditView/>} />
//                 <Route path="/admin/create-activity" element={<ActivityView/>} />
//                 <Route path="/admin/edit-activity/:activityId" element={<ActivityEditView/>} />
//                 <Route path="/admin/create-category" element={<CategoryView/>} />
//                 <Route path="/admin/profile" element={<AdminProfilePanel/>} />
//                 <Route path="/admin/provider-approval/:userId" element={<ProviderApproval/>} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;