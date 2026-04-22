# Step 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# This builds the jar and then finds it, renaming it to app.jar
RUN mvn clean package -DskipTests && \
    cp target/*.jar target/app.jar

# Step 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy only the renamed jar from the builder stage
COPY --from=build /app/target/app.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
