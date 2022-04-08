# Conclave Pass Backend - Backend database storage for a Password Manager implemented using Conclave Cloud
This project contains a very simple Spring Boot service that has two endpoints
that allow Conclave Functions to persist password databases for individual
users.

The service is only intended as a demo, thus has no authentication or error
checking and only persists the user data in memory. Restarting the service
clears the database.

The service listens on port 8080.

## Building
The service can be built using:

```
./gradlew build
```

Once built the service can be run with:

```
java -jar build/libs/conclavepass-0.0.1-SNAPSHOT.jar
```

## Endpoints
`POST /passwords/{userID}`

```
request body = {
    "encryptedDB": "[base64 encoded string containing encrypted database]"
}
```

This endpoint is used to set the encrypted database for a particular user. The
user is identified by an ID which is just a unique string.

`GET /passwords/{userID}`

```
response body = {
    "[base64 encoded string containing encrypted database]"
}
```

This endpoint is used to get the encrypted database for a particular user. The
user is identified by an ID which is just a unique string. If the user ID does
not exist then an empty string is returned.

## Integration with Conclave Pass demonstration
See the main README.md for the demonstration for details on the architecture and
how to configure the demonstration environment.