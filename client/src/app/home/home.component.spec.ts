import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../service/user.service';
import { FileUploadService } from '../service/file-upload.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ HomeComponent ],
      providers: [ UserService, FileUploadService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.userDetails = {_id: "62939e256995f3b41afbd0d7", fullName: "Test", email: "testsingh@gmail.com"};
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    component.f;
    expect(component).toBeTruthy();
  });

  it('should call getUserProfile on ngInit', async(() => {
    const userService = TestBed.inject(UserService);
    const http = TestBed.inject(HttpClient);
    jest.spyOn(userService, 'getUserProfile').mockReturnValue(http.get(environment.apiBaseUrl + '/userProfile'));

    component.ngOnInit();

    fixture.detectChanges();
    expect(component.userDetails).toEqual({_id: "62939e256995f3b41afbd0d7", fullName: "Test", email: "testsingh@gmail.com"});
  }));

  it('should call Logout', () => {
    jest.spyOn(component, 'onLogout');
    let logoutButton = fixture.debugElement.nativeElement.querySelector('#logoutButton');
    logoutButton.click();
    expect(component.onLogout).toHaveBeenCalled();
  });

  it('should open photoAdd Form Modal and Call Submit on form submit', fakeAsync(() => {
    jest.spyOn(component, 'onSubmit');
    let button = fixture.debugElement.nativeElement.querySelector('#openAddPhotoModalButton');
    button.click();
    let sumitButton = fixture.debugElement.nativeElement.querySelector('#photoModalSubmit');
    sumitButton.click();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should call uploadFiles', fakeAsync(() => {
    jest.spyOn(component, 'uploadFiles');
    component.uploadFiles('title', 'description', '62939e256995f3b41afbd0d7');
    expect(component.uploadFiles).toHaveBeenCalled();
  }));
});
