
import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { CloudSun, ArrowUp, ArrowDown, CloudRain, Sun, Cloud, Wind, Loader } from 'lucide-react';

const TANGIER_COORDS = { lat: 35.7595, lon: -5.8340 };

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo with Explicit Timezone to match Clock
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${TANGIER_COORDS.lat}&longitude=${TANGIER_COORDS.lon}&current=temperature_2m,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Africa%2FCasablanca`
        );
        const data = await response.json();

        // Map WMO codes to text/conditions
        const condition = mapWeatherCode(data.current.weather_code);

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition: condition,
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          location: 'Tangier'
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch weather", error);
        // Fallback data
        setWeather({
          temp: 22,
          condition: 'Mild Breeze',
          high: 24,
          low: 18,
          location: 'Tangier'
        });
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 mins
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const mapWeatherCode = (code: number): string => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Clear';
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear Sky': return <Sun size={14} aria-hidden="true" />;
      case 'Partly Cloudy': return <CloudSun size={14} aria-hidden="true" />;
      case 'Foggy': return <Wind size={14} aria-hidden="true" />;
      case 'Rainy': 
      case 'Showers': return <CloudRain size={14} aria-hidden="true" />;
      default: return <CloudSun size={14} aria-hidden="true" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-5 rounded-3xl h-full flex items-center justify-center" aria-label="Loading weather data">
        <Loader className="animate-spin text-gold-400" aria-hidden="true" />
      </div>
    );
  }

  const ariaLabel = weather 
    ? `Weather in ${weather.location}: ${weather.condition}, current temperature ${weather.temp} degrees. High of ${weather.high}, Low of ${weather.low}.`
    : 'Weather information unavailable';

  return (
    <div 
        className="glass-panel p-5 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:bg-white/20 dark:hover:bg-white/5"
        role="region"
        aria-label={ariaLabel}
    >
      
      <div className="flex justify-between items-start relative z-10">
         <div className="flex items-center space-x-2 text-gold-400">
            {weather && getWeatherIcon(weather.condition)}
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold">{weather?.location}</span>
         </div>
      </div>

      <div className="relative z-10" aria-hidden="true">
         <div className="flex items-baseline space-x-2">
             {/* Matches Clock Widget Size */}
             <span className="text-5xl lg:text-5xl font-light text-gray-900 dark:text-white tracking-tighter transition-colors duration-500">{weather?.temp}°</span>
         </div>
         <span className="text-xs text-gray-500 dark:text-gray-400 font-serif italic pl-1 block mt-0 transition-colors duration-500">{weather?.condition}</span>
         
         <div className="flex space-x-4 mt-2 pl-1">
            <div className="flex items-center text-[9px] text-gray-500">
               <ArrowUp size={9} className="mr-1" /> {weather?.high}°
            </div>
            <div className="flex items-center text-[9px] text-gray-500">
               <ArrowDown size={9} className="mr-1" /> {weather?.low}°
            </div>
         </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
