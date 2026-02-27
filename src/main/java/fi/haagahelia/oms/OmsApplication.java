package fi.haagahelia.oms;

import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class OmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(OmsApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(UserRepository userRepository,
								  PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.count() == 0) {

				System.out.println("Creating initial users...");

				// Admin
				User admin = new User();
				admin.setUsername("admin");
				admin.setEmail("admin@example.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole("ADMIN");
				admin.setEnabled(true);
				userRepository.save(admin);

				// Super Admin
				User superAdmin = new User();
				superAdmin.setUsername("superadmin");
				superAdmin.setEmail("superadmin@example.com");
				superAdmin.setPassword(passwordEncoder.encode("super123"));
				superAdmin.setRole("SUPER_ADMIN");
				superAdmin.setEnabled(true);
				userRepository.save(superAdmin);

			} else {
				System.out.println("Users already exist → skipping initial user creation");
			}
		};
	}

}
