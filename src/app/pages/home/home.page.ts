import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DiaryService } from '../../services/diary';
import { DiaryEntry } from '../../models/diary-entry.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  allEntries: DiaryEntry[] = [];
  filteredEntries: DiaryEntry[] = [];
  activeFilter: string = 'all';
  userEmail: string = '';

  constructor(
    private diaryService: DiaryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || 'Guest';

    this.diaryService.getEntries().subscribe((entries) => {
      this.allEntries = entries;
      this.filterEntries();
    });
  }

  filterEntries() {
    if (this.activeFilter === 'all') {
      this.filteredEntries = this.allEntries;
    } else if (this.activeFilter === 'public') {
      this.filteredEntries = this.allEntries.filter(
        (entry) => entry.privacy === 'public',
      );
    } else if (this.activeFilter === 'private') {
      this.filteredEntries = this.allEntries.filter(
        (entry) => entry.privacy === 'private',
      );
    }
  }

  goToAddEntry() {
    this.router.navigateByUrl('/add-entry');
  }

  viewEntry(id: string) {
    this.router.navigateByUrl(`/entry-details/${id}`);
  }

  async deleteEntry(id: string, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            await this.diaryService.deleteEntry(id);
            await this.showToast('Entry deleted', 'success');
          },
        },
      ],
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Logout',
          handler: async () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            await this.showToast('Logged out', 'success');
            this.router.navigateByUrl('/login');
          },
        },
      ],
    });
    await alert.present();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
