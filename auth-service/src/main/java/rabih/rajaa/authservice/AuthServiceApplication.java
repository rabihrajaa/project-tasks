package rabih.rajaa.authservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import rabih.rajaa.authservice.entity.User;
import rabih.rajaa.authservice.entity.UserRole;
import rabih.rajaa.authservice.repository.UserRepository;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin user
            if (!userRepository.existsByEmail("admin@gmail.com")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setRole(UserRole.ADMIN);
                admin.setDepartment("IT");
                admin.setPosition("Administrator");
                admin.setIsActive(true);
                userRepository.save(admin);
                System.out.println("Admin user created: email=admin@gmail.com, password=admin1234");
            }

            // Create regular user
            if (!userRepository.existsByUsername("user")) {
                User user = new User();
                user.setUsername("user");
                user.setEmail("user@example.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setFirstName("Regular");
                user.setLastName("User");
                user.setRole(UserRole.USER);
                user.setDepartment("Development");
                user.setPosition("Developer");
                user.setIsActive(true);
                userRepository.save(user);
                System.out.println("Regular user created: username=user, password=user123");
            }
        };
    }
}