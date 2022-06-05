package com.sgcc.sgccapi.constant;

public class SecurityConstants {
    public static final String LOGIN_PATH = "/api/auth/login";
    public static final String AUTH_PATH = "/api/auth";
    public static final String AUTH_PATH_REGEX = "/api/auth/**";
    public static final String TOKEN_REFRESH_PATH = "/api/auth/token/refresh";
    public static final String MANTENIMIENTO_PATH = "/api/mantenimiento";
    public static final String MANTENIMIENTO_PATH_REGEX = "/api/mantenimiento/**";
    public static final String SEGURIDAD_PATH_REGEX = "/api/seguridad/**";

    public static final String BEARER_AUTHENTICATION = "Bearer ";
    public static final String ROLES_CLAIMS_NAME = "roles";

    public static final String ADMIN_ROLE = "Administrador";
    public static final String INQUILINO_ROLE = "Inquilino";

    public static final long TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 HORA
    public static final long REFRESH_TOKEN_EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12 HORAS
}
