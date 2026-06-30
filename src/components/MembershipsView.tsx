/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Award, QrCode, Search, Download, Printer, Shield, RefreshCw, X, 
  Check, UserCheck, Smartphone, Eye, CreditCard
} from 'lucide-react';
import { Player } from '../types';
import { handleExportData } from '../data';

interface MembershipsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const MembershipsView: React.FC<MembershipsViewProps> = ({ 
  onAddToast, playersList, setPlayersList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('الكل');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const sportsList = ["الكل", "كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];

  const filteredPlayers = useMemo(() => {
    return playersList.filter(p => {
      const matchSearch = p.name.includes(searchTerm) || p.id.includes(searchTerm) || p.phone.includes(searchTerm);
      const matchSport = selectedSport === 'الكل' || p.sport === selectedSport;
      return matchSearch && matchSport;
    });
  }, [playersList, searchTerm, selectedSport]);

  const handleShowCard = (player: Player) => {
    setSelectedPlayer(player);
    setIsCardModalOpen(true);
  };

  const handleToggleMembershipStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'نشط' ? 'موقف' : 'نشط';
    setPlayersList(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus as any } : p));
    onAddToast(`تم تعديل حالة العضوية بنجاح إلى: ${nextStatus}`, 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20">
        <div className="space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">عضويات وبطاقات اللاعبين المعتمدة</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#E5D4C0]" />
            إدارة بطاقات العضوية والـ QR (Membership Management)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            توليد وتفعيل الكارنيهات الرقمية المعتمدة للاعبين، طباعة الهويات، وإصدار أكواد الـ QR السريعة لبوابات الدخول والـ GPS الذكي.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-[#1C080B]/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="ابحث عن اسم اللاعب أو رقم العضوية..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-950/40 border border-white/10 text-xs text-white rounded-xl focus:border-[#B76E79] outline-none"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <select
            value={selectedSport}
            onChange={e => setSelectedSport(e.target.value)}
            className="px-3.5 py-2 bg-slate-950/40 border border-white/10 text-xs text-slate-300 rounded-xl outline-none"
          >
            {sportsList.map(s => <option key={s} value={s} className="bg-slate-950 text-white">{s}</option>)}
          </select>

          <button
            onClick={() => handleExportData(playersList, 'عضويات-اللاعبين')}
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
                <th className="p-4">رقم العضوية</th>
                <th className="p-4">اللاعب</th>
                <th className="p-4">الرياضة والبرنامج</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">مستوى التدريب</th>
                <th className="p-4">تاريخ الانضمام</th>
                <th className="p-4 text-left">التحكم المعتمد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono font-black text-slate-400">{player.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${player.avatarColor} text-white flex items-center justify-center font-black`}>
                        {player.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white block">{player.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{player.sport}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                      player.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                      player.status === 'منتهي' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                    }`}>
                      {player.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-400">{player.level}</td>
                  <td className="p-4 font-mono text-slate-400">{player.joinDate}</td>
                  <td className="p-4 text-left">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleShowCard(player)}
                        className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-lg font-black transition-all flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        كارنيه العضوية
                      </button>

                      <button
                        onClick={() => handleToggleMembershipStatus(player.id, player.status)}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-black transition-all cursor-pointer ${
                          player.status === 'نشط' 
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20' 
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {player.status === 'نشط' ? 'تجميد' : 'تنشيط'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID Card / QR Generation Modal */}
      {isCardModalOpen && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div className="bg-[#1C080B] border border-[#B76E79]/30 rounded-3xl p-6 max-w-sm w-full text-right space-y-6 animate-fade-in relative">
            <button
              onClick={() => setIsCardModalOpen(false)}
              className="absolute top-5 left-5 p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-2 border-b border-white/5">
              <h3 className="text-md font-black text-white">كارنيه العضوية والرمز السريع</h3>
              <p className="text-xs text-[#B76E79] font-bold">بوابة النخبة لـ Al Ashwal Academy</p>
            </div>

            {/* Simulated Premium NFC/RFID ID Card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#1C080B] via-[#5A0B17] to-slate-950 p-6 border border-[#B76E79]/30 text-right space-y-4 shadow-[0_20px_50px_rgba(90,11,23,0.3)]">
              {/* Card Hologram chip decoration */}
              <div className="flex justify-between items-center">
                <div className="w-10 h-7 bg-gradient-to-br from-amber-400 to-amber-200 rounded-md opacity-70" />
                <span className="text-[10px] text-white font-black tracking-widest font-serif">AL ASHWAL</span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 border border-[#B76E79]/25 flex items-center justify-center text-white text-2xl font-black">
                  {selectedPlayer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">{selectedPlayer.name}</h4>
                  <p className="text-[10px] text-[#E5D4C0] font-bold mt-1">برنامج: {selectedPlayer.sport}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">المستوى: {selectedPlayer.level}</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-3 rounded-xl max-w-[130px] mx-auto shadow-inner flex flex-col items-center">
                {/* Simulated high quality QR code block */}
                <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-[10px] font-black text-center p-1.5 leading-tight select-none">
                  {selectedPlayer.id}
                  <br />
                  SECURE_RFID
                  <br />
                  APPROVED
                </div>
                <span className="text-[8px] text-slate-500 font-bold font-mono mt-1.5">{selectedPlayer.id}</span>
              </div>

              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold border-t border-white/5 pt-3">
                <span>البطاقة مجهزة بتقنية NFC</span>
                <span className="text-[#E5D4C0]">تحديث: ٢٠٢٦/٠٦</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => { onAddToast('جاري طباعة الكارنيه ورقياً للتسليم...', 'info'); }}
                className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                طباعة الكارنيه
              </button>
              <button
                onClick={() => { onAddToast('تم تحميل الكارنيه بهيأة PDF عالي الدقة.', 'success'); }}
                className="py-3 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/30 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#E5D4C0]" />
                تحميل PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
