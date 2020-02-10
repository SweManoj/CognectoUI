import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        if (sessionStorage.getItem('accessToken') && sessionStorage.getItem('accessToken') !== '')
            return of(true);
        else {
            this.router.navigate(['/auth/login']);  // optional url values
            return of(false);
        }
    }
}
