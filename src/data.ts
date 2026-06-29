/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Player, Parent, Employee, Coach, Transaction, 
  SystemNotification, ActivityLog, AttendanceRecord, SubscriptionType 
} from './types';

// قوائم الأسماء العربية لتوليد البيانات تلقائياً
const firstNames = [
  "محمد", "أحمد", "يوسف", "عمر", "علي", "عبد الرحمن", "عبد الله", "خالد", "زياد", "طارق",
  "سعيد", "سليمان", "محمود", "ياسر", "حسن", "حسين", "إبراهيم", "مصطفى", "حمزة", "بلال",
  "سعد", "ماجد", "فيصل", "سلطان", "صالح", "هاني", "سامر", "رائد", "كريم", "شريف",
  "فهد", "تركي", "نواف", "بدر", "باسل", "طلال", "خليل", "عادل", "مازن", "سفيان",
  "نائل", "براء", "جابر", "ساهر", "غازي", "حاتم", "راجح", "مؤيد", "مهند", "باسم"
];

const lastNames = [
  "الشريف", "العتيبي", "الغامدي", "الحربي", "القحطاني", "الزهراني", "الشمري", "الدوسري", "العنزي", "المطيري",
  "الرشيدي", "السبيعي", "المالكي", "الشهري", "القرني", "البقمي", "الخالدي", "الحسيني", "المنصوري", "أبو بكر",
  "شاهين", "نجم", "الحداد", "النمر", "الشايب", "عمران", "الشناوي", "الجبالي", "طاهر", "العمري",
  "الفالح", "السديري", "السليم", "الرويلي", "الموسى", "الرشيد", "الحكيم", "النجار", "الفيصل", "الباز"
];

export const sports = ["كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];
const levels = ["مبتدئ", "متوسط", "محترف"];
const employeeRoles = ["محاسب مالية", "سكرتير إداري", "مشرف صالة", "أخصائي تغذية", "طبيب رياضي", "مسؤول استقبال", "أمين مخزن", "منسق علاقات"];
const avatarColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-rose-500", "bg-purple-500", 
  "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500", "bg-cyan-500"
];

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// توليد اسم ثلاثي عشوائي
const generateArabicName = (index: number): string => {
  const first = firstNames[index % firstNames.length];
  const second = firstNames[(index + 11) % firstNames.length];
  const last = lastNames[(index + 23) % lastNames.length];
  return `${first} ${second} ${last}`;
};

// 1. توليد 50 ولي أمر
export const parents: Parent[] = Array.from({ length: 50 }, (_, i) => {
  const name = generateArabicName(i + 500);
  const phone = `05${getRandomInt(10000000, 99999999)}`;
  const email = `parent_${i + 1}@academy.com`;
  const professions = ["مهندس برمجيات", "طبيب أطفال", "معلم ثانوي", "رجل أعمال", "موظف حكومي", "عسكري متقاعد", "محامي", "صيدلي"];
  const profession = getRandomElement(professions);
  const relation = i % 10 === 0 ? "أم" : "أب";
  const avatarColor = getRandomElement(avatarColors);
  
  return {
    id: `ولي أمر-${i + 1}`,
    name,
    phone,
    email,
    profession,
    avatarColor,
    kidsIds: [], // سيتم التعبئة لاحقاً
    relation,
    notes: i % 7 === 0 ? "يفضل التواصل عبر واتساب فقط" : "لا توجد ملاحظات خاصة"
  };
});

