package fi.haagahelia.oms.api;

import fi.haagahelia.oms.domain.Room;
import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.Booking.BookingCreateDto;
import fi.haagahelia.oms.dto.Booking.BookingDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.service.BookingService;
import fi.haagahelia.oms.util.ResponseUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<BookingDto>> createBooking(
            @Valid @RequestBody BookingCreateDto dto) {

        Result<BookingDto> result = bookingService.createBooking(dto);

        if (result.isSuccess()) {
            return ResponseUtil.created(result.value());
        } else {
            return ResponseUtil.badRequest(result.error());
        }
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/my", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto<List<BookingDto>>> getMyBookings() {
        Result<List<BookingDto>> result = bookingService.getMyBookings();

        if (result.isSuccess()) {
            return ResponseUtil.handleResult(result);
        } else {
            return ResponseUtil.badRequest(result.error());
        }
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/rooms", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto<List<Room>>> getAvailableRooms() {
        Result<List<Room>> result = bookingService.getAvailableRooms();
        return ResponseUtil.handleResult(result);
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<ApiResponseDto<String>> deleteBooking(@PathVariable Long id) {
        Result<String> result = bookingService.deleteBooking(id);
        return ResponseUtil.handleResult(result);
    }
}