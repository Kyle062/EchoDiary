import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DiaryEntry } from '../models/diary-entry.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  private storage: Storage | null = null;
  private entriesSubject = new BehaviorSubject<DiaryEntry[]>([]);

  constructor(private storageService: Storage) {
    this.init();
  }

  async init() {
    this.storage = await this.storageService.create();
    await this.loadEntries();
  }

  private async loadEntries() {
    const entries = (await this.storage?.get('diary-entries')) || [];
    this.entriesSubject.next(entries);
  }

  getEntries(): Observable<DiaryEntry[]> {
    return this.entriesSubject.asObservable();
  }

  async addEntry(entry: DiaryEntry): Promise<void> {
    const currentEntries = this.entriesSubject.value;
    const updatedEntries = [entry, ...currentEntries];
    await this.storage?.set('diary-entries', updatedEntries);
    this.entriesSubject.next(updatedEntries);
  }

  async updateEntry(updatedEntry: DiaryEntry): Promise<void> {
    const currentEntries = this.entriesSubject.value;
    const index = currentEntries.findIndex(
      (entry) => entry.id === updatedEntry.id,
    );
    if (index !== -1) {
      currentEntries[index] = updatedEntry;
      await this.storage?.set('diary-entries', currentEntries);
      this.entriesSubject.next([...currentEntries]);
    }
  }

  async deleteEntry(id: string): Promise<void> {
    const currentEntries = this.entriesSubject.value;
    const updatedEntries = currentEntries.filter((entry) => entry.id !== id);
    await this.storage?.set('diary-entries', updatedEntries);
    this.entriesSubject.next(updatedEntries);
  }

  getEntryById(id: string): DiaryEntry | undefined {
    return this.entriesSubject.value.find((entry) => entry.id === id);
  }
}
