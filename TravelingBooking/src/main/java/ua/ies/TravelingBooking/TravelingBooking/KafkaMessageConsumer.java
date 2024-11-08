package ua.ies.TravelingBooking.TravelingBooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import ua.ies.TravelingBooking.TravelingBooking.entity.Airport;
import ua.ies.TravelingBooking.TravelingBooking.dto.FlightChangeDTO;
import ua.ies.TravelingBooking.TravelingBooking.dto.FlightPriceChangeDTO;
import ua.ies.TravelingBooking.TravelingBooking.dto.HotelPriceChangeDTO;
import ua.ies.TravelingBooking.TravelingBooking.entity.Airline;
import ua.ies.TravelingBooking.TravelingBooking.entity.Flight;
import ua.ies.TravelingBooking.TravelingBooking.entity.Hotel;
import ua.ies.TravelingBooking.TravelingBooking.entity.Museum;
import ua.ies.TravelingBooking.TravelingBooking.entity.Station;
import ua.ies.TravelingBooking.TravelingBooking.entity.Train;
import ua.ies.TravelingBooking.TravelingBooking.entity.TrainCompany;
import ua.ies.TravelingBooking.TravelingBooking.repository.AirportsRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.AirlinesRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.FlightsRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.StationsRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.TrainsCompanyRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.TrainsRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.HotelsRepository;
import ua.ies.TravelingBooking.TravelingBooking.repository.MuseumsRepository;

import java.io.IOException;
import java.text.ParseException;

@Component
public class KafkaMessageConsumer {

    private final FlightsRepository flightsRepository;
    private final AirportsRepository airportsRepository;
    private final AirlinesRepository airlinesRepository;
    private final StationsRepository stationsRepository;
    private final TrainsCompanyRepository trainCompanyRepository;
    private final TrainsRepository trainsRepository;
    private final HotelsRepository hotelsRepository;
    private final MuseumsRepository museumsRepository;

    private final ObjectMapper objectMapper;

