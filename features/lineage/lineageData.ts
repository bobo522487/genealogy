import { PersonRecord, LineageBranch } from './types';

export const INITIAL_BRANCHES: LineageBranch[] = [
  {
    id: 'folder-1',
    name: '入黔世系总谱卷',
    type: 'folder',
    isOpen: true,
    description: '贵州各州县支脉汇总卷宗',
    updatedAt: '2026-03-12'
  },
  {
    id: 'branch-1',
    name: '元英房世系图',
    type: 'branch',
    parentId: 'folder-1',
    code: 'BRANCH_YY',
    description: '始祖元英公入黔遵义桐梓开派支系，昭穆序列明晰',
    originAncestor: '元英',
    region: '中国/贵州/遵义/桐梓县',
    generationsCount: 5,
    membersCount: 16,
    hallName: '颖川堂',
    updatedAt: '2026-03-12'
  },
  {
    id: 'branch-3',
    name: '西塘东山支系',
    type: 'branch',
    parentId: 'folder-1',
    code: 'BRANCH_XT',
    description: '元英公三次子伯崇房分迁西塘、东山分支谱图',
    originAncestor: '伯崇',
    region: '中国/贵州/遵义',
    generationsCount: 4,
    membersCount: 9,
    hallName: '德星堂',
    updatedAt: '2026-02-18'
  },
  {
    id: 'folder-2',
    name: '华夏通考源流卷',
    type: 'folder',
    isOpen: true,
    description: '太始祖太丘公、江州义门陈氏通谱',
    updatedAt: '2026-03-01'
  },
  {
    id: 'branch-2',
    name: '陈氏族谱源流总系',
    type: 'branch',
    parentId: 'folder-2',
    code: 'BRANCH_TOTAL',
    description: '江州义门陈氏通派源流总系，上溯胡公至入黔各房',
    originAncestor: '胡公',
    region: '华夏通谱',
    generationsCount: 12,
    membersCount: 42,
    hallName: '颖川堂',
    updatedAt: '2026-03-01'
  }
];

