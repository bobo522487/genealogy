import { Organization, Project, TeamMember, BillingUsage, OrgAuditLog } from './types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'rnxvmzibhipcjpksaluw',
    name: 'rnxvmzibhipcjpksaluw',
    slug: 'rnxvmzibhipcjpksaluw',
    avatarUrl: '',
    plan: 'Free',
    createdAt: '2026-01-15',
    description: '陈氏宗亲数字化修谱总会与 gramps 谱系空间',
    billingEmail: 'bobo522487@gmail.com'
  },
  {
    id: 'org-chen-lineage',
    name: '陈氏宗亲数字化修谱总会',
    slug: 'chen-lineage-foundation',
    avatarUrl: '',
    plan: 'Pro',
    createdAt: '2026-01-15',
    description: '第八次重修陈氏大统宗谱数字化云端修谱工作委员会组织空间',
    billingEmail: 'admin@chen-lineage.com'
  },
  {
    id: 'org-antigravity-labs',
    name: 'Antigravity Cloud Labs',
    slug: 'antigravity-cloud',
    avatarUrl: '',
    plan: 'Enterprise',
    createdAt: '2025-11-20',
    description: '云端谱牒数据中台与古籍排版渲染研发组织',
    billingEmail: 'bobo522487@gmail.com'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-gramps',
    organizationId: 'rnxvmzibhipcjpksaluw',
    name: 'gramps',
    slug: 'gramps',
    region: 'AWS | ap-northeast-1',
    regionCode: 'ap-northeast-1',
    status: 'ACTIVE_HEALTHY',
    databaseVersion: 'PostgreSQL 15.6',
    databaseHost: 'db.rnxvmzibhipcjpksaluw.supabase.co',
    computeSize: 'NANO',
    createdAt: '2026-08-19 11:30',
    updatedAt: '2026-08-19 11:36',
    restUrl: 'https://rnxvmzibhipcjpksaluw.supabase.co/rest/v1',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueHZtemliaGlwY2pwa3NhbHV3Iiwicm9sZSI6ImFub24ifQ',
    storageUsed: '11.7 MB',
    dbSize: '2.4 MB',
    memberCount: 28,
    tags: ['NANO'],
    description: '陈氏二十一世至三十五世族人档案、世系图拓扑与古籍生平数字化主项目',
    linkedSpaceId: '2c9e80729fda2a90019fe03999fe4774'
  },
  {
    id: 'proj-chen-lineage-db',
    organizationId: 'rnxvmzibhipcjpksaluw',
    name: '陈氏数字化大统宗谱 (生产主库)',
    slug: 'chen-lineage-production',
    region: 'AWS | ap-northeast-1',
    regionCode: 'ap-northeast-1',
    status: 'ACTIVE_HEALTHY',
    databaseVersion: 'PostgreSQL 15.6 (Supabase Edition)',
    databaseHost: 'db.gdyjjvmncpwrv2izj2i7n2.supabase.co',
    computeSize: 'NANO',
    createdAt: '2026-01-16 09:30',
    updatedAt: '2026-08-19 11:36',
    restUrl: 'https://gdyjjvmncpwrv2izj2i7n2.supabase.co/rest/v1',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkeWpqdm1uY3B3cnYyaXpqMmkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ',
    storageUsed: '11.7 MB',
    dbSize: '2.4 MB',
    memberCount: 28,
    tags: ['大统宗谱', '世系关系图', '苏欧排版'],
    description: '陈氏二十一世至三十五世族人档案、世系图拓扑与古籍生平数字化主项目',
    linkedSpaceId: '2c9e80729fda2a90019fe03999fe4774'
  },
  {
    id: 'proj-baijia-hub',
    organizationId: 'org-chen-lineage',
    name: '百家姓通谱云端数据中枢',
    slug: 'baijia-genealogy-hub',
    region: '华东 · 上海数据中心',
    regionCode: 'cn-east-shanghai',
    status: 'ACTIVE_HEALTHY',
    databaseVersion: 'PostgreSQL 15.6',
    databaseHost: 'db.baijia-hub-prod.supabase.co',
    computeSize: 'Small (2 Core, 4GB RAM)',
    createdAt: '2026-03-02 14:15',
    updatedAt: '2026-08-18 19:40',
    restUrl: 'https://baijia-hub.supabase.co/rest/v1',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhaWppYS1odWIiLCJyb2xlIjoiYW5vbiJ9',
    storageUsed: '64.2 MB',
    dbSize: '18.9 MB',
    memberCount: 156,
    tags: ['跨姓氏索引', '堂号字典', '地名沿革'],
    description: '支持全国各姓氏堂号源流、迁徙路线与宗族谱书检索云服务'
  },
  {
    id: 'proj-render-engine',
    organizationId: 'org-chen-lineage',
    name: '苏欧式古籍排版与渲染微服务',
    slug: 'su-ou-render-engine',
    region: '华南 · 深圳数据中心',
    regionCode: 'cn-south-shenzhen',
    status: 'PAUSED',
    databaseVersion: 'PostgreSQL 15.6',
    databaseHost: 'db.su-ou-render.supabase.co',
    computeSize: 'Nano (1 Core, 1GB RAM)',
    createdAt: '2026-04-10 11:20',
    updatedAt: '2026-08-10 08:00',
    restUrl: 'https://su-ou-render.supabase.co/rest/v1',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1LW91LXJlbmRlciIsInJvbGUiOiJhbm9uIn0',
    storageUsed: '5.1 MB',
    dbSize: '1.2 MB',
    memberCount: 12,
    tags: ['SVG世系', '排版引擎', 'PDF生成'],
    description: '将世系树结构自动转译为欧苏体例竖排古籍与五世一图矢量文件'
  },
  {
    id: 'proj-cloud-analytics',
    organizationId: 'org-antigravity-labs',
    name: 'Antigravity Gene Analytics Engine',
    slug: 'antigravity-gene-analytics',
    region: '亚太 · 新加坡数据中心',
    regionCode: 'ap-southeast-singapore',
    status: 'ACTIVE_HEALTHY',
    databaseVersion: 'PostgreSQL 16.0',
    databaseHost: 'db.antigravity-analytics.supabase.co',
    computeSize: 'Medium (4 Core, 8GB RAM)',
    createdAt: '2025-12-01 10:00',
    updatedAt: '2026-08-19 18:22',
    restUrl: 'https://antigravity-analytics.supabase.co/rest/v1',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudGlncmF2aXR5LWEiLCJyb2xlIjoiYW5vbiJ9',
    storageUsed: '142.5 MB',
    dbSize: '88.3 MB',
    memberCount: 420,
    tags: ['AI分析', '谱系关联挖掘'],
    description: '利用 Gemini 多模态模型解析古籍谱牒并自动建立亲缘拓扑'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-rnx-1',
    organizationId: 'rnxvmzibhipcjpksaluw',
    name: 'Alex Developer',
    email: 'bobo522487@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    role: 'Owner',
    joinedAt: '2026-01-15',
    status: 'active',
    isCurrentUser: true
  },
  {
    id: 'tm-rnx-2',
    organizationId: 'rnxvmzibhipcjpksaluw',
    name: '陈宗望 (编委会主任)',
    email: 'chen.zongwang@lineage.org',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop',
    role: 'Admin',
    joinedAt: '2026-01-18',
    status: 'active'
  },
  {
    id: 'tm-rnx-3',
    organizationId: 'rnxvmzibhipcjpksaluw',
    name: '陈文礼 (副主编)',
    email: 'chen.wenli@lineage.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    role: 'Developer',
    joinedAt: '2026-02-05',
    status: 'active'
  },
  {
    id: 'tm-1',
    organizationId: 'org-chen-lineage',
    name: 'Alex Developer',
    email: 'bobo522487@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    role: 'Owner',
    joinedAt: '2026-01-15',
    status: 'active',
    isCurrentUser: true
  },
  {
    id: 'tm-2',
    organizationId: 'org-chen-lineage',
    name: '陈宗望 (编委会主任)',
    email: 'chen.zongwang@lineage.org',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop',
    role: 'Admin',
    joinedAt: '2026-01-18',
    status: 'active'
  },
  {
    id: 'tm-3',
    organizationId: 'org-chen-lineage',
    name: '陈文礼 (副主编)',
    email: 'chen.wenli@lineage.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    role: 'Developer',
    joinedAt: '2026-02-05',
    status: 'active'
  },
  {
    id: 'tm-4',
    organizationId: 'org-chen-lineage',
    name: '陈晓华 (文史校对员)',
    email: 'chen.xiaohua@lineage.org',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    role: 'Read-only',
    joinedAt: '2026-03-12',
    status: 'active'
  },
  {
    id: 'tm-5',
    organizationId: 'org-chen-lineage',
    name: '李明 (古籍数字化顾问)',
    email: 'li.ming@history-cloud.cn',
    avatar: '',
    role: 'Developer',
    joinedAt: '2026-08-01',
    status: 'invited'
  }
];

