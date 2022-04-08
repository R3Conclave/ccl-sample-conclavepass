import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CclService, PasswordEntry } from '../ccl.service';

@Component({
  selector: 'app-show-password-dialog',
  templateUrl: './show-password-dialog.component.html',
  styleUrls: ['./show-password-dialog.component.scss']
})
export class ShowPasswordDialogComponent implements OnInit {
  password: string = ""

  constructor(
    public dialogRef: MatDialogRef<ShowPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordEntry,
    private ccl: CclService
  ) { }

  ngOnInit(): void {
    this.ccl.getPassword(this.data.url).then(entry => {
      this.password = entry.password;
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
