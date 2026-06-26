/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Search, Plus, Trash2, Edit, Eye, Phone, Calendar,
  BadgeDollarSign, CheckSquare, X, Download, Printer, ArrowUpDown, 
  ChevronLeft, ChevronRight, Ban, HelpCircle, CheckCircle2
} from 'lucide-react';
import { Employee } from '../types';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';
import { handleExportData, handlePrintData } from '../data';

interface EmployeesViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  employeesList: Employee[];
  setEmployeesList: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({ 
  onAddToast, employeesList, setEmployeesList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [sortBy, setSortBy] = useState<'name' | 'salary'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);

  // Modal actions
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    id: '',
    name: '',
    role: 'مسؤول استقبال',
    salary: 5000,
    phone: '',
    status: 'نشط' as 'نشط' | 'إجازة' | 'موقف',
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Role and status arrays
  const employeeRoles = ["الكل", "محاسب مالية", "سكرتير إداري", "مشرف صالة", "أخصائي تغذية", "طبيب رياضي", "مسؤول استقبال", "أمين مخزن", "منسق علاقات"];
  const statuses = ["الكل", "نشط", "إجازة", "موقف"];

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const toggleSort = (field: 'name' | 'salary') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    triggerLoading();
  };

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...employeesList];

    if (searchTerm.trim() !== '') {
      result = result.filter(emp => 
        emp.name.includes(searchTerm) || 
        emp.phone.includes(searchTerm) || 
        emp.role.includes(searchTerm)
      );
    }

    if (selectedRole !== 'الكل') {
      result = result.filter(emp => emp.role === selectedRole);
    }

    if (selectedStatus !== 'الكل') {
      result = result.filter(emp => emp.status === selectedStatus);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'ar');
      } else {
        comparison = a.salary - b.salary;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [employeesList, searchTerm, selectedRole, selectedStatus, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name.trim() || !employeeForm.phone.trim()) {
      onAddToast('يرجى كتابة الاسم ورقم الهاتف بالكامل!', 'error');
      return;
    }

    if (isEditMode) {
      setEmployeesList(prev => prev.map(emp => emp.id === employeeForm.id ? { ...emp, ...employeeForm } : emp));
      onAddToast(`تم حفظ وتحديث ملف الموظف: ${employeeForm.name}`, 'success');
    } else {
      const newId = `موظف-${employeesList.length + 1}`;
      const randomColor = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-teal-500", "bg-red-500"][Math.floor(Math.random() * 5)];
      const added: Employee = {
        ...employeeForm,
        id: newId,
        avatarColor: randomColor,
        vacations: [],
        penalties: [],
        advances: [],
        attendance: [],
      };
      setEmployeesList(prev => [added, ...prev]);
      onAddToast(`تمت إضافة الموظف الجديد بنجاح: ${employeeForm.name}`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleEditClick = (emp: Employee) => {
    setEmployeeForm({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      salary: emp.salary,
      phone: emp.phone,
      status: emp.status,
      joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من إنهاء عقد وشطب الموظف "${name}" نهائياً من النظام؟`)) {
      setEmployeesList(prev => prev.filter(emp => emp.id !== id));
      onAddToast(`تم إلغاء سجل الموظف "${name}" بنجاح وتأمينه.`, 'success');
    }
  };

  const handleExport = () => {
    const success = handleExportData(employeesList, 'employees_list');
    if (success) onAddToast('تم تصدير ملف كادر الموظفين بنجاح!', 'success');
  };

  const handlePrint = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>الرقم التعريفى</th>
            <th>الاسم الكامل</th>
            <th>المسمى الوظيفى</th>
            <th>الراتب الأساسى</th>
            <th>الهاتف</th>
            <th>تاريخ التعيين</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
    `;
    filteredAndSorted.forEach(e => {
      html += `
        <tr>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.role}</td>
          <td>${e.salary.toLocaleString()} ر.س</td>
          <td>${e.phone}</td>
          <td>${e.joinDate || '-'}</td>
          <td>${e.status}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData('تقرير كادر موظفي الأكاديمية - MK Sports Academy', html);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-500" />
            شؤون الموظفين والإدارة العامة
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            متابعة العقود والوظائف، الرواتب والجزاءات، الإجازات الطبية والسنوية، وسلف الراتب للموظفين والمنسقين.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Printer className="w-4 h-4" />
            طباعة
          </button>
          <button
            onClick={() => {
              setEmployeeForm({ id: '', name: '', role: 'مسؤول استقبال', salary: 5000, phone: '', status: 'نشط', joinDate: new Date().toISOString().split('T')[0] });
              setIsEditMode(false);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            إضافة موظف جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث عن موظف بالاسم، المسمى، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>
        <div>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            {employeeRoles.map((role, idx) => (
              <option key={idx} value={role}>{role === 'الكل' ? 'كل الوظائف' : role}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            {statuses.map((s, idx) => (
              <option key={idx} value={s}>{s === 'الكل' ? 'كل الحالات' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main List Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : paginatedEmployees.length === 0 ? (
        <EmptyState title="لا يوجد موظفين مسجلين بهذا البحث" description="يرجى مراجعة فلاتر البحث والوظائف أو تسجيل موظف إداري جديد." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 font-bold" onClick={() => toggleSort('name')}>
                    الاسم الكامل والمسمى <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4">المسمى الوظيفي</th>
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 font-bold" onClick={() => toggleSort('salary')}>
                    الراتب الشهري <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4">الهاتف</th>
                  <th className="p-4">تاريخ التعيين</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${emp.avatarColor}`}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-slate-100">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-bold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-indigo-600 dark:text-indigo-400">
                      {emp.salary.toLocaleString()} ر.س
                    </td>
                    <td className="p-4 font-mono text-slate-500">{emp.phone}</td>
                    <td className="p-4 font-mono text-slate-500">{emp.joinDate || '2025-01-10'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        emp.status === 'نشط' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                          : emp.status === 'إجازة'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'نشط' ? 'bg-emerald-500' : emp.status === 'إجازة' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setViewEmployee(emp)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-lg cursor-pointer"
                          title="الملف الوظيفي والتفاصيل المتقدمة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-amber-500 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-bold">
              عرض {paginatedEmployees.length} من أصل {filteredAndSorted.length} موظفاً
            </span>
            <div className="flex gap-1">
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }} className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 border border-slate-100 dark:border-slate-800 rounded-xl font-bold dark:bg-slate-800">{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); triggerLoading(); }} className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in text-xs font-bold">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Plus className="w-5 h-5 text-indigo-500" />
              {isEditMode ? 'تحديث ملف موظف' : 'تسجيل وتعيين موظف جديد'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">اسم الموظف بالكامل *</label>
                <input
                  type="text"
                  required
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  placeholder="مثال: يوسف خالد السليم"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">المسمى الوظيفي</label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {employeeRoles.slice(1).map((role, idx) => (
                      <option key={idx} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">الراتب الشهري الأساسي (ريال)</label>
                  <input
                    type="number"
                    required
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, salary: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">رقم هاتف الاتصال *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">الحالة العملية</label>
                  <select
                    value={employeeForm.status}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="نشط">نشط</option>
                    <option value="إجازة">إجازة</option>
                    <option value="موقف">موقف</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">تاريخ التعيين والبدء</label>
                <input
                  type="date"
                  value={employeeForm.joinDate}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, joinDate: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                  {isEditMode ? 'حفظ التغييرات' : 'تثبيت الموظف'}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Employee View Details (Vacations, Penalties, Advances, Attendance history) */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in text-xs max-h-[85vh] overflow-y-auto">
            <button onClick={() => setViewEmployee(null)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black ${viewEmployee.avatarColor}`}>
                {viewEmployee.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{viewEmployee.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{viewEmployee.id} • المسمى: {viewEmployee.role} • تاريخ التعيين: {viewEmployee.joinDate || '2025-01-10'}</p>
              </div>
            </div>

            {/* تفاصيل المال */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl text-center">
                <p className="text-slate-400 font-bold">الراتب الأساسي</p>
                <p className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mt-1">{viewEmployee.salary.toLocaleString()} ر.س</p>
              </div>
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl text-center">
                <p className="text-slate-400 font-bold">إجمالي السلف</p>
                <p className="font-mono text-amber-600 dark:text-amber-400 font-extrabold text-sm mt-1">
                  {(viewEmployee.advances?.reduce((sum, ad) => sum + ad.amount, 0) || 0).toLocaleString()} ر.س
                </p>
              </div>
              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl text-center">
                <p className="text-slate-400 font-bold">الجزاءات والحسومات</p>
                <p className="font-mono text-rose-600 dark:text-rose-400 font-extrabold text-sm mt-1">
                  {(viewEmployee.penalties?.reduce((sum, pe) => sum + pe.amount, 0) || 0).toLocaleString()} ر.س
                </p>
              </div>
            </div>

            {/* Tabs for details */}
            <div className="space-y-4">
              {/* 1. الإجازات */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 dark:text-slate-200 border-r-4 border-indigo-500 pr-2">سجل الإجازات الرسمية والاضطرارية</h4>
                {!viewEmployee.vacations || viewEmployee.vacations.length === 0 ? (
                  <p className="text-slate-400 font-bold text-center py-2 bg-slate-50 dark:bg-slate-800/20 rounded-xl">لم يطلب هذا الموظف أي إجازات حتى الآن.</p>
                ) : (
                  <div className="space-y-2">
                    {viewEmployee.vacations.map(vac => (
                      <div key={vac.id} className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">إجازة {vac.type}</p>
                          <p className="text-[10px] text-slate-400 font-mono">من: {vac.startDate} إلى: {vac.endDate}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          vac.status === 'مقبولة' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {vac.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. الجزاءات */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 dark:text-slate-200 border-r-4 border-rose-500 pr-2">سجل المخالفات والجزاءات</h4>
                {!viewEmployee.penalties || viewEmployee.penalties.length === 0 ? (
                  <p className="text-slate-400 font-bold text-center py-2 bg-slate-50 dark:bg-slate-800/20 rounded-xl">السجل نظيف ولا توجد أي حسميات أو جزاءات.</p>
                ) : (
                  <div className="space-y-2">
                    {viewEmployee.penalties.map(pe => (
                      <div key={pe.id} className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between bg-rose-50/10">
                        <div>
                          <p className="font-bold text-rose-600">{pe.reason}</p>
                          <p className="text-[10px] text-slate-400 font-mono">تاريخ التدوين: {pe.date}</p>
                        </div>
                        <span className="font-mono font-bold text-rose-600">-{pe.amount} ر.س</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button onClick={() => setViewEmployee(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
