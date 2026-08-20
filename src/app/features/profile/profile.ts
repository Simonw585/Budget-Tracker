import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  profile = {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '+44 7700 900123',
    location: 'Leeds, UK',
    role: 'Budget Planner',
    currency: 'GBP',
    monthlyTarget: 5000,
    theme: 'Dark mode',
    bio: 'Planning weekly savings goals and keeping spending aligned with long-term financial priorities.'
  };

  initialProfile = { ...this.profile };
  isEditing = false;
  savedMessage = '';

  get fullName(): string {
    return `${this.profile.firstName} ${this.profile.lastName}`.trim();
  }

  get initials(): string {
    const first = this.profile.firstName?.charAt(0)?.toUpperCase() ?? 'A';
    const last = this.profile.lastName?.charAt(0)?.toUpperCase() ?? 'M';
    return `${first}${last}`;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.savedMessage = '';
    if (!this.isEditing) {
      this.profile = { ...this.initialProfile };
    }
  }

  saveProfile(): void {
    this.initialProfile = { ...this.profile };
    this.isEditing = false;
    this.savedMessage = 'Profile updated successfully.';
  }
}
