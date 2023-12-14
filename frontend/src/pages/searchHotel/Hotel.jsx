import React, { useState } from "react";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HotelCard from "../../components/cardHotel/CardHotel"
import { useLocation } from 'react-router-dom';



const Hotel = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);

  const [stopsFilter, setStopsFilter] = useState("Any");
  const [departureTimeFilter, setDepartureTimeFilter] = useState("Any");
  const [durationFilter, setDurationFilter] = useState("Any");
  const [airlineFilter, setAirlineFilter] = useState("Any");

  const location = useLocation();
  const hotelsData = location.state?.hotels;

  console.log("hotelsData");
  console.log(hotelsData);

  const handleSelectStops = (value) => {
    setStopsFilter(value);
  };

  const handleSelectDepartureTime = (value) => {
    setDepartureTimeFilter(value);
  };

  const handleSelectDuration = (value) => {
    setDurationFilter(value);
  };

  const handleSelectAirline = (value) => {
    setAirlineFilter(value);
  };



  return (
    <div>
      <Navbar />
      <Header type="hotels" />
      <div className="containerSearchHotel" style={{ alignItems: "start" }}>
        <div className="container2hotel">
          <div className="filters">
            <label>Filter by Stops:</label>
            <select
              value={stopsFilter}
              onChange={(e) => handleSelectStops(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Direct">Direct</option>
              <option value="1 Stop">1 Stop</option>
              <option value="2+ Stops">2+ Stops</option>
            </select>

            <label>Filter by Departure Time:</label>
            <select
              value={departureTimeFilter}
              onChange={(e) => handleSelectDepartureTime(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>

            <label>Filter by Trip Duration:</label>
            <select
              value={durationFilter}
              onChange={(e) => handleSelectDuration(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </select>

            <label>Filter by Airline:</label>
            <select
              value={airlineFilter}
              onChange={(e) => handleSelectAirline(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Ryanair">Ryanair</option>
              <option value="Airline B">Airline B</option>
              {/* Add more airline options as needed //*/}
            </select>
          </div>
        </div>
        <div className="container3hotel">
          {hotelsData.length > 0 ? (
            hotelsData.map((hotel, index) => (
              <HotelCard
                key={index}
                hotel={hotel}
              />
            ))
          ) : (
            <p>No hotels found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hotel;