// 2. توليد 20 مدرب
export const coaches: Coach[] = Array.from({ length: 20 }, (_, i) => {
  const name = generateArabicName(i + 200);
  const sport = sports[i % sports.length];
  const rating = parseFloat((4 + Math.random()).toFixed(1));
  const salary = getRandomInt(6000, 14000);
  const phone = `05${getRandomInt(10000000, 99999999)}`;
  const status = i < 18 ? 'نشط' : 'إجازة';
  const avatarColor = getRandomElement(avatarColors);
  const teamNames = [`فريق ال${sport} أ`, `فريق ال${sport} ب`, `براعم ال${sport}`];
  
  return {
    id: `مدرب-${i + 1}`,
    name,
    sport,
    rating,
    salary,
    phone,
    status,
    avatarColor,
    teams: [teamNames[i % teamNames.length]],
    playersIds: [], // سيتم التعبئة لاحقاً
    schedules: [
      { day: 'السبت', time: '04:00 م - 06:00 م', location: 'الملعب الرئيسي' },
      { day: 'الإثنين', time: '06:00 م - 08:00 م', location: 'الصالة المغلقة' },
      { day: 'الأربعاء', time: '04:00 م - 06:00 م', location: 'الملعب الرئيسي' }
    ],
    salariesPaid: [
      { month: 'يناير 2026', amount: salary, date: '2026-01-28', status: 'مكتمل' },
      { month: 'فبراير 2026', amount: salary, date: '2026-02-28', status: 'مكتمل' },
      { month: 'مارس 2026', amount: salary, date: '2026-03-28', status: 'مكتمل' },
      { month: 'أبريل 2026', amount: salary, date: '2026-04-28', status: 'مكتمل' },
      { month: 'مايو 2026', amount: salary, date: '2026-05-28', status: 'مكتمل' },
      { month: 'يونيو 2026', amount: salary, date: '2026-06-25', status: 'مكتمل' }
    ]
  };
});

// 3. أنواع الاشتراكات المتاحة (باقات الأكاديمية الرسمية)
export const subscriptionTypes: SubscriptionType[] = [
  { id: "باقة-1", name: "اشتراك شهري أساسي", durationMonths: 1, price: 350, sport: "كرة القدم", features: ["3 حصص أسبوعياً", "تيشيرت الأكاديمية مجاناً", "متابعة مع المدرب"] },
  { id: "باقة-2", name: "اشتراك ربع سنوي فضي", durationMonths: 3, price: 900, sport: "السباحة", features: ["3 حصص أسبوعياً", "استخدام مرافق المسبح الدافئ", "متابعة الوزن والتغذية"] },
  { id: "باقة-3", name: "اشتراك نصف سنوي ذهبي", durationMonths: 6, price: 1600, sport: "الكاراتيه", features: ["حضور غير محدود للمستويات", "بدلة كاراتيه رسمية مجاناً", "اختبارات الأحزمة مجانية"] },
  { id: "باقة-4", name: "اشتراك سنوي بلاتيني شريك", durationMonths: 12, price: 2800, sport: "التنس", features: ["مضرب تنس هدية", "حصص مخصصة أسبوعياً", "حق الدخول لكافة البطولات الودية"] },
  { id: "باقة-5", name: "اشتراك اللياقة البدنية والجرى", durationMonths: 1, price: 250, sport: "اللياقة البدنية", features: ["إرشاد رياضي وتغذية", "دخول الجيم اليومي"] },
];

