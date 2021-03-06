# Conclave Pass - Password Manager implemented using Conclave Cloud
This project implements a CLI that can be used to interact with the ConclavePass
password manager example Conclave Functions code. It demonstrates how the
Conclave Cloud Kotlin/Java SDK can be used to invoke functions that have been
deployed into a project in Conclave Cloud.

The project builds a CLI tool that provides the following capabilities against
the ConclavePass Functions backend:

* Login/Logout using username and password.
* List password entries for the logged in user.
* Get the actual password for an entry.
* Remove a password entry.

## Building
The Conclave Cloud SDK is not currently hosted in a public repository. You need
to download the repository directory containing the SDK, unzip it then update
Gradle to point to the directory.

Edit `build.gradle.kts` and edit the repository path to point to the directory
where you unzipped the SDK.

```kotlin
repositories {
	maven(url = "../lib/conclave-cloud-sdk-java-1.0.0-beta1/repo") // Change this path
	mavenCentral()
}
```

## Examples
The tool uses PicoCli to provide a command line interface. This can be invoked
once built using the following command:

```
java -jar ./build/libs/conclavepass-0.0.1-SNAPSHOT-all.jar [args]
```

It is recommended to create a shell script that invokes this for you, passing
all arguments to Java:

_`cpcli`:_
```bash
#/bin/bash
java -jar ./build/libs/conclavepass-0.0.1-SNAPSHOT-all.jar "$@"
```

### Login
```bash
cpcli login
```

You will be prompted for a username and password. These will be saved in your
home directory under `~/.conclavepass` so do not use enter any real or sensitive
user information here (remember it is just a demonstration!).

### Logout
```bash
cpcli logout
```

This deletes the credentials in `~/.conclavepass` and will cause the CLI to
request the user to login before performing any other command.

### Add a new password entry for the logged in user
```bash
cpcli add --url "https://ebay.co.uk" --description "Buying more stuff." --username "myuser" --password "N17hIwCN^L2R"
```

Adds a new password into the database for the logged in user.

### List all password entries for the logged in user
```bash
cpcli list
```

### Remove a password entry matching the given URL for the logged in user
```bash
cpcli remove --url "https://ebay.co.uk"
```

### Get the actual password for the matching URL for the logged in user
```bash
cpcli get --url "https://ebay.co.uk"
```

## Implementation notes
### Conclave Cloud/Functions Implementation
All of the code that interacts with Conclave Cloud can be found in the file
`FunctionsBackend.kt`. This module shows how to connect to the Conclave Cloud
service and to prepare and execute function invocations as well as how to parse
the response that comes back from the invoked JavaScript code.

The top of the module contains a number of strings and hashes. These need to
match the values in your environment.

Once you have created an account in Conclave Cloud, you then need to create a
project and upload the functions that are referenced in this module. See the
main demonstration README.md for more details.

Once you have done this you need to find your tenant ID, project ID and the
hashes of the four functions that are called in the module. Update the values in
the module to match these.

The `Authetication.kt` module provides a simple username/password login UI and
saves the credentials to the home directory. These can then be passed as
parameters to the backend.

The `ConclavePass.kt` is the main module and implements a PicoCLi command line
that directly invokes the backend.

### Remember this is a demonstration!!!
This is just a demonstration. As such, errors may not be handled correctly and
providing invalid parameters may render a database unusable, requiring it to be
cleared and reset. Please feel free to expand the demonstration project and
contribute back to this repository to improve the capabilities/error handling.
