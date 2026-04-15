package fi.haagahelia.oms.service;

import fi.haagahelia.oms.domain.Booking;
import fi.haagahelia.oms.domain.Room;
import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.dto.Booking.BookingCreateDto;
import fi.haagahelia.oms.dto.Booking.BookingDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.repository.BookingRepository;
import fi.haagahelia.oms.repository.RoomRepository;
import fi.haagahelia.oms.repository.UserRepository;
import fi.haagahelia.oms.util.SecurityUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Result<BookingDto> createBooking(BookingCreateDto dto) {
        String username = SecurityUtil.getCurrentUsernameOrThrow();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        boolean hasConflict = bookingRepository.existsByRoomAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
                room, dto.getBookingDate(), dto.getEndTime(), dto.getStartTime());

        if (hasConflict) {
            return Result.failure("Room is already booked for the selected time");
        }

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setTitle(dto.getTitle());
        booking.setBookingDate(dto.getBookingDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());

        booking = bookingRepository.save(booking);

        return Result.success(BookingDto.from(booking));
    }

    @Transactional
    public Result<String> deleteBooking(Long id){
        String username = SecurityUtil.getCurrentUsernameOrThrow();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking existbooking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking with id: " +  id + " does not found"));

        if (!existbooking.getUser().getUsername().equals(user.getUsername())) {
            return Result.failure("You can only delete your own bookings");
        }

        try {
            bookingRepository.deleteById(id);
            return Result.success("Booking deleted successfully");
        } catch (Exception e) {
            return Result.failure("Failed to delete booking: " + e.getMessage());
        }
    }

    public Result<List<BookingDto>> getMyBookings() {
        String username = SecurityUtil.getCurrentUsernameOrThrow();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUser(user);
        List<BookingDto> bookingDtos = bookings.stream()
                .map(BookingDto::from)
                .collect(Collectors.toList());
        return Result.success(bookingDtos);
    }

    public Result<List<Room>> getAvailableRooms() {
        try {
            List<Room> rooms = roomRepository.findByAvailableTrue();
            return Result.success(rooms);
        } catch (Exception e) {
            return Result.failure("Failed to load available rooms");
        }
    }
}
