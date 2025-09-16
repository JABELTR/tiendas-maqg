# Etapa 1: construir jar
FROM maven:3.9.7-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Etapa 2: imagen final más ligera
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto (Render usa este para enrutar)
EXPOSE 8080

# Arranque de la app
ENTRYPOINT ["java","-jar","app.jar"]
