FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

# Copy project
COPY . .

# Build jar
RUN mvn clean package -DskipTests

# Show jar file (for debugging)
RUN ls target

# Run jar
CMD ["sh", "-c", "java -jar target/*.jar"]