// 4. توليد 150 لاعب
export const players: Player[] = Array.from({ length: 150 }, (_, i) => {
  const name = generateArabicName(i + 1);
  const sport = sports[i % sports.length];
  const age = getRandomInt(6, 22);
  const level = getRandomElement(levels);
  const status = i < 115 ? 'نشط' : i < 135 ? 'موقف' : 'منتهي';
  const phone = `05${getRandomInt(10000000, 99999999)}`;
  const joinDate = `2025-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`;
  const avatarColor = getRandomElement(avatarColors);

  // ربط عشوائي بولي أمر ومدرب
  const parentIndex = i % 50;
  const parent = parents[parentIndex];
  const parentId = parent.id;
  
  // تصفية مدربي نفس الرياضة إن وجدوا، وإلا مدرب عشوائي
  const sportCoaches = coaches.filter(c => c.sport === sport);
  const coach = sportCoaches.length > 0 ? getRandomElement(sportCoaches) : getRandomElement(coaches);
  const coachId = coach.id;

  const groupNames = ["فئة البراعم أ", "فئة الناشئين ب", "فئة الأشبال ت", "الفئة الذهبية ج", "المستوى المتوسط د", "نخبة المحترفين"];
  const groupName = getRandomElement(groupNames);

  const notesList = [
    "اللاعب ملتزم بالتمارين ويتحسن مستواه بسرعة ومهاراته ممتازة.",
    "يحتاج للتركيز على اللياقة البدنية والسرعة وبناء القوة العضلية.",
    "لاعب واعد يمتلك روحاً قيادية عالية في الملعب مع زملائه.",
    "توصية للمدرب: تكثيف التمارين المهارية الفردية لتحسين التمرير والتحكم."
  ];
  const notes = [getRandomElement(notesList)];

  const files = [
    { name: "صورة الهوية الوطنية.pdf", date: "2025-08-12", size: "1.2 MB" },
    { name: "التقرير الطبي المعتمد.pdf", date: "2025-08-14", size: "850 KB" }
  ];

  const injuries: Player['injuries'] = i % 7 === 0 ? [
    { name: "التواء بسيط في الكاحل", date: "2026-02-14", status: "متعافي" },
    { name: "كدمة في الركبة اليمنى", date: "2026-06-12", status: "نشط" }
  ] : [];

  // توليد تاريخ حضور عشوائي
  const attendance: Player['attendance'] = Array.from({ length: 12 }, (_, attI) => {
    const day = getRandomInt(1, 28);
    const date = `2026-06-${String(day).padStart(2, '0')}`;
    const statusVal: 'حاضر' | 'غائب' = Math.random() > 0.15 ? 'حاضر' : 'غائب';
    return { date, status: statusVal };
  });

  // توليد مدفوعات عشوائية مطابقة للاشتراكات والعمليات المالية
  const payments: Player['payments'] = [
    { id: `سند-لاعب-${i + 1}-1`, amount: 350, date: `2026-04-${String(getRandomInt(1, 28)).padStart(2, '0')}`, type: "اشتراك شهري", status: "مكتمل" },
    { id: `سند-لاعب-${i + 1}-2`, amount: 350, date: `2026-05-${String(getRandomInt(1, 28)).padStart(2, '0')}`, type: "اشتراك شهري", status: "مكتمل" },
    { id: `سند-لاعب-${i + 1}-3`, amount: 350, date: `2026-06-${String(getRandomInt(1, 28)).padStart(2, '0')}`, type: "اشتراك شهري", status: "مكتمل" }
  ];

  const timeline = [
    { title: "تسجيل الانضمام للأكاديمية", date: joinDate, description: `تم تسجيل اللاعب رسمياً في رياضة ${sport} المستوى المبتدئ.`, type: "تسجيل" },
    { title: "الترقية إلى مستوى متوسط", date: "2026-02-10", description: "اجتياز اختبار المهارات الأساسية بنجاح.", type: "أداء" },
    { title: "الحصول على ميدالية التميز", date: "2026-05-20", description: "المشاركة الفعالة في دورة الصيف الرياضية للأكاديمية.", type: "إنجاز" }
  ];

  // ربط الأبناء بولي الأمر
  parent.kidsIds.push(`لاعب-${i + 1}`);
  // ربط اللاعبين بالمدرب
  coach.playersIds.push(`لاعب-${i + 1}`);

  return {
    id: `لاعب-${i + 1}`,
    name,
    sport,
    age,
    level,
    status,
    phone,
    joinDate,
    avatarColor,
    parentId,
    coachId,
    groupName,
    notes,
    files,
    injuries,
    attendance,
    payments,
    timeline
  };
});

