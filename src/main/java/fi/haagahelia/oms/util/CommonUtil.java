package fi.haagahelia.oms.util;

public final class CommonUtil {
    public CommonUtil() {}

    public static String generateUserName(String firstName, String lastName) {
        StringBuilder result = new StringBuilder();

        result.append(firstName.toLowerCase(), 0, Math.min(3, firstName.length()));

        String[] lastNameParts = lastName.split("\\s+");
        if(lastNameParts.length > 1) {
            for (String part : lastNameParts) {
                result.append(part.toLowerCase().charAt(0));
            }
        } else {
            result.append(lastName.toLowerCase(), 0, Math.min(5, lastName.length()));
        }

        return result.toString();
    }

    public static String appendIdToUsername(String username, long incrementId) {
        return username + incrementId;
    }
}
