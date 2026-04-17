import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  hasUpperCase(str: string): boolean {
    return /[A-Z]/.test(str);
  }

  hasNumber(str: string): boolean {
    return /[0-9]/.test(str);
  }

  async onRegister() {
    if (!this.email || !this.password || !this.confirmPassword) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      await this.showToast('Please enter a valid email address', 'warning');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(
      (user: any) => user.email === this.email,
    );

    if (userExists) {
      await this.showToast(
        'Email already registered. Please login instead.',
        'danger',
      );
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    if (!this.hasUpperCase(this.password)) {
      await this.showToast(
        'Password must contain at least 1 uppercase letter',
        'warning',
      );
      return;
    }

    if (!this.hasNumber(this.password)) {
      await this.showToast(
        'Password must contain at least 1 number',
        'warning',
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Passwords do not match', 'danger');
      return;
    }

    this.isLoading = true;

    const loading = await this.loadingController.create({
      message: 'Creating your account...',
      spinner: 'circles',
      cssClass: 'custom-loading',
      backdropDismiss: false,
    });
    await loading.present();

    setTimeout(async () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ email: this.email, password: this.password });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.email);

      await loading.dismiss();
      this.isLoading = false;
      await this.showToast('Account created successfully!', 'success');

      setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 1000);
    }, 1500);
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
        },
      ],
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
}