    public KafkaMessageConsumer(FlightsRepository flightsRepository,
            AirportsRepository airportsRepository,
            AirlinesRepository airlinesRepository,
            StationsRepository stationsRepository,
            TrainsCompanyRepository trainCompanyRepository,
            TrainsRepository trainsRepository,
            HotelsRepository hotelsRepository,
            MuseumsRepository museumsRepository,
            ObjectMapper objectMapper) {
        this.flightsRepository = flightsRepository;
        this.airportsRepository = airportsRepository;
        this.airlinesRepository = airlinesRepository;
        this.stationsRepository = stationsRepository;
        this.trainCompanyRepository = trainCompanyRepository;
        this.trainsRepository = trainsRepository;
        this.hotelsRepository = hotelsRepository;
        this.museumsRepository = museumsRepository;
        this.objectMapper = objectMapper;
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "flighs_data", groupId = "my-consumer-group")
    public void listenFlighs_data(String message) {
        System.out.println("AQUIiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        System.out.println("Received message Flighs_data: " + message);

        try {
            Flight flight = objectMapper.readValue(message, Flight.class);
            flightsRepository.save(flight);
            System.out.println("Saved flight data to database: " + flight);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing flight message: " + message);
        }
    }

    @KafkaListener(topics = "airports_topic", groupId = "my-consumer-group")
    public void listenAirportsTopic(String message) {
        try {
            Airport airport = objectMapper.readValue(message, Airport.class);
            if (airport.getAirportCode() == null || airport.getAirportCode().isEmpty()) {
                System.out.println("Received airport data with null or empty ID");
                return;
            }
            airportsRepository.save(airport);
            System.out.println("Saved airport data to database: " + airport);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing airport message: " + message);
        }
    }

    @KafkaListener(topics = "airlines_topic", groupId = "my-consumer-group")
    public void listenAirlinesTopic(String message) {
        try {
            Airline airline = objectMapper.readValue(message, Airline.class);
            airlinesRepository.save(airline);
            System.out.println("Saved airline data to database: " + airline);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing airline message: " + message);
        }
    }

    @KafkaListener(topics = "station_topic", groupId = "my-consumer-group")
    public void listenStationTopic(String message) {
        try {
            System.out.println(message);
            Station station = objectMapper.readValue(message, Station.class);

            stationsRepository.save(station);

            System.out.println("Received and processed station data: " + station);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing station message: " + message);
        }
    }

    @KafkaListener(topics = "train_company_topic", groupId = "my-consumer-group")
    public void listenTrainCompanyTopic(String message) {
        try {
            System.out.println(message);
            TrainCompany trainCompany = objectMapper.readValue(message, TrainCompany.class);

            trainCompanyRepository.save(trainCompany);

            System.out.println("Received and processed train company data: " + trainCompany);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing train company message: " + message);
        }
    }

    @KafkaListener(topics = "train_data", groupId = "my-consumer-group")
    public void listenTrainDataTopic(String message) {
        try {
            System.out.println(message);
            Train train = objectMapper.readValue(message, Train.class);

            trainsRepository.save(train);

            System.out.println("Received and processed train data: " + train);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing train message: " + message);
        }
    }

    @KafkaListener(topics = "hotel_data", groupId = "my-consumer-group")
    public void listenHotelTopic(String message) {
        try {
            System.out.println(message);
            Hotel hotel = objectMapper.readValue(message, Hotel.class);

            hotelsRepository.save(hotel);

            System.out.println("Received and processed hotel data: " + hotel);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing train message: " + message);
        }
    }

    @KafkaListener(topics = "museums_topic", groupId = "my-consumer-group")
    public void listenMuseumsTopic(String message) {
        try {
            System.out.println(message);
            Museum museum = objectMapper.readValue(message, Museum.class);

            museumsRepository.save(museum);

            System.out.println("Received and processed museum data: " + museum);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing museum message: " + message);
        }
    }

    
    @KafkaListener(topics = "flight_change", groupId = "my-consumer-group")
    public void listenFlightChange(String message) throws ParseException {
        try {
            System.out.println(message);
            FlightChangeDTO flightChange = objectMapper.readValue(message, FlightChangeDTO.class);

            Flight flight = flightsRepository.findById(flightChange.getFlightNumber()).orElse(null);

            if (flight != null) {
                if (flightChange.getNewState().equals("Canceled")) {
                    flight.setState("Canceled");
                    flightsRepository.save(flight);
                } else if (flightChange.getNewState().equals("Delay")) {
                    flight.setState("Delay");
                    flight.setDepartureHour(flightChange.getNewDepartureHour());
                    flight.setArrivalHour(flightChange.getNewArrivalHour());
                    flightsRepository.save(flight);
                } 
            } else {
                System.out.println("Flight not found: " + flightChange.getFlightNumber());
            }
            messagingTemplate.convertAndSend("/topic/flightStateChange", flightChange);
            System.out.println("Received and processed flight change: " + flightChange);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing flight change message: " + message);
        }
    }

    @KafkaListener(topics = "flight_price_change", groupId = "my-consumer-group")
    public void listenFlightPriceChange(String message) throws ParseException {
        try {
            System.out.println(message);
            FlightPriceChangeDTO flightPriceChange = objectMapper.readValue(message, FlightPriceChangeDTO.class);

            System.out.println("Flight Number: " + flightPriceChange.getFlightNumber());
            
            Flight flight = flightsRepository.findById(flightPriceChange.getFlightNumber()).orElse(null);

            if (flight != null) {
                System.out.println("Price Flight: " + flight.getPrice());
                flight.setPrice(Double.valueOf(flightPriceChange.getPrice()));
                flightsRepository.save(flight); 
                System.out.println("Price Flight: " + flight.getPrice());
            } else {
                System.out.println("Flight not found: " + flightPriceChange.getFlightNumber());
            }
            messagingTemplate.convertAndSend("/topic/flightPriceUpdate", flightPriceChange);
            System.out.println("Received and processed flight price change: " + flightPriceChange);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing flight change message: " + message);
        }
    }

    @KafkaListener(topics = "hotel_price_change", groupId = "my-consumer-group")
    public void listenHotelPriceChange(String message) throws ParseException {
        try {
            System.out.println(message);
            HotelPriceChangeDTO hotelPriceChangeDTO = objectMapper.readValue(message, HotelPriceChangeDTO.class);

            System.out.println("Hotel Name: " + hotelPriceChangeDTO.getHotelName());
            
            Hotel hotel = hotelsRepository.findByHotelName(hotelPriceChangeDTO.getHotelName());

            if (hotel != null) {
                System.out.println("Price Hotel: " + hotel.getInitialPrice());
                hotel.setInitialPrice(String.valueOf(hotelPriceChangeDTO.getPrice()));
                System.out.println("Price Hotel: " + hotel.getInitialPrice());
                hotelsRepository.save(hotel);

            } else {
                System.out.println("Hotel not found: " + hotelPriceChangeDTO.getHotelName());
            }
            messagingTemplate.convertAndSend("/topic/HotelPriceUpdate", hotelPriceChangeDTO);
            System.out.println("Received and processed hotel price change: " + hotelPriceChangeDTO);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error processing flight change message: " + message);
        }
    }
}   