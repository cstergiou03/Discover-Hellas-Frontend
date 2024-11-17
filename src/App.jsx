import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPanel from "./Components/MainPanel";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPanel />} />
            </Routes>
        </Router>
    );
}

export default App;
