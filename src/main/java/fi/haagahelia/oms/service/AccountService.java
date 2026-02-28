package fi.haagahelia.oms.service;

import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.dto.AccountDto;
import fi.haagahelia.oms.dto.ChangePasswordDto;
import fi.haagahelia.oms.dto.Result;
import fi.haagahelia.oms.repository.UserRepository;
import fi.haagahelia.oms.util.SecurityUtil;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Result<AccountDto> changePassword(String username, ChangePasswordDto input) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(input.getCurrentPassword(), user.getPassword())) {
            return Result.failure("Incorrect current password");
        }

        if (passwordEncoder.matches(input.getNewPassword(), user.getPassword())) {
            return Result.failure("New password cannot be the same as the current one");
        }

        user.setPassword(passwordEncoder.encode(input.getNewPassword()));
        user.setDefaultPassword(false);

        userRepository.save(user);

        return Result.success(AccountDto.from(user));
    }

    @Transactional
    public Result<AccountDto> markFirstLoginCompleted(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isDefaultPassword()) {
            return Result.success(AccountDto.from(user));
        }

        user.setDefaultPassword(false);
        userRepository.save(user);

        return Result.success(AccountDto.from(user));
    }

    public Result<AccountDto> getCurrentAccount() {
        if (!SecurityUtil.isAuthenticated()) {
            return Result.failure("User not authenticated");
        }

        String username = SecurityUtil.getCurrentUsernameOrThrow();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return Result.success(AccountDto.from(user));
    }

}
