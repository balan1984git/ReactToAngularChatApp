import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isFormError = false;

  constructor(private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.createUserForm();
  }

  createUserForm(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    let formValue = this.loginForm.value;
    if (formValue.userName === undefined || formValue.userName === null || formValue.userName === "") {
      this.isFormError = true;
    } else {
      this.router.navigate(['/chat'], { queryParams: this.loginForm.value, skipLocationChange: true });
    }
  }

}
