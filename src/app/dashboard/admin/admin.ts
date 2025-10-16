import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminDashboardComponent {
  totalPatients = 12; // you can load from db.json later
  totalDoctors = 5;

  constructor(private router: Router) {}

 m(){
    this.router.navigate(['/management/patient']);
 }

 n(){
    this.router.navigate(['/management/doctor']);
 }

 o(){
    this.router.navigate(['/management/appointment']);
 }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/auth/login']);
  }
}
