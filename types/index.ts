export enum ViewMode {
  HOME = 'HOME',
  LINEAGE = 'LINEAGE',
  SETTINGS = 'SETTINGS'
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  bio?: string;
}