// 5. توليد 30 موظفاً
export const employees: Employee[] = Array.from({ length: 30 }, (_, i) => {
  const name = generateArabicName(i + 100);
  const role = getRandomElement(employeeRoles);
  const salary = getRandomInt(4000, 9500);
  const phone = `05${getRandomInt(10000000, 99999999)}`;
  const status = i < 26 ? 'نشط' : i < 28 ? 'إجازة' : 'موقف';
  const avatarColor = getRandomElement(avatarColors);
  const joinDate = `2024-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`;

  const vacations: Employee['vacations'] = i % 5 === 0 ? [
    { id: `إجازة-موظف-${i + 1}-1`, startDate: "2026-04-10", endDate: "2026-04-15", type: "اضطرارية", status: "مقبولة" },
    { id: `إجازة-موظف-${i + 1}-2`, startDate: "2026-07-01", endDate: "2026-07-15", type: "سنوية", status: "قيد المراجعة" }
  ] : [];

  const penalties = i % 8 === 0 ? [
    { id: `جزاء-موظف-${i + 1}-1`, amount: 150, date: "2026-05-12", reason: "التأخر عن حضور صالة الاستقبال بدون إذن مسبق" }
  ] : [];

  const advances: Employee['advances'] = i % 6 === 0 ? [
    { id: `سلفة-موظف-${i + 1}-1`, amount: 1000, date: "2026-05-01", status: "مقبولة" as const }
  ] : [];

  // سجل حضور الموظف
  const attendance: Employee['attendance'] = Array.from({ length: 15 }, (_, attI) => {
    const day = getRandomInt(1, 28);
    const date = `2026-06-${String(day).padStart(2, '0')}`;
    const statusVal: 'حاضر' | 'غائب' | 'إجازة' = Math.random() > 0.1 ? 'حاضر' : Math.random() > 0.5 ? 'غائب' : 'إجازة';
    return { 
      date, 
      status: statusVal,
      timeIn: statusVal === 'حاضر' ? '08:05 ص' : undefined,
      timeOut: statusVal === 'حاضر' ? '04:10 م' : undefined
    };
  });

  return {
    id: `موظف-${i + 1}`,
    name,
    role,
    salary,
    phone,
    status,
    avatarColor,
    joinDate,
    vacations,
    penalties,
    advances,
    attendance
  };
});

// 6. توليد 1000 عملية مالية (مترابطة مع اللاعبين والموظفين والمدربين)
export const transactions: Transaction[] = Array.from({ length: 1000 }, (_, i) => {
  const isRevenue = i < 700; // 700 إيرادات، 300 مصروفات
  const type = isRevenue ? 'إيراد' : 'مصروف';
  
  // توليد تاريخ متدرج على مدار الشهور الستة الماضية من عام 2026
  const month = getRandomInt(1, 6);
  const day = getRandomInt(1, 28);
  const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  const user = getRandomElement(["عمر الرويلي (محاسب)", "أحمد الفالح (مدير)", "عبد الرحمن النجار (أمين صندوق)"]);
  const status: 'مكتمل' | 'مسترجع' | 'قيد الانتظار' = i < 960 ? 'مكتمل' : i < 985 ? 'قيد الانتظار' : 'مسترجع';

  let category = "";
  let amount = 0;
  let notes = "";
  let playerId: string | undefined = undefined;
  let employeeId: string | undefined = undefined;
  let coachId: string | undefined = undefined;

  if (isRevenue) {
    const revCategory = getRandomElement(["اشتراك لاعب شهري", "مبيعات متجر الأكاديمية", "إيجار ملاعب وصالات", "رعاة رسميين ودعم تكنولوجي"]);
    category = revCategory;
    
    if (revCategory === "اشتراك لاعب شهري") {
      const randomPlayer = getRandomElement(players);
      playerId = randomPlayer.id;
      amount = getRandomElement([350, 900, 1600, 2800]);
      notes = `استلام رسوم الاشتراك الشهري للعب في الأكاديمية من اللاعب: ${randomPlayer.name}`;
    } else if (revCategory === "مبيعات متجر الأكاديمية") {
      amount = getRandomInt(80, 450);
      notes = `بيع مستلزمات رياضية وأطقم الأكاديمية الرسمية من المتجر الداخلي`;
    } else if (revCategory === "إيجار ملاعب وصالات") {
      amount = getRandomInt(150, 600);
      notes = `إيجار ساعة ملعب كرة القدم الخماسي الخارجي لأفراد`;
    } else {
      amount = getRandomInt(2000, 15000);
      notes = `رعاية ودعم مالي شهري من قبل شركاء التكنولوجيا والأعمال`;
    }
  } else {
    const expCategory = getRandomElement(["رواتب المدربين", "رواتب موظفين وإداريين", "مستلزمات وأجهزة رياضية", "فواتير المقر والصيانة العامة"]);
    category = expCategory;
    
    if (expCategory === "رواتب المدربين") {
      const randomCoach = getRandomElement(coaches);
      coachId = randomCoach.id;
      amount = randomCoach.salary;
      notes = `صرف الراتب الشهري لمدرب رياضة ${randomCoach.sport} الكابتن: ${randomCoach.name}`;
    } else if (expCategory === "رواتب موظفين وإداريين") {
      const randomEmployee = getRandomElement(employees);
      employeeId = randomEmployee.id;
      amount = randomEmployee.salary;
      notes = `صرف الراتب والتعويض المالي للموظف: ${randomEmployee.name} (${randomEmployee.role})`;
    } else if (expCategory === "مستلزمات وأجهزة رياضية") {
      amount = getRandomInt(300, 3500);
      notes = `شراء صدريات وأقماع وكرات جديدة وتحديث صالة اللياقة البدنية والأجهزة`;
    } else {
      amount = getRandomInt(500, 4000);
      notes = `تغطية فواتير المياه، الكهرباء، صيانة المكيفات وإصلاح أرضية ملعب كرة القدم`;
    }
  }

  return {
    id: `سند-${i + 1}`,
    type,
    category,
    amount,
    date,
    notes,
    user,
    playerId,
    employeeId,
    coachId,
    status
  };
});

