package fi.haagahelia.oms.api;


import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.dto.Account.AccountDto;
import fi.haagahelia.oms.dto.Account.LoginDto;
import fi.haagahelia.oms.dto.Account.ResetPasswordDto;
import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.Account.ChangePasswordDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.service.AccountService;
import fi.haagahelia.oms.service.JwtService;
import fi.haagahelia.oms.util.ResponseUtil;
import fi.haagahelia.oms.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Date;
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

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> login(
            @RequestBody LoginDto input) {

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

            HttpHeaders headers = createAndAttachRefreshCookie(userDetails);
            Map<String, Object> data = createAccessTokenResponseData(userDetails);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(ApiResponseDto.success(data));

        } catch (BadCredentialsException e) {
            return ResponseUtil.error("Invalid username or password", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return ResponseUtil.error("Login failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/refresh-token", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> refresh(HttpServletRequest request) {

        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseUtil.error("Refresh token required", HttpStatus.BAD_REQUEST);
        }

        try {
            // Find user by hashed refresh token
            User user = accountService.findByRefreshToken(refreshToken)
                    .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

            // Check expiry
            if (user.getRefreshTokenExpiryDate() == null ||
                    user.getRefreshTokenExpiryDate().before(new Date())) {
                return ResponseUtil.error("Refresh token expired", HttpStatus.UNAUTHORIZED);
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

            // Validate refresh token signature & expiry
            if (!jwtService.isRefreshTokenValid(refreshToken, userDetails)) {
                return ResponseUtil.error("Invalid refresh token", HttpStatus.UNAUTHORIZED);
            }

            Map<String, Object> data = createAccessTokenResponseData(userDetails);
            HttpHeaders headers = createAndAttachRefreshCookie(userDetails);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(ApiResponseDto.success(data));

        } catch (BadCredentialsException e) {
            return ResponseUtil.error("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return ResponseUtil.error("Refresh failed", HttpStatus.INTERNAL_SERVER_ERROR);
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
        String username = SecurityUtil.getCurrentUsernameOrThrow();
        Result<AccountDto> result = accountService.changePassword(username, dto);

        return ResponseUtil.handleResult(result);
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/reset-password", method = RequestMethod.PUT)
    public ResponseEntity<ApiResponseDto<AccountDto>> resetPassword(
            @Valid @RequestBody ResetPasswordDto dto) {
        String username = SecurityUtil.getCurrentUsernameOrThrow();

        Result<AccountDto> result = accountService.resetPassword(username, dto.getNewPassword());

        return ResponseUtil.handleResult(result);
    }

    private HttpHeaders createAndAttachRefreshCookie(UserDetails userDetails) {
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        accountService.saveRefreshToken(refreshToken, userDetails, jwtService.getRefreshExpirationMs());
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Strict")
                .maxAge(Duration.ofMillis(jwtService.getRefreshExpirationMs()))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return headers;
    }

    private Map<String, Object> createAccessTokenResponseData(UserDetails userDetails) {
        String newToken = jwtService.generateToken(userDetails);
        long expiresInSeconds = jwtService.getExpirationMs() / 1000;
        return Map.of(
                "token", newToken,
                "tokenType", "Bearer",
                "expiresIn", expiresInSeconds,
                "username", userDetails.getUsername()
        );
    }
}
