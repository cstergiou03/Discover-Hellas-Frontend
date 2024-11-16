import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPanel from "./Components/MainPanel";
import CityPanel from "./Components/CityPanel";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPanel />} />
                <Route path="/city/:id" element={<CityPanel />} />
            </Routes>
        </Router>
    );
}

export default App;
