# SGCC Security Baseline

## Document Information

| Attribute | Value |
|---|---|
| Product | SGCC |
| Full Name | Sistema de Gestión de Cobros y Consumos de Recibos |
| Document Type | Security Baseline |
| Version | 1.0 |
| Status | Draft |
| Based On | Cloud Lab v1.0 |
| Backend Security | Spring Security |
| Authentication | JWT |
| Last Updated | 2026-07-21 |

---

## 1. Purpose

Este documento define los controles mínimos de seguridad para SGCC.

Objetivos:

- Proteger acceso al sistema.
- Controlar operaciones sensibles.
- Evitar exposición de información.
- Preparar evolución futura.

---

## 2. Security Principles

SGCC seguirá:

- Secure By Default
- Least Privilege
- Defense In Depth

---

## 3. Security Scope

SGCC v1.0 protegerá:

- Acceso al sistema.
- Información de propiedades.
- Datos de inquilinos.
- Consumos.
- Recibos.
- Liquidaciones.

---

## 4. Authentication Strategy

Versión inicial:

> JWT Authentication

Flujo:

```
User
   ↓
Login
   ↓
Backend validates credentials
   ↓
JWT Token
   ↓
Authenticated Requests
```

---

## 5. Authentication Endpoints

### Login

Endpoint:

```
POST /api/v1/auth/login
```

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "accessToken": "jwt-token",
  "expiresIn": 3600
}
```

---

## 6. Token Handling

JWT deberá contener:

```json
{
  "sub": "user-id",
  "roles": ["ADMIN"],
  "iat": 123456,
  "exp": 123999
}
```

---

## 7. Password Management

Reglas:

- Las contraseñas nunca deben almacenarse directamente.

Utilizar:

> BCrypt

Nunca:

> plain text password

---

## 8. Authorization Model

Modelo inicial:

> Role Based Access Control (RBAC)

Roles iniciales:

- ADMIN
- OPERATOR
- VIEWER

---

## 9. Role Responsibilities

### ADMIN

Puede:

- Administrar usuarios.
- Configurar servicios.
- Modificar información crítica.

---

### OPERATOR

Puede:

- Registrar lecturas.
- Registrar recibos.
- Generar liquidaciones.

---

### VIEWER

Puede:

- Consultar información.

---

## 10. Protected Resources

Ejemplo:

| Resource | Create | Read |
|---|---|---|
| Lecturas | OPERATOR, ADMIN | ADMIN, OPERATOR, VIEWER |
| Ajustes manuales | ADMIN | ADMIN |

---

Motivo:

> Los ajustes afectan montos finales.

---

## 11. API Security Rules

Todas las APIs deben:

- Validar autenticación.
- Validar autorización.
- Validar entrada.

---

Excepción:

Endpoint:

```
/health
```

> permitido sin autenticación.

---

## 12. Input Validation

Validar:

- Tipos.
- Longitudes.
- Rangos.
- Formatos.

---

Ejemplos:

- No aceptar: `readingValue` negativo
- No aceptar: `amount` null

---

## 13. Data Protection

Información sensible:

- Datos personales.
- Contactos.
- Identificadores.

---

Regla:

> No mostrar información innecesaria.

---

## 14. Logging Security

Nunca registrar:

- Passwords
- JWT Tokens
- Sensitive Data

---

Permitido:

- Request ID
- User ID
- Operation

---

Ejemplo:

**Correcto:**

```
User abc generated settlement xyz
```

**Incorrecto:**

```
JWT=eyJhbGc...
```

---

## 15. Audit Requirements

SGCC v1.0 tendrá auditoría básica.

Campos:

- `created_at`
- `created_by`
- `updated_at`
- `updated_by`

---

Operaciones críticas:

Registrar:

- Settlement generation
- Settlement adjustment
- Receipt modification

---

## 16. Adjustment Security

Los ajustes manuales requieren:

- Usuario autenticado.
- Razón obligatoria.
- Registro histórico.

---

Ejemplo:

```json
{
  "amount": -0.15,
  "reason": "Ajuste autorizado"
}
```

---

## 17. Configuration Security

Nunca almacenar:

- Database password
- JWT secret
- API keys

---

en:

- Código.
- Git.
- Docker image.

---

Usar:

> Environment Variables

---

## 18. Environment Separation

Cada ambiente tendrá secretos diferentes:

- local
- development
- staging
- production

---

Nunca reutilizar:

> Production secrets en local

---

## 19. Dependency Security

El proyecto debe revisar:

- Vulnerabilidades conocidas.
- Dependencias obsoletas.

---

Herramientas futuras:

- OWASP Dependency Check
- Snyk

---

## 20. HTTPS Requirement

Producción:

Obligatorio:

> HTTPS

HTTP permitido solamente:

> local development

---

## 21. Database Security

Reglas:

- Usuario exclusivo para aplicación.
- Mínimos privilegios.
- No usar usuario `postgres` en producción.

---

Ejemplo:

```
sgcc_app_user
```

---

## 22. Backup Considerations

Fuera de MVP:

Preparar:

- Backup automático.
- Restauración.
- Retención histórica.

---

## 23. Future Security Improvements

Fuera de SGCC v1.0:

- OAuth2
- Multi Tenant Security
- MFA
- Audit Log avanzado
- Encryption at Rest

---

## 24. Security Acceptance Criteria

SGCC v1.0 será aceptado cuando:

- Login funcional.
- JWT operativo.
- Roles aplicados.
- Secretos externos.
- Logs seguros.
- Operaciones críticas protegidas.

---

## 25. Status

| Item | Status |
|---|---|
| Security Baseline | ✓ |
| Implementation Ready | Pending |
