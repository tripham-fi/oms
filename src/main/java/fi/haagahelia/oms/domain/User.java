package fi.haagahelia.oms.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String fullname;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean defaultPassword = true;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(updatable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    public User(String username, String fullname, String email, String password, String role, boolean enabled, boolean defaultPassword) {
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
        this.defaultPassword = defaultPassword;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
