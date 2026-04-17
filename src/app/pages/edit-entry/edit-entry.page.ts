import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaryService } from '../../services/diary';
import { DiaryEntry } from '../../models/diary-entry.model';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.page.html',
  styleUrls: ['./edit-entry.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditEntryPage implements OnInit {
  entry: DiaryEntry | undefined;
  entryId: string = '';
  title: string = '';
  content: string = '';
  privacy: 'public' | 'private' = 'private';

  constructor(
    private route: ActivatedRoute,
    private diaryService: DiaryService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.entryId = this.route.snapshot.paramMap.get('id') || '';
    this.entry = this.diaryService.getEntryById(this.entryId);

    if (this.entry) {
      this.title = this.entry.title;
      this.content = this.entry.content;
      this.privacy = this.entry.privacy;
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  async updateEntry() {
    if (!this.content) {
      await this.showToast('Please write something', 'warning');
      return;
    }

    if (this.entry) {
      const updatedEntry: DiaryEntry = {
        ...this.entry,
        title: this.title,
        content: this.content,
        privacy: this.privacy,
        updatedAt: new Date(),
      };

      await this.diaryService.updateEntry(updatedEntry);
      await this.showToast('Entry updated successfully!', 'success');
      this.router.navigateByUrl(`/entry-details/${this.entryId}`);
    }
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
