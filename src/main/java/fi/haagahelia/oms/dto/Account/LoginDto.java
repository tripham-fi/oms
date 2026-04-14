package fi.haagahelia.oms.dto.Account;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {

    @NotBlank
    public String username;

    @NotBlank
    public String password;
}
