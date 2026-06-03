# ─── Etapa 1: Build con Maven ───────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar POM primero para aprovechar cache de capas Docker
COPY pom.xml .
RUN mvn dependency:go-offline --no-transfer-progress

# Copiar código fuente y compilar (sin ejecutar tests en imagen de producción)
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# ─── Etapa 2: Imagen de runtime ligera ──────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto por Spring Boot
EXPOSE 8080

# Healthcheck para que Render/Docker sepa cuándo la app está lista
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
