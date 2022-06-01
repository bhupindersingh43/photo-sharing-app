import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails: any;
  userProfilUpdateForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    profilePhoto: new FormControl('', [Validators.required]),
  });
  selectedFiles?: FileList;
  preview: any;
  submitted: boolean = false;
  imageBaseUrl = environment.imageBaseUrl;
  response: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userService.currentUser = res;
        this.userDetails = this.userService.currentUser;
        this.userProfilUpdateForm = new FormGroup({
          fullName: new FormControl(this.userDetails.fullName, [Validators.required, Validators.maxLength(30)]),
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  get f() {
    return this.userProfilUpdateForm.controls;
  }

  // showing selected files
  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    this.preview = "";
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  // update user profile form submit function
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userProfilUpdateForm.invalid) {
      return;
    }

    const formData: FormData = new FormData();
    if (this.selectedFiles !== undefined)
    {
      formData.append('profilePhoto', this.selectedFiles !== undefined ? this.selectedFiles[0] : '');
    }
    formData.append('fullName', this.userProfilUpdateForm.value.fullName);
    formData.append('id', this.userDetails._id);

    this.userService.updateUserProfile(formData).subscribe(
      (response: any) => {
        this.response = response;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      },
      (error: any) => {
        console.log(error);
        this.response = error;
      }
    );
  }
}