// 7. توليد 500 سجل حضور كقاعدة بيانات حضور تراكمية مترابطة
export const attendanceRecords: AttendanceRecord[] = Array.from({ length: 500 }, (_, i) => {
  const isPlayer = i < 350; // 350 لاعب، 100 موظف، 50 مدرب
  const role = isPlayer ? 'لاعب' as const : i < 450 ? 'موظف' as const : 'مدرب' as const;
  
  let personId = "";
  let personName = "";
  
  if (role === 'لاعب') {
    const p = players[i % players.length];
    personId = p.id;
    personName = p.name;
  } else if (role === 'موظف') {
    const emp = employees[i % employees.length];
    personId = emp.id;
    personName = emp.name;
  } else {
    const c = coaches[i % coaches.length];
    personId = c.id;
    personName = c.name;
  }

  const status: 'حاضر' | 'غائب' | 'إجازة' = Math.random() > 0.12 ? 'حاضر' : Math.random() > 0.4 ? 'غائب' : 'إجازة';
  
  const month = getRandomInt(5, 6);
  const day = getRandomInt(1, 28);
  const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  const time = status === 'حاضر' ? `${String(getRandomInt(15, 17)).padStart(2, '0')}:${String(getRandomInt(10, 59)).padStart(2, '0')} م` : '-';
  const method = getRandomElement(['QR' as const, 'Barcode' as const, 'Manual' as const]);

  return {
    id: `سجل_حضور-${i + 1}`,
    personId,
    personName,
    role,
    status,
    date,
    time,
    method
  };
});

// تصفية حضور اليوم للوحة التحكم
export const todayAttendance = attendanceRecords.slice(0, 40);

// 8. سجل الإشعارات (300 إشعار فوري وتذكيري)
const notificationTitles = [
  "تجديد اشتراك لاعب",
  "دفعة مالية جديدة",
  "تسجيل حضور مدرب",
  "تنبيه نقص مخزون",
  "تحديث جدول التمارين",
  "طلب إجازة موظف"
];

const notificationContents = [
  "تم تجديد الاشتراك السنوي للاعب بنجاح لمدة 12 شهراً إضافية.",
  "تم استلام رسوم الاشتراك لشهر يونيو من اللاعب بقيمة 350 ريال سعودي.",
  "تم تسجيل حضور المدرب في الصالة الرياضية في تمام الساعة 4:00 مساءً.",
  "تنبيه: الكرات الرياضية المتاحة في المستودع وصلت إلى الحد الأدنى (أقل من 5 قطع).",
  "تم تحديث جدول تدريبات كرة القدم لفئة البراعم والمستويات المبتدئة.",
  "قدم أحد موظفي الاستقبال طلباً للحصول على إجازة اضطرارية ليوم غد."
];

