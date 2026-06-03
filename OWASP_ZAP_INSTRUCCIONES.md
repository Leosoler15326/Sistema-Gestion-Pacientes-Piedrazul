# Guía OWASP ZAP – SGP Piedrazul
## Pruebas de Seguridad para el Tercer Corte (Ingeniería de Software III)

---

## ¿Qué es OWASP ZAP?

OWASP ZAP (Zed Attack Proxy) es una herramienta gratuita y de código abierto para encontrar vulnerabilidades de seguridad en aplicaciones web. Es la herramienta estándar de la industria para el OWASP Top 10.

---

## Requisito del entregable

> "Testear con OWASP ZAP al menos dos vulnerabilidades de la aplicación web acorde a la especificación OWASP top 10. Generar un informe breve de las vulnerabilidades reportadas."

---

## Paso 1: Levantar la aplicación localmente

```bash
# En la raíz del proyecto
docker-compose up -d          # inicia PostgreSQL

# En una terminal
cd Backend
mvn spring-boot:run           # backend en http://localhost:8080

# En otra terminal
cd Frontend
npm run dev                   # frontend en http://localhost:5173
```

Verifica que funcione:
```
GET http://localhost:8080/api/health → {"status":"UP"}
```

---

## Paso 2: Instalar OWASP ZAP

### Opción A – Instalador (recomendado para generar informe)
1. Ir a: https://www.zaproxy.org/download/
2. Descargar **"ZAP 2.x.x Standard"** para Windows
3. Instalar y abrir

### Opción B – Docker (sin instalación)
```bash
docker pull ghcr.io/zaproxy/zaproxy:stable
```

---

## Paso 3: Escaneo automático con Docker (más rápido)

```bash
# Escaneo del backend (API REST)
docker run --network=host ghcr.io/zaproxy/zaproxy:stable \
  zap-api-scan.py \
  -t http://localhost:8080/api \
  -f openapi \
  -r zap_report_backend.html \
  -J zap_report_backend.json

# Escaneo del frontend (aplicación web)
docker run --network=host ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
  -t http://localhost:5173 \
  -r zap_report_frontend.html \
  -J zap_report_frontend.json
```

Los archivos `zap_report_*.html` se generan en el directorio actual.

---

## Paso 4: Escaneo con interfaz gráfica (ZAP Desktop)

1. Abrir ZAP Desktop
2. **Automated Scan** (menú Quick Start):
   - URL to attack: `http://localhost:8080`
   - Clic en "Attack"
3. Esperar ~5–10 minutos
4. Ir a **Report → Generate Report** → seleccionar HTML o PDF

---

## Paso 5: Vulnerabilidades esperadas y cómo documentarlas

### Vulnerabilidades probables en este sistema

| OWASP Top 10 | ID | Descripción | Riesgo esperado |
|---|---|---|---|
| A05 – Security Misconfiguration | ZAP Alert | Headers de seguridad faltantes (X-Content-Type-Options, X-Frame-Options, etc.) | Medio |
| A07 – Identification and Auth Failures | ZAP Alert | JWT no tiene expiración corta / sin bloqueo por intentos fallidos completo | Medio |
| A02 – Cryptographic Failures | ZAP Alert | Tokens en localStorage (XSS podría robarlos) | Bajo-Medio |
| A06 – Vulnerable Components | ZAP Alert | Dependencias con CVEs conocidos | Bajo |
| A01 – Broken Access Control | Manual | Probar acceder a /api/usuarios sin token admin | Alto (si falla) |

### Cómo generar el informe para el entregable

El informe debe tener:

1. **Portada**: nombre del sistema, fecha, herramienta usada
2. **Resumen ejecutivo** (2–3 líneas)
3. **Tabla de hallazgos**:

| # | Vulnerabilidad | OWASP Cat. | Severidad | URL afectada | Evidencia ZAP | Recomendación |
|---|---|---|---|---|---|---|
| 1 | X-Content-Type-Options faltante | A05 | Bajo | http://localhost:8080/api/health | Screenshot alerta ZAP | Agregar header en SecurityConfig |
| 2 | Content Security Policy no configurado | A05 | Medio | http://localhost:5173 | Screenshot alerta ZAP | Configurar CSP en nginx.conf |

4. **Capturas de pantalla** de las alertas en ZAP
5. **Plan de remediación** (qué archivo cambiar, cómo)

---

## Paso 6: Correcciones recomendadas tras el escaneo

### Agregar headers de seguridad en Spring Boot (SecurityConfig.java)

```java
// Dentro del filterChain, agregar:
.headers(headers -> headers
    .contentTypeOptions(Customizer.withDefaults())
    .frameOptions(frame -> frame.deny())
    .httpStrictTransportSecurity(hsts -> hsts
        .maxAgeInSeconds(31536000)
        .includeSubDomains(true))
)
```

### Agregar Content-Security-Policy en nginx.conf (Frontend)

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## Paso 7: Script automatizado para CI/CD (opcional)

Guardar como `zap-scan.sh` en la raíz del proyecto:

```bash
#!/bin/bash
# Ejecuta escaneo ZAP baseline y falla el build si hay alertas de riesgo ALTO
docker run --network=host ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
  -t http://localhost:8080 \
  -r zap_report.html \
  --fail-on-high-risk

echo "Reporte generado: zap_report.html"
```

---

## Recursos útiles

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- ZAP User Guide: https://www.zaproxy.org/docs/
- ZAP Alerts: https://www.zaproxy.org/docs/alerts/

---

*Guía generada para SGP Piedrazul – Tercer Corte 2026.1 – Ingeniería de Software III*
