package fi.haagahelia.oms.dto;

public record Result<T>(
        boolean isSuccess,
        T value,
        String error
) {
    public static <T> Result<T> success(T value) {
        return new Result<>(true, value, null);
    }

    public static <T> Result<T> failure(String error) {
        return new Result<>(false, null, error);
    }

    public boolean isFailure() {
        return !isSuccess;
    }

    public T getOrThrow() {
        if (isSuccess) {
            return value;
        }
        throw new RuntimeException("Result failed: " + error);
    }

}
