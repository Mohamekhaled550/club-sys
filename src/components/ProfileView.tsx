/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, Shield, Mail, Phone, Calendar, Save, Key, 
  CheckCircle2, AlertTriangle, Eye, EyeOff, Sparkles, Sliders
} from 'lucide-react';

interface ProfileViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onAddToast }) => {
  // حالات الملف الشخصي
  const [profile, setProfile] = useState({
    name: "م. خالد سليم البقمي",
    role: "المدير العام للأكاديمية",
    phone: "0543210987",
    email: "khaledsallleeem@gmail.com",
    joinedDate: "2024-01-01",
    bio: "المدير العام والمسؤول الفني الأول عن إدارة الأكاديمية والربط الرياضي وتأسيس العقود والاشتراكات.",
  });

  // حالات تغيير كلمة المرور
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [showPass, setShowPass] = useState(false);

  // حساب قوة كلمة المرور الجديدة
  const passwordStrength = () => {
    const len = passwords.newPass.length;
    if (len === 0) return { label: 'فارغة', width: 'w-0', color: 'bg-slate-200' };
    if (len < 6) return { label: 'ضعيفة', width: 'w-1/3', color: 'bg-rose-500' };
    if (len < 10) return { label: 'متوسطة', width: 'w-2/3', color: 'bg-amber-500' };
    return { label: 'قوية ومؤمنة جداً', width: 'w-full', color: 'bg-indigo-600' };
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast('تم بنجاح حفظ وتحديث بيانات ملفك الشخصي الإداري بنجاح!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      onAddToast('يرجى ملء جميع خانات الأمان لتغيير كلمة المرور!', 'error');
      return;
    }
    if (passwords.newPass.length < 6) {
      onAddToast('يجب أن لا تقل كلمة المرور الجديدة عن 6 أحرف أو أرقام!', 'error');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      onAddToast('تنبيه: كلمة المرور الجديدة وتأكيدها غير متطابقتين!', 'error');
      return;
    }

    onAddToast('تم تعديل وتشفير كلمة المرور الجديدة بنجاح بالأنظمة الحماية!', 'success');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const strength = passwordStrength();

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة والتحكم */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-500" />
          الملف الشخصي وإعدادات أمان حسابك
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          تعديل بيانات ملفك التعريفي الإداري، رقم الهاتف، وإعادة تهيئة وتشفير كلمة المرور الخاصة بك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* القسم الأول: كرت الهوية والملف الشخصي */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800 mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              البيانات التعريفية الأساسية
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl mb-2">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/10">
                  {profile.name.charAt(0)}
                </div>
                <div className="text-center sm:text-right">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{profile.name}</h4>
                  <span className="text-[10px] text-indigo-500 font-bold block">{profile.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">المسمى الإداري والصلاحية *</label>
                  <input
                    type="text"
                    disabled
                    value={profile.role}
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">البريد الإلكتروني المعتمد *</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">رقم هاتف التواصل *</label>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">نبذة تعريفية سريعة</label>
                <textarea
                  value={profile.bio}
                  rows={3}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  حفظ وتحديث الملف الشخصي
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* القسم الثاني: إعادة تعيين وتعديل كلمة المرور (Change Password) */}
        <div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" />
                طبقة الحماية وتشفير كلمة المرور
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                
                <div className="relative">
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">كلمة المرور الحالية *</label>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="اكتب كلمة مرورك الحالية"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl pr-3 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3.5 top-8.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">كلمة المرور الجديدة *</label>
                  <input
                    type="password"
                    required
                    placeholder="اكتب كلمة مرور معقدة وصعبة التخمين"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                  />
                </div>

                {/* مؤشر قوة كلمة المرور */}
                {passwords.newPass && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400">قوة كلمة المرور:</span>
                      <span className={
                        strength.label.includes('قوية') ? 'text-indigo-500' :
                        strength.label.includes('متوسطة') ? 'text-amber-500' : 'text-rose-500'
                      }>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة *</label>
                  <input
                    type="password"
                    required
                    placeholder="أعد كتابة كلمة المرور الجديدة"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-4 h-4" />
                    تشفير واعتماد الكلمة الجديدة
                  </button>
                </div>

              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1 leading-normal">
                <Shield className="w-4 h-4 text-indigo-500" /> يتم تشفير كلمات المرور الثنائية بأسلوب هاش معقد لحمايتك.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
