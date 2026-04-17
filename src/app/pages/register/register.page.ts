import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  NavController,
  ToastController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class RegisterPage implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  agreeTerms: boolean = false;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {}

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
    // Validate email
    if (!this.email || !this.password || !this.confirmPassword) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    // Email format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      await this.showToast('Please enter a valid email address', 'warning');
      return;
    }

    // Check if email already exists
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

    // Password validation
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

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      await this.showToast('Passwords do not match', 'danger');
      return;
    }

    // Check terms agreement
    if (!this.agreeTerms) {
      await this.showToast(
        'Please agree to the Terms of Service and Privacy Policy',
        'warning',
      );
      return;
    }

    this.isLoading = true;

    // Show loading spinner
    const loading = await this.loadingController.create({
      message: 'Creating your account...',
      spinner: 'circles',
      cssClass: 'custom-loading',
      backdropDismiss: false,
    });
    await loading.present();

    // Simulate API call delay
    setTimeout(async () => {
      // Get existing users or initialize empty array
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Create new user object
      const newUser = {
        email: this.email,
        password: this.password,
        createdAt: new Date().toISOString(),
      };

      // Add to users array
      users.push(newUser);

      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Auto-login after registration
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('loginTimestamp', Date.now().toString());

      await loading.dismiss();
      this.isLoading = false;

      await this.showToast(
        'Account created successfully! Welcome to EchoDiary!',
        'success',
      );

      // Navigate to home page
      setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 1000);
    }, 1500);
  }

  async showTerms() {
    const alert = await this.alertController.create({
      header: 'Terms of Service',
      message: `Welcome to EchoDiary! By using our app, you agree to:
      
1. You will not misuse our services.
2. You will respect other users' privacy.
3. Your diary entries are your own responsibility.
4. Public entries may be viewed by other users.
5. We reserve the right to update these terms.

For full terms, please contact us.`,
      buttons: ['I Understand'],
      cssClass: 'terms-alert',
    });
    await alert.present();
  }

  async showPrivacy() {
    const alert = await this.alertController.create({
      header: 'Privacy Policy',
      message: `At EchoDiary, we value your privacy:
      
• Your diary entries are stored locally on your device.
• We do not collect personal data without consent.
• Public entries are visible to other app users.
• You can delete your data at any time.
• We do not share your information with third parties.

For full privacy policy, please contact us.`,
      buttons: ['I Understand'],
      cssClass: 'terms-alert',
    });
    await alert.present();
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