export const notifications: SystemNotification[] = Array.from({ length: 300 }, (_, i) => {
  const typeIndex = i % notificationTitles.length;
  const title = notificationTitles[typeIndex];
  const content = notificationContents[typeIndex];
  const isRead = i < 180; // أول 180 مقروءة، الباقي غير مقروءة
  
  const month = getRandomInt(5, 6);
  const day = getRandomInt(1, 28);
  const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(getRandomInt(8, 21)).padStart(2, '0')}:${String(getRandomInt(10, 59)).padStart(2, '0')}`;

  const types: Array<'تنبيه' | 'اشتراك' | 'دفع' | 'حضور' | 'تحديث'> = ['تحديث', 'دفع', 'حضور', 'تنبيه', 'تحديث', 'تنبيه'];

  return {
    id: `إشعار-${i + 1}`,
    title,
    content,
    date,
    type: types[typeIndex],
    read: isRead,
  };
});

// 9. الأنشطة وسجل تتبع النظام الداخلي
const logActions = [
  "إضافة لاعب جديد", "تحديث اشتراك لاعب", "تعديل بيانات مدرب", "صرف راتب موظف", 
  "إضافة عملية مالية", "تحديث مخزون الأدوات", "تسجيل غياب لاعب", "تغيير كلمة المرور"
];

const logDetails = [
  "تم تسجيل اللاعب الجديد في لعبة كرة القدم وتعيينه للمدرب فهد.",
  "تمت ترقية باقة اشتراك اللاعب إلى الباقة الاحترافية الشاملة.",
  "تم تعديل رقم هاتف المدرب والبريد الإلكتروني وتحديث التقييم السنوي.",
  "تم تحويل راتب الشهر الجاري لحساب الموظف البنكي بنجاح.",
  "تم تقييد فاتورة شراء كرات قدم وسلات تدريب جديدة في الدفاتر المالية.",
  "تم تحديث عدد الأقماع الرياضية وصدريات التدريب المتاحة في المخزن.",
  "تم تسجيل غياب اللاعب عن الحصة التدريبية المسائية وتنبيه ولي أمره.",
  "تم تغيير كلمة مرور المدير العام للنظام من خلال لوحة الأمان."
];

export const activityLogs: ActivityLog[] = Array.from({ length: 200 }, (_, i) => {
  const actionIndex = i % logActions.length;
  const user = getRandomElement(["المدير العام", "محاسب النظام", "موظف الاستقبال", "المشرف الرياضي"]);
  const action = logActions[actionIndex];
  const details = logDetails[actionIndex];
  
  const month = getRandomInt(4, 6);
  const day = getRandomInt(1, 28);
  const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(getRandomInt(8, 22)).padStart(2, '0')}:${String(getRandomInt(10, 59)).padStart(2, '0')}`;

  const types: Array<'إضافة' | 'تعديل' | 'حذف' | 'تسجيل' | 'أخرى'> = ['إضافة', 'تعديل', 'تعديل', 'تسجيل', 'إضافة', 'تعديل', 'تسجيل', 'أخرى'];

  return {
    id: `نشاط-${i + 1}`,
    user,
    action,
    date,
    details,
    type: types[actionIndex],
  };
});

// 10. أدوات المخزن والمستودعات
export interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  currentQuantity: number;
  requiredQuantity: number;
  status: 'حرج' | 'ناقص' | 'مكتمل';
}

export const warehouseItems: WarehouseItem[] = [
  { id: "مخزن-1", name: "كرات قدم مقاس 5", category: "أدوات رئيسية", currentQuantity: 4, requiredQuantity: 30, status: "حرج" },
  { id: "مخزن-2", name: "أقماع تدريب بلاستيكية", category: "تنظيم الميدان", currentQuantity: 12, requiredQuantity: 50, status: "ناقص" },
  { id: "مخزن-3", name: "صدريات تدريب ملونة (فوسفوري)", category: "ملابس رياضية", currentQuantity: 8, requiredQuantity: 40, status: "حرج" },
  { id: "مخزن-4", name: "حبال قفز للياقة", category: "لياقة بدنية", currentQuantity: 5, requiredQuantity: 20, status: "ناقص" },
  { id: "مخزن-5", name: "مضارب تنس طاولة", category: "أدوات ترفيهية", currentQuantity: 2, requiredQuantity: 15, status: "حرج" },
  { id: "مخزن-6", name: "مراتب كاراتيه مطاطية", category: "دفاع عن النفس", currentQuantity: 15, requiredQuantity: 25, status: "ناقص" },
  { id: "مخزن-7", name: "ساعات توقيت للمدربين", category: "أجهزة تكنولوجية", currentQuantity: 3, requiredQuantity: 10, status: "ناقص" },
  { id: "مخزن-8", name: "قوارير مياه مبردة (كرتون)", category: "سوائل وتغذية", currentQuantity: 6, requiredQuantity: 50, status: "حرج" },
];

