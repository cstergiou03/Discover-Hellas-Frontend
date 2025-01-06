import "../Style/statSection.css";
import Stat from "./Stat";
import stats from "../assets/stats.json"; // Εισάγουμε το JSON αρχείο

function StatSection() {
    return (
        <div className="stats-container">
            {stats.map((stat, index) => (
                <div className="stat" key={index}> {/* Ενσωματώνουμε την κλάση "stat" */}
                    <Stat number={stat.number} type={stat.type} />
                </div>
            ))}
        </div>
    );
}

export default StatSection;
