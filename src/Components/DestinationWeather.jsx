import "../Style/destinationWeather.css"
import { getWeatherIcon, getWeatherDescription } from '../assets/weatherUtils';
import { useState, useEffect } from "react";

function DestinationWeather({ longitude, latitude }) {
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const url = "https://api.open-meteo.com/v1/forecast";
            const params = {
                latitude: latitude,
                longitude: longitude,
                hourly: ["temperature_2m", "weather_code"],
                daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
                timezone: "auto",
            };

            try {
                const response = await fetch(`${url}?latitude=${params.latitude}&longitude=${params.longitude}&hourly=${params.hourly.join(",")}&daily=${params.daily.join(",")}&timezone=${params.timezone}`);
                const data = await response.json();
                setData(data);  // Ενημερώνουμε το state με τα δεδομένα
                setLoading(false);  // Ολοκληρώθηκε η φόρτωση
            } catch (err) {
                setError("Failed to fetch weather data");  // Αν υπάρχει σφάλμα
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);  // Η χρήση του empty array [ ] σημαίνει ότι το effect θα τρέξει μόνο μια φορά, κατά την πρώτη φόρτωση του component

    if (loading) return <div>Loading...</div>;  // Εμφάνιση loading ενώ φορτώνουν τα δεδομένα
    if (error) return <div>{error}</div>;  // Εμφάνιση error αν αποτύχει το API call

    const today = new Date().toISOString().split('T')[0];
    const todayIndex = data.daily.time.indexOf(today);
    const nextDays = data.daily.time.slice(todayIndex + 1, todayIndex + 4);

    return (
        <div className="weather-widget">
            <h1>Weather Forecast</h1>
            <div className="forecast-container">
                <TodayForecast data={data} todayIndex={todayIndex} />
                <div className="next-days-forecast">
                    {nextDays.map((day, index) => (
                        <DayForecast
                            key={day}
                            data={data}
                            dayIndex={todayIndex + index + 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TodayForecast = ({ data, todayIndex }) => {
  const weatherIcon = getWeatherIcon(data.daily.weather_code[todayIndex]);
  const weatherDescription = getWeatherDescription(data.daily.weather_code[todayIndex]);

  return (
    <div className="today-forecast">
      <h2>Today</h2>
      <div className="weather-icon">{weatherIcon}</div>
      <p className="weather-description">{weatherDescription}</p>
      <p className="temperature">
        {Math.round(data.daily.temperature_2m_max[todayIndex])}
        {data.daily_units.temperature_2m_max}
      </p>
      <p className="low-temperature">
        Low: {Math.round(data.daily.temperature_2m_min[todayIndex])}
        {data.daily_units.temperature_2m_min}
      </p>
    </div>
  );
};

const DayForecast = ({ data, dayIndex }) => {
  const weatherIcon = getWeatherIcon(data.daily.weather_code[dayIndex]);
  const date = new Date(data.daily.time[dayIndex]);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="day-forecast">
      <p className="day-name">{dayName}</p>
      <div className="weather-icon">{weatherIcon}</div>
      <p className="temperature">
        {Math.round(data.daily.temperature_2m_max[dayIndex])}
        {data.daily_units.temperature_2m_max}
      </p>
      <p className="low-temperature">
        {Math.round(data.daily.temperature_2m_min[dayIndex])}
        {data.daily_units.temperature_2m_min}
      </p>
    </div>
  );
};

export default DestinationWeather;