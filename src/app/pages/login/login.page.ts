import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // 1. Ensure this is imported
import { RouterLink } from '@angular/router'; // 2. Needed for the [routerLink] in your HTML

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // 3. Add this to the imports array
    CommonModule,
    FormsModule,
    RouterLink, // 4. Add this so your register link works
  ],
})
export class LoginPage implements OnInit {
  constructor() {}
  ngOnInit() {}
}
