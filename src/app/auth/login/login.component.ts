import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userEmail: AbstractControl;
  password: AbstractControl;
  unAuthorizedError = false;
  submitDisabled = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    sessionStorage.clear();
    this.loginForm = this.fb.group({
      'userEmail': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.userEmail = this.loginForm.controls['userEmail'];
    this.password = this.loginForm.controls['password'];

    this.loginForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.loginForm);
    });
  }

  validationMessages = {
    userEmail: {
      required: 'User Email is required',
      minlength: 'User Email must be greater than 4 characters'
    },
    password: {
      required: 'Password Name is required',
      minlength: 'Password must be greater than 4 characters'
    }
  };

  formErrors = {
    userEmail: '',
    password: ''
  };

  logValidationErrors(group: FormGroup = this.loginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  allFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup)
        this.allFormTouched(abstractControl);
      else
        abstractControl.markAsTouched();
    });
  }

  signIn() {
    this.submitDisabled = true;
    this.allFormTouched(this.loginForm);
    this.logValidationErrors(this.loginForm);
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe(res => {
        sessionStorage.setItem('accessToken', res.access_token);
        this.router.navigateByUrl('/pages');
      }, error => {
        this.unAuthorizedError = true;
        this.submitDisabled = false;
      });
    }
  }
}
