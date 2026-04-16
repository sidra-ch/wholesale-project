"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toaster";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold text-dark-text mb-6">Profile</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast("Profile updated successfully!");
          }}
          className="space-y-5 max-w-xl"
        >
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Full Name
            </label>
            <input
              defaultValue={user?.name}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Email
            </label>
            <input
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
              defaultValue={user?.businessName}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-chocolate"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-text mb-1.5 block">
              Phone
            </label>
            <input
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
            className="px-6 py-2.5 bg-candy text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}
