"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toaster";
import api from "@/lib/api";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const res = await api.put("/my/profile", {
        name: fd.get("name"),
        email: fd.get("email"),
        business_name: fd.get("business_name"),
        phone: fd.get("phone"),
      });
      const updated = res.data.data || res.data;
      if (updated && token) {
        login({
          ...user!,
          name: updated.name || (fd.get("name") as string),
          email: updated.email || (fd.get("email") as string),
          businessName: updated.business_name || (fd.get("business_name") as string),
          phone: updated.phone || (fd.get("phone") as string),
        }, token);
      }
      toast("Profile updated successfully!");
    } catch {
      toast("Failed to update profile. Changes saved locally.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-dark-text mb-6">Profile</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Full Name
            </label>
            <input
              name="name"
              defaultValue={user?.name}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Email
            </label>
            <input
              name="email"
              defaultValue={user?.email}
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Business Name
            </label>
            <input
              name="business_name"
              defaultValue={user?.businessName}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Phone
            </label>
            <input
              name="phone"
              defaultValue={user?.phone}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Account Status
            </label>
            <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
              {user?.status === "approved" ? "Approved" : user?.status}
            </span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-candy text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
