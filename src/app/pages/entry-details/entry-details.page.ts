import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.page.html',
  styleUrls: ['./entry-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EntryDetailsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
