import "../Style/stat.css";
import { useState, useEffect, useRef } from "react";

function Stat({ number, type }) {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [isVisible, setIsVisible] = useState(false); // Ελέγχει αν το στοιχείο είναι ορατό
    const statRef = useRef(null); // Αναφορά στο DOM στοιχείο

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Διακοπή παρακολούθησης μετά την ενεργοποίηση
                }
            },
            { threshold: 0.5 } // Το 50% του στοιχείου πρέπει να είναι ορατό
        );

        if (statRef.current) observer.observe(statRef.current);

        return () => observer.disconnect(); // Καθαρισμός παρατηρητή
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = parseInt(number.replace(/[.,]/g, ""), 10); // Μετατροπή του number σε ακέραιο
        if (start === end) return;

        const increment = Math.ceil(end / 100); // Το βήμα της αύξησης
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setCurrentNumber(start.toLocaleString()); // Επιστροφή με διαχωριστικά
        }, 20); // Κάθε 20ms

        return () => clearInterval(timer); // Καθαρισμός του interval
    }, [isVisible, number]);

    return (
        <div className="statistic-container" ref={statRef}>
            <h2 className="statNumber">{currentNumber}</h2>
            <h2 className="statType">{type}</h2>
        </div>
    );
}

export default Stat;
