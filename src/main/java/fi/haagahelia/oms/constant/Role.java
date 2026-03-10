package fi.haagahelia.oms.constant;

import java.util.Arrays;

public enum Role {
    EMPLOYEE,
    ADMIN,
    SUPER_ADMIN;

    public static boolean isValid(String role) {
        return Arrays.stream(Role.values())
                .anyMatch(r -> r.name().equalsIgnoreCase(role));
    }
}
