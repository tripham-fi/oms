package fi.haagahelia.oms.web;


import fi.haagahelia.oms.dto.AccountDto;
import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.ChangePasswordDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.service.AccountService;
import fi.haagahelia.oms.util.ResponseUtil;
import fi.haagahelia.oms.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Account", description = "get account info, change password, reset password and check first login")
@RestController
@RequestMapping("/account")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService userService) {
        this.accountService = userService;
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
