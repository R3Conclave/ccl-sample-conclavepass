import {AES, enc, lib} from "crypto-js";

const serviceURL = "http://20.124.9.121:8080";

interface PasswordEntry {
    url: string;
    description: string;
    username: string;
    password: string;
}

interface PasswordDatabase {
    passwords: Array<PasswordEntry>;
}

const logs = new Array<string>()


class ConclavePass {
    async addEntry(userToken: string, password: string, entry: PasswordEntry) {
        const pd = await this.getDatabase(userToken, password);
        // Add the new entry.
        pd.passwords.push(entry);
        // Send it back to the data store.
        await this.putDatabase(userToken, password, pd);
    }

    async query(userToken: string, password: string, search: string): Promise<PasswordEntry[]> {
        const pd = await this.getDatabase(userToken, password);
        const result = new Array<PasswordEntry>();

        // Search for entries where the description or url contains the search string.
        pd.passwords.forEach(pe => {
            if (!search || search.length === 0 || pe.description.includes(search) || pe.url.includes(search)) {
                // Store the entry without the password.
                result.push({
                    url: pe.url,
                    description: pe.description,
                    username: pe.username,
                    password: ""
                });
            }
        });
        return result;
    }

    async get(userToken: string, password: string, url: string): Promise<PasswordEntry> {
        const pd = await this.getDatabase(userToken, password);
        const result = new Array<PasswordEntry>();

        // Search for an entry where the url matches exactly.
        let found = null;
        pd.passwords.some(pe => {
            if (pe.url === url) {
                found = pe;
                return true;
            }
            return false;
        });
        return found;
    }

    async remove(userToken: string, password: string, url: string) {
        const pd = await this.getDatabase(userToken, password);
        const result = new Array<PasswordEntry>();
        const newPd = { passwords: new Array<PasswordEntry>() };

        // Copy every entry that doesn't match.
        pd.passwords.forEach(pe => {
            if (pe.url !== url) {
                newPd.passwords.push(pe);
            }
        });
        await this.putDatabase(userToken, password, newPd);
    }

    private async getDatabase(userToken: string, password: string): Promise<PasswordDatabase> {
        const response = await fetch(`${serviceURL}/passwords/${userToken}`);
        const encryptedDB = await response.text()
        return this.decryptDatabase(password, encryptedDB)
    }

    private async putDatabase(userToken: string, password: string, db: PasswordDatabase) {
        //logs.push("putDatabase()");

        const encryptedDB = this.encryptDatabase(password, db);
        //logs.push("encryptedDB");
        try {
            const res = await fetch(`${serviceURL}/passwords/${userToken}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ encryptedDB: encryptedDB })
            });
            //logs.push("Service called: " + JSON.stringify(res));
        } catch (e) {
            //logs.push("Exception");
        }
    }

    private decryptDatabase(password: string, db: string): PasswordDatabase {
        // If we have been given a database then decrypt it.
        if (db) {
            const decryptedDb = AES.decrypt(db, crypto.getProjectKey() + password).toString(enc.Utf8);
            return JSON.parse(decryptedDb);
        } else {
            // If we haven't got a password database then create a new one
            return { passwords: new Array<PasswordEntry>() };
        }
    }

    private encryptDatabase(password: string, pd: PasswordDatabase): string {
        const encrypted = AES.encrypt(JSON.stringify(pd), crypto.getProjectKey() + password);
        return encrypted.toString()
    }
}

export async function addEntry(userToken: string, password: string, entry: PasswordEntry): Promise<string> {
    await new ConclavePass().addEntry(userToken, password, entry);
    //return JSON.stringify(logs);
    return "ok"
}

export async function query(userToken: string, password: string, search: string): Promise<PasswordEntry[]> {
    return await new ConclavePass().query(userToken, password, search);
}

export async function get(userToken: string, password: string, url: string): Promise<PasswordEntry> {
    return await new ConclavePass().get(userToken, password, url);
}

export async function remove(userToken: string, password: string, url: string): Promise<string> {
    await new ConclavePass().remove(userToken, password, url);
    return "ok"
}
