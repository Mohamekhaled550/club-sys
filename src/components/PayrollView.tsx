/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BadgeDollarSign, Users, Search, Download, CheckSquare, X, 
  FileText, Clock, AlertCircle, RefreshCw, Landmark, Save, Eye, CheckCircle2
} from 'lucide-react';
import { Employee, Coach } from '../types';
import { handleExportData } from '../data';

interface StaffPayroll {
  id: string;
  name: string;
  role: 'مدرب' | 'موظف';
  baseSalary: number;
  workingHours: number;
  lateMinutes: number;
  overtimeHours: number;
  penalties: number;
  netSalary: number;
  status: 'قيد المراجعة' | 'تم الاعتماد' | 'تم الصرف';
}

interface PayrollViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  employeesList: Employee[];
  coachesList: Coach[];
}

export const PayrollView: React.FC<PayrollViewProps> = ({ 
  onAddToast, employeesList, coachesList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedItem, setSelectedItem] = useState<StaffPayroll | null>(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  // Combine coaches and employees into payroll structures
  const [payrollList, setPayrollList] = useState<StaffPayroll[]>([
    { id: 'مدرب-1', name: 'كابتن أحمد الشمراني', role: 'مدرب', baseSalary: 8000, workingHours: 160, lateMinutes: 20, overtimeHours: 10, penalties: 50, netSalary: 8350, status: 'تم الاعتماد' },
    { id: 'مدرب-2', name: 'كابتن محمود عسيري', role: 'مدرب', baseSalary: 7500, workingHours: 155, lateMinutes: 0, overtimeHours: 15, penalties: 0, netSalary: 8200, status: 'تم الصرف' },
    { id: 'موظف-1', name: 'أ. جاسم المطيري', role: 'موظف', baseSalary: 6000, workingHours: 176, lateMinutes: 120, overtimeHours: 4, penalties: 150, netSalary: 5950, status: 'قيد المراجعة' },
    { id: 'موظف-2', name: 'أ. لمى العتيبي', role: 'موظف', baseSalary: 5500, workingHours: 176, lateMinutes: 10, overtimeHours: 8, penalties: 0, netSalary: 5750, status: 'قيد المراجعة' }
  ]);

  const filteredPayroll = useMemo(() => {
    return payrollList.filter(item => {
      const matchSearch = item.name.includes(searchTerm) || item.id.includes(searchTerm);
      const matchRole = selectedRole === 'الكل' || item.role === selectedRole;
      const matchStatus = selectedStatus === 'الكل' || item.status === selectedStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [payrollList, searchTerm, selectedRole, selectedStatus]);

  const handleApproveSalary = (id: string) => {
    setPayrollList(prev => prev.map(item => item.id === id ? { ...item, status: 'تم الاعتماد' } : item));
    onAddToast('تم اعتماد مسير الراتب لهذا الموظف بنجاح!', 'success');
  };

  const handleDisburseSalary = (id: string) => {
    setPayrollList(prev => prev.map(item => item.id === id ? { ...item, status: 'تم الصرف' } : item));
    onAddToast('تم تقييد حوالة صرف الراتب البنكية بنجاح!', 'success');
  };

  const handleShowPayslip = (item: StaffPayroll) => {
    setSelectedItem(item);
    setIsPayslipOpen(true);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20">
        <div className="space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">النظام المالي والرواتب والمسيرات</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-[#E5D4C0]" />
            مسيرات الرواتب والأجور (Payroll Management)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            حساب ساعات العمل الفعلية، ساعات الإضافي والـ Overtime، احتساب حسميات الغياب والتأخر، واعتماد كشوفات الرواتب شهرياً بشكل دقيق.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-[#1C080B]/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="البحث بالاسم أو الرقم التعريفي..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-950/40 border border-white/10 text-xs text-white rounded-xl focus:border-[#B76E79] outline-none"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 bg-slate-950/40 border border-white/10 text-xs text-slate-300 rounded-xl outline-none"
          >
            <option value="الكل" className="bg-slate-950 text-white">كل الكوادر</option>
            <option value="مدرب" className="bg-slate-950 text-white">المدربين</option>
            <option value="موظف" className="bg-slate-950 text-white">الموظفين</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-950/40 border border-white/10 text-xs text-slate-300 rounded-xl outline-none"
          >
            <option value="الكل" className="bg-slate-950 text-white">كل الحالات</option>
            <option value="قيد المراجعة" className="bg-slate-950 text-white">قيد المراجعة</option>
            <option value="تم الاعتماد" className="bg-slate-950 text-white">تم الاعتماد</option>
            <option value="تم الصرف" className="bg-slate-950 text-white">تم الصرف</option>
          </select>

          <button
            onClick={() => handleExportData(payrollList, 'مسير-الرواتب')}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            تصدير Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1C080B]/20 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300">
            <thead className="bg-[#5A0B17]/10 text-white border-b border-white/5 font-black uppercase tracking-wider">
              <tr>
                <th className="p-4">الرقم التعريفي</th>
                <th className="p-4">الاسم</th>
                <th className="p-4">الكادر</th>
                <th className="p-4">ساعات العمل</th>
                <th className="p-4">إضافي (ساعة)</th>
                <th className="p-4">التأخر (دقيقة)</th>
                <th className="p-4">الحسميات</th>
                <th className="p-4">صافي المستحق</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-left">التحكم والمسير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold">
              {filteredPayroll.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-mono text-slate-400">{item.id}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{item.name}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black ${
                      item.role === 'مدرب' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{item.workingHours} ساعة</td>
                  <td className="p-4 font-mono text-emerald-400">+{item.overtimeHours}</td>
                  <td className="p-4 font-mono text-rose-400">{item.lateMinutes} د</td>
                  <td className="p-4 font-mono text-rose-400">{item.penalties} ر.س</td>
                  <td className="p-4 font-mono font-black text-[#E5D4C0]">{item.netSalary.toLocaleString()} ر.س</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      item.status === 'تم الصرف' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.status === 'تم الاعتماد' ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-left">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleShowPayslip(item)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 cursor-pointer"
                        title="عرض كشف الراتب (Payslip)"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {item.status === 'قيد المراجعة' && (
                        <button
                          onClick={() => handleApproveSalary(item.id)}
                          className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-lg font-black text-[10px] cursor-pointer"
                        >
                          اعتماد
                        </button>
                      )}

                      {item.status === 'تم الاعتماد' && (
                        <button
                          onClick={() => handleDisburseSalary(item.id)}
                          className="px-2.5 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 rounded-lg font-black text-[10px] cursor-pointer"
                        >
                          صرف حوالة
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      {isPayslipOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1C080B] border border-[#B76E79]/30 rounded-3xl p-6 max-w-md w-full text-right space-y-6 animate-fade-in relative text-xs">
            <button
              onClick={() => setIsPayslipOpen(false)}
              className="absolute top-5 left-5 p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center border-b border-white/5 pb-4">
              <h3 className="text-md font-black text-white">كشف الراتب والبدلات الرسمي</h3>
              <p className="text-xs text-[#B76E79] font-black">الشهر الجاري: يونيو ٢٠٢٦</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/5 text-slate-300 font-bold">
                <div>
                  <span className="text-slate-500 block">اسم المستحق:</span>
                  <span className="text-white block mt-0.5">{selectedItem.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">المعرف الوظيفي:</span>
                  <span className="text-white font-mono block mt-0.5">{selectedItem.id}</span>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="space-y-2.5 font-bold">
                <div className="flex justify-between items-center text-slate-300">
                  <span>الراتب الأساسي:</span>
                  <span className="font-mono text-white">{selectedItem.baseSalary.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>بدل عمل إضافي (Overtime):</span>
                  <span className="font-mono">+{((selectedItem.baseSalary / 176) * 1.5 * selectedItem.overtimeHours).toFixed(1)} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-rose-400">
                  <span>حسميات التأخر والغياب:</span>
                  <span className="font-mono">-{selectedItem.penalties} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-rose-400">
                  <span>خصم ضريبة التأمين الاجتماعي:</span>
                  <span className="font-mono">-(١٠٪) {((selectedItem.baseSalary) * 0.1).toFixed(0)} ر.س</span>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-white text-sm font-black">
                  <span>إجمالي صافي المستحق:</span>
                  <span className="font-mono text-[#E5D4C0]">{selectedItem.netSalary.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-start gap-3 mt-4 text-slate-400 font-semibold leading-relaxed">
                <Clock className="w-5 h-5 text-[#B76E79] shrink-0 mt-0.5" />
                <p className="text-[10px]">
                  تم إصدار مسير الراتب بناء على سجلات الحضور والانصراف الرقمية وبوابات التحقق RFID في الفرع. وفي حال وجود أي اعتراض يرجى تقديم تذكرة دعم فني للمحاسبة قبل الموعد.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { onAddToast('تم تحميل كشف الراتب بهيئة PDF بنجاح.', 'success'); setIsPayslipOpen(false); }}
                className="px-5 py-2.5 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/30 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4 text-[#E5D4C0]" />
                تحميل الكشف كـ PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
