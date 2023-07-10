import { Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from '../share/service.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userData: any[]= [];
  constructor(private http: HttpClient, private service: ServiceService,) {}

  ngOnInit(): void {
    //get Api data
    this.http
      .get<any>('/api-v1/test')
      .pipe(map((res)=>{
        const user=res.dataDetails;
        return user;
      }))
      .subscribe((user) => {
        this.userData = user;
        console.log(this.userData)
        console.log(user);
      });

    this.service.canAccess();
  }
}
