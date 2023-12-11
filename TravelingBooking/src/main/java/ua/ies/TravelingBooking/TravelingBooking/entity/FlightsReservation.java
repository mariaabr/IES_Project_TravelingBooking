package ua.ies.TravelingBooking.TravelingBooking.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

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
@Table(name = "FlightsReservation")
public class FlightsReservation {

    @Id
    @Column(name = "reservationId", nullable = false, unique = true)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userID", referencedColumnName = "UserID")
    private User user;

    @Column(name = "flightNumberOutbound", nullable = false)
    private String flightNumberOutbound;

    @Column(name = "flightNumberInbound", nullable = true)
    private String flightNumberInbound;

    @Column(name = "isRoundTrip")
    private boolean roundTrip;

    @Column(name = "totalPrice", nullable = false)
    private double totalPrice;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reservationDate", nullable = false)
    private Date reservationDate;

    @Column(name = "emailContact", nullable = false)
    private String emailContact;

    @Column(name = "phoneContact", nullable = false)
    private String phoneContact;

    @Column(name = "nameCard", nullable = false)
    private String nameCard;

    @Column(name = "numberCard", nullable = false)
    private String numberCard;

    @Column(name = "expirationDateCard", nullable = false)
    private String expirationDateCard;

    @Column(name = "cvvCard", nullable = false)
    private String cvvCard;

    @Column(name = "addressCard1", nullable = false)
    private String addressCard1;

    @Column(name = "addressCard2", nullable = true)
    private String addressCard2;

    @Column(name = "cityCard", nullable = false)
    private String cityCard;

    @Column(name = "zipCodeCard", nullable = false)
    private String zipCodeCard;

    @Column(name = "countryCard", nullable = false)
    private String countryCard;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flightNumberOutbound", referencedColumnName = "FlightNumber", insertable = false, updatable = false)
    private Flight flightOutbound;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flightNumberInbound", referencedColumnName = "FlightNumber", insertable = false, updatable = false)
    private Flight flightInbound;

    @OneToMany(mappedBy = "flightsReservation", cascade = CascadeType.ALL)
    private Set<PassengerFlight> passengers = new HashSet<>();

    @PrePersist
    public void generateReservationId() {
        this.id = generateRandomId();
    }

    private String generateRandomId() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder result = new StringBuilder(5);
        Random random = new Random();
        for (int i = 0; i < 5; i++) {
            result.append(characters.charAt(random.nextInt(characters.length())));
        }
        return result.toString();
    }


}