import { useState, useEffect } from 'react';
import './App.css';

const getWether = () => {
  return fetch('http://api.weatherapi.com/v1/forecast.json?' + new URLSearchParams({
    key: '9127f88fc0774f1c88c133339222104',
    q: 'London',
    days: 3,
    aqi: 'no',
    alerts: 'no',
  }))
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getWether()
      .then(response => response.json())
      .then(weather => setData(weather))
  }, [])

  return (
    <div className="App">
      {!data ? <span>No data</span> : (
        <>
          <div className="weather-card">
            <img src={`https:${data.current.condition.icon}`} alt={data.current.condition.text} height="64" />
            <div>
              <p>Today</p>
              <h1>{data.current.feelslike_c}<sup>°C</sup></h1>
            </div>
            <div className="weather-card__extra">
              <small>Humidity</small>
              <p>{data.current.humidity}</p>
              <small>Wind speed</small>
              <p>{data.current.wind_kph} km / h</p>
            </div>
          </div>
          <div className="weather-card">
            <ul className="weather-list">
              {data.forecast.forecastday.map((item, i) => i > 0 && (
                <li key={item.date}>
                  <small>
                    {i === 1 ? 'Tomorrow' : 'Day after tomorrow'}
                  </small>
                  <img src={`https:${item.day.condition.icon}`} alt={item.day.condition.text} height="36" />
                  <b>
                    {item.day.avgtemp_c}<sup>°C</sup>
                  </b>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
