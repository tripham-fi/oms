package fi.haagahelia.oms.util;

import fi.haagahelia.oms.dto.ApiResponseDto;
import fi.haagahelia.oms.dto.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResponseUtil {
    private ResponseUtil() {

    }

    public static <T> ResponseEntity<ApiResponseDto<T>> handleResult(Result<T> result) {
        return handleResult(result, HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> handleResult(Result<T> result, HttpStatus successStatus) {
        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        if (result.isSuccess()) {
            if (result.value() == null) {
                return ResponseEntity.status(successStatus).build();
            }
            return ResponseEntity.status(successStatus)
                    .body(ApiResponseDto.success(result.value()));
        }

        return ResponseEntity.badRequest()
                .body(ApiResponseDto.error(result.error()));
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> success(T data) {
        return ResponseEntity.ok(ApiResponseDto.success(data));
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.success(data));
    }

    public static ResponseEntity<ApiResponseDto<Void>> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(ApiResponseDto.error(message));
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> badRequest(String message) {
        return error(message, HttpStatus.BAD_REQUEST);
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> unauthorized(String message) {
        return error(message, HttpStatus.UNAUTHORIZED);
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> notFound(String message) {
        return error(message, HttpStatus.NOT_FOUND);
    }

}
