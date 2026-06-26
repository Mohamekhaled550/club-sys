/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar, Search, Plus, Trash2, CheckCircle, XCircle, Clock, 
  QrCode, Barcode, UserCheck, X, Download, Printer, ArrowUpDown, 
  ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { AttendanceRecord, Player, Employee, Coach } from '../types';
import { attendanceRecords, handleExportData, handlePrintData } from '../data';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface AttendanceViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  attendanceList: AttendanceRecord[];
  setAttendanceList: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  playersList: Player[];
  employeesList: Employee[];
  coachesList: Coach[];
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ 
  onAddToast, attendanceList, setAttendanceList, playersList, employeesList, coachesList 
}) => {
  const [activeRoleTab, setActiveRoleTab] = useState<'لاعب' | 'مدرب' | 'موظف'>('لاعب');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedMethod, setSelectedMethod] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);

  // Quick QR/Barcode Simulator Modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanType, setScanType] = useState<'QR' | 'Barcode'>('QR');
  const [simulatedId, setSimulatedId] = useState('');

  // Manual check-in form
  const [manualPersonId, setManualPersonId] = useState('');
  const [manualStatus, setManualStatus] = useState<'حاضر' | 'غائب'>('حاضر');

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredRecords = useMemo(() => {
    let result = [...attendanceList];

    // Filter by Active Tab Role
    result = result.filter(rec => rec.role === activeRoleTab);

    if (searchTerm.trim() !== '') {
      result = result.filter(rec => 
        rec.personName.includes(searchTerm) || 
        rec.personId.includes(searchTerm)
      );
    }

    if (selectedStatus !== 'الكل') {
      result = result.filter(rec => rec.status === selectedStatus);
    }

    if (selectedMethod !== 'الكل') {
      result = result.filter(rec => rec.method === selectedMethod);
    }

    // Sort by Date (newest first)
    result.sort((a, b) => b.date.localeCompare(a.date));

    return result;
  }, [attendanceList, activeRoleTab, searchTerm, selectedStatus, selectedMethod]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  // Handle Quick Check-In
  const handleQuickCheckIn = (personId: string, status: 'حاضر' | 'غائب' | 'إجازة' = 'حاضر', method: 'QR' | 'Barcode' | 'Manual' = 'Manual') => {
    if (!personId.trim()) {
      onAddToast('يرجى تحديد الشخص لإثبات الحضور!', 'error');
      return;
    }

    let personName = '';
    let foundRole: 'لاعب' | 'مدرب' | 'موظف' = 'لاعب';

    if (personId.startsWith('لاعب-')) {
      const p = playersList.find(x => x.id === personId);
      if (p) {
        personName = p.name;
        foundRole = 'لاعب';
      }
    } else if (personId.startsWith('مدرب-')) {
      const c = coachesList.find(x => x.id === personId);
      if (c) {
        personName = c.name;
        foundRole = 'مدرب';
      }
    } else if (personId.startsWith('موظف-')) {
      const emp = employeesList.find(x => x.id === personId);
      if (emp) {
        personName = emp.name;
        foundRole = 'موظف';
      }
    }

    if (!personName) {
      onAddToast('لم يتم العثور على الرقم التعريفي المدخل في سجلات الأكاديمية!', 'error');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `حضور-${Date.now()}`,
      personId,
      personName,
      role: foundRole,
      status,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      method,
    };

    setAttendanceList(prev => [newRecord, ...prev]);
    onAddToast(`تم بنجاح تسجيل حالة (${status}) للشخص: ${personName} عبر ${method}!`, 'success');
    setSimulatedId('');
    setManualPersonId('');
  };

  // Simulated QR/Barcode Scanner
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedId.trim()) return;
    handleQuickCheckIn(simulatedId, 'حاضر', scanType);
    setIsScannerOpen(false);
  };

  const handleExport = () => {
    const success = handleExportData(attendanceList, 'attendance_records');
    if (success) onAddToast('تم تصدير سجلات الحضور بنجاح!', 'success');
  };

  const handlePrint = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>الشخص</th>
            <th>الرقم التعريفى</th>
            <th>النوع / الصفة</th>
            <th>التاريخ واليوم</th>
            <th>الوقت</th>
            <th>وسيلة التحضير</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
    `;
    filteredRecords.forEach(r => {
      html += `
        <tr>
          <td>${r.personName}</td>
          <td>${r.personId}</td>
          <td>${r.role}</td>
          <td>${r.date}</td>
          <td>${r.time}</td>
          <td>${r.method}</td>
          <td>${r.status}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData(`سجل حضور وانصراف الكادر واللاعبين (${activeRoleTab})`, html);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-500" />
            حضور وانصراف الأكاديمية اليومي
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تحضير ذكي متكامل عبر QR Code والباركود السريع للملاعب والصالات، مع إمكانية التحضير اليدوي الفوري.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => { setScanType('QR'); setIsScannerOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-black text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            محاكي QR Code
          </button>
          <button
            onClick={() => { setScanType('Barcode'); setIsScannerOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/40 text-xs font-black text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-all cursor-pointer"
          >
            <Barcode className="w-4 h-4" />
            محاكي الباركود
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Printer className="w-4 h-4" />
            طباعة
          </button>
        </div>
      </div>

      {/* Manual Action Box (Add Quick Manual Attendance) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="text-xs font-black text-slate-700 dark:text-slate-300">تسجيل تحضير يدوي فوري:</p>
          <p className="text-[10px] text-slate-400 mt-0.5">اختر الشخص من القائمة أو ادخل الكود.</p>
        </div>
        <div className="md:col-span-2 flex gap-2">
          <select
            value={manualPersonId}
            onChange={(e) => setManualPersonId(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="">-- اختر لاعب أو موظف أو مدرب --</option>
            <optgroup label="اللاعبين (أمثلة)">
              {playersList.slice(0, 15).map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </optgroup>
            <optgroup label="الكادر التدريبي">
              {coachesList.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
            </optgroup>
            <optgroup label="الموظفين والإداريين">
              {employeesList.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>)}
            </optgroup>
          </select>

          <select
            value={manualStatus}
            onChange={(e) => setManualStatus(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="حاضر">حاضر</option>
            <option value="غائب">غائب</option>
          </select>
        </div>
        <button
          onClick={() => handleQuickCheckIn(manualPersonId, manualStatus, 'Manual')}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer"
        >
          حفظ التحضير
        </button>
      </div>

      {/* Role selector Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-sm w-full">
        {(['لاعب', 'مدرب', 'موظف'] as const).map((role) => (
          <button
            key={role}
            onClick={() => { setActiveRoleTab(role); setCurrentPage(1); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl cursor-pointer transition-all text-center ${
              activeRoleTab === role 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {role === 'لاعب' ? 'حضور اللاعبين' : role === 'مدرب' ? 'حضور المدربين' : 'حضور الموظفين'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث بالاسم الكامل أو الكود الخاص في الحضور..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pr-10 pl-4 py-2 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل الحالات</option>
            <option value="حاضر">حاضر</option>
            <option value="غائب">غائب</option>
            <option value="إجازة">إجازة</option>
          </select>
          <select
            value={selectedMethod}
            onChange={(e) => { setSelectedMethod(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل وسائل التحضير</option>
            <option value="QR">QR Code</option>
            <option value="Barcode">Barcode</option>
            <option value="Manual">يدوي إداري</option>
          </select>
        </div>
      </div>

      {/* Attendance List */}
      {loading ? (
        <TableSkeleton rows={10} />
      ) : paginatedRecords.length === 0 ? (
        <EmptyState title="لا توجد سجلات حضور اليوم" description="لم يتم تسجيل أي حالة حضور أو غياب للمجموعة المحددة بعد." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4">الشخص</th>
                  <th className="p-4">الرقم التعريفي</th>
                  <th className="p-4">الصفة</th>
                  <th className="p-4">تاريخ التحضير</th>
                  <th className="p-4">وقت الحضور</th>
                  <th className="p-4">وسيلة التحضير</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                          {rec.personName.charAt(0)}
                        </div>
                        <span className="font-extrabold text-slate-950 dark:text-slate-50">{rec.personName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400 font-bold">{rec.personId}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                        {rec.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-500">{rec.date}</td>
                    <td className="p-4 font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        <span>{rec.time}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-600 dark:text-slate-400">{rec.method}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                        rec.status === 'حاضر' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                          : rec.status === 'غائب'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'
                      }`}>
                        {rec.status === 'حاضر' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm('هل ترغب في مسح سجل الحضور هذا؟')) {
                            setAttendanceList(prev => prev.filter(x => x.id !== rec.id));
                            onAddToast('تم حذف السجل بنجاح.', 'info');
                          }
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-bold">
              عرض {paginatedRecords.length} من أصل {filteredRecords.length} سجل حضور
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

      {/* Quick QR/Barcode Simulator Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs animate-fade-in">
            <button onClick={() => setIsScannerOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              {scanType === 'QR' ? <QrCode className="w-5 h-5 text-indigo-500" /> : <Barcode className="w-5 h-5 text-blue-500" />}
              جهاز محاكي مسح الـ {scanType === 'QR' ? 'كود QR' : 'الباركود'} للأكاديمية
            </h3>

            <form onSubmit={handleScanSubmit} className="space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                {scanType === 'QR' ? (
                  <QrCode className="w-20 h-20 text-indigo-500 animate-pulse" />
                ) : (
                  <Barcode className="w-20 h-20 text-blue-500 animate-pulse" />
                )}
                <p className="text-[10px] text-slate-400 mt-2 font-bold text-center">أدخل الرقم التعريفي للاعب أو الكادر لمحاكاة المسح الضوئي الفوري</p>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الرقم التعريفي (أمثلة: لاعب-1, لاعب-25, مدرب-3, موظف-5) *</label>
                <input
                  type="text"
                  required
                  placeholder="لاعب-1"
                  value={simulatedId}
                  onChange={(e) => setSimulatedId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow cursor-pointer">
                  محاكاة مسح ناجح
                </button>
                <button type="button" onClick={() => setIsScannerOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
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
