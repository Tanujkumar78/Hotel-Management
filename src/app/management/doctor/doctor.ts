import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { map } from 'rxjs';

@Component({
  selector: 'app-doctor',
  imports: [FormsModule,CommonModule],
  templateUrl: './doctor.html',
  styleUrls: ['./doctor.css'],
})
export class DoctorComponent implements OnInit {
  doctors: any[] = [];
  newDoctor: any = {
    name: '',
    specialization: '',
    phone: '',
    fee: '',
    role:'doctor'
  };

  constructor(private doctorService: UserService) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getUsers()
     .pipe(
       map((data: any[]) => data.filter(user => user.role === 'doctor'))
     )
     .subscribe(filteredPatients => {
       this.doctors = filteredPatients;
     });
  }

  addDoctor() {
    if (
      this.newDoctor.name &&
      this.newDoctor.specialization &&
      this.newDoctor.phone &&
      this.newDoctor.fee
    ) {
      const doctor = {
        ...this.newDoctor,
        id: 'D' + (this.doctors.length + 1).toString().padStart(3, '0'),
      };
      this.doctorService.addUser(doctor).subscribe(() => {
        this.newDoctor = { name: '', specialization: '', phone: '', fee: '' };
        this.loadDoctors();
      });
    }
  }

  deleteDoctor(id: string) {
    this.doctorService.deleteUser(id).subscribe(() => {
      this.loadDoctors();
    });
  }
}
