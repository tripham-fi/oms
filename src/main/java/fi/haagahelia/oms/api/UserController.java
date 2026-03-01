package fi.haagahelia.oms.api;

import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.RegisterDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.dto.UserDto;
import fi.haagahelia.oms.service.UserService;
import fi.haagahelia.oms.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Users", description = "User list, create, edit and disable ")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Register new user to the database",
            description = "Automatically create new user to the database for new employee" +
                    " username = position + employee_number (e.g SD4406)" +
                    " password is 6 character auto-generated" +
                    " the rest ...TBD"
    )
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<String>> register(@Valid @RequestBody RegisterDto dto) {
        try {
            userService.register(dto);
            return ResponseUtil.created("User registered successfully");
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }

    @Operation(
            summary = "List all users",
            description = "Returns paginated list of users. Admin and Super Admin only."
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto<List<UserDto>>> getUserList() {
        Result<List<UserDto>> users = userService.getUsers();
        return ResponseUtil.handleResult(users);
    }
}
