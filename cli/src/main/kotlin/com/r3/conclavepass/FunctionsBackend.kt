package com.r3.conclavepass

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.r3.conclave.common.SHA256Hash
import com.r3.conclavecloud.Conclave
import com.r3.conclavecloud.client.ConclaveClientConfig

// Ensure these ID's match the values in your project.
//  ccl platform tenant
//  ccl projects list
val tenantID = "[TODO: Replace with your Tenant ID]"
val projectID = "[TODO: Replace with your Project ID]"

// Ensure these hashes match the actual hashes of the uploaded code
//  ccl functions list
val queryHash = "AD7635832EDC36AF1ED9C38E0FD57F5E056AD0215F86A7E5BACCB330A32D8E40"
val addEntryHash = "DD442ADA05F2469E3AA6F10A33A3914FF13C7318AFC9713D5BDCA8C3AD8C26DF"
val getHash = "3CFC30B748EF865D518C4C03109375AB91EC355F53ED5166C09197BF7540D9BD"
val removeHash = "CB5A3C5EC607A4FD980014D10E08015E8664ECB70607DA01A92B9C9AD4EDF681"

// A class to represent a password entry.
data class PasswordEntry(
    val url: String,
    val description: String,
    val username: String,
    val password: String
)

class FunctionsBackend {
    private val mapper = jacksonObjectMapper()

    // Create the Conclave SDK instance
    val conclave = Conclave.create(ConclaveClientConfig(tenantID, projectID, Conclave.PRODUCTION_API_URL))

    fun getPasswords(): List<PasswordEntry> {
        val entries = mutableListOf<PasswordEntry>()
        val result = conclave.functions.call("query", queryHash, prepareArg(""))
        // We will have got a JSON string back containing an object named 'return' that contains
        // the result, which is an array of entries.
        val json = mapper.readTree(result)
        val entryArray = json["return"] as ArrayNode
        entryArray.forEach {
            val entry = mapper.treeToValue(it, PasswordEntry::class.java)
            entries.add(entry)
        }
        return entries.toList()
    }

    fun getPassword(url: String): PasswordEntry {
        val result = conclave.functions.call("get", getHash, prepareArg(url))
        // We will have got a JSON string back containing an object named 'return' that contains
        // the result. In this case it should be a password entry.
        val json = mapper.readTree(result)
        return mapper.treeToValue(json["return"], PasswordEntry::class.java)
    }

    fun removePassword(url: String): String {
        val result = conclave.functions.call("remove", removeHash, prepareArg(url))
        // We will have got a JSON string back containing an object named 'return' that contains
        // the result. In this case it should be a password entry.
        // We will have got a JSON string back containing an object named 'return' that contains
        // the result. In this case it should just be 'ok'
        val json = mapper.readTree(result)
        return json["return"].asText()
    }

    fun addPassword(entry: PasswordEntry): String {
        // Create the new password entry.
        val result = conclave.functions.call("addEntry", addEntryHash, prepareArg(entry))
        // We will have got a JSON string back containing an object named 'return' that contains
        // the result. In this case it should just be 'ok'
        val json = mapper.readTree(result)
        return json["return"].asText()
    }

    private fun prepareArg(arg: Any): List<Any> {
        val userinfo = ConclavePass.auth.getUserInfo()
        // All our functions start with `token, password`. Just add the final parameter.
        return listOf(getUsernameHash(), userinfo.password, arg)
    }

    private fun getUsernameHash(): String {
        // Hash the username to generate the user token.
        val userinfo = ConclavePass.auth.getUserInfo()
        return SHA256Hash.hash(userinfo.username.toByteArray()).toString()
    }

}