package fi.haagahelia.oms.dto.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserCreateDto {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String role;
    private String location;

    @NotBlank
    @Email
    private String email;

    @Past
    @NotNull
    private LocalDate dob;
}
