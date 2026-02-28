package fi.haagahelia.oms.service;

import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.dto.*;
import fi.haagahelia.oms.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Result<UserDto> findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return Result.success(UserDto.from(user));
    }

    public Result<List<UserDto>> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> dtos = users.stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
        return Result.success(dtos);
    }
}
