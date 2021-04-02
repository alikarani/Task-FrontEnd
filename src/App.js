import "./App.css";
import Navbar from "./Components/Navbar";
import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Api_End_Point } from "./globals";
import axios from "axios";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      longitude: 0,
      latitude: 0,
      longitudeList: [],
      latitudeList: [],
      searchedImages: [],
      imagesToBeDisplayed: [],
      fovouriteImageUrls: [],
      loopStart: 0,
      loopEnd: 5,
      modalHide: true,
    };
  }
  componentDidMount() {
    axios.get(`${Api_End_Point}/GeoLocationList/`).then((data) => {
      this.setState({
        latitudeList: data.data.Data.latitude,
        longitudeList: data.data.Data.longitude,
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onLove = (url) => {
    const body = { imageUrl: url };
    axios
      .post(`${Api_End_Point}/FavouriteImages/`, body)
      .then((response) => console.log(response));
  };

  handleClick = () => {
    this.setState({
      loopStart: 0,
      loopEnd: 5,
    });
    if (this.state.latitude && this.state.longitude) {
      axios
        .get(
          `${Api_End_Point}/SearchImages/?lat=${this.state.latitude}&lon=${this.state.longitude}`
        )
        .then((data) => {
          let imagesToBeDisplayed = this.arrangeImages(data.data.Data);
          this.setState({
            searchedImages: data.data.Data,
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
    let res = this.arrangeImages(this.state.searchedImages);
    this.setState({
      imagesToBeDisplayed: res,
    });
  };

  displayWishList = () => {
    this.setState({
      modalHide: false,
    });

    axios.get(`${Api_End_Point}/FavouriteImages`).then((data) => {
      this.setState({
        fovouriteImageUrls: data.data.Data,
      });
    });
  };
  render() {
    return (
      <div className="App">
        <Navbar />
        <Modal
          show={!this.state.modalHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Wish List
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {this.state.fovouriteImageUrls.length ? (
                this.state.fovouriteImageUrls.map((val, index) => (
                  <div className="col-md-3" key={index}>
                    <div className="card border-primary mb-3">
                      <div className="card-body text-primary">
                        <img
                          src={val}
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
                <h6 style={{ margin: "auto" }}>
                  Sorry we are unable to find any image for these co-ordinates
                </h6>
              )}
              <div></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() =>
                this.setState({
                  modalHide: true,
                })
              }
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <div className="jumbotron jumbotron-fluid">
          <h1 className=" text-center p-4">
            <i className="fas fa-search"></i> Search images with Latitude &
            Longitude
          </h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => this.displayWishList()}
            >
              Wish list
            </button>
            <div style={{ paddingLeft: "5%" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title="Longitude"
                onSelect={(dropDownValue) =>
                  this.setState({
                    longitude: dropDownValue,
                  })
                }
              >
                {this.state.longitudeList.length ? (
                  this.state.longitudeList.map((val, index) => (
                    <Dropdown.Item eventKey={val}>{val}</Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item eventKey="">Null</Dropdown.Item>
                )}
              </DropdownButton>
            </div>
            <div style={{ paddingLeft: "5%" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title="Latitude"
                onSelect={(dropDownValue) =>
                  this.setState({
                    latitude: dropDownValue,
                  })
                }
              >
                {this.state.latitudeList.length ? (
                  this.state.latitudeList.map((val, index) => (
                    <Dropdown.Item eventKey={val}>{val}</Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item eventKey="">Null</Dropdown.Item>
                )}
              </DropdownButton>
            </div>
          </div>
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
              <h5 style={{ margin: "auto" }}>
                Sorry we are unable to find any image for these co-ordinates
              </h5>
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
