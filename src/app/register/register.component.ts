import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../share/service.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public signUpForm!: FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private apiservice: ServiceService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.formbuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
    });
  }

  submit() {
    this.apiservice.getAlldata().subscribe((res: any) => {
      console.log('Response:', res);
      const data = res.dataDetails;
      console.log('Data:', data);
      if (data && data.length > 0) {
        let emailExists = data.find((item: any) => {
          return item['email'] == this.signUpForm.controls['email'].value;
        });
        if (emailExists) {
          this.toast.error({
            detail: 'Error Message',
            summary: 'Email Already Exists',
            duration: 5000,
            position: 'topRight',
          });
        } else {
          //call register service
          this.apiservice
            .register(
              this.signUpForm.get('first_name')!.value,
              this.signUpForm.get('last_name')!.value,
              this.signUpForm.get('email')!.value,
              this.signUpForm.get('mobile')!.value,
              this.signUpForm.get('password')!.value,
              this.signUpForm.get('address')!.value
            )
            .subscribe({
              next: (response) => {
                console.log('Token: ' + response.token);
                this.apiservice.storeToken(data.token);

                this.toast.success({
                  detail: 'Success Message',
                  summary: 'Successfully Registered',
                  duration: 5000,
                  position: 'topRight',
                });
              },
              error: (error) => {
                console.error('Error:', error); // Log the error object
                this.toast.error({
                  detail: 'Error Message',
                  summary: 'Error',
                  duration: 5000,
                  position: 'topRight',
                });
              },
            });
        }
      } else {
        alert('No data found');
      }
    });
  }
}
