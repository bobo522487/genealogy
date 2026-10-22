import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  ShieldCheck, 
  Sliders, 
  FileText,
  Lock
} from 'lucide-react';
import { OrgGeneralSettings } from './OrgGeneralSettings';
import { OrgBillingUsage } from './OrgBillingUsage';
import { OrgAuditLogs } from './OrgAuditLogs';

export const OrgSettingsView: React.FC = () => {
  const [subTab, setSubTab] = useState<'general' | 'billing' | 'audit'>('general');

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('general')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            subTab === 'general'
              ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Sliders size={13} />
          <span>常规设置 (General)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('billing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            subTab === 'billing'
              ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <CreditCard size={13} />
          <span>订阅与计费配额 (Billing & Usage)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            subTab === 'audit'
              ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <ShieldCheck size={13} />
          <span>操作审计日志 (Audit Logs)</span>
        </button>
      </div>

      {/* Tab Content */}
      {subTab === 'general' && <OrgGeneralSettings />}
      {subTab === 'billing' && <OrgBillingUsage />}
      {subTab === 'audit' && <OrgAuditLogs />}
    </div>
  );
};
