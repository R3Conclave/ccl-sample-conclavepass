package com.r3.conclavepass.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

data class SetRequest(
    val encryptedDB: String
)

@RestController
@RequestMapping("/passwords/{userID}")
class ConclavePassController {
    private val passwordDatabases: MutableMap<String, String> = mutableMapOf()
    @PostMapping()
    fun set(
        @PathVariable userID: String,
        @RequestBody request: SetRequest
    ): ResponseEntity<String> {
        println("Set: " + userID.lowercase())
        passwordDatabases[userID.lowercase()] = request.encryptedDB
        return ResponseEntity.ok("ok")
    }

    @GetMapping()
    fun get(
        @PathVariable userID: String,
    ): ResponseEntity<String> {
        println("Get: " + userID.lowercase())
        return ResponseEntity.ok(passwordDatabases[userID.lowercase()] ?: "")
    }
}
