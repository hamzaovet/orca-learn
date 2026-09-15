"use client";

import { useState, useTransition } from "react";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Crown, 
  GraduationCap, 
  KeyRound, 
  Power, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Lock, 
  UserCheck, 
  UserX,
  Eye,
  EyeOff
} from "lucide-react";
import { toggleUserStatus, updateUserPassword, changeUserRole } from "@/actions/users";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

interface UserItem {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  isActive: boolean;
  createdAt: string | Date;
}

interface UsersTableProps {
  initialUsers: UserItem[];
  currentUserRole: "ADMIN" | "SUPERADMIN";
  currentUserId: string;
}

export default function UsersTable({ initialUsers, currentUserRole, currentUserId }: UsersTableProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [isPending, startTransition] = useTransition();
  const [passwordModalUser, setPasswordModalUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = 
      statusFilter === "ALL" || 
      (statusFilter === "ACTIVE" && u.isActive) || 
      (statusFilter === "INACTIVE" && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (user: UserItem) => {
    if (user.id === currentUserId) {
      toast.error("لا يمكنك تعطيل حسابك الشخصي!");
      return;
    }

    const actionText = user.isActive ? "تعطيل" : "تفعيل";
    confirmToast({
      title: `تأكيد ${actionText} الحساب`,
      message: `هل أنت متأكد من ${actionText} حساب "${user.name || user.username}"؟`,
      confirmText: `نعم، ${actionText}`,
      onConfirm: () => {
        startTransition(async () => {
          const res = await toggleUserStatus(user.id);
          if (res.success) {
            toast.success(res.message || `تم ${actionText} الحساب بنجاح`);
            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, isActive: res.newStatus! } : u))
            );
          } else {
            toast.error(res.error || `فشل ${actionText} الحساب`);
          }
        });
      },
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !newPassword) return;

    if (newPassword.trim().length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updateUserPassword(passwordModalUser.id, newPassword);
      if (res.success) {
        toast.success(res.message || "تم تعديل كلمة المرور بنجاح");
        setPasswordModalUser(null);
        setNewPassword("");
      } else {
        toast.error(res.error || "حدث خطأ أثناء تعديل كلمة المرور");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleChangeRole = (user: UserItem, newRole: "USER" | "ADMIN") => {
    if (currentUserRole !== "SUPERADMIN") return;
    if (user.id === currentUserId) return;

    startTransition(async () => {
      const res = await changeUserRole(user.id, newRole);
      if (res.success) {
        toast.success(res.message || "تم تغيير الصلاحية بنجاح");
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(res.error || "فشل تغيير الصلاحية");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-4 backdrop-blur-xl">
        {/* Search */}
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="بحث بالاسم، اسم المستخدم، أو البريد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-2.5 pr-11 pl-4 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">الرتبة:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="ALL">الكل</option>
            {currentUserRole === "SUPERADMIN" && (
              <option value="SUPERADMIN">سوبر أدمن (المايسترو)</option>
            )}
            <option value="ADMIN">مدير النظام (أدمن)</option>
            <option value="USER">طالب (مستخدم)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">الحالة:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="ALL">الكل</option>
            <option value="ACTIVE">نشط فقط</option>
            <option value="INACTIVE">معطل فقط</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/50 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-white/10 bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">المستخدم</th>
                <th className="px-6 py-4">اسم المستخدم</th>
                <th className="px-6 py-4">الصلاحية</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">تاريخ الانضمام</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    لا يوجد مستخدمين مطابقين للبحث.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentUserId;
                  const isTargetSuper = user.role === "SUPERADMIN";
                  const canManage =
                    currentUserRole === "SUPERADMIN"
                      ? !isSelf
                      : user.role === "USER";

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Name & Email */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-bold text-slate-300">
                            {user.name ? user.name.charAt(0) : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 flex items-center gap-2">
                              {user.name || "مستخدم بدون اسم"}
                              {isSelf && (
                                <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                                  أنت
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{user.email || "بدون بريد"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-cyan-400">
                          {user.username ? `@${user.username}` : "—"}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        {user.role === "SUPERADMIN" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                            <Crown className="h-3.5 w-3.5" />
                            سوبر أدمن
                          </span>
                        )}
                        {user.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-extrabold text-cyan-300">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            مدير النظام
                          </span>
                        )}
                        {user.role === "USER" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-400">
                            <GraduationCap className="h-3.5 w-3.5" />
                            طالب
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            نشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-400 animate-pulse">
                            <XCircle className="h-3 w-3" />
                            معطل
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Change Password Button */}
                          <button
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewPassword("");
                            }}
                            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                            title="تعديل كلمة المرور"
                          >
                            <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                            <span>تعديل الباسوورد</span>
                          </button>

                          {/* Toggle Active/Inactive */}
                          {canManage && (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={isPending}
                              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                user.isActive
                                  ? "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              }`}
                              title={user.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
                            >
                              <Power className="h-3.5 w-3.5" />
                              <span>{user.isActive ? "تعطيل" : "تفعيل"}</span>
                            </button>
                          )}

                          {/* Superadmin Role Change */}
                          {currentUserRole === "SUPERADMIN" && !isSelf && !isTargetSuper && (
                            <button
                              onClick={() =>
                                handleChangeRole(
                                  user,
                                  user.role === "ADMIN" ? "USER" : "ADMIN"
                                )
                              }
                              disabled={isPending}
                              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/10"
                              title={
                                user.role === "ADMIN"
                                  ? "تحويل إلى طالب"
                                  : "ترقية إلى مدير نظام"
                              }
                            >
                              {user.role === "ADMIN" ? (
                                <>
                                  <GraduationCap className="h-3.5 w-3.5" />
                                  <span>تخفيض لطالب</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  <span>ترقية لأدمن</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Change Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B0F19] p-7 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-50">تعديل كلمة المرور</h3>
                <p className="text-xs text-slate-400">
                  للحساب: <span className="font-bold text-cyan-400">{passwordModalUser.name || passwordModalUser.username}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-400">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="أدخل كلمة المرور الجديدة (6 أحرف فأكثر)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#050B14] py-3 pr-11 pl-11 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50"
                >
                  {isUpdatingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>حفظ كلمة المرور</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
