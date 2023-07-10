import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private router: Router, private http: HttpClient) {}

  isAuthenticated() {
    if (sessionStorage.getItem('token') !== null) {
      return true;
    }
    return false;
  }

  canAccess() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['login']);
    }
  }
  canActivate() {
    if (this.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }
  storeToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  register(
    first_name: string,
    last_name: string,
    email: string,
    mobile: number,
    password: string,
    address: string
  ) {
    //send data toregister api
    return this.http.post<{ token: string }>('/api-v1/registration', {
      first_name,
      last_name,
      email,
      mobile,
      password,
      address,
    });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>('/api-v1/login', {
      email,
      password,
    });
  }
  getAlldata() {
    return this.http.get<any>('/api-v1/test').pipe(
      map((res) => {
        return res;
      })
    );
  }
}
