import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CclService } from '../ccl.service';

@Component({
  selector: 'app-add-password',
  templateUrl: './add-password.component.html',
  styleUrls: ['./add-password.component.scss']
})
export class AddPasswordComponent implements OnInit {
  public isValid = false;
  public url = '';
  public description = '';
  public username = '';
  public password = '';

  constructor(private router: Router, private ccl: CclService) { 
  }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    this.isValid = true;
    this.ccl.addPassword(this.url, this.description, this.username, this.password).then(() => {
      this.router.navigateByUrl('');
    });

  }

  public cancel(): void {
    this.router.navigateByUrl('');
  }
}
