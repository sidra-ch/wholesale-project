"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toaster";
import {
  Store,
  Globe,
  Phone,
  Mail,
  MapPin,
  Save,
  Palette,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const LOGO_URL =
  "https://res.cloudinary.com/dfixnhqn0/image/upload/q_auto/f_auto/v1774637471/logo-img_t6qfjg.jpg";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();

  // Store info
  const [storeName, setStoreName] = useState("Arslan Wholesale");
  const [storeEmail, setStoreEmail] = useState("info@arslanwholesale.com");
  const [storePhone, setStorePhone] = useState("+92 347 5175875");
  const [storeAddress, setStoreAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("923475175875");
  const [currency, setCurrency] = useState("USD");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Theme
  const [primaryColor, setPrimaryColor] = useState("#6B4226");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Settings could be loaded from API in the future
  }, []);

  const handleSaveStore = async () => {
    setSaving(true);
    // In production, save via API
    await new Promise((r) => setTimeout(r, 600));
    toast("Store settings saved");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast("Fill in all password fields", "error");
      return;
    }
    if (newPassword.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiUrl}/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast("Failed to change password", "error");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your store configuration
        </p>
      </div>

      {/* Store Information */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-chocolate/10 flex items-center justify-center">
            <Store className="h-5 w-5 text-chocolate" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Store Information</h3>
            <p className="text-xs text-gray-400">Basic store details</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={LOGO_URL}
            alt="Store Logo"
            className="h-16 w-16 rounded-xl object-cover border border-gray-200"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Store Logo</p>
            <p className="text-xs text-gray-400">
              Managed via Cloudinary dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Store Name
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              WhatsApp Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                rows={2}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate resize-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate bg-white"
            >
              <option value="USD">USD ($)</option>
              <option value="PKR">PKR (Rs)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveStore}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-chocolate text-white rounded-xl text-sm font-medium hover:bg-chocolate/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {/* Theme */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Theme</h3>
            <p className="text-xs text-gray-400">Customize appearance</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Primary Color</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-9 w-14 border border-gray-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs text-gray-400 font-mono">
            {primaryColor}
          </span>
        </div>
      </section>

      {/* Password */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Change Password</h3>
            <p className="text-xs text-gray-400">
              Logged in as {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-chocolate"
            />
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          <Lock className="h-4 w-4" />
          {saving ? "Updating..." : "Update Password"}
        </button>
      </section>
    </div>
  );
}
