import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PatientService } from '../../services/patient';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.html',
  styleUrls: ['./patient.css']
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  newPatient = {
    name: '',
    age: '',
    gender: '',
    phone: '',
    bloodGroup: ''
  };

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe((data) => {
      this.patients = data;
    });
  }

  addPatient() {
    if (!this.newPatient.name || !this.newPatient.age || !this.newPatient.phone) {
      alert('Please fill all required fields');
      return;
    }

    const id = 'P' + (this.patients.length + 1).toString().padStart(3, '0');
    const patient = { id, ...this.newPatient };

    this.patientService.addPatient(patient).subscribe(() => {
      this.patients.push(patient);
      this.newPatient = { name: '', age: '', gender: '', phone: '', bloodGroup: '' };
    });
  }
}
