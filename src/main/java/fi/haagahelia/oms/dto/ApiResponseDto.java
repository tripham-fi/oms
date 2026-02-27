package fi.haagahelia.oms.dto;


import java.util.List;

public record ApiResponseDto<T>(
        String status,
        T result,
        List<String> errors
) {

    public static <T> ApiResponseDto<T> success (T data) {
        return new ApiResponseDto<>("success", data, List.of());
    }

    public static <T> ApiResponseDto<T> success() {
        return new ApiResponseDto<>("success", null, List.of());
    }

    public static <T> ApiResponseDto<T> error(String message) {
        return new ApiResponseDto<>("error", null, List.of(message));
    }

    public static <T> ApiResponseDto<T> error(List<String> errors) {
        return new ApiResponseDto<>("error", null, errors);
    }
}
