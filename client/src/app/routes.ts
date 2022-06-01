import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: 'register', component: UserComponent,
        children: [{ path: '', component: RegisterComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: LoginComponent }]
    },
    {
        path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuard]
    },
    {
        path: 'home', component: HomeComponent,canActivate:[AuthGuard]
    },
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    }
];