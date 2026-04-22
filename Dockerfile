FROM eclipse-temurin:17-jdk

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven

# Copy project files
COPY . .

# Build project
RUN mvn clean package -DskipTests

# Run Spring Boot
CMD ["java", "-jar", "target/*jar"]