// دالة تصدير وطباعة البيانات المشتركة في النظام
export const handleExportData = (data: any[], fileName: string) => {
  try {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${fileName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const handlePrintData = (title: string, dataHtml: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 12px; }
            th { bg-color: #f4f4f4; }
            h1 { font-size: 18px; border-bottom: 2px solid #1a237e; padding-bottom: 10px; color: #1a237e; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${dataHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

// حساب الإحصائيات العامة المتسقة
export const getSystemStats = (
  playersList: Player[] = players, 
  employeesList: Employee[] = employees, 
  coachesList: Coach[] = coaches, 
  transactionsList: Transaction[] = transactions,
  attRecords: AttendanceRecord[] = attendanceRecords
) => {
  const activeSubs = playersList.filter(p => p.status === 'نشط').length;
  const expiredSubs = playersList.filter(p => p.status === 'منتهي').length;
  const totalEmployees = employeesList.length;
  const totalCoaches = coachesList.length;
  
  // حساب المعاملات المالية
  const revenues = transactionsList.filter(t => t.type === 'إيراد' && t.status === 'مكتمل').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactionsList.filter(t => t.type === 'مصروف' && t.status === 'مكتمل').reduce((sum, t) => sum + t.amount, 0);
  const profits = revenues - expenses;

  // الحضور والغياب لليوم
  const todayAttendanceCount = attRecords.filter(a => a.status === 'حاضر').length;
  const todayAbsenceCount = attRecords.filter(a => a.status === 'غائب').length;

  // الأدوات الناقصة
  const lowStockItemsCount = warehouseItems.filter(item => item.status === 'حرج' || item.status === 'ناقص').length;

  return {
    playersCount: playersList.length,
    employeesCount: totalEmployees,
    coachesCount: totalCoaches,
    activeSubs,
    expiredSubs,
    revenues,
    expenses,
    profits,
    todayAttendanceCount,
    todayAbsenceCount,
    lowStockItemsCount,
  };
};

// إحصائيات الرسوم البيانية
export const monthlyFinancials = [
  { name: "يناير", revenues: 125000, expenses: 85000 },
  { name: "فبراير", revenues: 142000, expenses: 92000 },
  { name: "مارس", revenues: 165000, expenses: 105000 },
  { name: "أبريل", revenues: 158000, expenses: 98000 },
  { name: "مايو", revenues: 189000, expenses: 110000 },
  { name: "يونيو", revenues: 210000, expenses: 115000 },
];

export const subscriptionsByType = [
  { name: "باقة كرة القدم الأساسية", count: 42 },
  { name: "باقة السباحة الذهبية", count: 28 },
  { name: "باقة الكاراتيه الشاملة", count: 18 },
  { name: "باقة اللياقة وتخسيس الوزن", count: 12 },
];

export const coachPerformance = [
  { name: "الكابتن أحمد الفالح", rate: 5, sport: "كرة القدم" },
  { name: "الكابتن يوسف الغامدي", rate: 4.9, sport: "السباحة" },
  { name: "الكابتن خالد الحربي", rate: 4.8, sport: "الكاراتيه" },
  { name: "الكابتن فهد العتيبي", rate: 4.7, sport: "كرة السلة" },
  { name: "الكابتن عمر الشمري", rate: 4.6, sport: "التنس" },
];

export const bestPlayers = [
  { name: "يوسف أحمد الحربي", score: 98, sport: "كرة القدم" },
  { name: "عبد الله سعيد الدوسري", score: 95, sport: "السباحة" },
  { name: "زياد طارق القرني", score: 94, sport: "الكاراتيه" },
  { name: "فيصل خالد العتيبي", score: 92, sport: "كرة السلة" },
  { name: "حمزة بلال الشريف", score: 91, sport: "التنس" },
];
