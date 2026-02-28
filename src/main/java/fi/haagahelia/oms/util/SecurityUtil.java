package fi.haagahelia.oms.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public final class SecurityUtil {
    private SecurityUtil() {}

    public static String getCurrentUsernameOrThrow() {
        String username = getCurrentUsername();
        if (username == null) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return username;
    }

    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails details) {
            return details.getUsername();
        }
        return null;
    }

    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails;
    }
}
