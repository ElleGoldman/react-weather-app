import React, { useState, useEffect, useCallback, useContext, useReducer, useMemo, useId, useRef } from 'react';
import './App.css';

const getWether = () => {
  return fetch('https://api.weatherapi.com/v1/forecast.json?' + new URLSearchParams({
    key: '9127f88fc0774f1c88c133339222104',
    q: 'London',
    days: 3,
    aqi: 'no',
    alerts: 'no',
  }));
};

// useContext
const context = { appTitle: 'My weather app' };
const AppContext = React.createContext(context);
function AppTitle() {
  const { appTitle } = useContext(AppContext);
  return (
    <h1>{ appTitle }</h1>
  );
}

// useReducer
const initialState = { loading: 0 };
function reducer(state, action) {
  switch (action.type) {
    case 'toggleLoading':
      return { loading: !state.loading };
    default:
      throw new Error();
  }
}

function App() {
  // useRef
  const captionRef = useRef(null)

  // useId
  const appId = useId();

  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // useState
  const [data, setData] = useState(null);

  // useMemo
  const lastUpdated = useMemo(() => {
    return data ? data.location.localtime : '-'
  }, [data])

  // useEffect
  useEffect(() => {
    getWether()
      .then(response => response.json())
      .then(weather => setData(weather));
  }, []);

  // useCallback
  const handleRefresh = useCallback(() => {
    captionRef.current.style.color = 'red'
    dispatch({type: 'toggleLoading'})
    getWether()
      .then(response => response.json())
      .then(weather => {
        setTimeout(() => {
          dispatch({type: 'toggleLoading'})
          setData(weather)
        }, 3000)
     });
  }, []);

  return (
    <AppContext.Provider value={context}>
      <div id={appId} className="App">
        {!data ? <span>No data</span> : (
          <>
            <AppTitle />
            <small ref={captionRef} tabindex="-1">{lastUpdated}</small>
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

            <button onClick={handleRefresh} disabled={state.loading}>
              {state.loading ? 'Loading...' : 'Refresh'}
            </button>
          </>
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
