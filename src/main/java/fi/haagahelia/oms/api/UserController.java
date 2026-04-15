package fi.haagahelia.oms.api;

import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.dto.User.UserCreateDto;
import fi.haagahelia.oms.dto.User.UserUpdateDto;
import fi.haagahelia.oms.dto.User.UserDto;
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
            summary = "Create new user (admin only)",
            description = "Creates a new user with auto-generated username (based on name initials + number if needed) " +
                    "and temporary password (username@DDMMYYYY). User must change password on first login."
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<UserDto>> createNewUser(@Valid @RequestBody UserCreateDto dto) {
        try {
            Result<UserDto> result = userService.createUser(dto);

            if(result.isSuccess()) {
                UserDto created = result.value();
                return ResponseUtil.created(created);
            }

            return ResponseUtil.badRequest(result.error());
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }

    @Operation(
            summary = "Update existing user (admin and super admin only)",
            description = "Update an existing user with id"
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @RequestMapping(value = "", method = RequestMethod.PUT)
    public ResponseEntity<ApiResponseDto<UserDto>> updateExistUser(@Valid @RequestBody UserUpdateDto dto) {
        try {
            Result<UserDto> result = userService.updateUser(dto);

            if(result.isSuccess()) {
                UserDto created = result.value();
                return ResponseUtil.created(created);
            }

            return ResponseUtil.badRequest(result.error());
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }

    @Operation(
            summary = "Disable existing user except super admin user (admin and super admin only)",
            description = "Disable an existing user with id"
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<ApiResponseDto<String>> deleteUser(@PathVariable Long id) {
        Result<String> result = userService.disableUser(id);
        return ResponseUtil.handleResult(result);
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
