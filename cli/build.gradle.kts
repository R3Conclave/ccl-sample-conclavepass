import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	kotlin("jvm") version "1.6.10"
	application
	id("com.github.johnrengelman.shadow") version "7.0.0"
}

tasks {
	application {
		mainClass.set("com.r3.conclavepass.ConclavePassKt")
	}
}

group = "com.r3"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	maven(url = "../lib/conclave-cloud-sdk-java-1.0.0-beta2/repo")
	mavenCentral()
}

dependencies {
	// Kotlin
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.2")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	// CLI
	implementation("info.picocli:picocli:4.6.1")

	// Conclave Cloud
	implementation("com.r3.conclave.cloud:conclave-cloud-sdk:1.0.0-beta2")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "11"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
