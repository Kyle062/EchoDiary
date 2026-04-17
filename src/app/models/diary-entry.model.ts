export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  privacy: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}
