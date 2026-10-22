import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  X, 
  Star, 
  HelpCircle, 
  MapPin, 
  Check, 
  Info, 
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { SpaceItem } from '../../../types';
import { RegionCascadePicker } from './RegionCascadePicker';

interface CreateSpaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSpace: (spaceData: Partial<SpaceItem>) => void;
}

export const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  open,
  onOpenChange,
  onCreateSpace
}) => {
  // Form States
  const [projectName, setProjectName] = useState('');
  const [primarySurname, setPrimarySurname] = useState('');
  const [region, setRegion] = useState('贵州/黔南/都匀市');
  const [primaryName, setPrimaryName] = useState('');
  const [projectState] = useState('进行中');
  const [projectLevel, setProjectLevel] = useState<number>(1);
  const [hoverLevel, setHoverLevel] = useState<number | null>(null);
  const [projectRemarks, setProjectRemarks] = useState('');
  
  // UI toggles
  const [showWhatIsSpaceTip, setShowWhatIsSpaceTip] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset or initialize when opened
  useEffect(() => {
    if (open) {
      setProjectName('陈氏族谱的云谱空间');
      setPrimarySurname('陳');
      setRegion('贵州/黔南/都匀市');
      setPrimaryName('義門陳氏宗谱');
      setProjectLevel(1);
      setProjectRemarks('第八次重修陈氏大统宗谱数字化云端管理空间');
      setShowWhatIsSpaceTip(false);
      setValidationError(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setValidationError('请输入空间名');
      return;
    }
    if (!primarySurname.trim()) {
      setValidationError('请输入姓氏');
      return;
    }
    if (!region.trim()) {
      setValidationError('请选择所属地区');
      return;
    }
    if (!primaryName.trim()) {
      setValidationError('请输入主题名');
      return;
    }

    onCreateSpace({
      name: projectName.trim(),
      surname: primarySurname.trim(),
      region: region.trim(),
      themeName: primaryName.trim(),
      level: projectLevel,
      remarks: projectRemarks.trim(),
      description: projectRemarks.trim() || `${primaryName.trim()}数字化修谱空间`
    });

    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in-0 duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Main Modal Container (width 820px standard) */}
      <div className="relative z-50 w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-card-foreground animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FolderPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-serif tracking-tight flex items-center gap-2">
                <span>创建云谱空间</span>
                <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5 text-primary border-primary/30">
                  数智云谱
                </Badge>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Left Preview & Right Form */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* ======================================================== */}
          {/* LEFT: Cover Preview Box (addOutViews / centerImgsBox)    */}
          {/* ======================================================== */}
          <div className="md:col-span-5 bg-gradient-to-b from-muted/60 via-muted/30 to-muted/80 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/70 select-none">
            
            {/* Book Cover Card */}
            <div className="relative w-[210px] h-[310px] rounded-lg shadow-xl overflow-hidden border border-amber-900/30 flex flex-col justify-between p-4 bg-[#1a2b49] text-amber-50">
              
              {/* Classical Decorative Background & Stitches */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-amber-200/20 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-amber-200/30 pointer-events-none" />
              
              {/* Traditional 4 Stitched Binding Marks on Right/Left */}
              <div className="absolute left-2 top-6 w-2 h-1 bg-amber-100/70 rounded-full shadow-xs" />
              <div className="absolute left-2 top-24 w-2 h-1 bg-amber-100/70 rounded-full shadow-xs" />
              <div className="absolute left-2 bottom-24 w-2 h-1 bg-amber-100/70 rounded-full shadow-xs" />
              <div className="absolute left-2 bottom-6 w-2 h-1 bg-amber-100/70 rounded-full shadow-xs" />

              {/* Cover Top Heading */}
              <div className="text-right pr-1">
                <span className="text-[10px] tracking-widest text-amber-200/60 font-serif">
                  大谱师 · 数字化云谱
                </span>
              </div>

              {/* Center Theme Title Strip: Dynamic `#showZhuTiName` */}
              <div className="my-auto mx-auto w-16 min-h-[170px] bg-[#faf6ed] text-neutral-900 border-2 border-neutral-800 rounded-xs p-2 shadow-md flex flex-col items-center justify-center text-center">
                <div 
                  id="showZhuTiName" 
                  className={`font-serif tracking-widest font-bold leading-relaxed break-all ${
                    primaryName.trim() 
                      ? 'text-neutral-950 text-sm writing-vertical-rl' 
                      : 'text-neutral-400 text-xs italic'
                  }`}
                  style={{ writingMode: primaryName.trim() ? 'vertical-rl' : 'horizontal-tb' }}
                >
                  {primaryName.trim() || '右侧输入主题名'}
                </div>

                {/* Vermilion Ancestral Seal */}
                <div className="mt-2 w-6 h-6 border border-red-700 bg-red-600/90 text-[9px] text-white flex items-center justify-center font-serif font-bold rounded-xs shadow-2xs">
                  {primarySurname.trim() ? `${primarySurname.trim()[0]}印` : '谱印'}
                </div>
              </div>

              {/* Cover Bottom Meta */}
              <div className="pt-2 border-t border-amber-200/20 text-center space-y-0.5 text-[10px] text-amber-200/80">
                <div className="truncate font-serif px-2">
                  {region || '所属地区'}
                </div>
                <div className="flex items-center justify-center gap-1 text-[9px] text-amber-300/60">
                  <span>状态: {projectState}</span>
                  <span>•</span>
                  <span>星级: {projectLevel}星</span>
                </div>
              </div>
            </div>

            {/* Hint below preview */}
            <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              <span>云谱空间封面效果实时预览</span>
            </p>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: Form Details Box (addDetailsBox / moreInfoForms) */}
          {/* ======================================================== */}
          <div className="md:col-span-7 p-6 space-y-4">
            <form id="deletFormSlelect" onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Message if any */}
              {validationError && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <Info size={14} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* 1. 空间名 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="projectNameEnters" className="text-xs font-bold text-foreground">
                    空间名： <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {projectName.length}/24
                  </span>
                </div>
                <Input
                  id="projectNameEnters"
                  name="projectName"
                  maxLength={24}
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  required
                  placeholder="请输入项目名称，限长24个字"
                  className="h-9 text-xs"
                />
              </div>

              {/* 2. 姓氏 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="primarySurname" className="text-xs font-bold text-foreground">
                    姓氏： <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {primarySurname.length}/24
                  </span>
                </div>
                <Input
                  id="primarySurname"
                  name="primarySurname"
                  maxLength={24}
                  value={primarySurname}
                  onChange={(e) => {
                    setPrimarySurname(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  required
                  placeholder="如：陳，一旦确定，不可修改"
                  className="h-9 text-xs font-serif font-semibold"
                />
                <div className="text-[11px] text-muted-foreground/80">
                  如：陳，一旦确定，不可修改
                </div>
              </div>

              {/* 3. 地区 (三级选择：省 - 地区 - 市县) */}
              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="countriesRegions" className="text-xs font-bold text-foreground">
                    地区： <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    省 / 地区 / 市县 三级联动
                  </span>
                </div>
                
                {/* 3-Level Cascade Picker */}
                <RegionCascadePicker 
                  value={region} 
                  onChange={(newVal) => {
                    setRegion(newVal);
                    if (validationError) setValidationError(null);
                  }} 
                />
              </div>

              {/* 4. 主题名 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="primaryName" className="text-xs font-bold text-foreground">
                    主题名： <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {primaryName.length}/10
                  </span>
                </div>
                <Input
                  id="primaryName"
                  name="primaryName"
                  maxLength={10}
                  value={primaryName}
                  onChange={(e) => {
                    setPrimaryName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  required
                  placeholder="如：義門陳氏宗谱，一旦确定，不可修改！"
                  className="h-9 text-xs font-serif"
                />
                <div className="text-[11px] text-muted-foreground/80">
                  如：義門陳氏宗谱，一旦确定，不可修改！
                </div>
              </div>

              {/* 5. 状态 & 6. 重要等级 (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 状态 */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    状态：
                  </Label>
                  <Input
                    name="projectState"
                    disabled
                    value={projectState}
                    className="h-9 text-xs bg-muted/40 cursor-not-allowed text-muted-foreground"
                  />
                </div>

                {/* 重要等级 (Interactive Stars) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    重要等级：
                  </Label>
                  <div className="h-9 px-3 border border-input rounded-md bg-background flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                      const isFilled = (hoverLevel !== null ? hoverLevel : projectLevel) >= starIndex;
                      return (
                        <button
                          key={starIndex}
                          type="button"
                          onClick={() => setProjectLevel(starIndex)}
                          onMouseEnter={() => setHoverLevel(starIndex)}
                          onMouseLeave={() => setHoverLevel(null)}
                          className="p-1 text-muted-foreground hover:scale-110 transition-transform focus:outline-none"
                          title={`重要等级 ${starIndex} 星`}
                        >
                          <Star 
                            size={16} 
                            className={`${
                              isFilled 
                                ? 'text-amber-500 fill-amber-500' 
                                : 'text-muted-foreground/40'
                            } transition-colors`} 
                          />
                        </button>
                      );
                    })}
                    <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">
                      {projectLevel} 星
                    </span>
                  </div>
                </div>

              </div>

              {/* 7. 备注 */}
              <div className="space-y-1.5">
                <Label htmlFor="projectRemarks" className="text-xs font-bold text-foreground">
                  备注：
                </Label>
                <Textarea
                  id="projectRemarks"
                  name="projectRemarks"
                  value={projectRemarks}
                  onChange={(e) => setProjectRemarks(e.target.value)}
                  placeholder="请输入项目备注"
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

            </form>
          </div>

        </div>

        {/* ======================================================== */}
        {/* FOOTER: Controls & Quota Info (addDirbtns)               */}
        {/* ======================================================== */}
        <div className="px-6 py-3.5 border-t border-border/80 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left Quota Info & Help */}
          <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <span className="text-muted-foreground">可创建云谱空间数量:</span>
              <span className="font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">1 / 1</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWhatIsSpaceTip(!showWhatIsSpaceTip)}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-normal cursor-pointer"
              >
                <HelpCircle size={13} />
                <span>什么是云谱空间 ？</span>
              </button>

              {/* Popover explaining What is Cloud Space */}
              {showWhatIsSpaceTip && (
                <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl text-xs space-y-1.5 z-40 animate-in fade-in-0 zoom-in-95">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen size={14} className="text-primary" />
                    <span>云谱空间说明</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    云谱空间是数字化宗族谱牒的独立工程单元。每个空间可容纳多卷谱书（如卷首、世系、传记、附录）、世系分支谱图与编修团队协同权限。
                  </p>
                  <div className="text-right pt-1">
                    <button 
                      type="button" 
                      onClick={() => setShowWhatIsSpaceTip(false)}
                      className="text-[10px] text-primary font-medium hover:underline"
                    >
                      我知道了
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 px-4"
            >
              取消
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSubmit}
              className="text-xs h-9 px-5 gap-1.5 font-medium shadow-xs"
            >
              <Check size={14} />
              <span>确定</span>
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
