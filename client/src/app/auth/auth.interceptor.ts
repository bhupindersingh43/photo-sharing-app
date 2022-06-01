import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Router } from "@angular/router";
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from "../service/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService : UserService,private router : Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.get('noauth'))
      return next.handle(request.clone());
    else {
        const clonedreq = request.clone({
            headers: request.headers.set("Authorization", "Bearer " + this.userService.getToken())
        });
        return next.handle(clonedreq).pipe(
            tap(
                event => { },
                err => {
                    if (err.error.auth == false) {
                        this.router.navigateByUrl('/login');
                    }
                })
        );
    }
  }
}