export const INITIAL_PERSONS: PersonRecord[] = [
  // 1世 (始祖)
  {
    id: 'p-1',
    name: '元英',
    courtesyName: '伯宣',
    childhoodName: '英哥',
    generation: 1,
    generationWord: '元',
    gender: 'male',
    rank: '始祖',
    status: 'deceased',
    fatherId: null,
    motherName: '',
    birthDate: '明洪武十八年乙丑三月初六日亥时',
    deathDate: '明永乐二十一年癸卯九月十二日未时',
    age: 78,
    officialTitle: '唐宣宗大中举人，授奉议大夫',
    burialPlace: '桐梓县狮子山金钗穴，坐北朝南兼子午三分，有碑刻华表',
    spouses: [
      { name: '李氏', clanOrigin: '系出清河郡，封宜人', burialPlace: '与公合葬金钗穴右侧' },
      { name: '赵氏', clanOrigin: '系出天水郡', burialPlace: '葬狮子山后陇' }
    ],
    biography: '公学识博洽，敦厚仁恕，元末避乱迁黔，卜居桐梓，躬耕课读，积善余庆。修谱设馆，惠泽宗党，子孙繁衍，尊为入黔开基始祖。',
    branchId: 'branch-1',
    notes: '族谱首录人物，德配二妣'
  },

  // 2世
  {
    id: 'p-2',
    name: '伯康',
    courtesyName: '子安',
    generation: 2,
    generationWord: '伯',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-1',
    fatherName: '元英',
    motherName: '李氏',
    birthDate: '明永乐元年癸未四月初八日卯时',
    deathDate: '明成化五年己丑七月十五日辰时',
    age: 67,
    officialTitle: '岁贡生，训导',
    burialPlace: '桐梓凤凰山下象鼻嘴，坐东向西',
    spouses: [
      { name: '王氏', clanOrigin: '系出太原郡，贤良淑德', burialPlace: '合葬象鼻嘴' }
    ],
    biography: '性纯孝，工诗文，承父业训导族子，置祭田十亩以奉祠堂。',
    branchId: 'branch-1'
  },
  {
    id: 'p-3',
    name: '伯虚',
    courtesyName: '子顺',
    generation: 2,
    generationWord: '伯',
    gender: 'male',
    rank: '次子',
    status: 'deceased',
    fatherId: 'p-1',
    fatherName: '元英',
    motherName: '李氏',
    birthDate: '明永乐三年乙酉八月十五日寅时',
    deathDate: '明天顺八年甲申十月二十日申时',
    age: 60,
    officialTitle: '武略骑尉',
    burialPlace: '桐梓南门外回龙寺旁，坐乾向巽',
    spouses: [
      { name: '张氏', clanOrigin: '系出清河郡', burialPlace: '葬回龙寺祖茔' }
    ],
    biography: '习韬略，沉毅有谋，卫土安民，乡里称重。',
    branchId: 'branch-1'
  },
  {
    id: 'p-4',
    name: '伯崇',
    courtesyName: '德隆',
    generation: 2,
    generationWord: '伯',
    gender: 'male',
    rank: '三子',
    status: 'deceased',
    fatherId: 'p-1',
    fatherName: '元英',
    motherName: '赵氏',
    birthDate: '明永乐六年戊子冬月初二日午时',
    deathDate: '明成化十二年丙申正月初七日戌时',
    age: 69,
    officialTitle: '廪膳生员',
    burialPlace: '西塘东山白虎咀，坐南向北',
    spouses: [
      { name: '孙氏', clanOrigin: '系出富春郡', burialPlace: '合葬白虎咀' }
    ],
    biography: '分居西塘，开辟基业，崇文重教，后裔甚蕃。',
    branchId: 'branch-1'
  },

  // 3世
  {
    id: 'p-5',
    name: '延年',
    courtesyName: '寿昌',
    generation: 3,
    generationWord: '延',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-2',
    fatherName: '伯康',
    motherName: '王氏',
    birthDate: '明宣德三年戊申五月十六日',
    deathDate: '明弘治二年己酉',
    age: 62,
    officialTitle: '庠生',
    burialPlace: '凤凰山麓',
    spouses: [
      { name: '刘氏', clanOrigin: '系出彭城郡', burialPlace: '同茔' }
    ],
    biography: '承继家风，宽仁待邻，重修家谱初稿。',
    branchId: 'branch-1'
  },
  {
    id: 'p-6',
    name: '延德',
    courtesyName: '茂先',
    generation: 3,
    generationWord: '延',
    gender: 'male',
    rank: '次子',
    status: 'deceased',
    fatherId: 'p-2',
    fatherName: '伯康',
    motherName: '王氏',
    birthDate: '明宣德六年辛亥',
    deathDate: '明弘治八年乙卯',
    burialPlace: '凤凰山麓西冈',
    spouses: [
      { name: '周氏', clanOrigin: '系出汝南郡' }
    ],
    biography: '勤谨起家，修桥铺路，乡党咸钦。',
    branchId: 'branch-1'
  },
  {
    id: 'p-7',
    name: '延福',
    courtesyName: '吉安',
    generation: 3,
    generationWord: '延',
    gender: 'male',
    rank: '独子',
    status: 'deceased',
    fatherId: 'p-3',
    fatherName: '伯虚',
    motherName: '张氏',
    birthDate: '明正统二年丁巳',
    deathDate: '明弘治十五年壬戌',
    burialPlace: '回龙寺南山',
    spouses: [
      { name: '杨氏', clanOrigin: '系出弘农郡' }
    ],
    biography: '袭祖荫，明理好义。',
    branchId: 'branch-1'
  },
  {
    id: 'p-8',
    name: '延贵',
    courtesyName: '显荣',
    generation: 3,
    generationWord: '延',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-4',
    fatherName: '伯崇',
    motherName: '孙氏',
    birthDate: '明正统五年庚申',
    deathDate: '明正德三年戊辰',
    burialPlace: '西塘东山祖茔',
    spouses: [
      { name: '罗氏', clanOrigin: '系出豫章郡' }
    ],
    biography: '拓殖庄田，乐善好施。',
    branchId: 'branch-1'
  },
  {
    id: 'p-9',
    name: '延龄',
    courtesyName: '长庚',
    generation: 3,
    generationWord: '延',
    gender: 'male',
    rank: '次子',
    status: 'deceased',
    fatherId: 'p-4',
    fatherName: '伯崇',
    motherName: '孙氏',
    birthDate: '明正统八年癸亥',
    deathDate: '明正德六年辛未',
    burialPlace: '西塘东山',
    spouses: [
      { name: '钱氏', clanOrigin: '系出彭城郡' }
    ],
    biography: '工书画，好吟咏。',
    branchId: 'branch-1'
  },
  {
    id: 'p-10',
    name: '延富',
    courtesyName: '裕后',
    generation: 3,
    generationWord: '延',
    gender: 'male',
    rank: '三子',
    status: 'deceased',
    fatherId: 'p-4',
    fatherName: '伯崇',
    motherName: '孙氏',
    birthDate: '明正统十一年丙寅',
    deathDate: '明正德九年甲戌',
    burialPlace: '西塘北原',
    spouses: [
      { name: '何氏', clanOrigin: '系出庐江郡' }
    ],
    biography: '经营商业，赈济饥馑。',
    branchId: 'branch-1'
  },

  // 4世
  {
    id: 'p-11',
    name: '光远',
    courtesyName: '景明',
    generation: 4,
    generationWord: '光',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-5',
    fatherName: '延年',
    motherName: '刘氏',
    birthDate: '明成化八年壬辰',
    deathDate: '明嘉靖十年辛卯',
    burialPlace: '凤凰山后山',
    spouses: [
      { name: '宋氏', clanOrigin: '系出京兆郡' }
    ],
    biography: '乡贡士，为族立宗规十则。',
    branchId: 'branch-1'
  },
  {
    id: 'p-12',
    name: '光大',
    courtesyName: '弘业',
    generation: 4,
    generationWord: '光',
    gender: 'male',
    rank: '次子',
    status: 'deceased',
    fatherId: 'p-5',
    fatherName: '延年',
    motherName: '刘氏',
    birthDate: '明成化十一年乙未',
    deathDate: '明嘉靖十六年丁酉',
    burialPlace: '凤凰山后山',
    spouses: [
      { name: '吴氏', clanOrigin: '系出延陵郡' }
    ],
    biography: '端谨守道，敦亲睦族。',
    branchId: 'branch-1'
  },
  {
    id: 'p-13',
    name: '光明',
    courtesyName: '昭德',
    generation: 4,
    generationWord: '光',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-7',
    fatherName: '延福',
    motherName: '杨氏',
    birthDate: '明成化十四年戊戌',
    deathDate: '明嘉靖二十年辛丑',
    burialPlace: '回龙寺后冈',
    spouses: [
      { name: '郭氏', clanOrigin: '系出太原郡' }
    ],
    biography: '治家严谨，后人皆遵其训。',
    branchId: 'branch-1'
  },
  {
    id: 'p-14',
    name: '光宗',
    courtesyName: '绳武',
    generation: 4,
    generationWord: '光',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-8',
    fatherName: '延贵',
    motherName: '罗氏',
    birthDate: '明成化十六年庚子',
    deathDate: '明嘉靖二十四年乙巳',
    burialPlace: '西塘东山',
    spouses: [
      { name: '朱氏', clanOrigin: '系出沛国郡' }
    ],
    biography: '秉承祖训，开基创业。',
    branchId: 'branch-1'
  },

  // 5世
  {
    id: 'p-15',
    name: '承宪',
    courtesyName: '则之',
    generation: 5,
    generationWord: '承',
    gender: 'male',
    rank: '长子',
    status: 'deceased',
    fatherId: 'p-11',
    fatherName: '光远',
    motherName: '宋氏',
    birthDate: '明弘治十八年乙丑',
    deathDate: '明隆庆二年戊辰',
    officialTitle: '贡生，修职郎',
    burialPlace: '桐梓县城北象山，坐艮向坤',
    spouses: [
      { name: '冯氏', clanOrigin: '系出始平郡', burialPlace: '合葬象山' }
    ],
    biography: '嘉靖年间举岁贡，任司训，掌教有方，修撰家谱五卷。',
    branchId: 'branch-1'
  },
  {
    id: 'p-16',
    name: '承恩',
    courtesyName: '泽民',
    generation: 5,
    generationWord: '承',
    gender: 'male',
    rank: '次子',
    status: 'deceased',
    fatherId: 'p-11',
    fatherName: '光远',
    motherName: '宋氏',
    birthDate: '明正德三年戊辰',
    deathDate: '明万历五年丁丑',
    burialPlace: '桐梓县城北象山',
    spouses: [
      { name: '谢氏', clanOrigin: '系出陈留郡' }
    ],
    biography: '好行其德，施医赠药，远近颂之。',
    branchId: 'branch-1'
  }
];
