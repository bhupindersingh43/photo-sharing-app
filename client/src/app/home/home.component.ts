import { Component, OnInit } from "@angular/core";
import { UserService } from "../service/user.service";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { FileUploadService } from "../service/file-upload.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  moment: any = moment;
  userDetails: any;
  selectedFiles?: FileList;
  progressInfo: any;
  preview: any;
  photos: any = [];
  imageInViewModal: any;
  imageInfos?: Observable<any>;
  LoginStatus$ = new BehaviorSubject<boolean>(false);
  submitted: boolean = false;
  deletableId: string = "";
  photoAddForm = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.maxLength(30)]),
    description: new FormControl("", [Validators.required]),
    photo: new FormControl("", [Validators.required]),
  });
  imageBaseUrl = environment.imageBaseUrl;

  constructor(private userService: UserService, private router: Router, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.getPhotos();

    this.userService.getUserProfile().subscribe(
      res => {
        this.userService.currentUser = res;
        this.userDetails = this.userService.currentUser;
        this.LoginStatus$.next(true)
      },
      err => {
        console.log(err);
      }
    );
  }

  get f() {
    return this.photoAddForm.controls;
  }

  // remove selected files
  removeFile(fileUpload: any): void {
    fileUpload.value = '';
    this.preview = null;
  }

  // fetching all photos from databse
  getPhotos(): void {
    this.imageInfos = this.uploadService.getFiles();

    this.imageInfos.subscribe((response) => {
      this.photos = response.data;
    });
  }

  // showing selected files
  selectFiles(event: any): void {
    this.progressInfo = {};
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

  // call upload file function
  uploadFiles(title: string, description: string, userId: string): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.savePhoto(this.selectedFiles[i], title, description, userId);
      }
    }
  }

  // save file in database
  savePhoto(
    file: File,
    title: string,
    description: string,
    userId: string
  ): void {
    this.progressInfo = { value: 0, fileName: file.name };
    if (file) {
      this.uploadService.upload(file, title, description, userId).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfo.value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            setTimeout(() => {
              // get all photos
              this.getPhotos();

              // close add photo modal
              document.getElementById("photoAddModalClose")?.click();

              // reset add photo form fields
              this.photoAddForm.reset();
              this.submitted = false;
              this.progressInfo = {};
              this.preview = null;
            }, 500);
          }
        },
        (err: any) => {
          this.progressInfo.value = 0;
        }
      );
    }
  }

  // add photo form submit function
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.photoAddForm.invalid) {
      return;
    }

    this.uploadFiles(
      this.photoAddForm.value.title,
      this.photoAddForm.value.description,
      this.userDetails._id
    );
  }

  // logout user
  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(["/login"]);
  }

  // get photo upload time
  dateDiff(photoDate: any) {
    // get current date
    const currentDate = new Date().toISOString();
    const currentDateMoment = moment(currentDate);
    const photoDateMoment = moment(photoDate);
    const differenceInMinutes = currentDateMoment.diff(
      photoDateMoment,
      "minutes"
    );
    // if photo uploaded more tha hour ago
    if (differenceInMinutes > 60) {
      return currentDateMoment.diff(photoDateMoment, "hours") + " hours ago";
    }
    // if photo uploaded less than minute ago
    if (differenceInMinutes < 1) {
      return (
        currentDateMoment.diff(photoDateMoment, "seconds") + " seconds ago"
      );
    }
    return differenceInMinutes + " minutes ago";
  }

  // delete photo from database
  deletePhoto(deletableId: string) {
    this.uploadService.delete(deletableId).subscribe((response) => {
      // close delete photo confirm modal
      document.getElementById("deleteConfirmationModalClose")?.click();
      // get all photos
      this.getPhotos();
    });
  }
}
