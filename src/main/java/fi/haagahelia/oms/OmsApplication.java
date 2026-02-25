package fi.haagahelia.oms;

import fi.haagahelia.oms.domain.Role;
import fi.haagahelia.oms.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class OmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(OmsApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(RoleRepository roleRepository) {
		return args -> {
			String[] roles = {"EMPLOYEE", "ADMIN", "SUPER_ADMIN"};
			for (String roleName : roles) {
				if (roleRepository.findByName(roleName).isEmpty()) {
					Role role = new Role();
					role.setName(roleName);
					roleRepository.save(role);
					System.out.println("Created default role: " + roleName);
				}
			}
		};
	}

}
