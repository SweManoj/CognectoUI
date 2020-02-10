import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { environment } from '../../../environments/environment';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

        const serverUrl = environment.serverUrl + request.url;

        if (request.url.includes('oauth')) {
            const basicAuthToken = `Basic ${btoa('iot-client:secret')}`; // base 64 encode mechanism
            request = request.clone({
                setHeaders: {
                    'Authorization': basicAuthToken
                },
                url: serverUrl
            });
        } else {
            const accessToken = sessionStorage.getItem('accessToken');
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${accessToken}`
                },
                url: serverUrl
            });
        }

        return next.handle(request)
            .do(event => {
                return event;
            }, error => {
                // 401 - UnAuthorized, 403 - Access Denied
                if (error.status == 401 || error.status == 403) {
                    sessionStorage.remove('accessToken');
                    this.router.navigateByUrl('/auth/login');
                }
                else
                    return throwError(error);
            });
    }

}
