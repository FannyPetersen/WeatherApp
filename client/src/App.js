import React, { Component } from 'react';
import Search from './Search';
import Temp from './Temp';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: '',
      value: '',
      cels: true,
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.value) {
      const newState = {
        ...this.state,
        apiResponse: '',
        city: `${this.state.value}`,
        value: '',
        cels: true,
      };

      this.setState({ ...newState });
      setTimeout(() => this.callAPI(this.state.city), 500);
    }
  };

  handleClick = event => {
    const newState = { ...this.state };
    newState.cels = !newState.cels;
    this.setState({ ...newState });
  };

  dateToday() {
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', dateOptions);
    return today;
  }

  callAPI(city) {
    fetch(`http://localhost:8080/search/${city}`)
      .then(res => res.json())
      .then(data =>
        this.setState({
          ...this.state,
          apiResponse: {
            weather: data.weather[0].description,
            farenheit: data.main.temp,
            celsius: Math.floor(data.main.temp - 273.15),
            wind: data.wind.speed,
            city: data.name,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          },
        }),
      )
      .catch(err => err);
  }

  componentDidMount() {
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
            this.setState({
              ...this.state,
              apiResponse: {
                weather: data.current.weather[0].description,
                farenheit: data.current.temp,
                celsius: Math.floor(data.current.temp - 273.15),
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

  render() {
    return (
      <div className='App'>

        <header className='App-header'>
          <h1 className='App-title'>{this.state.apiResponse.city}</h1>
          <h2 className='date'>{this.dateToday()}</h2>
        </header>

        <section className="content">
          <p className='weather'>We have {this.state.apiResponse.weather},</p>
        <Temp
          cels={this.state.cels}
          farenheit={this.state.apiResponse.farenheit}
          celsius={this.state.apiResponse.celsius}
          handleClick={this.handleClick}
        />
        <p className='wind'>and wind speed is {this.state.apiResponse.wind} m/s.</p>
        <img className='icon' src={this.state.apiResponse.icon} alt='pretty weather icon'></img>
        </section>

        <Search 
          handleChange={this.handleChange} 
          handleSubmit={this.handleSubmit} 
          value={this.state.value} 
        />
        
      </div>
    );
  }
}

export default App;
