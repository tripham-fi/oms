package fi.haagahelia.oms.repository;

import fi.haagahelia.oms.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long countByUsername(String exactUsername);
    long countByUsernameStartingWith(String prefix);
    List<User> findByEnabledTrue();
}
