import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonTextarea,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaryService } from '../../services/diary';
import { DiaryEntry } from '../../models/diary-entry.model';
import {
  createOutline,
  documentTextOutline,
  lockClosedOutline,
  globeOutline,
  saveOutline,
  trashBinOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.page.html',
  styleUrls: ['./edit-entry.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
  ],
})
export class EditEntryPage implements OnInit {
  // Icons
  public createOutline = createOutline;
  public documentTextOutline = documentTextOutline;
  public lockClosedOutline = lockClosedOutline;
  public globeOutline = globeOutline;
  public saveOutline = saveOutline;
  public trashBinOutline = trashBinOutline;

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
    private alertController: AlertController,
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

  async deleteEntry() {
    const alert = await this.alertController.create({
      header: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            await this.diaryService.deleteEntry(this.entryId);
            await this.showToast('Entry deleted successfully', 'success');
            this.router.navigateByUrl('/home');
          },
        },
      ],
    });
    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
