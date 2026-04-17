import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DiaryService } from '../../services/diary';
import { DiaryEntry } from '../../models/diary-entry.model';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddEntryPage {
  title: string = '';
  content: string = '';
  privacy: 'public' | 'private' = 'private';

  constructor(
    private diaryService: DiaryService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  async saveEntry() {
    if (!this.content) {
      await this.showToast('Please write something', 'warning');
      return;
    }

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      title: this.title,
      content: this.content,
      date: new Date(),
      privacy: this.privacy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.diaryService.addEntry(newEntry);
    await this.showToast('Entry saved successfully!', 'success');
    this.router.navigateByUrl('/home');
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
