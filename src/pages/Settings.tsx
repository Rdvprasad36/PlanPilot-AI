import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../store/planStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Download, Upload, Trash2, Sun, Moon } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const plan = usePlanStore((state) => state.plan);
  const clear = usePlanStore((state) => state.clear);
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    if (!plan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${plan.brief.title.toLowerCase().replace(/\s+/g, '_')}_plan.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          localStorage.setItem('planpilot_ai_current_plan_v1', JSON.stringify(parsed));
          window.location.href = '/dashboard';
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF] text-[#1B1B1F] p-8 space-y-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-xl font-bold">Settings & Data Management</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-[#1B1B1F]">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Theme Preference</span>
              <Button onClick={toggleTheme} variant="outline" size="sm">
                {theme === 'light' ? <Moon className="h-4 w-4 mr-1" /> : <Sun className="h-4 w-4 mr-1" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-[#1B1B1F]">Backup & Data Persistence</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExportJson} variant="primary" size="sm" disabled={!plan}>
                <Download className="h-4 w-4 mr-1" /> Export Plan JSON
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" /> Import Plan JSON
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJson}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#FDF3F2] p-6 shadow-sm border border-[#FAD2D0] space-y-4">
            <h2 className="text-base font-bold text-[#B3261E]">Danger Zone</h2>
            <p className="text-sm text-gray-600">Permanently delete your current event plan from local device storage.</p>
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to delete all data?')) {
                  clear();
                  navigate('/');
                }
              }}
              variant="danger"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
