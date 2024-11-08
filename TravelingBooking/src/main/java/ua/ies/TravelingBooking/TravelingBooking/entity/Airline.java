package ua.ies.TravelingBooking.TravelingBooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Airlines")
public class Airline {
    
    @Id
    @Column(name = "Airline_Code")
    private String airlineCode;

    @Column(name = "Airline_Name", nullable = false)
    private String airlineName;

    @Column(name = "Airline_ICAO", nullable = false)
    private String airlineICAO;
}
