package fi.haagahelia.oms.api;


import fi.haagahelia.oms.dto.Account.AccountDto;
import fi.haagahelia.oms.dto.Account.LoginDto;
import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.Account.ChangePasswordDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.service.AccountService;
import fi.haagahelia.oms.service.JwtService;
import fi.haagahelia.oms.util.ResponseUtil;
import fi.haagahelia.oms.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Account", description = "get account info, change password, reset password and check first login")
@RestController
@RequestMapping("/account")
public class AccountController {
    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AccountController(AccountService accountService,
                             AuthenticationManager authenticationManager,
                             JwtService jwtService,
                             UserDetailsService userDetailsService) {
        this.accountService = accountService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> login(
            LoginDto input) {

        String username = input.getUsername();
        String password = input.getPassword();

        if (username == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Username and password are required"));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            long expiresInSeconds = 3600000 / 1000;

            Map<String, Object> data = Map.of(
                    "token", token,
                    "tokenType", "Bearer",
                    "expiresIn", expiresInSeconds,
                    "username", userDetails.getUsername()
            );

            return ResponseEntity.ok(ApiResponseDto.success(data));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDto.error("Login failed"));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/current", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto<AccountDto>> getCurrentUser() {
        Result<AccountDto> result = accountService.getCurrentAccount();
        return ResponseUtil.handleResult(result);
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/change-password", method = RequestMethod.PUT)
    public ResponseEntity<ApiResponseDto<AccountDto>> changePassword(
            @Valid @RequestBody ChangePasswordDto dto) {
        // TODO: Enforcing mandatory for first login

        if (!SecurityUtil.isAuthenticated()) {
            return ResponseUtil.unauthorized("Not authenticated");
        }

        String username = SecurityUtil.getCurrentUsernameOrThrow();
        Result<AccountDto> result = accountService.changePassword(username, dto);

        return ResponseUtil.handleResult(result);
    }

    @RequestMapping(value = "/first-login", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto<AccountDto>> firstLogin() {
        if (!SecurityUtil.isAuthenticated()) {
            return ResponseUtil.unauthorized("Not authenticated");
        }

        String username = SecurityUtil.getCurrentUsernameOrThrow();
        Result<AccountDto> result = accountService.markFirstLoginCompleted(username);

        return ResponseUtil.handleResult(result);
    }
}
