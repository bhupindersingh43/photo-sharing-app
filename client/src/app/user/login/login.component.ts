import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router : Router) { }

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessages: string = '';
  submitted: boolean = false;

  loginForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
    },
  );

  ngOnInit() {
    if(this.userService.isLoggedIn())
    this.router.navigateByUrl('/home');
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;
  
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.userService.login(this.loginForm.value).subscribe(
      res => {
        this.userService.setToken(res.token);
        this.resetForm();
        this.router.navigateByUrl('/home');
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  resetForm() {
    this.loginForm.reset();
    this.serverErrorMessages = '';
  }
}



