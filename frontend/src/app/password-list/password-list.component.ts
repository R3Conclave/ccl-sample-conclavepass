import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CclService, PasswordEntry } from '../ccl.service';
import { MatDialog } from '@angular/material/dialog';
import { ShowPasswordDialogComponent } from '../show-password-dialog/show-password-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss']
})
export class PasswordListComponent implements OnInit {

  public data: PasswordEntry[] = null;
  public displayedColumns = ["delete", "url", "description", "username"];

  constructor(
    private ccl: CclService, 
    private router: Router,
    private dialog: MatDialog,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.update();
  }

  private update() {
    this.ccl.getPasswords().then(pw => {
      this.data = pw;
    }).catch(reason => {
      this.auth.logout();
      this.router.navigateByUrl('/login')
    });
  }

  public addPassword(): void {
    this.router.navigateByUrl('/add')
  }

  public showPassword(entry: PasswordEntry): void {
    const dialogRef = this.dialog.open(ShowPasswordDialogComponent, { width: '450px', data: entry });
  }

  public deletePassword(event: PointerEvent, entry: PasswordEntry): void {
    // Prevent the row click from occuring after this is complete.
    event.stopPropagation();

    if (confirm("Are you sure you want to delete " + entry.url + "?")) {
      this.ccl.deletePassword(entry.url).then(() => {
        this.update();
      })
    }
  }

  public logout() {
    if (confirm("Are you sure you want to logout?")) {
      this.auth.logout();
      this.router.navigateByUrl('/login')
    }
  }
}
