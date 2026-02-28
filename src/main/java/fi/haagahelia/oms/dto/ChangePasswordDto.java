package fi.haagahelia.oms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDto {
    @NotBlank(message = "Current password is required")
    public String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    public String newPassword;
}
