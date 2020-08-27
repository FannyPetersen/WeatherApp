import React, { Component } from "react";
import Search from "./Search";
import Temp from "./Temp";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
      value: "",
      cels: true,
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.value.match(/^[a-zA-Z\s]*$/)) {
      this.setState({
        ...this.state,
        value: "",
        error: "invalid input",
      });
    } else {
      this.callAPICity(this.state.value);
      this.setState({
        ...this.state,
        value: "",
      });
    }
  };

  handleClick = (event) => {
    const newState = { ...this.state };
    newState.cels = !newState.cels;
    this.setState({ ...newState });
  };

  dateToday() {
    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    const today = new Date().toLocaleDateString("en-US", dateOptions);
    return today;
  }

  async callAPICity(city) {
    const response = await fetch(`http://localhost:8080/search/${city}`);
    const cityData = await response.json();
    if (!cityData.name) {
      this.setState({
        ...this.state,
        value: "",
        error: "invalid input",
      });
    } else {
      this.setState({
        ...this.state,
        apiResponse: {
          weather: cityData.weather[0].description,
          farenheit: cityData.main.temp,
          celsius: Math.floor(cityData.main.temp - 273.15),
          wind: cityData.wind.speed,
          city: cityData.name,
          icon: `http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`,
        },
        error: "",
      });
    }
  }

  async callAPINearby(location) {
    try {
      const response = await fetch("http://localhost:8080/nearby", location);
      if (response.status !== 200) {
        throw new Error("Something went wrong!");
      } else {
        const cityData = await response.json();
        this.setState({
          ...this.state,
          apiResponse: {
            weather: cityData.current.weather[0].description,
            farenheit: cityData.current.temp,
            celsius: Math.floor(cityData.current.temp - 273.15),
            wind: cityData.current.wind_speed,
            city: cityData.timezone
              .replace(/^(.*[\\/])/, "")
              .replace(/_/g, " "),
            icon: `http://openweathermap.org/img/wn/${cityData.current.weather[0].icon}@2x.png`,
          },
        });
      }
    } catch (err) {
      this.setState({
        ...this.state,
        value: "",
        error: "server error",
      });
      console.error(err);
    }
  }

  getLocation() {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const long = position.coords.longitude;
          const lat = position.coords.latitude;
          const coordinates = { lat, long };
          const location = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify(coordinates),
          };
          return location;
        });
      } else {
        throw new Error("Geolocation not available");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async componentDidMount() {
    const location = this.getLocation();
    await this.callAPINearby(location);
  }

  render() {
    const noError = this.state.error ? "no-show" : "show";
    const invalidInput =
      this.state.error === "invalid input" ? "show" : "no-show";
    const notFound = this.state.error === "server error" ? "show" : "no-show";

    return (
      <div className="App">
        <header className={`App-header ${noError}`}>
          <h1 className="App-title">{this.state.apiResponse.city}</h1>
          <h2 className="date">{this.dateToday()}</h2>
        </header>

        <section className={`content ${noError}`}>
          <p className="weather">We have {this.state.apiResponse.weather},</p>
          <Temp
            cels={this.state.cels}
            farenheit={this.state.apiResponse.farenheit}
            celsius={this.state.apiResponse.celsius}
            handleClick={this.handleClick}
          />
          <p className="wind">
            and wind speed is {this.state.apiResponse.wind} m/s.
          </p>{" "}
          <br></br>
          <img
            className="icon"
            src={this.state.apiResponse.icon}
            alt="pretty weather icon"
          ></img>
        </section>

        <section className={`content--input-error ${invalidInput}`}>
          <p>Please input a valid city</p>
        </section>

        <section className={`content--not-found ${notFound}`}>
          <p>
            Sorry, something went wrong with getting your local weather data!
          </p>
          <br></br>
          <p>You can still input a city below.</p>
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
