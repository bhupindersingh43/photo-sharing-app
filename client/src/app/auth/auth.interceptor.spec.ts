import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { UserService } from '../service/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from '@angular/forms';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      ReactiveFormsModule
    ],
    providers: [
      UserService,
      AuthInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
