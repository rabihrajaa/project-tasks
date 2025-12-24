# Projects and Tasks Management System

This is a comprehensive project management system built using a microservices architecture. It allows users to manage projects, tasks, and includes features like authentication, notifications, and a user-friendly dashboard.

## Demo

Watch a demo of the project here: [Project Demo](https://drive.google.com/file/d/15ZIRIhbpsIvVEdknrPslNe2_hlIixbfj/view?usp=sharing)

## Tools and Technologies Used

- **Backend:**
  - Java 21
  - Spring Boot 3.2.0
  - Spring Cloud 2023.0.0
  - Maven
  - MySQL (for production)
  - JWT for authentication
  - GraphQL for API queries


- **Frontend:**
  - Angular 17
  - TypeScript
  - Tailwind CSS
  - NgRx for state management


- **Infrastructure:**
  - Eureka Server for service discovery
  - Spring Cloud Gateway for API gateway
  - Spring Cloud Config Server for centralized configuration

## Microservices Architecture

### Why Microservices?

The microservices architecture was chosen for this project for several key reasons:

- **Scalability:** Each service can be scaled independently based on its specific load and resource requirements. For example, the notification service might need more resources during peak hours, while the auth service maintains steady usage.

- **Technology Diversity:** Different services can use different technologies best suited for their specific needs. While most services use Spring Boot, the frontend uses Angular, allowing for optimal technology choices.

- **Fault Isolation:** If one service fails, it doesn't bring down the entire system. Users can still manage projects and tasks even if the notification service is temporarily unavailable.

- **Team Autonomy:** Different teams can work on different services independently, enabling parallel development and faster release cycles.

- **Easier Maintenance:** Smaller, focused services are easier to understand, test, and maintain than a monolithic application.

- **Deployment Flexibility:** Services can be deployed, updated, and rolled back independently without affecting other parts of the system.

### Architecture Overview

The system follows a layered architecture with clear separation of concerns:

```
[Angular Frontend]
        |
    [API Gateway]
        |
    ┌─────────────────────────────────────┐
    │         Core Services Layer         │
    │  ┌─────────┐  ┌─────────┐  ┌─────┐  │
    │  │ Auth    │  │ Project │  │Task │  │
    │  │ Service │  │ Service │  │Svc  │  │
    │  └─────────┘  └─────────┘  └─────┘  │
    └─────────────────────────────────────┘
        │
    ┌─────────────────────────────────────┐
    │    Infrastructure Services Layer    │
    │  ┌─────────┐  ┌─────────┐  ┌─────┐  │
    │  │ Eureka  │  │ Config  │  │Noti │  │
    │  │ Server  │  │ Server  │  │Svc  │  │
    │  └─────────┘  └─────────┘  └─────┘  │
    └─────────────────────────────────────┘
```

### Service Communication Patterns

- **Synchronous Communication:** REST APIs and GraphQL for real-time operations
- **Asynchronous Communication:** Kafka messaging for notifications and events
- **Service Discovery:** Eureka for dynamic service location
- **API Gateway:** Centralized entry point with routing, authentication, and rate limiting

### Data Management

- **Database per Service:** Each service has its own database to ensure loose coupling
- **Eventual Consistency:** Asynchronous events ensure data consistency across services
- **CQRS Pattern:** Command Query Responsibility Segregation for complex operations

### Core Services

1. **Auth Service**
   - **Purpose:** Centralized authentication and authorization
   - **Architecture:** Stateless service using JWT tokens
   - **Key Features:**
     - User registration and login
     - JWT token generation and validation
     - Refresh token mechanism
     - Role-based access control
   - **Technology:** Spring Boot, Spring Security, JWT, H2/MySQL
   - **Communication:** REST API, integrates with Gateway for token validation

2. **Project Service**
   - **Purpose:** Project lifecycle management
   - **Architecture:** Domain-driven design with clear bounded contexts
   - **Key Features:**
     - CRUD operations for projects
     - Project status tracking
     - Team member assignment
     - REST and GraphQL APIs for flexibility
   - **Technology:** Spring Boot, Spring Data JPA, GraphQL, H2/MySQL
   - **Communication:** REST/GraphQL APIs, Eureka registration

3. **Task Service**
   - **Purpose:** Task management within projects
   - **Architecture:** Event-sourced architecture for task history
   - **Key Features:**
     - Task creation, assignment, and tracking
     - Status updates and progress monitoring
     - Integration with project timelines
     - Both REST and GraphQL interfaces
   - **Technology:** Spring Boot, Spring Data JPA, GraphQL, H2/MySQL
   - **Communication:** REST/GraphQL APIs, OpenFeign for service communication

4. **Notification Service**
   - **Purpose:** Asynchronous notification handling
   - **Architecture:** Event-driven architecture using message queues
   - **Key Features:**
     - Email notifications for task assignments
     - Project milestone alerts
     - User activity notifications
     - Circuit breaker pattern for resilience
   - **Technology:** Spring Boot, Spring Kafka, JavaMail, Resilience4j
   - **Communication:** Kafka consumers, REST APIs for configuration

### Infrastructure Services

5. **Eureka Server**
   - **Purpose:** Service discovery and registration
   - **Architecture:** Client-side service discovery pattern
   - **Key Features:**
     - Automatic service registration
     - Health monitoring
     - Load balancing support
     - Service instance management
   - **Technology:** Spring Cloud Netflix Eureka

6. **Config Server**
   - **Purpose:** Centralized configuration management
   - **Architecture:** Externalized configuration pattern
   - **Key Features:**
     - Git-backed configuration storage
     - Environment-specific configurations
     - Dynamic configuration updates
     - Encrypted sensitive data support
   - **Technology:** Spring Cloud Config Server

7. **Gateway**
   - **Purpose:** API Gateway and routing
   - **Architecture:** API Gateway pattern with filters
   - **Key Features:**
     - Request routing to appropriate services
     - Authentication and authorization
     - Rate limiting and circuit breaking
     - Request/response transformation
   - **Technology:** Spring Cloud Gateway

### Frontend

8. **Project Management Dashboard**
   - **Purpose:** User interface for the entire system
   - **Architecture:** Component-based architecture with state management
   - **Key Features:**
     - Responsive single-page application
     - Real-time updates using WebSockets
     - Modular component structure
     - State management with NgRx
   - **Technology:** Angular 17, NgRx, Tailwind CSS, Chart.js
   - **Communication:** HTTP client with interceptors for authentication

## How to Start the Project

### Prerequisites

- Java 21
- Maven 3.6+
- Node.js 18+
- npm or yarn
- MySQL (optional, H2 is used by default)

### Starting the Services

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd projects-tasks-managment
   ```

2. **Start the infrastructure services first:**

   - **Eureka Server:**
     ```bash
     cd eureka-server
     mvn spring-boot:run
     ```

   - **Config Server:**
     ```bash
     cd config-server
     mvn spring-boot:run
     ```

3. **Start the core services:**

   - **Auth Service:**
     ```bash
     cd auth-service
     mvn spring-boot:run
     ```

   - **Project Service:**
     ```bash
     cd project-service
     mvn spring-boot:run
     ```

   - **Task Service:**
     ```bash
     cd task-service
     mvn spring-boot:run
     ```

   - **Notification Service:**
     ```bash
     cd notification-service
     mvn spring-boot:run
     ```

   - **Gateway:**
     ```bash
     cd gateway
     mvn spring-boot:run
     ```

4. **Start the frontend:**

   - **Project Management Dashboard:**
     ```bash
     cd project-management-dashboard
     npm install
     npm start
     ```

### Accessing the Application

- **Frontend Dashboard:** http://localhost:4200
- **Gateway (API):** http://localhost:8080
- **Eureka Dashboard:** http://localhost:8761

### Default Credentials

- Username: admin@example.com
- Password: admin123

## Configuration

Configuration files are located in the `config-server/src/main/resources/config/` directory. Each service has its own configuration file:

- `auth-service.properties`
- `project-service.properties`
- `task-service.properties`
- `gateway.properties`

## API Documentation

APIs are available through the Gateway service. Use tools like Postman or Swagger UI to explore the endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


