import "../Style/statSection.css";
import Stat from "./Stat";
import stats from "../assets/stats.json"; // Εισάγουμε το JSON αρχείο

function StatSection() {
    return (
        <div className="stats-container">
            {stats.map((stat, index) => (
                <Stat key={index} number={stat.number} type={stat.type} />
            ))}
        </div>
    );
}

export default StatSection;
