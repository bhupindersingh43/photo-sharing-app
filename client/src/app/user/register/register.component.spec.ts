import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { UserService } from '../../service/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule ],
      declarations: [ RegisterComponent ],
      providers: [ UserService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    component.f;
    expect(component).toBeTruthy();
  });

  it('should call onSubmit on button click', () => {
    jest.spyOn(component, 'onSubmit');
    let logoutButton = fixture.debugElement.nativeElement.querySelector('#signUpButton');
    logoutButton.click();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
