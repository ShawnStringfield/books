"use client";

import { SettingsContent } from "./components/SettingsContent";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <SettingsContent />
      </div>
    </DashboardLayout>
  );
}
