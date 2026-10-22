export type ProjectStatus = 'ACTIVE_HEALTHY' | 'PAUSED' | 'RESTORING' | 'UPGRADING' | 'INACTIVE';

export type TeamRole = 'Owner' | 'Admin' | 'Developer' | 'Read-only';

export type PlanTier = 'Free' | 'Pro' | 'Enterprise';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  plan: PlanTier;
  createdAt: string;
  description?: string;
  billingEmail?: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  region: string;
  regionCode: string;
  status: ProjectStatus;
  databaseVersion: string;
  databaseHost: string;
  computeSize: string;
  dbPassword?: string;
  createdAt: string;
  updatedAt: string;
  restUrl: string;
  anonKey: string;
  serviceKey?: string;
  storageUsed: string;
  dbSize: string;
  memberCount: number;
  tags?: string[];
  description?: string;
  // Link to lineage space if applicable
  linkedSpaceId?: string;
}

export interface TeamMember {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  avatar?: string;
  role: TeamRole;
  joinedAt: string;
  status: 'active' | 'invited';
  isCurrentUser?: boolean;
}

export interface BillingUsage {
  planTier: PlanTier;
  projectsUsed: number;
  projectsLimit: number;
  dbStorageUsedMb: number;
  dbStorageLimitMb: number;
  bandwidthUsedGb: number;
  bandwidthLimitGb: number;
  authUsersCount: number;
  authUsersLimit: number;
  storageFileUsedMb: number;
  storageFileLimitMb: number;
  nextBillingDate: string;
}

export interface OrgAuditLog {
  id: string;
  organizationId: string;
  actor: string;
  actorAvatar?: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
  type: 'project' | 'team' | 'billing' | 'security';
}
