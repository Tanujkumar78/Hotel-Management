import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment';
import { DoctorService } from '../../services/doctor';
import { PatientService } from '../../services/patient';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointment.html',
  styleUrls: ['./appointment.css'],
})
export class AppointmentComponent implements OnInit {
  appointments: any[] = [];
  doctors: any[] = [];
  patients: any[] = [];
  newAppointment: any = {
    patientId: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    status: 'Scheduled',
  };

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadDoctors();
    this.loadPatients();
    this.loadAppointments();
  }

  // Load doctors list
  loadDoctors() {
    this.doctorService.getDoctors().subscribe((data) => {
      this.doctors = data;
    });
  }

  // Load patients list
  loadPatients() {
    this.patientService.getPatients().subscribe((data) => {
      this.patients = data;
    });
  }

  // Load appointments list
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe((data) => {
      this.appointments = data;
    });
  }

  // Add new appointment
addAppointment() {
  if (
    this.newAppointment.patientId &&
    this.newAppointment.doctorId &&
    this.newAppointment.date &&
    this.newAppointment.timeSlot
  ) {
    const patient = this.patients.find((p) => p.id === this.newAppointment.patientId);
    const doctor = this.doctors.find((d) => d.id === this.newAppointment.doctorId);

    if (!patient || !doctor) {
      alert('Invalid doctor or patient selection');
      return;
    }

    const appointment = {
      id: this.appointments.length + 1,
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,        // ✅ Added
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorEmail: doctor.email,          // ✅ Added
      date: this.newAppointment.date,
      timeSlot: this.newAppointment.timeSlot,
      status: 'Scheduled',
    };

    this.appointmentService.addAppointment(appointment).subscribe(() => {
      alert('Appointment created successfully!');
      this.newAppointment = {
        patientId: '',
        doctorId: '',
        date: '',
        timeSlot: '',
        status: 'Scheduled',
      };
      this.loadAppointments();
    });
  }
}



  // Update appointment status
  updateStatus(app: any, newStatus: string) {
    const updated = { ...app, status: newStatus };
    this.appointmentService.updateAppointment(app.id, updated).subscribe(() => {
      this.loadAppointments();
      app.status = newStatus;
      localStorage.setItem('appointments', JSON.stringify(this.appointments));
    });
  }

  // Delete appointment
  deleteAppointment(id: number) {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(() => {
        this.loadAppointments();
      });
    }
  }
}
