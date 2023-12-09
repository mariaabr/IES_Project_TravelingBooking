import {
  faCalendarDays,
  faPerson,
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { Checkbox, FormControlLabel } from "@mui/material";
import dayjs from "dayjs";

import "./flightsSearch.css";

const FlightsSearch = () => {
  
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [departureDate, setDepartureDate] = useState(dayjs());
  const calendarRef = useRef();
  const navigate = useNavigate();
  const [isOneWay, setIsOneWay] = useState(false);
  const [flightClass, setFlightClass] = useState("economy");

  const handleDateChange = (newValue) => {
    localStorage.setItem("flightDate", newValue.format("DD/MM/YYYY"));
    setDepartureDate(newValue);
  };

  const handleDateChangeRange = (item) => {
    const range = [format(item['startDate'], "dd/MM/yyyy"), format(item['endDate'], "dd/MM/yyyy")]
    localStorage.setItem("flightDate", range);
    setDate([item]);
  };

  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    class: "economy",
  });

  const useOutsideClick = (ref, callback) => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    });
  };

  useOutsideClick(calendarRef, () => {
    if (openDate) setOpenDate(false);
  });

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      localStorage.setItem("flightOptions", JSON.stringify(options));
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleClassChange = (event) => {
    localStorage.setItem("flightClass", event.target.value);
    setFlightClass(event.target.value);
    const selectedClass = event.target.value;
    setOptions((prevOptions) => ({
      ...prevOptions,
      class: selectedClass,
    }));
  };

  // const handleSearch = () => {
  //   navigate("/flights", { state: { destination, date, options } });
  // };

  const handleOneWayChange = (event) => {
    setIsOneWay(event.target.checked);
    localStorage.setItem("isOneWay", event.target.checked);
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
  };

  const fetchFlights = async () => {
    try {
      const isRoundTrip = !isOneWay;

      let formattedDepartureDate = 0;
      let formattedReturnDate = 0;

      if (isRoundTrip) {
        formattedDepartureDate = formatDate(date[0].startDate);
        formattedReturnDate = formatDate(date[0].endDate);
      } 
      else {
        formattedDepartureDate = departureDate.format("YYYY-MM-DD");
        formattedReturnDate = null;
      }
      
  
      const response = await fetch('http://localhost:8080/api/searchFlight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          airportCodeOrigin: from, 
          airportCodeDestination: destination,
          departureDate: formattedDepartureDate,
          returnDate: formattedReturnDate,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      if (data && data.outboundFlights && data.outboundFlights.length > 0) {
        const destinationCode = data.outboundFlights[0].airportDestinationInfo.airportName;
        localStorage.setItem("flightDestination", destinationCode);
      }
      navigate("/flights", { state: { flightsData: data } });
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    }
  };
  
  // Helper function to format dates
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  const handleSearch = () => {
    fetchFlights();
  };

  return (
    <div className="headerFlights">
      <h1>Quickly scan all your favourite flights</h1>

      <div className="containerSearch">
        <div className="headerSearch">
          <div className="headerSearchItemLeft">
            <FontAwesomeIcon icon={faPlaneDeparture} className="headerIcon" />
            <input
              type="text"
              value={from}
              placeholder="From:"
              className="headerSearchInput"
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faPlaneArrival} className="headerIcon" />
            <input
              type="text"
              placeholder="To:"
              className="headerSearchInput"
              onChange={(e) => handleDestinationChange(e.target.value)}
            />
          </div>
          {isOneWay === true && (
            <div className="headerSearchItem">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={departureDate}
                  onChange={(newValue) => {
                    handleDateChange(newValue);
                  }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </div>
          )}
          {isOneWay === false && (
            <div className="headerSearchItem">
              <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
              <span
                onClick={() => setOpenDate(!openDate)}
                className="headerSearchText"
              >{`${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
                date[0].endDate,
                "dd/MM/yyyy"
              )}`}</span>
              {openDate && (
                <div ref={calendarRef}>
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => handleDateChangeRange(item.selection)}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    className="date"
                    minDate={new Date()}
                  />
                </div>
              )}
            </div>
          )}
          <div className="headerSearchItemRight">
            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
            <span
              onClick={() => setOpenOptions(!openOptions)}
              className="headerSearchText"
            >{`${options.adult} adult · ${options.children} children · ${options.class} class`}</span>
            {openOptions && (
              <div className="options">
                <div className="optionItem">
                  <span className="optionText">Adult</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.adult <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.adult}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="optionItem">
                  <span className="optionText">Children</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.children <= 0}
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">
                      {options.children}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="optionItem">
                  <span className="optionText">Class</span>
                  <select
                    value={flightClass}
                    onChange={handleClassChange}
                    className="optionSelect"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="searchDiv">
          <button className="buttonFlightsSearch" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={isOneWay}
              onChange={handleOneWayChange}
              color="primary"
              style={{ color: "white", fontWeight: "bold" }}
            />
          }
          label="One-way flight ?"
        />
      </div>
    </div>
  );
};

export default FlightsSearch;