export const INITIAL_BILLING_USAGE: BillingUsage = {
  planTier: 'Pro',
  projectsUsed: 3,
  projectsLimit: 10,
  dbStorageUsedMb: 81.0,
  dbStorageLimitMb: 8192, // 8GB
  bandwidthUsedGb: 4.8,
  bandwidthLimitGb: 250, // 250GB
  authUsersCount: 202,
  authUsersLimit: 50000,
  storageFileUsedMb: 11.7,
  storageFileLimitMb: 51200, // 50GB
  nextBillingDate: '2026-09-15'
};

export const INITIAL_AUDIT_LOGS: OrgAuditLog[] = [
  {
    id: 'log-1',
    organizationId: 'org-chen-lineage',
    actor: 'Alex Developer',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    action: '更新数据库配置',
    target: '陈氏数字化大统宗谱 (生产主库)',
    timestamp: '2026-08-19 11:36:20',
    ipAddress: '113.240.12.89',
    type: 'project'
  },
  {
    id: 'log-2',
    organizationId: 'org-chen-lineage',
    actor: '陈宗望 (编委会主任)',
    actorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop',
    action: '邀请新协作成员',
    target: 'li.ming@history-cloud.cn (Developer)',
    timestamp: '2026-08-01 15:20:00',
    ipAddress: '183.14.132.54',
    type: 'team'
  },
  {
    id: 'log-3',
    organizationId: 'org-chen-lineage',
    actor: 'Alex Developer',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    action: '创建新项目',
    target: '苏欧式古籍排版与渲染微服务',
    timestamp: '2026-04-10 11:20:12',
    ipAddress: '113.240.12.89',
    type: 'project'
  },
  {
    id: 'log-4',
    organizationId: 'org-chen-lineage',
    actor: 'Alex Developer',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    action: '升级组织套餐',
    target: 'Pro 专业版计划生效',
    timestamp: '2026-01-16 10:00:00',
    ipAddress: '113.240.12.89',
    type: 'billing'
  }
];
