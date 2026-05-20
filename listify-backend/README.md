# Demo API

A Spring Boot 3 REST API built contract-first using OpenAPI. The API contract lives in `src/main/resources/openapi.yaml` and is the single source of truth for all endpoints and models.

---

## Prerequisites

Install the following before running the project:

**Java 21 or higher**
Download and run the installer from https://aka.ms/download-jdk/microsoft-jdk-21.0.11-windows-x64.msi — it sets up `JAVA_HOME` and `PATH` automatically.
Verify with: `java -version`

**Maven 3.9+**
Download the binary zip from https://maven.apache.org/download.cgi, extract it to a folder of your choice, and add the `bin` subfolder to your system `PATH`.
Verify with: `mvn -version`

**VS Code** (optional but recommended)
Install from https://code.visualstudio.com and add these two extensions:
- Extension Pack for Java (Microsoft)
- Spring Boot Extension Pack (VMware)

---

## Running the application

Clone the repository, open a terminal in the project root, and run:

```bash
mvn spring-boot:run
```

The application starts on `http://localhost:8081` (Port is configured in [application.properties](src/main/resources/application.properties)).

To stop it press `Ctrl + C` and confirm with `y` if needed.

---

## Swagger UI

Once the application is running, open the interactive API docs in your browser:

```
http://localhost:8081/swagger-ui.html
```

From here you can browse all available endpoints and send test requests directly.

---

## Project structure

```
src/
├── main/
│   ├── java/com/jatitoto/listify_backend/
│   │   ├── mapper			# To-do: To map i.e. json to objects
│   │   ├── service			# Is called from the controller and may have Businesslogic
│   │   ├── config			# To-do: Conigs, duh!
│   │   └── controller      # Endpoint implementations, calls a function in one of the services in the service dir
│	│
│	└── resources/
│       ├── openapi.yaml                 # API contract — edit this to change the API
│       └── application.properties       # App configuration
└── test/
    └── java/com/example/demo/
        └── GreetingControllerTest.java  # Unit tests
```

---

## Changing the API

The project follows an API-first approach. To add or modify endpoints:

1. Edit `src/main/resources/openapi.yaml`
2. Run `mvn generate-sources` to regenerate the Java interfaces and models
3. Implement any new interfaces in your controller

---

## Running the tests

```bash
mvn test
```