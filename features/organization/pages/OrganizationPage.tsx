import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { ProjectList } from '../components/projects/ProjectList';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { CreateOrgModal } from '../components/CreateOrgModal';
import { TeamMemberList } from '../components/team/TeamMemberList';
import { OrgSettingsView } from '../components/settings/OrgSettingsView';

export const OrganizationPage: React.FC = () => {
  const { orgId, tab } = useParams<{ orgId?: string; tab?: string }>();
  const navigate = useNavigate();
  const { 
    activeOrgId, 
    setActiveOrgId, 
    activeOrgTab, 
    setActiveOrgTab,
    organizations 
  } = useAppStore();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  // Sync orgId from URL
  useEffect(() => {
    if (orgId) {
      const match = organizations.find(o => o.id === orgId || o.slug === orgId);
      if (match) {
        if (activeOrgId !== match.id) {
          setActiveOrgId(match.id);
        }
      } else {
        setActiveOrgId(orgId);
      }
    }
  }, [orgId, organizations, activeOrgId, setActiveOrgId]);

  // Sync tab from URL
  useEffect(() => {
    if (tab === 'team') {
      if (activeOrgTab !== 'team') setActiveOrgTab('team');
    } else if (tab === 'settings') {
      if (activeOrgTab !== 'settings') setActiveOrgTab('settings');
    } else {
      if (activeOrgTab !== 'projects') setActiveOrgTab('projects');
    }
  }, [tab, activeOrgTab, setActiveOrgTab]);

  return (
    <div className="w-full h-full flex overflow-y-auto bg-background text-foreground animate-in fade-in">
      {/* Single Main Content Container */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {activeOrgTab === 'projects' && (
          <ProjectList onOpenCreateProject={() => setIsCreateProjectOpen(true)} />
        )}

        {activeOrgTab === 'team' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Team Members
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                管理组织下的协作者权限与角色分工
              </p>
            </div>
            <TeamMemberList />
          </div>
        )}

        {activeOrgTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Organization Settings
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                配置组织基本信息、配额账单以及安全操作审计日志
              </p>
            </div>
            <OrgSettingsView />
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />

      <CreateOrgModal
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
      />
    </div>
  );
};
export default OrganizationPage;
