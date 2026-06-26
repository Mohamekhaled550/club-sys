/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, 
  Trash2, Eye, UserPlus, Phone, Calendar, UserCheck, ShieldAlert,
  SlidersHorizontal, CheckCircle2, X, Users, Image as ImageIcon,
  Shield, CreditCard, Award, FileText, Activity, Clock, BadgeDollarSign, MapPin
} from 'lucide-react';
import { Player } from '../types';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface PlayersViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const PlayersView: React.FC<PlayersViewProps> = ({ 
  onAddToast, playersList, setPlayersList 
}) => {
  // حالات البحث والفرز والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'age'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // حالة التحميل المصطنعة لإبراز الـ Skeleton Loading
  const [loading, setLoading] = useState(false);
  
  // حالة الصفحة الحالية والعدد في كل صفحة
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // الحوار المفتوح للإضافة والتفاصيل
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Tab within Player profile details modal
  const [profileTab, setProfileTab] = useState<'info' | 'parent' | 'subscription' | 'files' | 'injuries' | 'history'>('info');

  // نموذج اللاعب الجديد
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    sport: 'كرة القدم',
    age: '15',
    level: 'مبتدئ',
    phone: '',
    status: 'نشط' as 'نشط' | 'موقف' | 'منتهي',
    joinDate: new Date().toISOString().split('T')[0],
  });

  // الرياضات والخيارات المتاحة للفلترة
  const sports = ["الكل", "كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];

  // دالة تشغيل التحميل السريع لمحاكاة استجابة الشبكة
  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleSportFilter = (sport: string) => {
    setSelectedSport(sport);
    setCurrentPage(1);
    triggerLoading();
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    triggerLoading();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleSort = (field: 'name' | 'joinDate' | 'age') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    triggerLoading();
  };

  // تصفية وفرز البيانات المشتقة
  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...playersList];

    // 1. البحث
    if (searchTerm.trim() !== '') {
      result = result.filter(player => 
        player.name.includes(searchTerm) || 
        player.id.includes(searchTerm) ||
        player.phone.includes(searchTerm)
      );
    }

    // 2. فلترة اللعبة
    if (selectedSport !== 'الكل') {
      result = result.filter(player => player.sport === selectedSport);
    }

    // 3. فلترة الحالة
    if (selectedStatus !== 'الكل') {
      result = result.filter(player => player.status === selectedStatus);
    }

    // 4. الفرز
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'ar');
      } else if (sortBy === 'age') {
        comparison = a.age - b.age;
      } else if (sortBy === 'joinDate') {
        comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [playersList, searchTerm, selectedSport, selectedStatus, sortBy, sortOrder]);

  const totalItems = filteredAndSortedPlayers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = useMemo(() => {
    return filteredAndSortedPlayers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPlayers, startIndex]);

  // إضافة لاعب جديد
  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name.trim() || !newPlayer.phone.trim()) {
      onAddToast('يرجى ملء جميع الحقول المطلوبة!', 'error');
      return;
    }

    const randomColor = ["bg-indigo-600", "bg-blue-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600"][Math.floor(Math.random() * 5)];
    const createdPlayer: Player = {
      id: `لاعب-${playersList.length + 1}`,
      name: newPlayer.name,
      sport: newPlayer.sport,
      age: parseInt(newPlayer.age) || 15,
      level: newPlayer.level as 'مبتدئ' | 'متوسط' | 'محترف',
      status: newPlayer.status as 'نشط' | 'موقف' | 'منتهي',
      phone: newPlayer.phone,
      joinDate: newPlayer.joinDate,
      avatarColor: randomColor,
      parentId: `ولي أمر-${Math.floor(Math.random() * 50) + 1}`,
      coachId: `مدرب-${Math.floor(Math.random() * 20) + 1}`,
      groupName: `مجموعة ${newPlayer.sport} - فئة أ`,
      notes: ['تم تسجيل العضوية المبدئية والاشتراك النشط في اللعبة بنجام.'],
      files: [{ name: "الهوية الوطنية وصورة القيد", date: newPlayer.joinDate, size: "1.2 MB" }],
      injuries: [],
      attendance: [{ date: newPlayer.joinDate, status: 'حاضر' }],
      payments: [{ id: `دفع-${Math.random().toString(36).substring(2, 7)}`, amount: 450, date: newPlayer.joinDate, type: 'رسوم عضوية', status: 'مكتمل' }],
      timeline: [{ title: 'تأسيس الحساب وتسجيل البيانات', date: newPlayer.joinDate, description: 'تم إنشاء ملف اللاعب لأول مرة وربطه بالمدرب المعتمد.', type: 'سجل' }]
    };

    setPlayersList(prev => [createdPlayer, ...prev]);
    setIsAddModalOpen(false);
    onAddToast(`تم تسجيل اللاعب "${newPlayer.name}" بنجاح في باقة ${newPlayer.sport}!`, 'success');
    
    setNewPlayer({
      name: '',
      sport: 'كرة القدم',
      age: '15',
      level: 'مبتدئ',
      phone: '',
      status: 'نشط',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeletePlayer = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في إلغاء تسجيل وحذف اللاعب: ${name}؟`)) {
      setPlayersList(prev => prev.filter(p => p.id !== id));
      onAddToast(`تم شطب ملف اللاعب "${name}" وحذفه من النظام نهائياً.`, 'success');
      if (selectedPlayer?.id === id) {
        setSelectedPlayer(null);
      }
    }
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. قسم التحكم العلوي وأزرار الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            شؤون اللاعبين وعقود الاشتراك
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            إدارة كاملة للمشتركين واللاعبين بالأكاديمية الرياضية. ابحث، صنف، أضف، وشطب السجلات.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
        >
          <UserPlus className="w-4 h-4" />
          تسجيل لاعب جديد
        </button>
      </div>

      {/* 2. شريط البحث والفرز والفلترة الفعال */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* خانة البحث الفوري */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث بالاسم، الرقم التعريفي، أو الهاتف..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        {/* تصفية الرياضات */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <select
            value={selectedSport}
            onChange={(e) => handleSportFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            {sports.map((sport, i) => (
              <option key={i} value={sport}>{sport === 'الكل' ? 'كل الرياضات' : sport}</option>
            ))}
          </select>
        </div>

        {/* تصفية الحالات */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">جميع الحالات</option>
            <option value="نشط">نشط فقط</option>
            <option value="موقف">موقف مؤقتاً</option>
            <option value="منتهي">الاشتراكات المنتهية</option>
          </select>
        </div>

      </div>

      {/* 3. عرض جدول اللاعبين مع Skeleton loading وحالة الـ Empty */}
      {loading ? (
        <TableSkeleton rows={10} />
      ) : filteredAndSortedPlayers.length === 0 ? (
        <EmptyState 
          title="لا يوجد أي لاعبين يطابقون خياراتك" 
          description="تأكد من كتابة الاسم الصحيح، أو قم بتغيير الفلاتر النشطة لمحرك البحث للوصول للنتائج المطلوبة." 
          actionText="إعادة تعيين البحث والفلترة"
          onAction={() => {
            setSearchTerm('');
            setSelectedSport('الكل');
            setSelectedStatus('الكل');
            triggerLoading();
          }}
          type="search"
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4">الرقم التعريفي</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200">
                      الاسم الكامل
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">اللعبة الرياضية</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('age')}>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200">
                      العمر
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">المستوى الفني</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('joinDate')}>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200">
                      تاريخ الاشتراك
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">حالة الاشتراك</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {paginatedPlayers.map((player) => {
                  return (
                    <tr key={player.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-400">{player.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${player.avatarColor}`}>
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{player.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[11px] text-slate-600 dark:text-slate-300">
                          {player.sport}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold">{player.age} سنة</td>
                      <td className="p-4 text-slate-500 font-semibold">{player.level}</td>
                      <td className="p-4 font-mono text-slate-500">{player.phone}</td>
                      <td className="p-4 font-mono text-slate-400">{player.joinDate}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          player.status === 'نشط' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                            : player.status === 'موقف'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            player.status === 'نشط' ? 'bg-emerald-500' : player.status === 'موقف' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></span>
                          {player.status === 'نشط' ? 'نشط' : player.status === 'موقف' ? 'موقف' : 'منتهي'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setProfileTab('info'); setSelectedPlayer(player); }}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.id, player.name)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ترقيم الصفحات النشط (Pagination) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">
              عرض <strong className="text-slate-700 dark:text-slate-200">{startIndex + 1}</strong> إلى{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </strong>{' '}
              من أصل <strong className="text-slate-700 dark:text-slate-200">{totalItems}</strong> لاعب مسجل
            </span>

            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* أرقام الصفحات الذكية */}
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(pageNum); triggerLoading(); }}
                    className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${
                      currentPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => prev + 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 4. حوار إضافة لاعب جديد (Add Player Dialog Modal) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-fade-in text-right">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <UserPlus className="w-5 h-5 text-indigo-500" />
              تسجيل لاعب وعقد اشتراك جديد
            </h3>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الاسم الكامل للاعب *</label>
                <input
                  type="text"
                  required
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  placeholder="مثال: يوسف خالد الشريف"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الرياضة المشترك بها</label>
                  <select
                    value={newPlayer.sport}
                    onChange={(e) => setNewPlayer({ ...newPlayer, sport: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {sports.slice(1).map((sport, idx) => (
                      <option key={idx} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">عمر اللاعب (سنوات)</label>
                  <input
                    type="number"
                    min="4"
                    max="60"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">المستوى الحالي</label>
                  <select
                    value={newPlayer.level}
                    onChange={(e) => setNewPlayer({ ...newPlayer, level: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                  >
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="محترف">محترف</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">رقم هاتف التواصل *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={newPlayer.phone}
                    onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-left font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">تاريخ بدء الاشتراك</label>
                  <input
                    type="date"
                    value={newPlayer.joinDate}
                    onChange={(e) => setNewPlayer({ ...newPlayer, joinDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الحالة المبدئية</label>
                  <select
                    value={newPlayer.status}
                    onChange={(e) => setNewPlayer({ ...newPlayer, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="نشط">نشط</option>
                    <option value="موقف">موقف</option>
                    <option value="منتهي">منتهي</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 shadow-indigo-600/10"
                >
                  حفظ وتسجيل اللاعب
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. حوار تفاصيل اللاعب الشامل (Comprehensive Tabbed Profile Modal) */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header / Main Bio */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black ${selectedPlayer.avatarColor}`}>
                {selectedPlayer.name.charAt(0)}
              </div>
              <div className="text-center sm:text-right space-y-1">
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {selectedPlayer.name}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    selectedPlayer.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {selectedPlayer.status}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold">كود العضوية بالأكاديمية: {selectedPlayer.id} • الرياضة: {selectedPlayer.sport}</p>
              </div>
            </div>

            {/* Profile Navigation Tabs (Specific user requests integrated here) */}
            <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-2xl mb-4">
              <button onClick={() => setProfileTab('info')} className={`flex-1 py-2 text-center rounded-xl font-black ${profileTab === 'info' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow' : 'text-slate-400'}`}>
                الملف والمهارات
              </button>
              <button onClick={() => setProfileTab('parent')} className={`flex-1 py-2 text-center rounded-xl font-black ${profileTab === 'parent' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow' : 'text-slate-400'}`}>
                ولي الأمر
              </button>
              <button onClick={() => setProfileTab('subscription')} className={`flex-1 py-2 text-center rounded-xl font-black ${profileTab === 'subscription' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow' : 'text-slate-400'}`}>
                الاشتراك والمجموعة
              </button>
              <button onClick={() => setProfileTab('files')} className={`flex-1 py-2 text-center rounded-xl font-black ${profileTab === 'files' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow' : 'text-slate-400'}`}>
                الملاحظات والملفات
              </button>
              <button onClick={() => setProfileTab('injuries')} className={`flex-1 py-2 text-center rounded-xl font-black ${profileTab === 'injuries' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow' : 'text-slate-400'}`}>
                الإصابات
              </button>
              <button onClick={() => setProfileTab('history')} className={`flex-1 py-2 text-center rounded-xl font-black ${profileTab === 'history' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow' : 'text-slate-400'}`}>
                الحضور والتايملاين
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-4">
              {profileTab === 'info' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">البيانات الفنية الأساسية</p>
                    <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <p>المستوى الحالي: <b>{selectedPlayer.level}</b></p>
                      <p>العمر: <b>{selectedPlayer.age} سنة</b></p>
                      <p>رقم الجوال: <b>{selectedPlayer.phone}</b></p>
                      <p>تاريخ الانضمام: <b>{selectedPlayer.joinDate}</b></p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">الصور الفوتوغرافية الرسمية</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold text-center">الحد الأقصى للصور المرفوعة: 2 صورتين ملونتين رسميتين</p>
                  </div>
                </div>
              )}

              {profileTab === 'parent' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">بيانات ولي الأمر الكفيل</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="text-slate-400">الاسم الكامل لولي الأمر:</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">سليمان خالد الشريف</p>
                    </div>
                    <div>
                      <span className="text-slate-400">صلة القرابة:</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">الأب / ولي الأمر الرئيسي</p>
                    </div>
                    <div>
                      <span className="text-slate-400">هاتف الطوارئ والتواصل:</span>
                      <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">0542387192</p>
                    </div>
                    <div>
                      <span className="text-slate-400">البريد الإلكتروني:</span>
                      <p className="font-mono text-slate-800 dark:text-slate-100 mt-0.5">soliman@gmail.com</p>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'subscription' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-extrabold">باقة الاشتراك النشطة</span>
                    </div>
                    <p className="text-[11px]">الباقة الحالية: <b>باقة السباحة الذهبية (ربع سنوي)</b></p>
                    <p className="text-[11px]">رسوم الباقة: <b>850 ريال سعودي / 3 شهور</b></p>
                    <p className="text-[11px] text-emerald-600">تاريخ انتهاء الصلاحية: <b>2026-09-15</b></p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Award className="w-4 h-4" />
                      <span className="font-extrabold">المجموعة والمدرب الفني</span>
                    </div>
                    <p className="text-[11px]">المجموعة التدريبية: <b>فئة البراعم والموهوبين أ</b></p>
                    <p className="text-[11px]">المدرب الفني المباشر: <b>الكابتن يوسف الغامدي</b></p>
                    <p className="text-[11px]">موقع التدريب: <b>الصالة المغلقة أ والمسبح الدافئ</b></p>
                  </div>
                </div>
              )}

              {profileTab === 'files' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <FileText className="w-4 h-4" />
                      <span className="font-extrabold">الملاحظات الفنية والإدارية</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4 pr-1">
                      <li>تطور ملحوظ في الأداء البدني والتحمل خلال حصة الكارديو.</li>
                      <li>يحتاج إلى تحسين مهارات التوازن الأساسية في التمرير السريع.</li>
                      <li>حضور متميز وملتزم بالتوجيهات الفنية طوال فترة الإعداد والتدريب.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-1">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200">الملفات والمستندات المرفقة</p>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg text-[10px]">
                      <span>بطاقة الهوية الوطنية للمشترك.pdf</span>
                      <span className="text-emerald-500 font-bold">معتمد ومؤكد</span>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'injuries' && (
                <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Activity className="w-4 h-4" />
                    <p className="font-extrabold text-xs">التاريخ الصحي والإصابات الحالية</p>
                  </div>
                  <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-2">
                    <li className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl">
                      <div>
                        <p className="font-black text-slate-900 dark:text-slate-50">إلتواء خفيف في مفصل الكاحل الأيمن</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">تاريخ الحدوث: 2026-05-10 • خلال تدريب السرعات</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded">شُفي بالكامل</span>
                    </li>
                    <li className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl">
                      <div>
                        <p className="font-black text-slate-900 dark:text-slate-50">إجهاد في عضلات الفخذ الخلفية</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">تاريخ الحدوث: 2026-06-12 • خضع للعلاج الطبيعي</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded">مرحلة التأهيل</span>
                    </li>
                  </ul>
                </div>
              )}

              {profileTab === 'history' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-extrabold">سجل الحضور والغياب الأخير</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between p-1 bg-white dark:bg-slate-800 rounded">
                        <span>2026-06-25</span>
                        <span className="text-emerald-500 font-bold">حاضر (يدوي)</span>
                      </div>
                      <div className="flex justify-between p-1 bg-white dark:bg-slate-800 rounded">
                        <span>2026-06-23</span>
                        <span className="text-emerald-500 font-bold">حاضر (QR)</span>
                      </div>
                      <div className="flex justify-between p-1 bg-white dark:bg-slate-800 rounded">
                        <span>2026-06-20</span>
                        <span className="text-rose-500 font-bold">غائب بعذر</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Activity className="w-4 h-4" />
                      <span className="font-extrabold">التايملاين والتاريخ الزمني</span>
                    </div>
                    <div className="relative border-r border-slate-200 dark:border-slate-800 pr-4 space-y-3.5 text-[10px]">
                      <div className="relative">
                        <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
                        <p className="font-black text-slate-900 dark:text-slate-100">تم تجديد الاشتراك ربع سنوي</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">2026-06-15 بواسطة نظام الحسابات</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="font-black text-slate-900 dark:text-slate-100">ترقية اللاعب لمستوى "متوسط"</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">2026-05-20 بواسطة الكابتن يوسف</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const nextStatus = selectedPlayer.status === 'نشط' ? 'موقف' : 'نشط';
                  setPlayersList(prev => prev.map(p => p.id === selectedPlayer.id ? { ...p, status: nextStatus } : p));
                  setSelectedPlayer(null);
                  onAddToast(`تم تغيير حالة اشتراك اللاعب إلى: ${nextStatus === 'نشط' ? 'نشط' : 'موقف'}`, 'success');
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white hover:bg-indigo-600 rounded-xl font-bold cursor-pointer text-center transition-all"
              >
                {selectedPlayer.status === 'نشط' ? 'تجميد وتعليق الاشتراك مؤقتاً' : 'تنشيط وإعادة العقد الفورية'}
              </button>
              
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold cursor-pointer hover:bg-slate-200 transition-all text-center"
              >
                إغلاق النافذة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
