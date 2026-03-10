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
    public String firstName;

    @NotBlank
    public String lastName;

    @NotBlank
    public String role;
    public String location;

    @NotBlank
    @Email
    public String email;

    @Past
    @NotNull
    private LocalDate dob;
}
