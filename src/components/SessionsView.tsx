/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, User, Award, Plus, CheckCircle2, ChevronRight, X, 
  MapPin, Check, Save, Users, AlertCircle, Sparkles
} from 'lucide-react';
import { Coach, Player } from '../types';

interface Session {
  id: string;
  coachName: string;
  sport: string;
  field: string;
  time: string;
  date: string;
  status: 'قادمة' | 'نشطة حالياً' | 'مكتملة';
  branchName: string;
  playersCount: number;
}

interface SessionsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  coachesList: Coach[];
  playersList: Player[];
}

export const SessionsView: React.FC<SessionsViewProps> = ({ 
  onAddToast, coachesList, playersList 
}) => {
  const [sessions, setSessions] = useState<Session[]>([
    { id: 'حصة-1', coachName: 'كابتن أحمد الشمراني', sport: 'كرة القدم للبراعم', field: 'الملعب الخماسي أ', time: '05:00 م - 06:30 م', date: '2026-06-29', status: 'نشطة حالياً', branchName: 'فرع شمال الرياض', playersCount: 15 },
    { id: 'حصة-2', coachName: 'كابتن محمود عسيري', sport: 'السباحة الكلاسيكية', field: 'المسبح الأولمبي المغطى', time: '06:00 م - 07:30 م', date: '2026-06-29', status: 'قادمة', branchName: 'فرع جدة كورنيش', playersCount: 12 },
    { id: 'حصة-3', coachName: 'كابتن فيصل الحربي', sport: 'كرة السلة للمحترفين', field: 'الصالة الرياضية ب', time: '04:00 م - 05:30 م', date: '2026-06-28', status: 'مكتملة', branchName: 'فرع شرق الرياض', playersCount: 10 }
  ]);

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Attendance simulation states for active session details
  const [sessionAttendance, setSessionAttendance] = useState<Record<string, 'حاضر' | 'غائب' | 'متأخر'>>({
    'لاعب-1': 'حاضر',
    'لاعب-2': 'حاضر',
    'لاعب-3': 'غائب',
    'لاعب-4': 'متأخر'
  });
  const [sessionEvaluations, setSessionEvaluations] = useState<Record<string, number>>({
    'لاعب-1': 5,
    'لاعب-2': 4,
    'لاعب-3': 1,
    'لاعب-4': 3
  });
  const [sessionNotes, setSessionNotes] = useState<Record<string, string>>({
    'لاعب-1': 'أداء فني ممتاز ومهارات عالية',
    'لاعب-2': 'حضور متميز والتزام كامل بالتمارين'
  });

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (activeTab === 'today') return s.status === 'نشطة حالياً';
      if (activeTab === 'upcoming') return s.status === 'قادمة';
      return s.status === 'مكتملة';
    });
  }, [sessions, activeTab]);

  const handleOpenDetails = (session: Session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const handleSaveDetails = () => {
    onAddToast('تم تدوين الحضور وتقييم أداء اللاعبين في الحصة التدريبية!', 'success');
    setShowDetails(false);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20">
        <div className="space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">محرك وجدولة الحصص الفنية اليومية</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#E5D4C0]" />
            الحصص التدريبية والمجموعات (Training Sessions)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            متابعة الحصص النشطة والقادمة، تدوين حضور ومشاركة الأبطال، وتقييم أداء اللاعبين من قبل المدربين المعتمدين فورياً.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-3 gap-2 bg-[#1C080B]/40 p-1.5 border border-white/5 rounded-2xl">
        <button
          onClick={() => setActiveTab('today')}
          className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'today' 
              ? 'bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white shadow-xl' 
              : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          حصة نشطة حالياً
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'upcoming' 
              ? 'bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white shadow-xl' 
              : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          الحصص القادمة
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'completed' 
              ? 'bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white shadow-xl' 
              : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          الحصص المؤرشفة والمكتملة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions list */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-extrabold text-white mr-1">قائمة الجلسات التدريبية</h3>
          {filteredSessions.length === 0 ? (
            <div className="p-8 bg-[#1C080B]/20 rounded-2xl border border-white/5 text-center text-xs text-slate-400 font-semibold">
              لا توجد حصص مسجلة في هذا التصنيف حالياً.
            </div>
          ) : (
            filteredSessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleOpenDetails(session)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-right space-y-3 ${
                  selectedSession?.id === session.id
                    ? 'bg-[#5A0B17]/25 border-[#B76E79]/50'
                    : 'bg-[#1C080B]/20 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold">{session.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                    session.status === 'نشطة حالياً' ? 'bg-emerald-500/10 text-emerald-400' :
                    session.status === 'قادمة' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-slate-500/15 text-slate-400'
                  }`}>
                    {session.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-white">{session.sport}</h4>
                  <p className="text-[11px] text-[#E5D4C0] font-semibold mt-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {session.coachName}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-2 font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B76E79]" /> {session.field}
                  </span>
                  <span className="font-mono text-white">{session.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected session details and attendance and evaluations */}
        <div className="lg:col-span-2">
          {showDetails && selectedSession ? (
            <div className="bg-[#1C080B]/30 backdrop-blur-md rounded-3xl border border-[#B76E79]/20 p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">{selectedSession.id}</span>
                  <h3 className="text-md font-black text-white">إجراءات حضور وتقييم الحصة</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">مدرب الحصة: {selectedSession.coachName}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Session Meta Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-bold">
                <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block">الملعب</span>
                  <span className="text-white block mt-1">{selectedSession.field}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block">الفرع الرياضي</span>
                  <span className="text-white block mt-1">{selectedSession.branchName}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block">الوقت المخصص</span>
                  <span className="text-white font-mono block mt-1">{selectedSession.time}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block">اللاعبين بالبرنامج</span>
                  <span className="text-[#E5D4C0] font-mono block mt-1">{selectedSession.playersCount} أبطال</span>
                </div>
              </div>

              {/* Attendance and Evaluation Sheet */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-white flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#E5D4C0]" /> كشف الحضور والغياب والتقييمات الفنية للمدرب
                </h4>

                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {[
                    { id: 'لاعب-1', name: 'يوسف عبد العزيز السالم', level: 'محترف (A+)' },
                    { id: 'لاعب-2', name: 'أحمد فيصل الحربي', level: 'متوسط' },
                    { id: 'لاعب-3', name: 'ريان تركي الأشول', level: 'محترف (A)' },
                    { id: 'لاعب-4', name: 'فهد خالد الزهراني', level: 'مبتدئ' }
                  ].map((player) => (
                    <div key={player.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-right text-xs">
                      <div>
                        <h5 className="font-black text-white">{player.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">مستوى: {player.level}</p>
                      </div>

                      {/* Attendance Selector */}
                      <div className="flex gap-1.5 bg-slate-950/40 p-1 border border-white/5 rounded-xl">
                        {(['حاضر', 'غائب', 'متأخر'] as const).map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setSessionAttendance(prev => ({ ...prev, [player.id]: status }))}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                              sessionAttendance[player.id] === status
                                ? status === 'حاضر' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                  status === 'غائب' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                                  'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      {/* Score Selector (1-5) */}
                      <div className="flex items-center gap-1 bg-slate-950/40 p-1 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-bold ml-1">التقييم:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSessionEvaluations(prev => ({ ...prev, [player.id]: star }))}
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[9px] transition-all ${
                              sessionEvaluations[player.id] >= star
                                ? 'bg-[#E5D4C0] text-slate-950'
                                : 'bg-white/5 text-slate-500 hover:text-white'
                            }`}
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="px-6 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  حفظ الحضور والتقييمات الفنية
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#1C080B]/10 rounded-3xl border border-white/5 p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center justify-center gap-3">
              <AlertCircle className="w-8 h-8 text-[#B76E79]" />
              الرجاء تحديد جلسة تدريبية من القائمة الجانبية لمشاهدة تفاصيلها وتسجيل الحضور والتقييمات الفنية الفورية.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
