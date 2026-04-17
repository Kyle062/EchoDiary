import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular'; // 1. Import Storage

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // 2. Inject Storage in the constructor
  constructor(private storage: Storage) {
    this.initStorage();
  }

  // 3. Initialize the database
  async initStorage() {
    await this.storage.create();
    console.log('Storage initialized and ready!');
  }
}
