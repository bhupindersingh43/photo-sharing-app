import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserInfo } from '../model/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService  {


  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  userInfo:any;
  constructor(private http: HttpClient) { }



  changeUser(user: any) {
    this.userInfo.getValue(user);
  }

  getUser() {
    return this.userInfo;
  }

  set currentUser(response: any) {
    this.userInfo = response.user;
  }

  get currentUser(){
    return this.userInfo;
  }

  //HttpMethods

  postUser(user: User){
    return this.http.post<User>(environment.apiBaseUrl+'/register', user, this.noAuthHeader);
  }

  login(authCredentials: any) {
    return this.http.post<User>(environment.apiBaseUrl + '/authenticate', authCredentials, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  updateUserProfile(userData: any) {
    return this.http.post(environment.apiBaseUrl + '/userProfile', userData);
  }

  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
