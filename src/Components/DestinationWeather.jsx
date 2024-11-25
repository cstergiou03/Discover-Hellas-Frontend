import "../Style/destinationWeather.css"
import { useState, useEffect } from "react";
import { FaSun, FaCloud, FaCloudRain, FaCloudShowersHeavy, FaRegSnowflake } from 'react-icons/fa';

function DestinationWeather({ data }){

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWeatherData = async () => {
        try {
            const url = "https://api.open-meteo.com/v1/forecast";
            const params = {
                latitude: data.latitude,
                longitude: data.longitude,
                hourly: ["temperature_2m", "weather_code"],
                daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
                timezone: "auto",
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${url}?${queryString}`);
            const data2 = await response.json();
            setWeatherData(data2);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    if (loading) {
        return <div className="weather-container">Loading weather data...</div>;
    }

    if (!weatherData || !weatherData.daily) {
        return <div className="weather-container">Failed to load weather data.</div>;
    }

    const { daily } = weatherData;

    // Περιορισμός στις πρώτες 6 ημέρες
    const limitedDailyData = daily.time.slice(0, 6);

    const getWeatherIcon = (code) => {
        switch (code) {
            case 0:
                return <FaSun />;
            case 1:
            case 2:
                return <FaCloud />;
            case 3:
                return <FaCloudRain />;
            case 45:
            case 48:
                return <FaCloudShowersHeavy />;
            case 51:
            case 53:
            case 55:
                return <FaCloudRain />;
            default:
                return <FaRegSnowflake />;
        }
    };

    return(
        <div className="destinationWeather-container">
            <h2 className="weather-title">{data.name}</h2>
            <div className="weather-summary">
                {limitedDailyData.length > 0 ? limitedDailyData.map((date, index) => (
                    <div key={index} className="weather-day">
                        <h3>{new Date(date).toLocaleDateString("el-GR", { weekday: "long" })}</h3>
                        <p>Μέγιστη: {daily.temperature_2m_max ? daily.temperature_2m_max[index] : "N/A"}°C</p>
                        <p>Ελάχιστη: {daily.temperature_2m_min ? daily.temperature_2m_min[index] : "N/A"}°C</p>
                        <p>Κωδικός Καιρού: {daily.weathercode ? daily.weathercode[index] : "N/A"}</p>
                        <p>Εικονίδιο Καιρού: {getWeatherIcon(daily.weathercode ? daily.weathercode[index] : 0)}</p>
                    </div>
                )) : (
                    <p>No weather data available</p>
                )}
            </div>
        </div>
    );
}

export default DestinationWeather;