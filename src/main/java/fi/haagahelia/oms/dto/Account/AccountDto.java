package fi.haagahelia.oms.dto.Account;

import fi.haagahelia.oms.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    public String username;
    public String fullName;
    public String role;
    public boolean enabled;
    public boolean defaultPassword;

    public static AccountDto from(User user) {
        if (user == null) {
            return null;
        }
        return AccountDto.builder()
                .username(user.getUsername())
                .fullName(user.getFullname())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .defaultPassword(user.isDefaultPassword())
                .build();
    }
}
