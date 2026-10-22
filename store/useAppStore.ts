import { create } from 'zustand';
import { ViewMode, UserProfile, SpaceItem } from '../types';
import { PersonRecord, LineageBranch } from '../features/lineage/types';
import { INITIAL_BRANCHES, INITIAL_PERSONS } from '../features/lineage/lineageData';
import { 
  Organization, 
  Project, 
  TeamMember, 
  BillingUsage, 
  OrgAuditLog, 
  TeamRole 
} from '../features/organization/types';
import { 
  INITIAL_ORGANIZATIONS, 
  INITIAL_PROJECTS, 
  INITIAL_TEAM_MEMBERS, 
  INITIAL_BILLING_USAGE, 
  INITIAL_AUDIT_LOGS 
} from '../features/organization/mockData';
import { supabase } from '../lib/supabase';

export type AppTheme = 'vercel' | 'supabase' | 'slack' | 'vscode';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface AppState {
  isDarkMode: boolean;
  theme: AppTheme;
  activeView: ViewMode;
  activeDevice: DeviceType;
  toggleTheme: () => void;
  setAppTheme: (theme: AppTheme) => void;
  setActiveView: (view: ViewMode) => void;
  setActiveDevice: (device: DeviceType) => void;
  
  // Auth State
  session: any | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setSession: (session: any) => void;
  initAuth: () => () => void;
  logout: () => Promise<void>;

  // Organizations & Projects (Supabase-Style) State
  organizations: Organization[];
  activeOrgId: string;
  activeProjectId: string;
  activeOrgTab: 'projects' | 'team' | 'settings';
  projects: Project[];
  teamMembers: TeamMember[];
  billingUsage: BillingUsage;
  auditLogs: OrgAuditLog[];
  setActiveOrgId: (id: string) => void;
  setActiveProjectId: (id: string) => void;
  setActiveOrgTab: (tab: 'projects' | 'team' | 'settings') => void;
  addOrganization: (org: Organization) => void;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectStatus: (id: string) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMemberRole: (id: string, role: TeamRole) => void;
  deleteTeamMember: (id: string) => void;
  addAuditLog: (log: OrgAuditLog) => void;

  // Spaces (云谱空间) State
  spaces: SpaceItem[];
  activeSpaceId: string;
  setActiveSpaceId: (id: string) => void;
  addSpace: (space: SpaceItem) => void;
  updateSpace: (id: string, updates: Partial<SpaceItem>) => void;
  deleteSpace: (id: string) => void;

  // Lineage (谱系) State
  branches: LineageBranch[];
  activeBranchId: string;
  persons: PersonRecord[];
  selectedPersonId: string | null;
  lineageViewMode: 'tree' | 'biography' | 'grid' | 'table';
  setBranches: (branches: LineageBranch[]) => void;
  setActiveBranchId: (id: string) => void;
  setPersons: (persons: PersonRecord[]) => void;
  setSelectedPersonId: (id: string | null) => void;
  setLineageViewMode: (mode: 'tree' | 'biography' | 'grid' | 'table') => void;
  addPerson: (person: PersonRecord) => void;
  updatePerson: (id: string, updates: Partial<PersonRecord>) => void;
  deletePerson: (id: string) => void;
  addBranch: (branch: LineageBranch) => void;
  updateBranch: (id: string, updates: Partial<LineageBranch>) => void;
  deleteBranch: (id: string) => void;
  toggleBranchFolder: (id: string) => void;
  reorderBranches: (branches: LineageBranch[]) => void;

  // User State
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const INITIAL_SPACES: SpaceItem[] = [
  {
    id: '2c9e80729fda2a90019fe03999fe4774',
    name: '陈氏族谱的云谱空间',
    themeName: '陈氏族谱',
    surname: '陈',
    region: '中国/贵州/遵义/桐梓县',
    lastModified: '2026-08-19 11:36',
    bookCount: 1,
    branchCount: 1,
    memberCount: 28,
    articleCount: 2,
    storageSize: '11.7 MB',
    status: 'active',
    description: '第八次重修陈氏大统宗谱数字化云端管理空间'
  }
];

const INITIAL_USER: UserProfile = {
  name: 'Alex Developer',
  email: 'alex.dev@antigravity.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  role: '修谱编委会主编',
  bio: '陈氏二十一世孙，负责第八次重修陈氏大统宗谱数字化整理。'
};

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: true,
  theme: 'vscode',
  activeView: ViewMode.OVERVIEW,
  activeDevice: 'desktop',
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setAppTheme: (theme) => set({ theme }),
  setActiveView: (view) => set({ activeView: view }),
  setActiveDevice: (device) => set({ activeDevice: device }),

  // Auth State
  session: null,
  isAuthenticated: false,
  authLoading: true,

  setSession: (session) => {
    if (session?.user) {
      const u = session.user;
      const userMeta = u.user_metadata || {};
      const updatedProfile: UserProfile = {
        id: u.id,
        name: userMeta.name || userMeta.full_name || u.email?.split('@')[0] || '陈氏族人',
        email: u.email || '',
        avatar: userMeta.avatar_url || get().user.avatar,
        role: userMeta.role || '修谱编委会主编',
        bio: userMeta.bio || get().user.bio
      };
      set({
        session,
        isAuthenticated: true,
        authLoading: false,
        user: updatedProfile
      });
    } else {
      set({
        session: null,
        isAuthenticated: false,
        authLoading: false
      });
    }
  },

  initAuth: () => {
    // 1. Check existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session) {
        get().setSession(session);
      } else {
        set({ authLoading: false });
      }
    }).catch(() => {
      set({ authLoading: false });
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      get().setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout error', e);
    }
    set({
      session: null,
      isAuthenticated: false
    });
  },

  // Organizations & Projects State
  organizations: INITIAL_ORGANIZATIONS,
  activeOrgId: 'rnxvmzibhipcjpksaluw',
  activeProjectId: 'proj-gramps',
  activeOrgTab: 'projects',
  projects: INITIAL_PROJECTS,
  teamMembers: INITIAL_TEAM_MEMBERS,
  billingUsage: INITIAL_BILLING_USAGE,
  auditLogs: INITIAL_AUDIT_LOGS,

  setActiveOrgId: (id) => set({ activeOrgId: id }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setActiveOrgTab: (tab) => set({ activeOrgTab: tab }),
  
  addOrganization: (org) => {
    set((state) => ({
      organizations: [...state.organizations, org],
      activeOrgId: org.id
    }));
    get().addAuditLog({
      id: `log-${Date.now()}`,
      organizationId: org.id,
      actor: get().user.name,
      actorAvatar: get().user.avatar,
      action: '创建新组织',
      target: org.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '127.0.0.1',
      type: 'security'
    });
  },

  updateOrganization: (id, updates) => set((state) => ({
    organizations: state.organizations.map(o => o.id === id ? { ...o, ...updates } : o)
  })),

  deleteOrganization: (id) => set((state) => {
    const remaining = state.organizations.filter(o => o.id !== id);
    return {
      organizations: remaining,
      activeOrgId: state.activeOrgId === id ? (remaining[0]?.id || '') : state.activeOrgId,
      projects: state.projects.filter(p => p.organizationId !== id),
      teamMembers: state.teamMembers.filter(m => m.organizationId !== id)
    };
  }),

  addProject: (project) => {
    set((state) => ({
      projects: [project, ...state.projects]
    }));
    get().addAuditLog({
      id: `log-${Date.now()}`,
      organizationId: project.organizationId,
      actor: get().user.name,
      actorAvatar: get().user.avatar,
      action: '创建新项目',
      target: project.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '127.0.0.1',
      type: 'project'
    });
  },

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  deleteProject: (id) => {
    const targetProject = get().projects.find(p => p.id === id);
    set((state) => ({
      projects: state.projects.filter(p => p.id !== id)
    }));
    if (targetProject) {
      get().addAuditLog({
        id: `log-${Date.now()}`,
        organizationId: targetProject.organizationId,
        actor: get().user.name,
        actorAvatar: get().user.avatar,
        action: '删除项目',
        target: targetProject.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '127.0.0.1',
        type: 'project'
      });
    }
  },

  toggleProjectStatus: (id) => {
    const target = get().projects.find(p => p.id === id);
    if (!target) return;
    const nextStatus = target.status === 'ACTIVE_HEALTHY' ? 'PAUSED' : 'ACTIVE_HEALTHY';
    get().updateProject(id, { 
      status: nextStatus,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    get().addAuditLog({
      id: `log-${Date.now()}`,
      organizationId: target.organizationId,
      actor: get().user.name,
      actorAvatar: get().user.avatar,
      action: nextStatus === 'ACTIVE_HEALTHY' ? '恢复项目运行' : '暂停项目',
      target: target.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '127.0.0.1',
      type: 'project'
    });
  },

  addTeamMember: (member) => {
    set((state) => ({
      teamMembers: [...state.teamMembers, member]
    }));
    get().addAuditLog({
      id: `log-${Date.now()}`,
      organizationId: member.organizationId,
      actor: get().user.name,
      actorAvatar: get().user.avatar,
      action: '邀请新成员',
      target: `${member.name || member.email} (${member.role})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '127.0.0.1',
      type: 'team'
    });
  },

  updateTeamMemberRole: (id, role) => {
    const member = get().teamMembers.find(m => m.id === id);
    set((state) => ({
      teamMembers: state.teamMembers.map(m => m.id === id ? { ...m, role } : m)
    }));
    if (member) {
      get().addAuditLog({
        id: `log-${Date.now()}`,
        organizationId: member.organizationId,
        actor: get().user.name,
        actorAvatar: get().user.avatar,
        action: '修改成员角色',
        target: `${member.name} -> ${role}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '127.0.0.1',
        type: 'team'
      });
    }
  },

  deleteTeamMember: (id) => {
    const member = get().teamMembers.find(m => m.id === id);
    set((state) => ({
      teamMembers: state.teamMembers.filter(m => m.id !== id)
    }));
    if (member) {
      get().addAuditLog({
        id: `log-${Date.now()}`,
        organizationId: member.organizationId,
        actor: get().user.name,
        actorAvatar: get().user.avatar,
        action: '移除团队成员',
        target: member.name || member.email,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '127.0.0.1',
        type: 'team'
      });
    }
  },

  addAuditLog: (log) => set((state) => ({
    auditLogs: [log, ...state.auditLogs]
  })),

  // Spaces State
  spaces: INITIAL_SPACES,
  activeSpaceId: '2c9e80729fda2a90019fe03999fe4774',
  setActiveSpaceId: (id) => set({ activeSpaceId: id }),
  addSpace: (space) => set((state) => ({
    spaces: [space, ...state.spaces],
    activeSpaceId: space.id
  })),
  updateSpace: (id, updates) => set((state) => ({
    spaces: state.spaces.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteSpace: (id) => set((state) => ({
    spaces: state.spaces.filter(s => s.id !== id),
    activeSpaceId: state.activeSpaceId === id ? (state.spaces.find(s => s.id !== id)?.id || '') : state.activeSpaceId
  })),

  // Lineage (谱系) State
  branches: INITIAL_BRANCHES,
  activeBranchId: 'branch-1',
  persons: INITIAL_PERSONS,
  selectedPersonId: 'p-1',
  lineageViewMode: 'tree',
  setBranches: (branches) => set({ branches }),
  setActiveBranchId: (id) => set({ activeBranchId: id }),
  setPersons: (persons) => set({ persons }),
  setSelectedPersonId: (id) => set({ selectedPersonId: id }),
  setLineageViewMode: (mode) => set({ lineageViewMode: mode }),
  addPerson: (person) => set((state) => ({
    persons: [...state.persons, person],
    selectedPersonId: person.id
  })),
  updatePerson: (id, updates) => set((state) => ({
    persons: state.persons.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deletePerson: (id) => set((state) => ({
    persons: state.persons.filter(p => p.id !== id && p.fatherId !== id),
    selectedPersonId: state.selectedPersonId === id ? null : state.selectedPersonId
  })),
  addBranch: (branch) => set((state) => {
    const isFirstBranch = !state.branches.some(b => b.type !== 'folder');
    return {
      branches: [...state.branches, branch],
      activeBranchId: branch.type !== 'folder' ? branch.id : (isFirstBranch ? branch.id : state.activeBranchId)
    };
  }),
  updateBranch: (id, updates) => set((state) => ({
    branches: state.branches.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  deleteBranch: (id) => set((state) => {
    const toDelete = new Set<string>([id]);
    let added = true;
    while (added) {
      added = false;
      state.branches.forEach(b => {
        if (b.parentId && toDelete.has(b.parentId) && !toDelete.has(b.id)) {
          toDelete.add(b.id);
          added = true;
        }
      });
    }
    const remainingBranches = state.branches.filter(b => !toDelete.has(b.id));
    const firstValidBranch = remainingBranches.find(b => b.type !== 'folder');
    return {
      branches: remainingBranches,
      activeBranchId: toDelete.has(state.activeBranchId) ? (firstValidBranch ? firstValidBranch.id : '') : state.activeBranchId
    };
  }),
  toggleBranchFolder: (id) => set((state) => ({
    branches: state.branches.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b)
  })),
  reorderBranches: (branches) => set({ branches }),

  // User State
  user: INITIAL_USER,
  updateUser: (updates) => {
    set((state) => ({
      user: { ...state.user, ...updates }
    }));
    // Sync metadata to Supabase if logged in
    const currentUser = get().session?.user;
    if (currentUser) {
      supabase.auth.updateUser({
        data: {
          name: updates.name || get().user.name,
          bio: updates.bio !== undefined ? updates.bio : get().user.bio,
          role: updates.role || get().user.role
        }
      }).catch(err => console.warn('Failed to update Supabase user metadata', err));
    }
  },
}));
