import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/finally';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {
    }

    signIn(loginData: any): Observable<any> {
        return this.http.post(`/oauth/token?grant_type=password&username=${loginData.userEmail}&password=${loginData.password}`, null);
    }
}