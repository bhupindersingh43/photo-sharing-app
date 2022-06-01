import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder  } from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from '../../service/user.service'
import { MustMatch } from '../../providers/CustomValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean = false;
  serverErrorMessages: string = '';
  submitted: boolean = false;
  registerForm:any;

  constructor(private userService: UserService, private router : Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    if(this.userService.isLoggedIn())
    this.router.navigateByUrl('/home');

    this.registerForm = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
      }, {
          validator: MustMatch('password', 'confirmPassword')
      });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.userService.postUser(this.registerForm.value).subscribe(
      res => {
        this.showSucessMessage = true;
        this.submitted = false;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm();
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }

  resetForm(): void{
    this.registerForm.reset();
    this.serverErrorMessages = '';
  }
}
