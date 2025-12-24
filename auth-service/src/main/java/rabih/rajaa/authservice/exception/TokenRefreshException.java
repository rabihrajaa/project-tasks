package rabih.rajaa.authservice.exception;

public class TokenRefreshException extends RuntimeException {

    public TokenRefreshException(String token, String msg) {
        super(msg + " Token: " + token);
    }
}