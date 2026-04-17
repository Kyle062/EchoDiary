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
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaryService } from '../../services/diary';
import { DiaryEntry } from '../../models/diary-entry.model';
import {
  createOutline,
  trashBinOutline,
  globeOutline,
  lockClosedOutline,
  calendarOutline,
  documentTextOutline,
  timeOutline,
  refreshOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.page.html',
  styleUrls: ['./entry-details.page.scss'],
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
    CommonModule,
    FormsModule,
  ],
})
export class EntryDetailsPage implements OnInit {
  // Icons
  public createOutline = createOutline;
  public trashBinOutline = trashBinOutline;
  public globeOutline = globeOutline;
  public lockClosedOutline = lockClosedOutline;
  public calendarOutline = calendarOutline;
  public documentTextOutline = documentTextOutline;
  public timeOutline = timeOutline;
  public refreshOutline = refreshOutline;

  entry: DiaryEntry | undefined;
  entryId: string = '';

  constructor(
    private route: ActivatedRoute,
    private diaryService: DiaryService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.entryId = this.route.snapshot.paramMap.get('id') || '';
    this.entry = this.diaryService.getEntryById(this.entryId);

    if (!this.entry) {
      this.router.navigateByUrl('/home');
    }
  }

  editEntry() {
    this.router.navigateByUrl(`/edit-entry/${this.entryId}`);
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
