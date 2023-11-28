package ua.ies.TravelingBooking.TravelingBooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TicketsTrain")
public class Ticket_train {
    
    @Id
    @Column(name = "TicketNumber")
    private String ticketNumber;
    
    @Column(name = "User_id")
    private String userId;

    @Column(name = "Train_number")
    private String trainNumber;

    @Column(name = "Seat", nullable = false)
    private String seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "User_id", referencedColumnName = "UserID", insertable = false, updatable = false)
    private User UserID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Train_number", referencedColumnName = "TrainNumber", insertable = false, updatable = false)
    private Train TrainNumber;
}