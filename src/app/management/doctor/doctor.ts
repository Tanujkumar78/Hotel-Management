import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  };

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe((data) => {
      this.doctors = data;
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
      this.doctorService.addDoctor(doctor).subscribe(() => {
        this.newDoctor = { name: '', specialization: '', phone: '', fee: '' };
        this.loadDoctors();
      });
    }
  }

  deleteDoctor(id: string) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.loadDoctors();
    });
  }
}
