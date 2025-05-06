import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shiki-test';

  // Sample JSON data for demonstration
  sampleJsonData = {
    "name": "John Doe",
    "age": 30,
    "isActive": true,
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    },
    "phoneNumbers": [
      {
        "type": "home",
        "number": "212-555-1234"
      },
      {
        "type": "work",
        "number": "646-555-5678"
      }
    ],
    "skills": ["JavaScript", "Angular", "TypeScript", "HTML", "CSS"]
  };

  // Modal control
  isModalOpen = false;

  openJsonModal() {
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }
}
