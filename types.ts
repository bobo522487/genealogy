export enum ViewMode {
  ORGANIZATIONS = 'ORGANIZATIONS',
  OVERVIEW = 'OVERVIEW',
  HOME = 'HOME',
  LINEAGE = 'LINEAGE',
  ARTICLES = 'ARTICLES',
  BOOKS = 'BOOKS',
  PUBLISH = 'PUBLISH',
  SETTINGS = 'SETTINGS'
}

export interface SpaceItem {
  id: string;
  name: string;
  surname: string;
  region: string;
  lastModified: string;
  bookCount: number;
  branchCount: number;
  memberCount: number;
  articleCount: number;
  storageSize: string;
  status: 'active' | 'archived';
  description?: string;
  themeName?: string;
  level?: number;
  remarks?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  bio?: string;
}
