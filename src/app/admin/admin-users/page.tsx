"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Shield, Plus, Search, Eye, Trash2, X, Edit2,
  ChevronLeft, ChevronRight, Users, Key,
} from "lucide-react";
import {
  fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser,
  fetchRoles, createRole, updateRole, deleteRole, fetchPermissions,
} from "@/lib/admin-api";

interface Role { id: number; slug: string; name: string; description: string | null; permissions?: Permission[] }
interface Permission { id: number; slug: string; name: string; module: string }
interface AdminUser { id: number; name: string; email: string; phone: string | null; role: string; roles?: Role[]; createdAt: string }

export default function AdminUsersPage() {
  const [tab, setTab] = useState<"users" | "roles">("users");

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [uLoading, setULoading] = useState(true);
  const [uSearch, setUSearch] = useState("");
  const [uPage, setUPage] = useState(1);
  const [uLastPage, setULastPage] = useState(1);
  const [uTotal, setUTotal] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);

  // Roles
  const [roles, setRoles] = useState<Role[]>([]);
  const [rLoading, setRLoading] = useState(true);
  const [allPerms, setAllPerms] = useState<Permission[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRoleConfirm, setDeleteRoleConfirm] = useState<Role | null>(null);

  // Forms
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoles, setFormRoles] = useState<number[]>([]);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [rolePerms, setRolePerms] = useState<number[]>([]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = useCallback(async () => {
    setULoading(true);
    try {
      const res = await fetchAdminUsers({ search: uSearch, page: uPage, perPage: 15 });
      const list = Array.isArray(res) ? res : (res.data ?? []);
      setUsers(list);
      setULastPage(res.lastPage || res.last_page || 1);
      setUTotal(Array.isArray(res) ? list.length : (res.total ?? 0));
    } catch { showToast("error", "Failed to load users"); }
    setULoading(false);
  }, [uSearch, uPage]);

  const loadRoles = useCallback(async () => {
    setRLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([fetchRoles(), fetchPermissions()]);
      setRoles(rolesRes);
      setAllPerms(permsRes);
    } catch { showToast("error", "Failed to load roles"); }
    setRLoading(false);
  }, []);

  useEffect(() => { if (tab === "users") loadUsers(); }, [tab, loadUsers]);
  useEffect(() => { if (tab === "roles") loadRoles(); }, [tab, loadRoles]);

  // Load roles for user form dropdown
  useEffect(() => { if (showUserModal && roles.length === 0) fetchRoles().then(setRoles).catch(() => {}); }, [showUserModal]);

  const openCreateUser = () => {
    setEditUser(null);
    setFormName(""); setFormEmail(""); setFormPhone(""); setFormPassword(""); setFormRoles([]);
    setShowUserModal(true);
  };

  const openEditUser = (u: AdminUser) => {
    setEditUser(u);
    setFormName(u.name); setFormEmail(u.email); setFormPhone(u.phone || ""); setFormPassword("");
    setFormRoles(u.roles?.map((r) => r.id) || []);
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!formName || !formEmail) { showToast("error", "Name and email required"); return; }
    if (!editUser && !formPassword) { showToast("error", "Password required for new user"); return; }
    setSaving(true);
    try {
      const data: Record<string, unknown> = { name: formName, email: formEmail, phone: formPhone || null, roles: formRoles };
      if (formPassword) data.password = formPassword;
      if (editUser) await updateAdminUser(editUser.id, data);
      else await createAdminUser({ ...data, password: formPassword });
      showToast("success", editUser ? "User updated" : "User created");
      setShowUserModal(false);
      loadUsers();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save");
    }
    setSaving(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteAdminUser(deleteConfirm.id);
      showToast("success", "User deleted");
      setDeleteConfirm(null);
      loadUsers();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete");
      setDeleteConfirm(null);
    }
  };

  const openCreateRole = () => {
    setEditRole(null);
    setRoleName(""); setRoleDesc(""); setRolePerms([]);
    setShowRoleModal(true);
  };

  const openEditRole = (r: Role) => {
    setEditRole(r);
    setRoleName(r.name); setRoleDesc(r.description || "");
    setRolePerms(r.permissions?.map((p) => p.id) || []);
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!roleName) { showToast("error", "Role name required"); return; }
    setSaving(true);
    try {
      const data = { name: roleName, description: roleDesc || null, permissions: rolePerms };
      if (editRole) await updateRole(editRole.id, data);
      else await createRole(data);
      showToast("success", editRole ? "Role updated" : "Role created");
      setShowRoleModal(false);
      loadRoles();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save");
    }
    setSaving(false);
  };

  const handleDeleteRole = async () => {
    if (!deleteRoleConfirm) return;
    try {
      await deleteRole(deleteRoleConfirm.id);
      showToast("success", "Role deleted");
      setDeleteRoleConfirm(null);
      loadRoles();
    } catch (e: unknown) {
      showToast("error", (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete");
      setDeleteRoleConfirm(null);
    }
  };

  const togglePerm = (id: number) => setRolePerms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  const toggleRole = (id: number) => setFormRoles((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);

  const permModules = [...new Set(allPerms.map((p) => p.module))];

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#3B82F6]" /> Admin Users & Roles
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage admin access and permissions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "users" ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25" : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300"}`}>
            <Users className="h-4 w-4 inline mr-1" /> Users
          </button>
          <button onClick={() => setTab("roles")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === "roles" ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25" : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300"}`}>
            <Key className="h-4 w-4 inline mr-1" /> Roles
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={uSearch} onChange={(e) => { setUSearch(e.target.value); setUPage(1); }}
                placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none" />
            </div>
            <button onClick={openCreateUser} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/25">
              <Plus className="h-4 w-4" /> Add Admin
            </button>
          </div>

          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
            {uLoading ? (
              <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-gray-200 dark:border-white/10 border-t-[#3B82F6] rounded-full animate-spin" /></div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No admin users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                      <th className="text-left py-3 px-5 font-medium text-gray-400 text-xs uppercase">Name</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-400 text-xs uppercase hidden sm:table-cell">Email</th>
                      <th className="text-left py-3 px-3 font-medium text-gray-400 text-xs uppercase">Roles</th>
                      <th className="text-center py-3 px-3 font-medium text-gray-400 text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold text-xs">{u.name.charAt(0).toUpperCase()}</div>
                            <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-gray-500 hidden sm:table-cell">{u.email}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {u.roles?.map((r) => (
                              <span key={r.id} className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded text-[11px] font-semibold">{r.name}</span>
                            )) || <span className="text-gray-400 text-xs">No roles</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => openEditUser(u)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-[#3B82F6]"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => setDeleteConfirm(u)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {uLastPage > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.06]">
                <span className="text-xs text-gray-400">Page {uPage} of {uLastPage} ({uTotal} users)</span>
                <div className="flex gap-1">
                  <button disabled={uPage <= 1} onClick={() => setUPage(uPage - 1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
                  <button disabled={uPage >= uLastPage} onClick={() => setUPage(uPage + 1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Roles Tab */}
      {tab === "roles" && (
        <>
          <div className="flex justify-end">
            <button onClick={openCreateRole} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/25">
              <Plus className="h-4 w-4" /> Add Role
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rLoading ? (
              <div className="col-span-full flex justify-center py-20"><div className="w-8 h-8 border-[3px] border-gray-200 dark:border-white/10 border-t-[#3B82F6] rounded-full animate-spin" /></div>
            ) : roles.map((r) => (
              <div key={r.id} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{r.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{r.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditRole(r)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-[#3B82F6]"><Edit2 className="h-3.5 w-3.5" /></button>
                    {r.slug !== "super-admin" && (
                      <button onClick={() => setDeleteRoleConfirm(r)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                </div>
                {r.description && <p className="text-xs text-gray-500 mb-3">{r.description}</p>}
                <div className="flex flex-wrap gap-1">
                  {r.permissions?.slice(0, 6).map((p) => (
                    <span key={p.id} className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 rounded text-[10px]">{p.name}</span>
                  ))}
                  {(r.permissions?.length || 0) > 6 && <span className="px-1.5 py-0.5 text-[10px] text-gray-400">+{(r.permissions?.length || 0) - 6} more</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowUserModal(false)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editUser ? "Edit Admin" : "Add Admin"}</h2>
              <button onClick={() => setShowUserModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label>
                <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Password {editUser ? "(leave blank to keep)" : "*"}</label>
                <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Roles</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button key={r.id} onClick={() => toggleRole(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        formRoles.includes(r.id) ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "border-gray-200 dark:border-white/[0.06] text-gray-500"
                      }`}>{r.name}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button disabled={saving} onClick={handleSaveUser}
                className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] disabled:opacity-50">
                {saving ? "Saving..." : editUser ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRoleModal(false)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editRole ? "Edit Role" : "Add Role"}</h2>
              <button onClick={() => setShowRoleModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
                <input value={roleName} onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <input value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Permissions</label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {permModules.map((mod) => (
                    <div key={mod}>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">{mod}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {allPerms.filter((p) => p.module === mod).map((p) => (
                          <button key={p.id} onClick={() => togglePerm(p.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                              rolePerms.includes(p.id) ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 dark:border-white/[0.06] text-gray-500"
                            }`}>{p.name}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRoleModal(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button disabled={saving} onClick={handleSaveRole}
                className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] disabled:opacity-50">
                {saving ? "Saving..." : editRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Admin User</h3>
            <p className="text-sm text-gray-500 mb-6">Delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button onClick={handleDeleteUser} className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Confirm */}
      {deleteRoleConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteRoleConfirm(null)}>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Role</h3>
            <p className="text-sm text-gray-500 mb-6">Delete <strong>{deleteRoleConfirm.name}</strong> role? Users with this role will lose associated permissions.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteRoleConfirm(null)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm font-medium">Cancel</button>
              <button onClick={handleDeleteRole} className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
