import React, { useState } from 'react';


const App =() => {

    const [state, setState] = useState({apiResponse: '',
    value: '',
    celsius: true});
    
    
    
    
      const handleChange = event => {
        setState({ value: event.target.value });
      };
    
      const handleSubmit = event => {
        event.preventDefault();
    
        if (state.value) {
          const newState = {
            ...state,
            apiResponse: '',
            city: `${state.value}`,
            value: '',
          };
    
          setState({ ...newState });
          setTimeout(() => callAPI(state.city), 500);
        }
      };
    
      const dateToday = () => {
        const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', dateOptions);
        return today;
      }
    
      const callAPI = (city) => {
        fetch(`http://localhost:8080/search/${city}`)
          .then(res => res.json())
          .then(data =>
            setState({
              ...state,
              apiResponse: {
                weather: data.weather[0].description,
                temperature: Math.floor(data.main.temp - 273.15),
                wind: data.wind.speed,
                city: data.name,
                icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
              },
            }),
          )
          .catch(err => err);
      }
    
      const componentDidMount = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const long = position.coords.longitude;
            const lat = position.coords.latitude;
            const coordinates = { lat, long };
            const location = {
              method: 'POST',
              headers: {
                'content-Type': 'application/json',
              },
              body: JSON.stringify(coordinates),
            };
    
            fetch('http://localhost:8080/nearby', location)
              .then(res => res.json())
              .then(data =>
                setState({
                  ...state,
                  apiResponse: {
                    weather: data.current.weather[0].description,
                    temperature: Math.floor(data.current.temp - 273.15),
                    wind: data.current.wind_speed,
                    city: data.timezone.replace(/^(.*[\\\/])/, '').replace(/_/g, ' '),
                    icon: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
                  },
                }),
              )
              .catch(err => err);
          });
        }
      }
    
        return (
          <div className={`App ${state.apiResponse.background}`}>
            <header className='App-header'>
              <h1 className='App-title'>{state.apiResponse.city}</h1>
              <h2 className='date'>{dateToday()}</h2>
            </header>
            <p className='weather'>We have {state.apiResponse.weather},</p>
            {/* <p className='temp'>temperature is {state.apiResponse.temperature} °C</p> */}
            <Temp temp={state.apiResponse.temperature} celsius={state.celsius} handleClick={handleClick} />
            <p className='wind'>and the wind speed is {state.apiResponse.wind} m/s.</p>
            <img className='icon' src={state.apiResponse.icon} alt='weather icon'></img>
            <Search change={handleChange} submit={handleSubmit} value={state.value} />
          </div>
        );
    }
    