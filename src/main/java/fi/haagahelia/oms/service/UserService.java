package fi.haagahelia.oms.service;

import fi.haagahelia.oms.constant.Role;
import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.dto.*;
import fi.haagahelia.oms.dto.User.UserCreateDto;
import fi.haagahelia.oms.dto.User.UserUpdateDto;
import fi.haagahelia.oms.repository.UserRepository;
import fi.haagahelia.oms.util.CommonUtil;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(RegisterDto dto) throws Exception {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new Exception("Username already exists");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new Exception("Email already exists");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("EMPLOYEE");
        user.setEnabled(true);

        userRepository.save(user);
    }


    @Transactional
    public Result<UserDto> createUser(UserCreateDto dto) throws Exception{
        if (!Role.isValid(dto.getRole())) {
            return Result.failure("Invalid role. Allowed: EMPLOYEE, ADMIN, SUPER_ADMIN");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            return Result.failure("Email already exists");
        }

        String generatedUserName = CommonUtil.generateUserName(dto.getFirstName(), dto.getLastName());
        String finalUsername;

        try {
            finalUsername = findAvailableUsername(generatedUserName);
        } catch (IllegalStateException e) {
            return Result.failure(e.getMessage());
        }

        User user = new User();
        user.setUsername(finalUsername);
        user.setLastName(dto.getLastName());
        user.setFirstName(dto.getFirstName());
        user.setDateOfBirth(dto.getDob());
        user.setRole(dto.getRole());
        user.setEmail(dto.getEmail());

        String generatedPassword = finalUsername + "@" + dto.getDob().format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        user.setPassword(passwordEncoder.encode(generatedPassword));

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            return Result.failure("Failed to create user, possible duplicate. Please try again. message:" + e.getMessage());
        }
        return Result.success(UserDto.from(user));
    }

    @Transactional
    public Result<UserDto> updateUser(UserUpdateDto dto) {
        User existUser = userRepository.findById(dto.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User with id: " +  dto.getId() + " does not found"));

        if(!Role.isValid(dto.getRole())) {
            return Result.failure("Invalid role. Allowed: EMPLOYEE, ADMIN, SUPER_ADMIN");
        }

        try {
            existUser.setDateOfBirth(dto.getDob());
            existUser.setRole(dto.getRole());
            existUser = userRepository.save(existUser);
        } catch (DataIntegrityViolationException e) {
            return Result.failure("Failed to update user, possible data conflict. Please try again. message:" + e.getMessage());
        }

        return Result.success(UserDto.from(existUser));
    }

    @Transactional
    public Result<String> disableUser(Long id) {
        User existUser = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User with id: " +  id + " does not found"));

        if (Role.SUPER_ADMIN.name().equalsIgnoreCase(existUser.getRole())) {
            return Result.failure("SUPER ADMIN users cannot be modified");
        }

        try {
            existUser.setEnabled(false);
            userRepository.save(existUser);
        } catch (DataIntegrityViolationException e) {
            return Result.failure("Failed to disable user, possible data conflict. Please try again. message:" + e.getMessage());
        }

        return Result.success("user " + existUser.getUsername() + " is disabled");
    }

    // TODO merge create and update service into save service

    public Result<UserDto> findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return Result.success(UserDto.from(user));
    }

    public Result<List<UserDto>> getUsers() {
        List<User> users = userRepository.findByEnabledTrue();
        List<UserDto> dtos = users.stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
        return Result.success(dtos);
    }

    private String findAvailableUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Base username cannot be empty");
        }

        if (!userRepository.existsByUsername(username)) {
            return username;
        }

        long start = userRepository.countByUsernameStartingWith(username);
        long current = start;

        for (int attempt = 0; attempt < 10; attempt++) {
            String result = username + current;
            if (!userRepository.existsByUsername(result)) {
                return result;
            }
            current++;
        }

        throw new IllegalStateException(
                "Could not generate unique username for base '%s' after 10 attempts (started at %d)"
                        .formatted(username, start)
        );
    }
}
