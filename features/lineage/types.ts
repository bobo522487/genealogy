export interface SpouseInfo {
  id?: string;
  name: string;
  clanOrigin?: string; // 岳家籍贯/郡望 如: 妣李氏，系出清河
  title?: string; // 封号/孺人/宜人
  birthDate?: string;
  deathDate?: string;
  burialPlace?: string; // 葬地与合葬信息
}

export interface PersonRecord {
  id: string;
  name: string; // 姓名 如: 陈元英
  courtesyName?: string; // 字/号 如: 伯宣
  childhoodName?: string; // 乳名/幼名
  generation: number; // 世次 如: 1 (第1世)
  generationWord?: string; // 派语字辈 如: 元
  gender: 'male' | 'female';
  rank?: string; // 排行 如: 长子、次子、幼子、长女
  status: 'living' | 'deceased'; // 健在 / 已故
  fatherId: string | null; // 父亲ID
  fatherName?: string;
  motherName?: string; // 生母 如: 妣张氏
  spouses: SpouseInfo[]; // 配偶列表
  birthDate?: string; // 生于 (农历/公历)
  deathDate?: string; // 卒于 (农历/公历)
  age?: number; // 享寿
  burialPlace?: string; // 墓茔葬地及坐向
  officialTitle?: string; // 功名/官阶 如: 举人/知县
  biography?: string; // 行状传记/生平事略
  biographyPage?: number; // 行传页码 如: 24
  biographyOrder?: number; // 行传录号/分房序号 如: 1
  branchId: string; // 所属谱系分支ID
  notes?: string; // 备注
  childrenIds?: string[];
}

export interface LineageBranch {
  id: string;
  name: string; // 谱系或文件夹名称
  code?: string;
  description?: string;
  originAncestor?: string; // 始祖
  region?: string; // 地区 如: 贵州桐梓
  generationsCount?: number;
  membersCount?: number;
  hallName?: string; // 堂号 如: 颖川堂
  updatedAt?: string;
  type?: 'branch' | 'folder'; // 谱系或文件夹类型
  parentId?: string; // 父级文件夹ID
  isOpen?: boolean; // 文件夹展开/折叠状态
  icon?: string;
}
