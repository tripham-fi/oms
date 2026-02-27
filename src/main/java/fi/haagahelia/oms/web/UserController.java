package fi.haagahelia.oms.web;

import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.RegisterDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.dto.UserDto;
import fi.haagahelia.oms.service.UserService;
import fi.haagahelia.oms.util.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users", description = "User list, registration, login and authentication")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/current", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto<UserDto>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (!isUserLoggedIn(auth)) {
            return ResponseUtil.unauthorized("Not authenticated");
        }

        String username = auth.getName();
        Result<UserDto> result = userService.getCurrentUser(username);
        return ResponseUtil.handleResult(result);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<String>> register(@Valid @RequestBody RegisterDto dto) {
        try {
            userService.register(dto);
            return ResponseUtil.created("User registered successfully");
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<String>> login() {
        // TODO: JWT TOKEN IMPLEMENT NEEDED
        return ResponseUtil.success("Login successful (placeholder)");
    }

    private boolean isUserLoggedIn(Authentication auth) {
        return auth != null &&
                auth.isAuthenticated() &&
                !(auth.getPrincipal() instanceof String);
    }
}
