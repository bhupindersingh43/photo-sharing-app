import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { User } from '../model/user';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(UserService);
  });

  it('should call getUserProfile with GET', () => {
    service.getUserProfile().subscribe();
 
    const testRequest = httpTestingController.match('http://localhost:3000/userProfile');
    expect(testRequest).toEqual([]);
  });

  it('should call postUser', () => {
    let user: User = {fullName: '', email: '', password: '', token: ''};
    service.postUser(user).subscribe();
 
    const testRequest = httpTestingController.match('http://localhost:3000/register');
    expect(testRequest).toEqual([]);
  });

  it('should call login', () => {
    let user = {};
    service.login(user).subscribe();
 
    const testRequest = httpTestingController.match('http://localhost:3000/authenticate');
    expect(testRequest).toEqual([]);
  });
});
