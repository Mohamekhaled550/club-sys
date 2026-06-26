/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, UserCheck, Plus, Search, Trash2, ShieldAlert,
  Star, Briefcase, Phone, BadgeDollarSign, Heart, X, Sparkles
} from 'lucide-react';
import { Employee, Coach } from '../types';
import { employees, coaches } from '../data';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface StaffViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  employeesList: Employee[];
  setEmployeesList: React.Dispatch<React.SetStateAction<Employee[]>>;
  coachesList: Coach[];
  setCoachesList: React.Dispatch<React.SetStateAction<Coach[]>>;
}

export const StaffView: React.FC<StaffViewProps> = ({ 
  onAddToast, employeesList, setEmployeesList, coachesList, setCoachesList 
}) => {
  // التبويب النشط: مدربين أم موظفين
  const [activeTab, setActiveTab] = useState<'coaches' | 'employees'>('coaches');
  
  // حالات البحث والتصفية والتحميل
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('الكل');
  const [selectedRole, setSelectedRole] = useState('الكل');
  const [loading, setLoading] = useState(false);

  // حالات الحوارات
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // نموذج المدرب/الموظف الجديد
  const [newStaff, setNewStaff] = useState({
    name: '',
    roleOrSport: '', // سيمثل التخصص للمدرب أو الوظيفة للموظف
    salary: '5000',
    phone: '',
    status: 'نشط' as any,
  });

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const handleTabChange = (tab: 'coaches' | 'employees') => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedSport('الكل');
    setSelectedRole('الكل');
    triggerLoading();
  };

  // 1. الرياضات المتاحة للمدربين
  const coachSports = ["الكل", "كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];

  // 2. المسميات الوظيفية المتاحة للموظفين
  const employeeRoles = ["الكل", "محاسب مالية", "سكرتير إداري", "مشرف صالة", "أخصائي تغذية", "طبيب رياضي", "مسؤول استقبال", "أمين مخزن", "منسق علاقات"];

  // تصفية الكادر الفني (المدربين)
  const filteredCoaches = useMemo(() => {
    let result = [...coachesList];

    if (searchTerm.trim() !== '') {
      result = result.filter(coach => 
        coach.name.includes(searchTerm) || 
        coach.phone.includes(searchTerm)
      );
    }

    if (selectedSport !== 'الكل') {
      result = result.filter(coach => coach.sport === selectedSport);
    }

    return result;
  }, [coachesList, searchTerm, selectedSport]);

  // تصفية الموظفين الإداريين
  const filteredEmployees = useMemo(() => {
    let result = [...employeesList];

    if (searchTerm.trim() !== '') {
      result = result.filter(emp => 
        emp.name.includes(searchTerm) || 
        emp.phone.includes(searchTerm)
      );
    }

    if (selectedRole !== 'الكل') {
      result = result.filter(emp => emp.role === selectedRole);
    }

    return result;
  }, [employeesList, searchTerm, selectedRole]);

  // إضافة فرد كادر جديد
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.phone.trim() || !newStaff.roleOrSport.trim()) {
      onAddToast('يرجى تعبئة كافة الحقول المطلوبة!', 'error');
      return;
    }

    const randomColor = ["bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-indigo-500"][Math.floor(Math.random() * 5)];
    const salaryVal = parseFloat(newStaff.salary) || 5000;

    if (activeTab === 'coaches') {
      const createdCoach: Coach = {
        id: `مدرب-${coachesList.length + 1}`,
        name: newStaff.name,
        sport: newStaff.roleOrSport,
        rating: 5,
        salary: salaryVal,
        phone: newStaff.phone,
        status: newStaff.status as 'نشط' | 'إجازة',
        avatarColor: randomColor,
        teams: [`الفريق الأول ${newStaff.roleOrSport}`],
        playersIds: [],
        schedules: [
          { day: "الأحد", time: "04:00 م - 06:00 م", location: "الملعب أ" },
          { day: "الثلاثاء", time: "04:00 م - 06:00 م", location: "الملعب أ" }
        ],
        salariesPaid: []
      };
      setCoachesList(prev => [createdCoach, ...prev]);
      onAddToast(`تم تسجيل الكابتن "${newStaff.name}" كمدرب جديد للعبة ${newStaff.roleOrSport}!`, 'success');
    } else {
      const createdEmployee: Employee = {
        id: `موظف-${employeesList.length + 1}`,
        name: newStaff.name,
        role: newStaff.roleOrSport,
        salary: salaryVal,
        phone: newStaff.phone,
        status: newStaff.status as 'نشط' | 'إجازة' | 'موقف',
        avatarColor: randomColor,
        joinDate: new Date().toISOString().split('T')[0],
        vacations: [],
        penalties: [],
        advances: [],
        attendance: []
      };
      setEmployeesList(prev => [createdEmployee, ...prev]);
      onAddToast(`تم تسجيل الموظف إدارياً "${newStaff.name}" في مسمى ${newStaff.roleOrSport}!`, 'success');
    }

    setIsAddModalOpen(false);
    setNewStaff({
      name: '',
      roleOrSport: '',
      salary: '5000',
      phone: '',
      status: 'نشط',
    });
  };

  // حذف فرد كادر
  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في شطب ملف: ${name} نهائياً؟`)) {
      if (activeTab === 'coaches') {
        setCoachesList(prev => prev.filter(c => c.id !== id));
      } else {
        setEmployeesList(prev => prev.filter(e => e.id !== id));
      }
      onAddToast(`تم إنهاء عقد وحذف سجل "${name}" بنجاح.`, 'success');
    }
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة والتحكم بالتبويبات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-500" />
            إدارة الكادر الفني والإداري للأكاديمية
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            سجلات تفصيلية للمدربين والموظفين والرواتب والتقييم والأنشطة الإشرافية.
          </p>
        </div>

        <button
          onClick={() => {
            setNewStaff({
              name: '',
              roleOrSport: activeTab === 'coaches' ? 'كرة القدم' : 'محاسب مالية',
              salary: '5000',
              phone: '',
              status: 'نشط',
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          إضافة {activeTab === 'coaches' ? 'مدرب جديد' : 'موظف جديد'}
        </button>
      </div>

      {/* 2. مفتاح التبديل الاحترافي للتبويبات (Tabs Switcher) */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md w-full">
        <button
          onClick={() => handleTabChange('coaches')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
            activeTab === 'coaches' 
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          المدربون الرياضيون ({coachesList.length})
        </button>
        <button
          onClick={() => handleTabChange('employees')}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
            activeTab === 'employees' 
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          الكادر الإداري والخدماتي ({employeesList.length})
        </button>
      </div>

      {/* 3. فلاتر التبويب النشط */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* حقل البحث */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder={`ابحث عن ${activeTab === 'coaches' ? 'مدرب بالاسم أو الهاتف...' : 'موظف بالاسم أو الهاتف...'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* فلاتر مخصصة لكل تبويب */}
        {activeTab === 'coaches' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex-shrink-0">تخصص اللعبة:</span>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
            >
              {coachSports.map((sport, i) => (
                <option key={i} value={sport}>{sport === 'الكل' ? 'كل الرياضات' : sport}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex-shrink-0">المسمى الوظيفي:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
            >
              {employeeRoles.map((role, i) => (
                <option key={i} value={role}>{role === 'الكل' ? 'كل الوظائف' : role}</option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* 4. جداول الكادر */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : activeTab === 'coaches' ? (
        // عرض قائمة المدربين
        filteredCoaches.length === 0 ? (
          <EmptyState 
            title="لا يوجد أي مدربين يطابقون بحثك" 
            description="يرجى كتابة الاسم بشكل صحيح أو تغيير تصفية الألعاب الرياضية." 
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                    <th className="p-4">الرقم التعريفي</th>
                    <th className="p-4">اسم الكابتن</th>
                    <th className="p-4">التخصص الرياضي</th>
                    <th className="p-4">التقييم الفني للاعبين</th>
                    <th className="p-4">الراتب الشهري</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {filteredCoaches.map((coach) => (
                    <tr key={coach.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-400">{coach.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${coach.avatarColor}`}>
                            {coach.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{coach.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-extrabold text-[11px]">
                          {coach.sport}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold">{coach.rating} / 5</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {coach.salary.toLocaleString()} ر.س
                      </td>
                      <td className="p-4 font-mono text-slate-500">{coach.phone}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          coach.status === 'نشط' 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' 
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${coach.status === 'نشط' ? 'bg-indigo-600' : 'bg-amber-500'}`}></span>
                          {coach.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteStaff(coach.id, coach.name)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        // عرض قائمة الموظفين الإداريين
        filteredEmployees.length === 0 ? (
          <EmptyState 
            title="لا يوجد أي موظفين يطابقون بحثك" 
            description="يرجى كتابة الاسم بشكل صحيح أو تغيير تصفية المسميات الوظيفية." 
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                    <th className="p-4">الرقم التعريفي</th>
                    <th className="p-4">اسم الموظف</th>
                    <th className="p-4">المسمى الوظيفي</th>
                    <th className="p-4">الراتب الشهري</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">الحالة النشطة</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-400">{emp.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${emp.avatarColor}`}>
                            {emp.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{emp.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-extrabold text-[11px]">
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {emp.salary.toLocaleString()} ر.س
                      </td>
                      <td className="p-4 font-mono text-slate-500">{emp.phone}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          emp.status === 'نشط' 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' 
                            : emp.status === 'إجازة'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'نشط' ? 'bg-indigo-600' : emp.status === 'إجازة' ? 'bg-blue-500' : 'bg-rose-500'
                          }`}></span>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteStaff(emp.id, emp.name)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* 5. حوار إضافة فرد كادر جديد */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Plus className="w-5 h-5 text-indigo-500" />
              إضافة وتعيين {activeTab === 'coaches' ? 'مدرب فني جديد' : 'كادر إداري جديد'}
            </h3>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="مثال: الكابتن فهد الحربي"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    {activeTab === 'coaches' ? 'التخصص الرياضي *' : 'المسمى الوظيفي *'}
                  </label>
                  {activeTab === 'coaches' ? (
                    <select
                      value={newStaff.roleOrSport}
                      onChange={(e) => setNewStaff({ ...newStaff, roleOrSport: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    >
                      {coachSports.slice(1).map((sport, idx) => (
                        <option key={idx} value={sport}>{sport}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={newStaff.roleOrSport}
                      onChange={(e) => setNewStaff({ ...newStaff, roleOrSport: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    >
                      {employeeRoles.slice(1).map((role, idx) => (
                        <option key={idx} value={role}>{role}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الراتب الشهري المقترح *</label>
                  <input
                    type="number"
                    required
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">رقم الهاتف الفوري *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-left font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الحالة الحالية</label>
                  <select
                    value={newStaff.status}
                    onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="نشط">نشط</option>
                    <option value="إجازة">إجازة</option>
                    <option value="موقف">موقف</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  تعيين وتثبيت السجل
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
