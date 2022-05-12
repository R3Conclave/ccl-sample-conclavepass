import { Injectable } from '@angular/core';
import { Conclave } from 'conclave-cloud-sdk';
import { AuthService } from './auth.service';

const tenantID = "[TODO: Replace with your Tenant ID]";
const projectID = "[TODO: Replace with your Project ID]";
const queryHash = "AD7635832EDC36AF1ED9C38E0FD57F5E056AD0215F86A7E5BACCB330A32D8E40";
const addEntryHash = "DD442ADA05F2469E3AA6F10A33A3914FF13C7318AFC9713D5BDCA8C3AD8C26DF";
const getHash = "3CFC30B748EF865D518C4C03109375AB91EC355F53ED5166C09197BF7540D9BD";
const removeHash = "CB5A3C5EC607A4FD980014D10E08015E8664ECB70607DA01A92B9C9AD4EDF681";

export interface PasswordEntry {
  url: string;
  description: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class CclService {

  private conclave: Conclave

  constructor(
    private auth: AuthService
  ) { 
    this.conclave = Conclave.create({
      tenantID: tenantID,
      projectID: projectID
    });

  }

  public async getPasswords(): Promise<PasswordEntry[]> {
    const userToken = await this.auth.userToken();
    console.log("Querying passwords from CCL with user token: " + userToken);
    const result = await this.conclave.functions.call('query', queryHash, [userToken, this.auth.password, '']);
    return result.return;
  }

  public async getPassword(url: string): Promise<PasswordEntry> {
    const userToken = await this.auth.userToken();
    console.log(`Querying password for ${url} from CCL with user token: ` + userToken);
    const result = await this.conclave.functions.call('get', getHash, [userToken, this.auth.password, url]);
    return result.return;
  }

  public async addPassword(url: string, description: string, username: string, password: string) {
    const userToken = await this.auth.userToken();
    console.log("Adding password with user token: " + userToken);
    const entry: PasswordEntry = {
      url, description, username, password
    }
    const result = await this.conclave.functions.call('addEntry', addEntryHash, [userToken, this.auth.password, entry]);
    console.log(result);
  }

  public async deletePassword(url: string) {
    const userToken = await this.auth.userToken();
    console.log(`Querying password for ${url} from CCL with user token: ` + userToken);
    const result = await this.conclave.functions.call('remove', removeHash, [userToken, this.auth.password, url]);
    return result.return;
  }
}
