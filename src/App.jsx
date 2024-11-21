import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPanel from "./Components/MainPanel";
import Destination from "./Components/Destination";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPanel />} />
                <Route path="/destination/:destinationId" element={<Destination />} />
            </Routes>
        </Router>
    );
}

export default App;
