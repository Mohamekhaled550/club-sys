/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Award, Flame, User, Sliders, CheckSquare, Search, Save, 
  ChevronRight, Sparkles, Smile, Star, ClipboardCheck, ArrowUpRight
} from 'lucide-react';
import { Player } from '../types';

interface PerformanceViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ 
  onAddToast, playersList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(playersList[0] || null);

  // Skills simulation state
  const [skills, setSkills] = useState({
    dribbling: 85, // المراوغة والتحكم
    shooting: 75,   // التسديد والدقة
    passing: 80,    // التمرير والتعاون
    stamina: 90,    // اللياقة البدنية والتحمل
    discipline: 95, // الانضباط والروح الرياضية
    speed: 88       // السرعة وردة الفعل
  });

  const [coachNote, setCoachNote] = useState('البطل يقدم أداء تصاعدياً ممتازاً، تم تحسين اللياقة البدنية وتوجيه اللاعب للتمارين الفردية لتقوية التمرير الطويل.');

  const filteredPlayers = useMemo(() => {
    return playersList.filter(p => p.name.includes(searchTerm));
  }, [playersList, searchTerm]);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    // Simulate updating values when switching player
    setSkills({
      dribbling: Math.floor(Math.random() * 30) + 70,
      shooting: Math.floor(Math.random() * 30) + 65,
      passing: Math.floor(Math.random() * 30) + 70,
      stamina: Math.floor(Math.random() * 30) + 70,
      discipline: Math.floor(Math.random() * 20) + 80,
      speed: Math.floor(Math.random() * 30) + 70
    });
    setCoachNote(`أداء فني متميز ومستوى تصاعدي رائع للبطل ${player.name}. يحتاج لمواصلة التركيز والالتزام.`);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast(`تم رصد تقييم الأداء الفني للبطل ${selectedPlayer?.name} بنجاح ومزامنته مع تطبيق ولي الأمر واللاعب فورياً!`, 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20">
        <div className="space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">تقييم الأداء الفني والبدني المتكامل</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#E5D4C0]" />
            تقييمات الأداء والمؤشرات (Performance & Skill Analytics)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            رصد وتقييم القدرات الفنية، والمهارات الحركية، واللياقة البدنية، ومستوى الانضباط والالتزام لكل لاعب لإنشاء الرسوم والخطوط التصاعدية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players Sidebar Search */}
        <div className="lg:col-span-1 bg-[#1C080B]/20 backdrop-blur-md rounded-2xl border border-white/5 p-4 space-y-4 flex flex-col h-[520px]">
          <h3 className="text-xs font-black text-white px-1">البحث واختيار اللاعب</h3>
          
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن لاعب..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-950/40 border border-white/10 text-xs text-white rounded-xl focus:border-[#B76E79] outline-none"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className={`p-3 rounded-xl border cursor-pointer text-right flex items-center justify-between transition-all ${
                  selectedPlayer?.id === player.id
                    ? 'bg-[#5A0B17]/25 border-[#B76E79]/40'
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${player.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{player.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">{player.sport}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Player Evaluations & Metrics */}
        <div className="lg:col-span-2">
          {selectedPlayer ? (
            <form onSubmit={handleSaveEvaluation} className="bg-[#1C080B]/30 backdrop-blur-md border border-[#B76E79]/20 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedPlayer.avatarColor} text-white flex items-center justify-center font-black text-sm shadow-xl`}>
                    {selectedPlayer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{selectedPlayer.name}</h3>
                    <p className="text-[11px] text-[#B76E79] font-bold mt-0.5">العضوية: {selectedPlayer.id} | برنامج {selectedPlayer.sport}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#E5D4C0]/10 text-[#E5D4C0] border border-[#E5D4C0]/20">
                  <Award className="w-3.5 h-3.5" /> تقييم فني نخبة
                </span>
              </div>

              {/* Sliders Grid for 6 core attributes */}
              <div className="space-y-5">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <Sliders className="w-4 h-4 text-[#B76E79]" /> رصد درجات المهارة والقدرات (100)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right text-xs font-bold">
                  {/* Dribbling */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>التحكم بالكرة والمراوغة (Dribbling)</span>
                      <span className="font-mono text-[#E5D4C0]">{skills.dribbling}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.dribbling}
                      onChange={e => setSkills({ ...skills, dribbling: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                    />
                  </div>

                  {/* Shooting */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>التسديد والدقة (Shooting)</span>
                      <span className="font-mono text-[#E5D4C0]">{skills.shooting}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.shooting}
                      onChange={e => setSkills({ ...skills, shooting: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                    />
                  </div>

                  {/* Passing */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>التعاون والتمرير الدقيق (Passing)</span>
                      <span className="font-mono text-[#E5D4C0]">{skills.passing}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.passing}
                      onChange={e => setSkills({ ...skills, passing: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                    />
                  </div>

                  {/* Stamina */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>اللياقة البدنية والتحمل (Stamina)</span>
                      <span className="font-mono text-[#E5D4C0]">{skills.stamina}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.stamina}
                      onChange={e => setSkills({ ...skills, stamina: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                    />
                  </div>

                  {/* Discipline */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>الانضباط والروح الرياضية (Discipline)</span>
                      <span className="font-mono text-[#E5D4C0]">{skills.discipline}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.discipline}
                      onChange={e => setSkills({ ...skills, discipline: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                    />
                  </div>

                  {/* Speed */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>السرعة وسرعة البديهة (Speed)</span>
                      <span className="font-mono text-[#E5D4C0]">{skills.speed}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.speed}
                      onChange={e => setSkills({ ...skills, speed: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                    />
                  </div>
                </div>
              </div>

              {/* Coach text evaluation notes */}
              <div className="space-y-2 text-xs font-bold text-right">
                <label className="text-slate-300 flex items-center gap-1">
                  <ClipboardCheck className="w-4 h-4 text-[#B76E79]" /> تقرير الملاحظات الفنية المفصلة للمدرب
                </label>
                <textarea
                  rows={3}
                  value={coachNote}
                  onChange={e => setCoachNote(e.target.value)}
                  placeholder="اكتب تفاصيل التوجيهات الفنية للاعب وولي أمره..."
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none font-medium leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  حفظ تقرير الأداء ومزامنته
                </button>
              </div>

            </form>
          ) : (
            <div className="bg-[#1C080B]/10 rounded-3xl border border-white/5 p-12 text-center text-xs text-slate-400 font-semibold">
              الرجاء تحديد لاعب من القائمة الجانبية لمشاهدة وتعديل تقييم الأداء والمؤشرات الفنية.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
