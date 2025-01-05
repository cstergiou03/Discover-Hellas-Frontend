import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import "../Style/topPage.css";
import seasonsData from "../assets/season.json";

function TopPage() {
    const [currentImage, setCurrentImage] = useState(seasonsData.seasons[0].imagePath);
    const [currentText, setCurrentText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const typingTimeoutRef = useRef(null);

    const getCurrentSeason = () => {
        const currentMonth = new Date().getMonth()
        
        const seasonsMap = [
            { name: "Χειμώνας", months: [11, 0, 1] },
            { name: "Άνοιξη", months: [2, 3, 4] },
            { name: "Καλοκαίρι", months: [5, 6, 7] },
            { name: "Φθινόπωρο", months: [8, 9, 10] }
        ];
        const season = seasonsMap.find((season) => season.months.includes(currentMonth));
        
        return season ? season.name : "Άνοιξη"
    };

    useEffect(() => {
        const currentSeasonName = getCurrentSeason();
        const season = seasonsData.seasons.find((s) => s.name === currentSeasonName);

        if (season) {
            setCurrentImage(season.imagePath);
            startTyping(season.text);
        }
    }, []);

    const handleSeasonClick = (seasonName) => {
        const season = seasonsData.seasons.find((s) => s.name === seasonName);

        if (season) {
            setCurrentImage(season.imagePath);
            startTyping(season.text);
        }
    };

    const startTyping = (text) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        setIsTyping(true);
        setCurrentText("");
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                setCurrentText((prev) => prev + text.charAt(i));
                i++;
                typingTimeoutRef.current = setTimeout(typeWriter, 40);
            } else {
                setIsTyping(false);
            }
        };

        typeWriter();
    };

    return (
        <div className="main-container">
            <Header />
            <img src={currentImage} className="photo" alt="season" />
            <div className="description-container">
                <h2 className="description-title">Info</h2>
                <p className={isTyping ? "typing" : ""}>{currentText}</p>
            </div>
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
        </div>
    );
}

export default TopPage;
