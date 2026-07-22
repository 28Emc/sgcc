# Build stage
FROM gradle:8.9-jdk21 AS build
WORKDIR /app

COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

RUN gradle bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
