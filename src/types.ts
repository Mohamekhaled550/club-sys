/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Player {
  id: string;
  name: string;
  sport: string; // e.g. كرة القدم، كرة السلة، السباحة، الكاراتيه، التنس
  age: number;
  level: string; // مبتدئ، متوسط، محترف
  status: 'نشط' | 'موقف' | 'منتهي';
  phone: string;
  joinDate: string;
  avatarColor: string;
  parentId: string; // رابط بولي الأمر
  coachId: string;  // رابط بالمدرب
  groupName: string; // اسم المجموعة / الفريق
  notes: string[];   // ملاحظات المدرب والإدارة
  files: { name: string; date: string; size: string }[]; // ملفات وثائق
  injuries: { name: string; date: string; status: 'نشط' | 'متعافي' }[]; // إصابات اللاعب
  attendance: { date: string; status: 'حاضر' | 'غائب' }[]; // سجل حضور اللاعب
  payments: { id: string; amount: number; date: string; type: string; status: 'مكتمل' | 'مسترجع' | 'قيد الانتظار' }[]; // مدفوعات اللاعب
  timeline: { title: string; date: string; description: string; type: string }[]; // التايملاين التاريخي للاعب
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: string;
  avatarColor: string;
  kidsIds: string[]; // معرفات الأبناء اللاعبين
  relation: string; // أب، أم، عم، إلخ
  notes: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string; // محاسب، سكرتير، مشرف، اخصائي تغذية، طبيب رياضي
  salary: number;
  phone: string;
  status: 'نشط' | 'إجازة' | 'موقف';
  avatarColor: string;
  joinDate: string;
  vacations: { id: string; startDate: string; endDate: string; type: 'سنوية' | 'مرضية' | 'اضطرارية'; status: 'مقبولة' | 'قيد المراجعة' }[];
  penalties: { id: string; amount: number; date: string; reason: string }[]; // جزاءات وحسميات
  advances: { id: string; amount: number; date: string; status: 'مقبولة' | 'مرفوضة' | 'قيد المراجعة' }[]; // سلف مالية
  attendance: { date: string; status: 'حاضر' | 'غائب' | 'إجازة'; timeIn?: string; timeOut?: string }[];
}

export interface Coach {
  id: string;
  name: string;
  sport: string; // كرة القدم، كرة السلة، إلخ
  rating: number; // 1-5
  salary: number;
  phone: string;
  status: 'نشط' | 'إجازة';
  avatarColor: string;
  teams: string[]; // أسماء الفرق التي يدربها
  playersIds: string[]; // اللاعبين المسجلين معه
  schedules: { day: string; time: string; location: string }[]; // جدول التدريب الأسبوعي
  salariesPaid: { month: string; amount: number; date: string; status: 'مكتمل' | 'قيد المعالجة' }[];
}

export interface Transaction {
  id: string;
  type: 'إيراد' | 'مصروف';
  category: string; // اشتراك لاعب، رواتب، أدوات رياضية، إيجار، صيانة، رعاة
  amount: number;
  date: string;
  notes: string;
  user: string; // من قام بالعملية
  playerId?: string; // إذا كانت إيراد اشتراك لاعب
  employeeId?: string; // إذا كانت مصروف راتب/سلفة موظف
  coachId?: string; // إذا كانت مصروف راتب مدرب
  status: 'مكتمل' | 'مسترجع' | 'قيد الانتظار';
}

export interface SystemNotification {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'تنبيه' | 'اشتراك' | 'دفع' | 'حضور' | 'تحديث';
  read: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  date: string;
  details: string;
  type: 'إضافة' | 'تعديل' | 'حذف' | 'تسجيل' | 'أخرى';
}

export interface AttendanceRecord {
  id: string;
  personId: string;
  personName: string;
  role: 'لاعب' | 'مدرب' | 'موظف';
  status: 'حاضر' | 'غائب' | 'إجازة';
  date: string;
  time: string;
  method: 'QR' | 'Barcode' | 'Manual';
}

export interface SubscriptionType {
  id: string;
  name: string; // اسم الاشتراك
  durationMonths: number; // المدة بالشهور
  price: number; // السعر بالريال
  sport: string; // الرياضة
  features: string[]; // المزايا
}
