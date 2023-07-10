import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../share/service.service';
import { NgToastService } from 'ng-angular-popup';
import { SHA256, enc } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loginForm!: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private apiservice: ServiceService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  login() {
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    this.apiservice.getAlldata().subscribe((res: any) => {
      console.log('Response:', res);
      const data = res.dataDetails;
      console.log('Data:', data);

      let emailExists = data.find((item: any) => {
        console.log('Item Email:', item.email);
        console.log('Item Password:', item.password);
        const encryptedPassword = SHA256(password).toString(enc.Hex);
        return item.email === email && item.password === encryptedPassword;
      });

      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Data Length:', data.length);
      console.log('Email Exists:', emailExists);

      if (!emailExists) {
        this.toast.error({
          detail: 'Error Message',
          summary: 'Email or Password is Incorrect',
          duration: 5000,
          position: 'topRight',
        });
    

      } else {
        this.apiservice.login(email, password).subscribe({
          next: (data) => {
            
            this.apiservice.storeToken(data.token);

            this.toast.success({
              detail: 'Success Message',
              summary: 'Successfully Login',
              duration: 5000,
              position: 'topRight',
            });
            console.log(sessionStorage.getItem('token'));

            this.apiservice.canActivate();
          },
          error: (error) => {
            alert('Error');
            this.toast.error({
              detail: 'Error Message',
              summary: 'Something Went Wrong',
              duration: 5000,
              position: 'topRight',
            });
          },
        });
      }
    });
  }
}
