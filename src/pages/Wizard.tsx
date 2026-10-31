import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../store/planStore.js';
import { OCCASION_PRESETS } from '../engine/presets.js';
import { parseAmount } from '../engine/money.js';
import { apiParseIntake } from '../services/api.js';
import { Occasion, EventBrief } from '../../shared/schemas.js';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Select } from '../components/ui/Select';
import { Sparkles, ArrowRight, ArrowLeft, Heart, Gift, Users, Trophy } from 'lucide-react';

export default function Wizard() {
  const navigate = useNavigate();
  const initPlan = usePlanStore((state) => state.initPlan);
  const loading = usePlanStore((state) => state.loading);
  const thinkingSeconds = usePlanStore((state) => state.thinkingSeconds);

  const [intakeText, setIntakeText] = useState('Wedding in Chicago, 150 guests, $25,000 budget, mid-June, modern ceremony with gourmet food');
  const [parsingIntake, setParsingIntake] = useState(false);
  const [occasion, setOccasion] = useState<Occasion>('wedding');
  const [title, setTitle] = useState('Emma & David Wedding');
  const [date, setDate] = useState('2028-06-20');
  const [guests, setGuests] = useState('150');
  const [budgetStr, setBudgetStr] = useState('25000');
  const [currency, setCurrency] = useState('USD');
  const [city, setCity] = useState('Chicago');
  const [theme, setTheme] = useState('Modern Botanical Elegance');
  const [priorityCategory, setPriorityCategory] = useState('Catering');

  const handleOccasionSelect = (occ: Occasion) => {
    setOccasion(occ);
    const p = OCCASION_PRESETS[occ];
    setTitle(p.defaultTitle);
    setGuests(p.defaultGuests.toString());
    setBudgetStr(p.defaultBudget.toString());
  };

  const handleAutoFill = async () => {
    if (!intakeText.trim()) return;
    setParsingIntake(true);
    try {
      const parsed = await apiParseIntake(intakeText);
      if (parsed.occasion) handleOccasionSelect(parsed.occasion as Occasion);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.budget) setBudgetStr(parsed.budget.toString());
      if (parsed.guests) setGuests(parsed.guests.toString());
      if (parsed.city) setCity(parsed.city);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.priorityCategory) setPriorityCategory(parsed.priorityCategory);
    } catch {
      // fallback: keep existing
    } finally {
      setParsingIntake(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const brief: EventBrief = {
      occasion,
      title,
      date,
      guests: parseInt(guests, 10) || 100,
      budget: parseAmount(budgetStr),
      currency,
      city,
      theme,
      priorityCategory,
      preferences: [],
      notes: '',
    };
    await initPlan(brief);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF] dark:bg-gray-900 text-[#1B1B1F] dark:text-white py-12 px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Home
          </Button>
          <span className="text-xs font-bold text-[#5B3FD9] uppercase tracking-wider">Plan Creation</span>
        </div>

        {/* 1. Free-Text Natural Language Intake */}
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#5B3FD9]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Describe your event in plain English</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={intakeText}
              onChange={(e) => setIntakeText(e.target.value)}
              placeholder="e.g. Wedding in Chicago, 150 guests, $25,000 budget, mid-June..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2 text-sm text-gray-900 dark:text-white"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAutoFill}
              disabled={parsingIntake}
            >
              {parsingIntake ? 'Parsing...' : 'Fill Form from Description'}
            </Button>
          </div>
        </div>

        {/* 2. Occasion Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'wedding', label: 'Wedding', icon: Heart },
            { id: 'birthday', label: "Kid's Birthday", icon: Gift },
            { id: 'milestone', label: 'Milestone', icon: Trophy },
            { id: 'community', label: 'Community', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = occasion === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOccasionSelect(item.id as Occasion)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSel
                    ? 'border-[#5B3FD9] bg-[#5B3FD9]/10 ring-2 ring-[#5B3FD9]/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-6 w-6 mb-1.5 ${isSel ? 'text-[#5B3FD9]' : 'text-gray-400'}`} />
                <span className="text-xs font-bold text-gray-900 dark:text-white">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Form Inputs */}
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          <TextField
            label="Event Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Event Date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <TextField
              label="Guest Headcount"
              type="number"
              required
              min="1"
              max="5000"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <TextField
                label="Budget (Supports '$25,000', '25k', '50000')"
                required
                value={budgetStr}
                onChange={(e) => setBudgetStr(e.target.value)}
              />
            </div>
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'CAD', label: 'CAD ($)' },
                { value: 'AUD', label: 'AUD ($)' },
                { value: 'INR', label: 'INR (₹)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="City / Location"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              label="Priority Category (What matters most?)"
              value={priorityCategory}
              onChange={(e) => setPriorityCategory(e.target.value)}
              hint="Receives 1.25x weighting in allocation"
            />
          </div>

          <TextField
            label="Theme / Style"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />

          {loading && (
            <div className="text-center text-xs text-[#5B3FD9] font-medium py-2">
              Building your connected plan with Gemini... ({thinkingSeconds}s)
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Building Connected Plan...' : 'Generate Plan with AI'} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}
