import React, { useState, useMemo } from 'react';
import { PersonRecord } from '../types';
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Award, 
  Heart, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Plus, 
  Printer, 
  Scroll, 
  Crown,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { formatGivenName } from '../utils/nameUtils';

interface LineageBiographyViewProps {
  persons: PersonRecord[];
  selectedPersonId: string | null;
  onSelectPerson: (id: string) => void;
  onNavigateToTree?: (personId: string) => void;
  onEditPerson?: (person: PersonRecord) => void;
  branchName?: string;
}

export const LineageBiographyView: React.FC<LineageBiographyViewProps> = ({
  persons,
  selectedPersonId,
  onSelectPerson,
  onNavigateToTree,
  onEditPerson,
  branchName = '陈氏族谱'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<number | 'all'>('all');

  // Group by generations
  const generations = useMemo(() => {
    return Array.from(new Set(persons.map((p) => p.generation || 1))).sort((a, b) => a - b);
  }, [persons]);

  // Filtered persons
  const filteredPersons = useMemo(() => {
    return persons.filter((p) => {
      const matchGen = selectedGeneration === 'all' || p.generation === selectedGeneration;
      const matchSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.courtesyName && p.courtesyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.officialTitle && p.officialTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.biography && p.biography.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchGen && matchSearch;
    });
  }, [persons, selectedGeneration, searchTerm]);

  // Group filtered persons by generation for European "五世提头" book grouping
  const groupedByGen = useMemo(() => {
    const map = new Map<number, PersonRecord[]>();
    filteredPersons.forEach((p) => {
      const g = p.generation || 1;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    });
    return map;
  }, [filteredPersons]);

  return (
    <div className="flex-1 flex flex-col h-full bg-amber-50/30 dark:bg-zinc-950 overflow-hidden font-serif">
      {/* Top Header & Search Ribbon */}
      <div className="h-14 border-b border-border/80 bg-card/80 backdrop-blur px-5 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Scroll className="text-red-700 dark:text-red-500" size={18} />
            <h2 className="font-bold text-base tracking-wide text-foreground">
              {branchName} · 欧式行传录
            </h2>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-sans">
            共载录 {filteredPersons.length} 位先祖及宗亲行状
          </span>
        </div>

        {/* Filter & Controls */}
        <div className="flex items-center gap-3 font-sans">
          {/* Generation Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1 text-xs text-muted-foreground shadow-2xs">
            <Filter size={12} className="text-red-600" />
            <span>世次:</span>
            <select
              value={selectedGeneration}
              onChange={(e) =>
                setSelectedGeneration(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="bg-transparent border-none text-foreground font-medium outline-none text-xs cursor-pointer"
            >
              <option value="all">全部世代</option>
              {generations.map((g) => (
                <option key={g} value={g}>
                  第 {g} 世
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
            <input
              type="text"
              placeholder="检索名讳、字号、官衔..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-background border border-border rounded-lg text-xs outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all font-sans"
            />
          </div>

          {/* Print Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 text-xs gap-1.5 border-border shadow-2xs"
          >
            <Printer size={13} /> 打印行传册
          </Button>
        </div>
      </div>

      {/* Main Book Reader Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-8 bg-card/90 dark:bg-zinc-900 border border-amber-900/20 dark:border-zinc-800 rounded-xl p-8 md:p-12 shadow-sm relative">
          
          {/* Subtle Watermark seal */}
          <div className="absolute right-8 top-8 opacity-10 pointer-events-none select-none text-red-700 dark:text-red-500 font-serif text-5xl font-bold tracking-widest writing-vertical">
            宗譜世澤
          </div>

          {/* Book Title & Hall Name Banner */}
          <div className="text-center pb-6 border-b-2 border-red-900/30 dark:border-red-900/50">
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-zinc-900 dark:text-zinc-100">
              {branchName} 先祖行传事略
            </h1>
            <p className="text-xs text-muted-foreground mt-2 font-sans tracking-wide">
              欧公谱法 · 图传互照 · 世代昭穆 · 德馨垂范
            </p>
          </div>

          {/* Render By Generation */}
          {Array.from(groupedByGen.entries()).map(([gen, genPersons]) => (
            <div key={gen} className="space-y-6 pt-2">
              {/* Generation Ribbon Header (五世提头典雅风格) */}
              <div className="flex items-center gap-3">
                <div className="bg-red-800 text-amber-50 dark:bg-red-900 px-3.5 py-1 rounded-sm text-sm font-bold tracking-wider flex items-center gap-1.5 shadow-2xs">
                  {gen === 1 && <Crown size={14} className="text-amber-400" />}
                  第 {gen} 世
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-red-800/40 via-red-800/20 to-transparent" />
                <span className="text-xs text-muted-foreground font-sans">
                  本世录入 {genPersons.length} 位
                </span>
              </div>

              {/* Persons in Generation */}
              <div className="grid grid-cols-1 gap-6">
                {genPersons.map((person) => {
                  const isSelected = selectedPersonId === person.id;
                  const displayPage = person.biographyPage || (20 + (person.generation - 1) * 3);
                  const displayOrder = person.biographyOrder || 1;

                  return (
                    <div
                      key={person.id}
                      id={`bio-${person.id}`}
                      onClick={() => onSelectPerson(person.id)}
                      className={`rounded-lg border p-5 transition-all bg-background/80 relative group ${
                        isSelected
                          ? 'border-red-600 ring-2 ring-red-600/30 shadow-md bg-red-50/20 dark:bg-red-950/20'
                          : 'border-border/80 hover:border-red-500/50 hover:shadow-xs'
                      }`}
                    >
                      {/* Entry Header: Name + Page Reference Index */}
                      <div className="flex items-baseline justify-between border-b border-border/50 pb-2 mb-3">
                        <div className="flex items-baseline gap-2.5 flex-wrap">
                          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
                            {formatGivenName(person.name)}
                          </span>
                          {person.courtesyName && (
                            <span className="text-xs text-muted-foreground font-normal">
                              字 {person.courtesyName}
                            </span>
                          )}
                          {person.childhoodName && (
                            <span className="text-xs text-muted-foreground font-normal">
                              幼名 {person.childhoodName}
                            </span>
                          )}
                          {person.rank && (
                            <span className="text-[11px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-sans border border-amber-500/20">
                              {person.rank}
                            </span>
                          )}
                          {person.officialTitle && (
                            <span className="text-[11px] px-1.5 py-0.2 rounded bg-red-600/10 text-red-700 dark:text-red-400 font-sans font-medium border border-red-600/20">
                              {person.officialTitle}
                            </span>
                          )}
                        </div>

                        {/* Top-Right: Book Page Reference (欧式行传页码索引) & Jump to Tree Button */}
                        <div className="flex items-center gap-2 font-sans">
                          <span className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
                            🕮 第 {displayPage} 页 · 第 {displayOrder} 录
                          </span>
                          {onNavigateToTree && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToTree(person.id);
                              }}
                              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                            >
                              世系图定位 <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Structured European Genealogy Facts */}
                      <div className="space-y-2 text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {/* Parentage */}
                        <p>
                          <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">【世系承祧】</strong>
                          {person.fatherName ? `系 ${formatGivenName(person.fatherName)} 公之${person.rank || '子'}` : '为入黔开基始祖，上承颍川大统'}
                          {person.motherName ? `，生母 ${person.motherName}` : ''}。
                        </p>

                        {/* Birth & Death */}
                        {(person.birthDate || person.deathDate || person.age) && (
                          <p>
                            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">【生卒寿数】</strong>
                            {person.birthDate ? `生于 ${person.birthDate}` : '生年待详'}
                            {person.deathDate ? `，卒于 ${person.deathDate}` : '，卒年待考'}
                            {person.age ? `，享寿 ${person.age} 龄` : ''}。
                          </p>
                        )}

                        {/* Spouses */}
                        {person.spouses && person.spouses.length > 0 && (
                          <p>
                            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">【德配继室】</strong>
                            {person.spouses.map((s, idx) => (
                              <span key={idx} className="mr-3">
                                配 {s.name}（{s.clanOrigin || '籍贯待考'}）
                                {s.title ? `，封 ${s.title}` : ''}
                                {s.burialPlace ? `，${s.burialPlace}` : ''}
                              </span>
                            ))}
                          </p>
                        )}

                        {/* Burial Place */}
                        {person.burialPlace && (
                          <p>
                            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">【墓茔葬地】</strong>
                            {person.burialPlace}。
                          </p>
                        )}

                        {/* Biography Narrative */}
                        {person.biography && (
                          <div className="mt-2 pt-2 border-t border-border/40 text-justify text-zinc-800 dark:text-zinc-200">
                            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">【事略行状】</strong>
                            <span className="leading-relaxed">{person.biography}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredPersons.length === 0 && (
            <div className="py-12 text-center text-muted-foreground font-sans">
              未检索到符合条件的族人行状
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineageBiographyView;
