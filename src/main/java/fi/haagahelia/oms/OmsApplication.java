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
				admin.setFullname("Administrator");
				admin.setUsername("admin");
				admin.setEmail("admin@example.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole("ADMIN");
				admin.setEnabled(true);
				userRepository.save(admin);

				// Super Admin
				User superAdmin = new User();
				superAdmin.setFullname("Super Administrator");
				superAdmin.setUsername("supa");
				superAdmin.setEmail("superadmin@example.com");
				superAdmin.setPassword(passwordEncoder.encode("super123"));
				superAdmin.setRole("SUPER_ADMIN");
				superAdmin.setEnabled(true);
				userRepository.save(superAdmin);

			} else {
				log.info("Users already exist → skipping initial user creation");
			}
		};
	}

}
