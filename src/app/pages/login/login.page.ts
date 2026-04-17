import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadSavedCredentials();
  }

  loadSavedCredentials() {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const rememberMe = localStorage.getItem('rememberMe');

    if (rememberMe === 'true' && savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.email || !this.password) {
      await this.showToast('Please enter both email and password', 'warning');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      await this.showToast('Please enter a valid email address', 'warning');
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    this.isLoading = true;

    const loading = await this.loadingController.create({
      message: 'Signing in...',
      spinner: 'circles',
      cssClass: 'custom-loading',
      backdropDismiss: false,
    });
    await loading.present();

    setTimeout(async () => {
      if (this.email === 'demo@echodiary.com' && this.password === 'demo123') {
        if (this.rememberMe) {
          localStorage.setItem('savedEmail', this.email);
          localStorage.setItem('savedPassword', this.password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
          localStorage.removeItem('rememberMe');
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', this.email);
        localStorage.setItem('loginTimestamp', Date.now().toString());

        await loading.dismiss();
        await this.showToast('Login successful! Welcome back!', 'success');

        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 500);
      } else {
        await loading.dismiss();
        this.isLoading = false;

        if (this.email !== 'demo@echodiary.com') {
          await this.showToast(
            'Email not found. Please use demo@echodiary.com',
            'danger',
          );
        } else if (this.password !== 'demo123') {
          await this.showToast(
            'Incorrect password. Please try again.',
            'danger',
          );
        } else {
          await this.showToast(
            'Invalid credentials. Use demo@echodiary.com / demo123',
            'danger',
          );
        }

        this.password = '';
      }
    }, 1500);
  }

  async onForgotPassword() {
    if (!this.email) {
      await this.showToast('Please enter your email address first', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sending reset link...',
      spinner: 'circles',
      duration: 2000,
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      await this.showToast(
        `Password reset link sent to ${this.email}`,
        'success',
      );
    }, 2000);
  }

  async quickFillDemo() {
    this.email = 'demo@echodiary.com';
    this.password = 'demo123';
    await this.showToast(
      'Demo credentials filled! Click Sign In to continue.',
      'success',
    );
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

  async googleLogin() {
    await this.showToast('Google login coming soon!', 'medium');
  }

  async appleLogin() {
    await this.showToast('Apple login coming soon!', 'medium');
  }

  clearForm() {
    this.email = '';
    this.password = '';
    this.rememberMe = false;
  }
}
