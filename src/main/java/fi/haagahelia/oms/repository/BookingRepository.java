package fi.haagahelia.oms.repository;

import fi.haagahelia.oms.domain.Booking;
import fi.haagahelia.oms.domain.Room;
import fi.haagahelia.oms.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoomAndBookingDate(Room room, LocalDate date);
    boolean existsByRoomAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Room room, LocalDate date, LocalTime start, LocalTime end);
    List<Booking> findByUser(User user);
}
