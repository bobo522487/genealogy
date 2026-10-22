import React, { useState } from 'react';
import { PersonRecord } from '../types';
import { Search, Heart, MapPin, Award, Edit3, Trash2, Plus, Download, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { formatGivenName } from '../utils/nameUtils';

interface LineageTableViewProps {
  persons: PersonRecord[];
  selectedPersonId: string | null;
  onSelectPerson: (id: string) => void;
  onAddPerson: () => void;
  onDeletePerson: (id: string) => void;
}

export const LineageTableView: React.FC<LineageTableViewProps> = ({
  persons,
  selectedPersonId,
  onSelectPerson,
  onAddPerson,
  onDeletePerson
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genFilter, setGenFilter] = useState<string>('all');

  const filteredPersons = persons.filter(p => {
    const matchesSearch = 
      p.name.includes(searchTerm) ||
      (p.courtesyName && p.courtesyName.includes(searchTerm)) ||
      (p.officialTitle && p.officialTitle.includes(searchTerm)) ||
      (p.burialPlace && p.burialPlace.includes(searchTerm)) ||
      (p.biography && p.biography.includes(searchTerm));
    
    const matchesGen = genFilter === 'all' || p.generation.toString() === genFilter;

    return matchesSearch && matchesGen;
  });

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden p-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-2 h-5 bg-primary rounded-full inline-block" />
            世系行传与族人总名录
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            收录全部谱系族人档案，支持姓名、字号、官阶、生卒年及茔葬地多维度检索。
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索族人姓名/字号/官阶/葬地..."
              className="h-8 pl-8 text-xs bg-muted/30"
            />
          </div>

          <select
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            className="h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">全部世次</option>
            <option value="1">第1世 (始祖)</option>
            <option value="2">第2世</option>
            <option value="3">第3世</option>
            <option value="4">第4世</option>
            <option value="5">第5世</option>
          </select>

          <Button size="sm" className="h-8 text-xs" onClick={onAddPerson}>
            <Plus size={14} className="mr-1" /> 新增族人
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 border border-border rounded-xl bg-card overflow-auto shadow-sm scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/50 border-b border-border sticky top-0 z-10 text-muted-foreground font-semibold">
            <tr>
              <th className="py-3 px-4 w-20">世次</th>
              <th className="py-3 px-4 w-32">姓名 / 字号</th>
              <th className="py-3 px-4 w-20">排行</th>
              <th className="py-3 px-4 w-28">承祧父祖</th>
              <th className="py-3 px-4 w-36">配偶</th>
              <th className="py-3 px-4 w-44">功名官阶</th>
              <th className="py-3 px-4 min-w-[200px]">生平与行状纪略</th>
              <th className="py-3 px-4 w-44">墓茔坐向</th>
              <th className="py-3 px-4 w-20 text-center">状态</th>
              <th className="py-3 px-4 w-20 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredPersons.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-muted-foreground">
                  未匹配到族人记录
                </td>
              </tr>
            ) : (
              filteredPersons.map((p) => {
                const isSelected = p.id === selectedPersonId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPerson(p.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-foreground font-medium'
                        : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-foreground">
                      <Badge variant={p.generation === 1 ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        第{p.generation}世
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground text-sm">{formatGivenName(p.name)}</div>
                      {p.courtesyName && (
                        <div className="text-[11px] text-muted-foreground">字 {p.courtesyName}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">{p.rank || '男'}</td>
                    <td className="py-3 px-4">
                      {p.fatherName ? `${formatGivenName(p.fatherName)} 公` : (p.generation === 1 ? '始迁祖' : '待考')}
                    </td>
                    <td className="py-3 px-4">
                      {p.spouses && p.spouses.length > 0 ? (
                        <div className="flex items-center gap-1 text-foreground">
                          <Heart size={11} className="text-rose-500 shrink-0" />
                          <span>{p.spouses.map(s => s.name).join('、')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60">待注</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {p.officialTitle ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                          <Award size={12} className="shrink-0" />
                          {p.officialTitle}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="line-clamp-2 max-w-md text-[11px] leading-relaxed">
                        {p.biography || (p.birthDate ? `生于：${p.birthDate}` : '暂无详细事略')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {p.burialPlace ? (
                        <div className="flex items-center gap-1 text-[11px] truncate max-w-[180px]">
                          <MapPin size={11} className="shrink-0 text-muted-foreground" />
                          <span className="truncate">{p.burialPlace}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        p.status === 'living'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {p.status === 'living' ? '健在' : '已故'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => onSelectPerson(p.id)}
                          title="编辑档案"
                        >
                          <Edit3 size={13} />
                        </Button>
                        {p.generation > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (confirm(`确定删除 ${p.name} 吗？`)) {
                                onDeletePerson(p.id);
                              }
                            }}
                            title="删除"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 shrink-0">
        <span>当前显示 {filteredPersons.length} 条记录 / 总计 {persons.length} 位族人</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.print()}>
            <Printer size={12} className="mr-1" /> 打印名录
          </Button>
        </div>
      </div>
    </div>
  );
};
