import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Search, 
  Check, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { CHINA_REGIONS, ProvinceData } from '../data/chinaRegions';

interface RegionCascadePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const RegionCascadePicker: React.FC<RegionCascadePickerProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Cascade Step (0: 省, 1: 地区/市, 2: 市县)
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  
  // Selected IDs
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(() => {
    // Parse from current value
    const parts = value.split('/');
    const provName = parts[0] === '中国' ? parts[1] : parts[0];
    return CHINA_REGIONS.find(p => p.name === provName) || CHINA_REGIONS.find(p => p.name === '贵州') || CHINA_REGIONS[0];
  });

  const [selectedCity, setSelectedCity] = useState<{ name: string; children?: string[] } | null>(() => {
    const parts = value.split('/');
    const cityName = parts[0] === '中国' ? parts[2] : parts[1];
    const prov = CHINA_REGIONS.find(p => p.name === '贵州') || CHINA_REGIONS[0];
    return prov.children.find(c => c.name === cityName || c.name === '黔南' || c.name === '遵义') || prov.children[0];
  });

  const [selectedCounty, setSelectedCounty] = useState<string>(() => {
    const parts = value.split('/');
    const countyName = parts[0] === '中国' ? parts[3] : parts[2];
    return countyName || '都匀市';
  });

  // Flat Search Index for fast lookup
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    const results: { fullPath: string; prov: string; city: string; county?: string }[] = [];

    CHINA_REGIONS.forEach(prov => {
      if (prov.isMunicipality) {
        prov.children[0]?.children?.forEach(dist => {
          if (prov.name.includes(query) || dist.includes(query)) {
            results.push({
              fullPath: `${prov.name}/${dist}`,
              prov: prov.name,
              city: dist
            });
          }
        });
      } else {
        prov.children.forEach(city => {
          if (city.children && city.children.length > 0) {
            city.children.forEach(county => {
              if (prov.name.includes(query) || city.name.includes(query) || county.includes(query)) {
                results.push({
                  fullPath: `${prov.name}/${city.name}/${county}`,
                  prov: prov.name,
                  city: city.name,
                  county: county
                });
              }
            });
          } else {
            if (prov.name.includes(query) || city.name.includes(query)) {
              results.push({
                fullPath: `${prov.name}/${city.name}`,
                prov: prov.name,
                city: city.name
              });
            }
          }
        });
      }
    });

    return results.slice(0, 15);
  }, [searchQuery]);

  // Handle Province Click
  const handleSelectProvince = (prov: ProvinceData) => {
    setSelectedProvince(prov);
    if (prov.isMunicipality) {
      // Municipality: Tab 1 directly shows districts
      const districtList = prov.children[0];
      setSelectedCity(districtList);
      setActiveTab(1);
    } else {
      setSelectedCity(null);
      setSelectedCounty('');
      setActiveTab(1);
    }
  };

  // Handle City/Prefecture Click
  const handleSelectCity = (city: { name: string; children?: string[] }) => {
    if (selectedProvince?.isMunicipality) {
      // For municipality, selecting a district finishes the selection e.g. "北京/朝阳"
      const path = `${selectedProvince.name}/${city.name}`;
      setSelectedCounty(city.name);
      onChange(path);
      setIsOpen(false);
      return;
    }

    setSelectedCity(city);
    if (city.children && city.children.length > 0) {
      setSelectedCounty('');
      setActiveTab(2);
    } else {
      // No sub-county, finish
      const path = `${selectedProvince?.name}/${city.name}`;
      onChange(path);
      setIsOpen(false);
    }
  };

  // Handle County/District Click
  const handleSelectCounty = (county: string) => {
    setSelectedCounty(county);
    if (selectedProvince && selectedCity) {
      const path = `${selectedProvince.name}/${selectedCity.name}/${county}`;
      onChange(path);
      setIsOpen(false);
    }
  };

  // Preset quick picks
  const quickSamples = [
    '贵州/黔南/都匀市',
    '贵州/遵义/桐梓县',
    '北京/朝阳',
    '广东/广州/越秀区',
    '浙江/杭州/西湖区',
    '江西/赣州/瑞金市',
    '江苏/苏州/姑苏区'
  ];

  return (
    <div className="relative w-full">
      {/* Trigger Button Input Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 border rounded-md bg-background flex items-center justify-between cursor-pointer transition-all text-xs ${
          isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-input hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin size={14} className="text-primary shrink-0" />
          <span className="text-foreground font-medium truncate">
            {value || '请点击选择所属地区 (省/地区/市县)'}
          </span>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop click closer */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />

          <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-card border border-border rounded-xl shadow-2xl overflow-hidden text-card-foreground p-3.5 space-y-3 animate-in fade-in-0 zoom-in-95 duration-150">
            
            {/* Top Bar: Search & Quick Reset */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="搜索省、地区、市县 (如: 都匀、朝阳、黔南、遵义)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 pr-7 text-xs bg-muted/30"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProvince(null);
                  setSelectedCity(null);
                  setSelectedCounty('');
                  setActiveTab(0);
                }}
                className="h-8 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1 shrink-0"
              >
                <RotateCcw size={11} />
                <span>重选</span>
              </Button>
            </div>

            {/* If Search Query is active, show quick search results */}
            {searchQuery.trim() ? (
              <div className="space-y-1.5">
                <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
                  <span>匹配到的地区 ({searchResults.length})</span>
                </div>
                
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {searchResults.length === 0 ? (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      未找到相关地区，请尝试输入其他关键词
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onChange(item.fullPath);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-muted-foreground group-hover:text-primary" />
                          <span className="font-medium text-foreground group-hover:text-primary">{item.fullPath}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">选择</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Regular 3-Level Cascade View */
              <div className="space-y-2.5">
                
                {/* Cascade Steps Breadcrumb Navigation Tabs */}
                <div className="flex items-center gap-1 border-b border-border/70 pb-2">
                  
                  {/* Step 1: 省/直辖市 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab(0)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                      activeTab === 0 
                        ? 'bg-primary text-primary-foreground shadow-2xs' 
                        : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{selectedProvince ? selectedProvince.name : '1. 选择省份'}</span>
                  </button>

                  <ChevronRight size={12} className="text-muted-foreground shrink-0" />

                  {/* Step 2: 地区 / 地级市 */}
                  <button
                    type="button"
                    disabled={!selectedProvince}
                    onClick={() => setActiveTab(1)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeTab === 1 
                        ? 'bg-primary text-primary-foreground shadow-2xs' 
                        : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>
                      {selectedProvince?.isMunicipality 
                        ? (selectedCounty ? selectedCounty : '2. 选择区县') 
                        : (selectedCity ? selectedCity.name : '2. 选择地区/市')}
                    </span>
                  </button>

                  {/* Step 3: 市县 (非直辖市才展示) */}
                  {!selectedProvince?.isMunicipality && (
                    <>
                      <ChevronRight size={12} className="text-muted-foreground shrink-0" />
                      <button
                        type="button"
                        disabled={!selectedCity}
                        onClick={() => setActiveTab(2)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                          activeTab === 2 
                            ? 'bg-primary text-primary-foreground shadow-2xs' 
                            : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>{selectedCounty || '3. 选择市县'}</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Level Content Display Grid */}
                <div className="min-h-[160px] max-h-[210px] overflow-y-auto pr-1">
                  
                  {/* LEVEL 0: 省份列表 */}
                  {activeTab === 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                      {CHINA_REGIONS.map((prov) => {
                        const isSelected = selectedProvince?.name === prov.name;
                        return (
                          <button
                            key={prov.name}
                            type="button"
                            onClick={() => handleSelectProvince(prov)}
                            className={`px-2 py-1.5 text-xs rounded text-center truncate transition-all ${
                              isSelected
                                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                : 'bg-muted/40 text-foreground hover:bg-muted hover:text-primary'
                            }`}
                          >
                            {prov.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* LEVEL 1: 地区 / 市 / 直辖市区 */}
                  {activeTab === 1 && selectedProvince && (
                    <div>
                      {selectedProvince.isMunicipality ? (
                        /* Direct Districts for Municipalities (e.g. 北京/朝阳) */
                        <div className="space-y-1">
                          <div className="text-[11px] text-muted-foreground pb-1">
                            {selectedProvince.name}市辖区（点击直接完成选择）：
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                            {selectedProvince.children[0]?.children?.map((district) => (
                              <button
                                key={district}
                                type="button"
                                onClick={() => {
                                  const path = `${selectedProvince.name}/${district}`;
                                  setSelectedCounty(district);
                                  onChange(path);
                                  setIsOpen(false);
                                }}
                                className="px-2 py-1.5 text-xs rounded text-center truncate bg-muted/40 hover:bg-primary/10 hover:text-primary hover:font-medium transition-colors"
                              >
                                {district}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Standard Province Prefecture/City List */
                        <div className="space-y-1">
                          <div className="text-[11px] text-muted-foreground pb-1">
                            {selectedProvince.name}下属地区 / 地级市：
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                            {selectedProvince.children.map((city) => {
                              const isSelected = selectedCity?.name === city.name;
                              return (
                                <button
                                  key={city.name}
                                  type="button"
                                  onClick={() => handleSelectCity(city)}
                                  className={`px-2 py-1.5 text-xs rounded text-center truncate transition-all ${
                                    isSelected
                                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                      : 'bg-muted/40 text-foreground hover:bg-muted hover:text-primary'
                                  }`}
                                >
                                  {city.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEVEL 2: 市县 / 区列表 */}
                  {activeTab === 2 && selectedCity && (
                    <div className="space-y-1">
                      <div className="text-[11px] text-muted-foreground pb-1">
                        {selectedProvince?.name} · {selectedCity.name} 下属市县 / 区：
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {selectedCity.children?.map((county) => {
                          const isSelected = selectedCounty === county;
                          return (
                            <button
                              key={county}
                              type="button"
                              onClick={() => handleSelectCounty(county)}
                              className={`px-2 py-1.5 text-xs rounded text-center truncate transition-all ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                  : 'bg-muted/40 text-foreground hover:bg-muted hover:text-primary'
                              }`}
                            >
                              {county}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Quick Samples */}
                <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                    <Sparkles size={11} className="text-amber-500" />
                    <span>常用快捷：</span>
                  </span>
                  {quickSamples.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        onChange(sample);
                        setIsOpen(false);
                      }}
                      className="px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-[10px]"
                    >
                      {sample}
                    </button>
                  ))}
                </div>

              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};
