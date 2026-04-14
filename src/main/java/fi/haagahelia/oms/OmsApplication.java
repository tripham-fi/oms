package fi.haagahelia.oms;

import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.repository.UserRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;


@OpenAPIDefinition(
		info = @Info(
				title = "OMS - Meeting Room & Event Scheduling API",
				version = "0.1.0",
				description = "REST API for managing meeting rooms, events, bookings and user access."
		)
)
@SpringBootApplication
public class OmsApplication {
	private static final Logger log = LoggerFactory.getLogger(OmsApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(OmsApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(UserRepository userRepository,
								  PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.count() == 0) {

				log.info("Creating initial users...");

				// Admin
				User admin = new User();
				admin.setFirstName("Admin");
				admin.setLastName("User");
				admin.setUsername("admin");
				admin.setEmail("admin@example.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setDateOfBirth(LocalDate.of(1990, 1, 1));
				admin.setRole("ADMIN");
				userRepository.save(admin);

				// Super Admin
				User superAdmin = new User();
				superAdmin.setFirstName("Super");
				superAdmin.setLastName("Admin");
				superAdmin.setUsername("supa");
				superAdmin.setEmail("superadmin@example.com");
				superAdmin.setPassword(passwordEncoder.encode("super123"));
				superAdmin.setDateOfBirth(LocalDate.of(1985, 5, 15));
				superAdmin.setRole("SUPER_ADMIN");
				userRepository.save(superAdmin);

			} else {
				log.info("Users already exist → skipping initial user creation");
			}
		};
	}

}
