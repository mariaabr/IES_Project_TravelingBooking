import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import "./traincheckout.css";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import visa from "../../components/images/visa.png";
import mastercard from "../../components/images/master-card.png";
import card from "../../components/images/card.png";
import cancelation from "../../components/images/cancelation.png";
import { useNavigate, useLocation } from "react-router-dom";
import CardTrainCheckout from "../../components/cardTrainCheckout/CardTrainCheckout";

const TrainCheckout = () => {
  const [sex, setSex] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cardExpirationDate, setCardExpirationDate] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bag, setbag] = useState("");
  const [priceTrain, setPriceTrain] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [optionalPrice, setOptionalPrice] = useState(0);
  const [outboundTrain, setOutboundTrain] = useState(null);
  const [inboundTrain, setInboundTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isRoundTrip = location.state?.isRoundTrip;
  const trainOptions = location.state?.trainOptions;
  const trainNumberOutbound = location.state?.trainNumberOutbound;
  const trainNumberInbound = location.state?.trainNumberInbound;

  useEffect(() => {
    const fetchData = async (trainNumber, setTrainFunc) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/trains/trainCheckout/${trainNumber}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        
        console.log("data")
        console.log(data)
        
        setTrainFunc(data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    if (trainNumberOutbound) {
      fetchData(trainNumberOutbound, setOutboundTrain);
    }

    if (isRoundTrip === true && trainNumberInbound) {
      fetchData(trainNumberInbound, setInboundTrain);
    }
  }, [trainNumberOutbound, trainNumberInbound, isRoundTrip]);

  useEffect(() => {
    if (
      outboundTrain &&
      outboundTrain["price1stclass"] &&
      trainOptions &&
      trainOptions.adult !== undefined &&
      trainOptions.children !== undefined
    ) {
      let price = parseFloat(
        (
          trainOptions.adult * outboundTrain["price1stclass"] +
          (trainOptions.children * outboundTrain["price1stclass"]) / 2
        ).toFixed(2)
      );

      // if (isRoundTrip === true) {
      //   price += parseFloat(
      //     (
      //       trainOptions.adult * inboundTrain["price1stclass"] +
      //       (trainOptions.children * inboundTrain["price1stclass"]) / 2
      //     ).toFixed(2)
      //   );
      //   setOptionalPrice(
      //     parseFloat(
      //       ((outboundTrain["price1stclass"] + inboundTrain["price1stclass"]) / 3).toFixed(2)
      //     )
      //   );
      // } else {
      //   setOptionalPrice(parseFloat((outboundTrain["price1stclass"] / 3).toFixed(2)));
      // }

      setOptionalPrice(
        parseFloat((outboundTrain["price1stclass"] / 3).toFixed(2))
      );

      setPriceTrain(price);
      const priceTotal = parseFloat((price + optionalPrice).toFixed(2));
      setTotalPrice(priceTotal);
    }
  }, [outboundTrain, trainOptions, isRoundTrip, inboundTrain, optionalPrice]);

  useEffect(() => {
    if (trainOptions) {
      const adultPassengers = Array.from(
        { length: trainOptions.adult },
        () => ({
          type: "Adult",
          firstName: "",
          lastName: "",
          sex: "",
          nationality: "",
          birthDate: "",
          passportNumber: "",
        })
      );

      const childPassengers = Array.from(
        { length: trainOptions.children },
        () => ({
          type: "Children",
          firstName: "",
          lastName: "",
          sex: "",
          nationality: "",
          birthDate: "",
          passportNumber: "",
        })
      );

      setPassengers([...adultPassengers, ...childPassengers]);
    }
  }, [trainOptions.adult, trainOptions.children]);

  const handleCheckout = async () => {
    const reservationData = {
      userID: parseInt(localStorage.getItem("userId")),
      trainNumberOutbound: trainNumberOutbound,
      trainNumberInbound:
        trainNumberInbound === "null" ? null : trainNumberInbound,
      roundTrip: isRoundTrip,
      totalPrice: totalPrice,
      reservationDate: new Date().toISOString(),
      passengers: passengers,
      emailContact: email,
      phoneContact: phoneNumber,
      nameCard: cardName,
      numberCard: cardNumber,
      expirationDateCard: cardExpirationDate,
      cvvCard: cvv,
      addressCard1: addressLine1,
      addressCard2: addressLine2 ? addressLine2 : null,
      cityCard: city,
      zipCodeCard: postalCode,
      countryCard: country,
    };

    console.log("Reservation data:", reservationData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/trains/createReservation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Reservation successful:", responseData);
      alert(
        `You have successfully booked your train!\nYour confirmation conde is ${responseData.reservationId}\nThank you for choosing TravellingBooking by IES!`
      );
      navigate("/"); // Redirect to home or confirmation page
    } catch (error) {
      console.error("Error in making reservation:", error.Error);
      alert("Failed to book the train. Please try again.");
    }
  };

  const handleGenderChange = (event) => {
    setSex(event.target.value);
  };

  const handleInputChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  console.log("passengers");
  console.log(passengers);

  return (
    <div>
      <Navbar />
      {/* <Header type="addExtrasFLight" /> */}
      <div className="containerCheckout">
        <div className="container1">
          <p style={{ fontSize: "25px" }}>
            Passengers
            <FontAwesomeIcon
              style={{ marginLeft: "0.5%" }}
              icon={faInfoCircle}
            />
          </p>
          <p style={{ fontWeight: "300", marginTop: "1%", color: "black" }}>
            Please enter the information about the passengers
          </p>

          {passengers.map((passenger, index) => (
            <div key={index}>
              <p style={{ fontWeight: "bold", marginTop: "20px" }}>
                {passenger.type} {index + 1}
              </p>
              <input
                id="firstName"
                type="text"
                style={{
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  height: "40px",
                  width: "100%",
                  marginTop: "20px",
                  marginBottom: "20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                placeholder="Enter your first name"
                value={passenger.firstName}
                onChange={(e) =>
                  handleInputChange(index, "firstName", e.target.value)
                }
                required
              />
              <input
                id="lastName"
                type="text"
                style={{
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  height: "40px",
                  width: "100%",
                  marginBottom: "20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                placeholder="Enter your last name"
                value={passenger.lastName}
                onChange={(e) =>
                  handleInputChange(index, "lastName", e.target.value)
                }
                required
              />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <select
                  value={passenger.sex}
                  onChange={(e) =>
                    handleInputChange(index, "sex", e.target.value) &&
                    handleGenderChange(e.target.value)
                  }
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    height: "44px",
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginRight: "20px",
                  }}
                >
                  <option>Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <input
                  id="nationality"
                  type="text"
                  style={{
                    flex: 1,
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    height: "40px",
                    width: "100%",
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  placeholder="Enter your nationality"
                  value={passenger.nationality}
                  onChange={(e) =>
                    handleInputChange(index, "nationality", e.target.value)
                  }
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  id="birthDate"
                  type="date"
                  style={{
                    flex: 1,
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    height: "40px",
                    width: "100%",
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  placeholder="Enter your date of birth"
                  value={passenger.birthDate}
                  onChange={(e) =>
                    handleInputChange(index, "birthDate", e.target.value)
                  }
                  required
                />

                <input
                  id="passportNumber"
                  type="text"
                  style={{
                    flex: 1,
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    height: "40px",
                    width: "100%",
                    marginLeft: "100px",
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  placeholder="Enter your passport number"
                  value={passenger.passportNumber}
                  onChange={(e) =>
                    handleInputChange(index, "passportNumber", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          ))}

          <p style={{ fontSize: "25px", marginTop: "30px" }}>Booking Contact</p>

          <input
            id="email"
            type="email"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginTop: "20px",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            id="phoneNumber"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <p style={{ fontSize: "25px", marginTop: "30px" }}>Payment Details</p>

          <input
            id="cardName"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginTop: "20px",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter card name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
          <p style={{ fontWeight: "300", marginTop: "1%", color: "black" }}>
            Card types accepted: Visa, Mastercard
          </p>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <img src={visa} alt="" style={{ width: "37px", height: "23px" }} />
            <img
              src={mastercard}
              alt=""
              style={{ width: "37px", height: "23px" }}
            />
          </div>
          <p
            style={{
              fontWeight: "300",
              marginTop: "1%",
              color: "black",
              fontSize: "15px",
            }}
          >
            Your card issuer may charge a fee.
          </p>
          <div
            style={{
              backgroundColor: "#C2C9CD",
              borderRadius: "5px",
              marginTop: "20px",
            }}
          >
            <p style={{ padding: "20px", color: "black" }}>
              Card Information is fully encrypted and protected
            </p>
          </div>

          <input
            id="cardNumber"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginTop: "20px",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />

          <input
            id="cardExpirationDate"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter card expiration date"
            value={cardExpirationDate}
            onChange={(e) => setCardExpirationDate(e.target.value)}
            required
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              verticalAlign: "middle",
            }}
          >
            <input
              id="cvv"
              type="text"
              style={{
                borderRadius: "5px",
                border: "1px solid #ccc",
                height: "40px",
                width: "20%",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              placeholder="Enter Security Code"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
            <img
              src={card}
              alt=""
              style={{ width: "90px", height: "36px", marginLeft: "4%" }}
            />
          </div>
          <input
            id="addressLine1"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter Address Line 1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />
          <input
            id="addressLine2"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter Address line 2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            required
          />
          <input
            id="city"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            id="postalCode"
            type="text"
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "40px",
              width: "100%",
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            placeholder="Enter Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "44px",
              marginBottom: "20px",
              width: "100%",
              fontSize: "16px",
              fontWeight: "bold",
              marginRight: "20px",
            }}
          >
            <option>Country</option>
            <option value="portugal">Portugal</option>
            <option value="spain">Spain</option>
            <option value="france">France</option>
            <option value="germany">Germany</option>
          </select>
          <button className="buttonSearchTrains" onClick={handleCheckout}>
            Book Now
          </button>
        </div>
        <div
          className="container1"
          style={{ paddingLeft: "30px", paddingTop: "20px" }}
        >
          <div style={{ backgroundColor: "#EFF1F2", borderRadius: "8px" }}>
            <div
              style={{
                padding: "20px",
                margin: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              <p>Train Details</p>
              <div>
                {isRoundTrip === false ? (
                  <div style={{ marginTop: "1%" }}>
                    {outboundTrain && outboundTrain["companyCode"] ? (
                      <CardTrainCheckout train={outboundTrain} />
                    ) : (
                      "Loading..."
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: "1%" }}>
                    {outboundTrain && outboundTrain["companyCode"] ? (
                      <CardTrainCheckout train={outboundTrain} />
                    ) : (
                      "Loading..."
                    )}
                    {inboundTrain && inboundTrain["companyCode"] ? (
                      <CardTrainCheckout train={inboundTrain} />
                    ) : (
                      "Loading..."
                    )}
                  </div>
                )}
              </div>
              {isRoundTrip === true ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10%",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TrainDetails train={outboundTrain} />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TrainDetails train={inboundTrain} type="Inbound" />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "2%",
                  }}
                >
                  <TrainDetails train={outboundTrain} />
                </div>
              )}
            </div>
            <div
              style={{
                padding: "20px",
                margin: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p>Train:</p>

                {outboundTrain ? (
                  <div>
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ color: "black", fontSize: "18px" }}>
                        Adults: {trainOptions.adult}
                      </p>
                      <p style={{ color: "black", fontSize: "18px" }}>
                        Children: {trainOptions.children}
                      </p>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <p style={{ color: "black", fontSize: "18px" }}>
                        Total Price: {priceTrain} €
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>Loading ...</p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <p>Additional Options:</p>
                {outboundTrain && outboundTrain["price1stclass"] ? (
                  <p style={{ color: "black" }}>{optionalPrice}€</p>
                ) : (
                  <p>Loading ...</p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "10px",
                  borderTop: "1px solid black",
                }}
              >
                <p style={{ marginTop: "10px" }}>Total</p>
                {outboundTrain && outboundTrain["price1stclass"] ? (
                  <p style={{ marginTop: "10px" }}>{totalPrice}€</p>
                ) : (
                  <p>Loading ...</p>
                )}
              </div>
            </div>
            <div
              style={{
                padding: "20px",
                margin: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                <img
                  src={cancelation}
                  style={{ width: "24px", height: "24px" }}
                  alt="cancelationIcon"
                />
                <p
                  style={{
                    color: "black",
                    marginLeft: "15px",
                    marginTop: "-3px",
                  }}
                >
                  Free cancellation
                </p>
              </div>
              { outboundTrain && outboundTrain["travelDate"] ? (
                <p
                  style={{
                    marginTop: "10px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "400",
                  }}
                >
                  Free cancellation before 11:59 PM on{" "}
                  {(() => {
                    const trainDate = new Date(outboundTrain["travelDate"]);
                    trainDate.setDate(trainDate.getDate() - 1); // Subtract one day
                    return trainDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
                  })()}{" "}
                  (local time of hotel). After that, you'll be charged 100% of
                  the cost.
                </p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrainCheckout;

const TrainDetails = ({ train, type = "Outbound" }) => {
  return (
    <div style={{ paddingLeft: "4%" }}>
      {train ? (
        <div>
          <p>{type}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "black", fontSize: "18px" }}>Train Number:</p>
            <p
              style={{
                color: "black",
                fontSize: "18px",
                marginLeft: "10px",
              }}
            >
              {" "}
              {train["trainNumber"]}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "black", fontSize: "18px" }}>Date:</p>
            {train && train["travelDate"] ? (
              <p
                style={{
                  color: "black",
                  fontSize: "18px",
                  marginLeft: "10px",
                }}
              >
                {train["travelDate"].split("T")[0]}
              </p>
            ) : (
              <p>Loading ...</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "black", fontSize: "18px" }}>Departure Time:</p>
            {train && train["departureHour"] ? (
              <p
                style={{
                  color: "black",
                  fontSize: "18px",
                  marginLeft: "10px",
                }}
              >
                {train["departureHour"].split(" ")[1]}
              </p>
            ) : (
              <p>Loading ...</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "black", fontSize: "18px" }}>Arrival Time:</p>
            {train && train["arrivalHour"] ? (
              <p
                style={{
                  color: "black",
                  fontSize: "18px",
                  marginLeft: "10px",
                }}
              >
                {train["arrivalHour"].split(" ")[1]}
              </p>
            ) : (
              <p>Loading ...</p>
            )}
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};
