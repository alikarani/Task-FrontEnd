import "./App.css";
import Navbar from "./Components/Navbar";
import React, { Component } from "react";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      longitude: 0,
      latitude: 0,
      searchedImages: [],
      imagesToBeDisplayed: [],
      loopStart: 0,
      loopEnd: 5,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onLove = (url) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url }),
    };
    fetch(
      "https://pythontask125.herokuapp.com/FavouriteImages/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  handleClick = () => {
    this.setState({
      loopStart: 0,
      loopEnd: 5,
    });
    if (this.state.latitude && this.state.longitude) {
      fetch(
        `https://pythontask125.herokuapp.com/SearchImages/?lat=${this.state.latitude}&lon=${this.state.longitude}`,
        { mode: "no-cors" }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let imagesToBeDisplayed = this.arrangeImages(data.Data);
          this.setState({
            searchedImages: data.Data,
            imagesToBeDisplayed: imagesToBeDisplayed,
          });
        });
    } else {
      alert("Please enter valid latitude & longitude");
    }
  };
  arrangeImages = (data) => {
    let imagesToBeDisplayed = [];
    for (let i = this.state.loopStart; i < data.length; i++) {
      imagesToBeDisplayed.push(data[i]);
      if (i == this.state.loopEnd) {
        this.setState({
          loopStart: this.state.loopStart + 5,
          loopEnd: this.state.loopEnd + 5,
        });
        return imagesToBeDisplayed;
      }
    }
    return imagesToBeDisplayed;
  };
  pagination = () => {
    console.log("clcfk");
    let res = this.arrangeImages(this.state.searchedImages);
    this.setState({
      imagesToBeDisplayed: res,
    });
  };

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="jumbotron jumbotron-fluid">
          <h1 className=" text-center p-4">
            <i className="fas fa-search"></i> Search images with Latitude &
            Longitude
          </h1>
          <div className="container">
            <div className="row">
              <div className="col-md-6 my-3">
                <input
                  className="form-control"
                  onChange={this.handleChange}
                  type="number"
                  name="latitude"
                  placeholder="Enter The Latitude"
                />
              </div>
              <div className="col-md-6 my-3">
                <input
                  className="form-control"
                  onChange={this.handleChange}
                  type="number"
                  name="longitude"
                  placeholder="Enter the Longitude"
                />
              </div>
            </div>

            <button
              onClick={this.handleClick}
              className="btn btn-primary btn-lg mt-3"
            >
              Search
            </button>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {this.state.imagesToBeDisplayed.length ? (
              this.state.imagesToBeDisplayed.map((val, index) => (
                <div className="col-md-3" key={index}>
                  <div className="card border-primary mb-3">
                    <button
                      className="btn btn-danger ml-auto"
                      onClick={() =>
                        this.onLove(
                          `https://live.staticflickr.com/${val.server}/${val.id}_${val.secret}.jpg`
                        )
                      }
                    >
                      <i className="far fa-heart"></i>
                    </button>
                    <div className="card-body text-primary">
                      <img
                        src={`https://live.staticflickr.com/${val.server}/${val.id}_${val.secret}.jpg`}
                        alt="image"
                        height="150"
                        width="100%"
                        alt={"image"}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>
                Sorry we are unable to find any image for these co-ordinates
              </h1>
            )}
            <div></div>
          </div>
        </div>
        <button
          onClick={this.pagination}
          className="btn btn-primary btn-lg mt-3"
          disabled={this.state.searchedImages.length <= 5}
        >
          Next
        </button>
      </div>
    );
  }
}
