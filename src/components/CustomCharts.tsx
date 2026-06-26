/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { monthlyFinancials, subscriptionsByType, coachPerformance, bestPlayers } from '../data';

// 1. رسم بياني للإيرادات والمصروفات الشهرية (شريط متكامل تفاعلي)
export const FinancialsChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const maxAmount = Math.max(...monthlyFinancials.map(f => Math.max(f.revenues, f.expenses)));
  
  return (
    <div className="w-full flex flex-col justify-between h-72 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">الإيرادات والمصروفات الشهرية (ريال)</h4>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1 text-indigo-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> الإيرادات
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> المصروفات
          </span>
        </div>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-2">
        {monthlyFinancials.map((item, idx) => {
          const revHeight = (item.revenues / maxAmount) * 100;
          const expHeight = (item.expenses / maxAmount) * 100;
          
          return (
            <div 
              key={idx} 
              className="flex-1 flex flex-col items-center group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="w-full flex justify-center items-end gap-1.5 h-44 relative">
                {/* شريط الإيرادات */}
                <div 
                  style={{ height: `${revHeight}%` }} 
                  className={`w-4 sm:w-6 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-300 ${
                    hoveredIdx === idx ? 'scale-x-110 shadow-lg shadow-indigo-500/20' : 'opacity-90'
                  }`}
                />
                {/* شريط المصروفات */}
                <div 
                  style={{ height: `${expHeight}%` }} 
                  className={`w-4 sm:w-6 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-300 ${
                    hoveredIdx === idx ? 'scale-x-110 shadow-lg shadow-rose-500/20' : 'opacity-90'
                  }`}
                />
                
                {/* نافذة التلميح السريعة */}
                {hoveredIdx === idx && (
                  <div className="absolute bottom-full mb-2 z-20 bg-slate-900 text-white text-[10px] sm:text-xs rounded-lg p-2 shadow-xl border border-slate-700 w-32 text-center transition-all duration-200 pointer-events-none">
                    <p className="font-bold mb-1 border-b border-slate-700 pb-1">{item.name}</p>
                    <p className="text-indigo-400">الإيراد: {item.revenues.toLocaleString()} ر.س</p>
                    <p className="text-rose-400">المصروف: {item.expenses.toLocaleString()} ر.س</p>
                    <p className="text-slate-300 font-semibold mt-1">الربح: {(item.revenues - item.expenses).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-500 mt-2 dark:text-slate-400">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. توزيع الاشتراكات كعكعة دائرية تفاعلية (SVG Donut Chart)
export const SubscriptionsChart: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const totalCount = subscriptionsByType.reduce((sum, item) => sum + item.count, 0);
  
  const colors = ['#3b82f6', '#6366f1', '#a855f7', '#f97316'];
  const glowColors = ['shadow-blue-500/20', 'shadow-indigo-500/20', 'shadow-purple-500/20', 'shadow-orange-500/20'];
  
  return (
    <div className="w-full h-72 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">توزيع الاشتراكات حسب الرياضات</h4>
      
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-4">
        {/* رسم الكعكة باستخدام SVG */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />
            
            {(() => {
              let accumulatedPercent = 0;
              return subscriptionsByType.map((item, idx) => {
                const percent = (item.count / totalCount) * 100;
                const strokeDasharray = `${percent} ${100 - percent}`;
                const strokeDashoffset = 100 - accumulatedPercent;
                accumulatedPercent += percent;
                
                const isFocused = activeIndex === idx;
                
                return (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={colors[idx]}
                    strokeWidth={isFocused ? "5.5" : "4.5"}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                );
              });
            })()}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400">إجمالي الباقات</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">{totalCount}</span>
          </div>
        </div>
        
        {/* أسماء الباقات ومفاتيح الألوان */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          {subscriptionsByType.map((item, idx) => {
            const percent = ((item.count / totalCount) * 100).toFixed(1);
            const isFocused = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between gap-4 p-1.5 rounded-lg transition-all ${
                  isFocused ? 'bg-slate-50 dark:bg-slate-800/50 scale-105' : ''
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colors[idx] }} />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-white">
                  {item.count} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 3. حضور اللاعبين والموظفين (مخطط خطي SVG تفاعلي)
export const AttendanceLineChart: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  
  // بيانات الأيام السبعة الماضية
  const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
  const playersRate = [88, 92, 85, 94, 91, 78, 82];
  const staffRate = [95, 98, 96, 95, 97, 90, 85];
  
  // نقاط الـ SVG
  const getPoints = (rates: number[]) => {
    return rates.map((rate, idx) => {
      const x = 10 + idx * 45;
      const y = 90 - (rate - 50) * 1.6; // مقياس من 50% إلى 100%
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full h-72 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">نسبة الحضور الأسبوعية (%)</h4>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1 text-blue-600 font-semibold">
            <span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span> اللاعبين
          </span>
          <span className="flex items-center gap-1 text-purple-600 font-semibold">
            <span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span> الكادر
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center p-2">
        <svg viewBox="0 0 300 100" className="w-full h-44 overflow-visible">
          {/* خطوط الشبكة */}
          <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <line x1="0" y1="90" x2="300" y2="90" stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-800" />
          
          {/* خط حضور اللاعبين */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            points={getPoints(playersRate)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* خط حضور الموظفين */}
          <polyline
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.5"
            points={getPoints(staffRate)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* نقاط تفاعلية */}
          {days.map((day, idx) => {
            const px = 10 + idx * 45;
            const pyPlayers = 90 - (playersRate[idx] - 50) * 1.6;
            const pyStaff = 90 - (staffRate[idx] - 50) * 1.6;
            const isHovered = hoveredDay === idx;
            
            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredDay(idx)} onMouseLeave={() => setHoveredDay(null)}>
                <circle cx={px} cy={pyPlayers} r={isHovered ? 4.5 : 3} fill="#3b82f6" stroke="#fff" strokeWidth="1" className="transition-all duration-200" />
                <circle cx={px} cy={pyStaff} r={isHovered ? 4.5 : 3} fill="#a855f7" stroke="#fff" strokeWidth="1" className="transition-all duration-200" />
                
                {/* أعمدة تظليل تفاعلية */}
                <rect x={px - 15} y="0" width="30" height="100" fill="transparent" />
                
                {/* تلميحات أرقام فوق العمود الفعال */}
                {isHovered && (
                  <foreignObject x={px - 45} y="-10" width="90" height="90" className="overflow-visible z-30">
                    <div className="bg-slate-950 text-white rounded p-1.5 text-[8px] sm:text-[9px] border border-slate-800 shadow-xl leading-tight text-center">
                      <p className="font-bold border-b border-slate-800 pb-0.5 mb-1">{day}</p>
                      <p className="text-blue-400">اللاعبين: {playersRate[idx]}%</p>
                      <p className="text-purple-400">الكادر: {staffRate[idx]}%</p>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* أسماء الأيام */}
      <div className="flex justify-between px-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2">
        {days.map((day, i) => (
          <span key={i} className={`w-10 text-center transition-all ${hoveredDay === i ? 'text-slate-900 dark:text-white font-extrabold scale-110' : ''}`}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

// 4. أفضل المدربين تقييماً (أشرطة أفقية تفاعلية)
export const CoachesPerformanceChart: React.FC = () => {
  return (
    <div className="w-full h-72 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">أفضل المدربين أداءً وتقييماً</h4>
      
      <div className="flex-1 flex flex-col justify-around">
        {coachPerformance.map((coach, idx) => {
          // نسبة التقييم من 5
          const percent = (coach.rate / 5) * 100;
          return (
            <div key={idx} className="flex flex-col gap-1 group">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors">
                  {coach.name} <span className="text-[10px] font-normal text-slate-400">({coach.sport})</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{coach.rate} / 5</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${percent}%` }} 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500 group-hover:from-indigo-400 group-hover:to-blue-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. أفضل اللاعبين تفوقاً ونقاطاً (تصنيف بأسلوب رائع)
export const BestPlayersChart: React.FC = () => {
  return (
    <div className="w-full h-72 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">أفضل اللاعبين تفوقاً والتزاماً</h4>
      
      <div className="flex-1 flex flex-col justify-around gap-2">
        {bestPlayers.map((player, idx) => {
          return (
            <div key={idx} className="flex items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200">
              {/* الترتيب */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs ${
                idx === 0 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                idx === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300' :
                idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {idx + 1}
              </div>
              
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{player.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{player.sport}</span>
              </div>
              
              {/* التقييم */}
              <div className="flex flex-col items-end">
                <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">{player.score} نقطة</span>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, starI) => (
                    <span 
                      key={starI} 
                      className={`text-[9px] ${
                        starI < (idx === 0 ? 5 : idx === 1 ? 4 : 4) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
