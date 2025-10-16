import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment';
import { DoctorService } from '../../services/doctor';
import { PatientService } from '../../services/patient';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { map } from 'rxjs';

interface Appointment {
  id: number;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  date: string;
  timeSlot: string;
  status: 'Scheduled' | 'Completed';
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  fee: number;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointment.html',
  styleUrls: ['./appointment.css'],
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  selectedDoctor: Doctor | null = null;
  errorMessage: string = '';
  minDate: string = new Date().toISOString().split('T')[0];

  newAppointment = {
    patientId: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    status: 'Scheduled' as const,
  };

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: UserService,
  ) { }

  ngOnInit() {
    this.loadDoctors();
    this.loadPatients();
    this.loadAppointments();
  }

  // Load doctors list
  loadDoctors() {
    this.doctorService.getUsers()
      .pipe(
        map((data: any[]) => data.filter(user => user.role === 'doctor'))
      )
      .subscribe(filteredPatients => {
        this.doctors = filteredPatients;
      });
  }

  // Load patients list
  loadPatients() {
    this.doctorService.getUsers()
      .pipe(
        map((data: any[]) => data.filter(user => user.role === 'patient'))
      )
      .subscribe(filteredPatients => {
        this.patients = filteredPatients;
        console.log('Patients:', this.patients);
      });

  }

  // Load appointments list
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe((data) => {
      this.appointments = data;
    });
  }

  // Validate appointment
  validateAppointment(): string | null {
    if (!this.newAppointment.patientId || !this.newAppointment.doctorId ||
      !this.newAppointment.date || !this.newAppointment.timeSlot) {
      return 'Please fill in all required fields';
    }

    // Check if date is in the past
    const selectedDate = new Date(this.newAppointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return 'Cannot book appointments for past dates';
    }

    // Check for duplicate appointments
    const existingAppointment = this.appointments.find(app =>
      app.doctorId === this.newAppointment.doctorId &&
      app.date === this.newAppointment.date &&
      app.timeSlot === this.newAppointment.timeSlot
    );

    if (existingAppointment) {
      return 'This time slot is already booked for the selected doctor';
    }

    return null;
  }

  // Add new appointment
  addAppointment() {
    this.errorMessage = '';
    const validationError = this.validateAppointment();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    const patient = this.patients.find((p) => p.id === this.newAppointment.patientId);
    const doctor = this.doctors.find((d) => d.id === this.newAppointment.doctorId);

    if (!patient || !doctor) {
      this.errorMessage = 'Invalid patient or doctor selection';
      return;
    }

    const appointment: Appointment = {
      id: this.appointments.length + 1,
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email || '',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorEmail: doctor.email || '',
      date: this.newAppointment.date,
      timeSlot: this.newAppointment.timeSlot,
      status: 'Scheduled'
    };

    this.appointmentService.addAppointment(appointment).subscribe({
      next: () => {
        this.loadAppointments();
        this.newAppointment = {
          patientId: '',
          doctorId: '',
          date: '',
          timeSlot: '',
          status: 'Scheduled'
        };
        this.errorMessage = '';
        alert('Appointment created successfully!');
      },
      error: (error) => {
        this.errorMessage = 'Failed to create appointment. Please try again.';
        console.error('Error creating appointment:', error);
      }
    });
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

  onSelection(event: any) {
    const selectedId = event.target.value;
    this.selectedDoctor = this.doctors.find(d => d.id === selectedId) || null;
  }
}
