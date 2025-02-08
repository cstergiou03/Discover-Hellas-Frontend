import { useState, useEffect } from "react";
import Header from "./Header";
import "../Style/topPage.css";
import seasonsData from "../assets/season.json";
import winter from "../assets/winter.png";
import spring from "../assets/spring.jpg";
import summer from "../assets/summer.jpg";
import fall from "../assets/fall.jpg";

function TopPage() {
    const [currentImage, setCurrentImage] = useState(winter); // Default image
    const [currentText, setCurrentText] = useState(""); // Default text
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 970); // Check if mobile
    const [fadeKey, setFadeKey] = useState(0); // Key to trigger fade-in animation

    const imagesMap = {
        Χειμώνας: winter,
        Άνοιξη: spring,
        Καλοκαίρι: summer,
        Φθινόπωρο: fall,
    };

    const getCurrentSeason = () => {
        const currentMonth = new Date().getMonth();
        const seasonsMap = [
            { name: "Χειμώνας", months: [11, 0, 1] },
            { name: "Άνοιξη", months: [2, 3, 4] },
            { name: "Καλοκαίρι", months: [5, 6, 7] },
            { name: "Φθινόπωρο", months: [8, 9, 10] },
        ];
        const season = seasonsMap.find((season) => season.months.includes(currentMonth));
        return season ? season.name : "Άνοιξη";
    };

    useEffect(() => {
        const initializeSeason = () => {
            const currentSeasonName = getCurrentSeason();
            const season = seasonsData?.seasons?.find((s) => s.name === currentSeasonName);

            if (season) {
                setCurrentImage(imagesMap[currentSeasonName]);
                setCurrentText(season.text || "Season text not available.");
                setFadeKey((prev) => prev + 1); // Trigger fade-in
            } else {
                setCurrentText("Unable to determine the current season.");
            }
        };

        initializeSeason();

        // Handle screen resizing
        const checkMobile = () => setIsMobile(window.innerWidth <= 970);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []); // Only run once on component mount

    const handleSeasonClick = (seasonName) => {
        const season = seasonsData.seasons.find((s) => s.name === seasonName);
        if (season) {
            setCurrentImage(imagesMap[seasonName]);
            setCurrentText(season.text);
            setFadeKey((prev) => prev + 1); // Trigger fade-in
        }
    };

    return (
        <div className="main-container">
            <Header />
            <img src={currentImage} className="photo" alt="season" />
            <div className="description-container">
                <h2 className="description-title">Info</h2>
                {/* Add a dynamic key to force reapplication of the fade-in animation */}
                <p key={fadeKey} className="fade-in">{currentText}</p>
            </div>
            {!isMobile && (
                <div className="season-container">
                    {seasonsData.seasons.map((season) => (
                        <p
                            key={season.name}
                            className="season-text"
                            onClick={() => handleSeasonClick(season.name)}
                        >
                            {season.name}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TopPage;
