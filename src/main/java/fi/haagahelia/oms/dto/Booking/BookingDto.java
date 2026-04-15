package fi.haagahelia.oms.dto.Booking;

import fi.haagahelia.oms.domain.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long id;
    private Long roomId;
    private String roomName;
    private String title;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String bookedBy;

    public static BookingDto from(Booking booking) {
        if (booking == null) {
            return null;
        }
        return BookingDto.builder()
                .id(booking.getId())
                .roomId(booking.getRoom() != null ? booking.getRoom().getId() : null)
                .roomName(booking.getRoom() != null ? booking.getRoom().getName() : null)
                .title(booking.getTitle())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .bookedBy(booking.getUser() != null ? booking.getUser().getUsername() : null)
                .build();
    }
}
