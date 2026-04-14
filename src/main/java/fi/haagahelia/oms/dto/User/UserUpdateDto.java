package fi.haagahelia.oms.dto.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateDto {

    @NotNull
    private Long id;

    @NotBlank
    private String role;

    @Past
    @NotNull
    private LocalDate dob;

}
