package com.r3.conclavepass

import picocli.CommandLine
import java.util.concurrent.Callable
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    exitProcess(ConclavePass().execute(args))
}

class ConclavePass {
    private val commandLine = CommandLine(ConclavePassCli())

    companion object {
        val auth = Authentication()
        val conclave = FunctionsBackend()
    }

    fun execute(args: Array<String>): Int {
        commandLine.executionStrategy = CommandLine.RunAll()
        return commandLine.execute(*args)
    }
}

@CommandLine.Command(
    name = "conclavepass",
    description = [
            "Conclave Pass CLI: A demonstration showing how to use Conclave Cloud."
    ],
    subcommands = [ LoginCli::class, LogoutCli::class, ListCli::class, AddCli::class, RemoveCli::class, GetCli::class ]
)
class ConclavePassCli: Callable<Int> {
    @CommandLine.Spec
    private lateinit var spec: CommandLine.Model.CommandSpec

    override fun call(): Int {
        val cl = spec.commandLine()
        if (!cl.parseResult.hasSubcommand()) {
            cl.usage(System.out)
        }
        return 0
    }
}

@CommandLine.Command(
    name = "login",
    description = ["Provide login details to the CLI."]
)
class LoginCli : Callable<Int> {
    override fun call(): Int {
        ConclavePass.auth.login()
        return 0
    }
}

@CommandLine.Command(
    name = "logout",
    description = ["Logout of the CLI."]
)
class LogoutCli : Callable<Int> {
    override fun call(): Int {
        ConclavePass.auth.logout()
        return 0
    }
}

@CommandLine.Command(
    name = "list",
    description = ["List password entries."]
)
class ListCli : Callable<Int> {
    override fun call(): Int {
        try {
            val entryArray = ConclavePass.conclave.getPasswords()

            System.out.format("+----------------------------------+------------------------------------------+---------------------------+%n");
            System.out.format("+ URL                              | Description                              | Username                  |%n");
            System.out.format("+----------------------------------+------------------------------------------+---------------------------+%n");
            entryArray.forEach {
                System.out.format("| %-32s | %-40s | %-25s |%n", it.url, it.description, it.username)
            }
            System.out.format("+----------------------------------+------------------------------------------+---------------------------+%n");
        } catch (ex: Exception) {
            println("Failed to get the list of entries. Perhaps you entered an incorrect password?")
        }
        return 0
    }
}

@CommandLine.Command(
    name = "add",
    description = ["Add a password entry."]
)
class AddCli : Callable<Int> {
    @CommandLine.Option(names = ["--url"], description = ["The URL for the password entry."], required = true)
    lateinit var url: String

    @CommandLine.Option(names = ["--description"], description = ["The entry description."], required = false)
    var description: String = ""

    @CommandLine.Option(names = ["--username"], description = ["The username for the password entry."], required = true)
    lateinit var username: String

    @CommandLine.Option(names = ["--password"], description = ["The password for the entry."], required = true)
    lateinit var password: String

    override fun call(): Int {
        try {
            println(ConclavePass.conclave.addPassword(PasswordEntry(url, description, username, password)))
        } catch (ex: Exception) {
            println("Failed to add a new entry. Perhaps you entered an incorrect password?")
        }
        return 0
    }
}

@CommandLine.Command(
    name = "remove",
    description = ["Remove a password entry."]
)
class RemoveCli : Callable<Int> {

    @CommandLine.Option(names = ["--url"], description = ["The URL for the password entry."], required = true)
    lateinit var url: String

    override fun call(): Int {
        try {
            println(ConclavePass.conclave.removePassword(url))
        } catch (ex: Exception) {
            println("Failed to remove entry. Perhaps you entered an incorrect password or it doesn't exist?")
        }
        return 0
    }
}

@CommandLine.Command(
    name = "get",
    description = ["Get a password entry."]
)
class GetCli : Callable<Int> {

    @CommandLine.Option(names = ["--url"], description = ["The URL for the password entry."], required = true)
    lateinit var url: String

    override fun call(): Int {
        try {
            val password = ConclavePass.conclave.getPassword(url)
            println("Password: ${password.password}")
        } catch (ex: Exception) {
            println("Failed get password entry. Perhaps you entered an incorrect password or it doesn't exist?")
        }
        return 0
    }
}
