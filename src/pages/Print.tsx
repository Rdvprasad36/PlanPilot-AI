import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../store/planStore.js';
import { Button } from '../components/ui/Button';
import { Printer, ArrowLeft } from 'lucide-react';

export default function Print() {
  const navigate = useNavigate();
  const plan = usePlanStore((state) => state.plan);

  useEffect(() => {
    if (!plan) navigate('/wizard');
  }, [plan, navigate]);

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-white text-black p-8 space-y-8">
      <div className="flex items-center justify-between print:hidden border-b pb-4">
        <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Button>
        <Button onClick={() => window.print()} variant="primary" size="sm">
          <Printer className="h-4 w-4 mr-1" /> Print / Save PDF
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-extrabold">{plan.brief.title}</h1>
          <p className="text-sm text-gray-600">
            Type: {plan.brief.type} &bull; Date: {plan.brief.date} &bull; Guests: {plan.brief.guests} &bull; Budget:{' '}
            {plan.brief.currency} {plan.brief.budget.toLocaleString()} &bull; City: {plan.brief.city} &bull; Theme:{' '}
            {plan.brief.theme}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold border-b pb-1">1. Budget Allocation</h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Category</th>
                <th className="py-2">Share (%)</th>
                <th className="py-2">Planned</th>
                <th className="py-2">Actual</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {plan.budget.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="py-2 font-medium">{b.category}</td>
                  <td className="py-2">{b.percent}%</td>
                  <td className="py-2">{plan.brief.currency} {b.planned.toLocaleString()}</td>
                  <td className="py-2">{plan.brief.currency} {b.actual.toLocaleString()}</td>
                  <td className="py-2 text-gray-600">{b.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold border-b pb-1">2. Timeline Milestones</h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Task</th>
                <th className="py-2">Due Date</th>
                <th className="py-2">Category</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {plan.timeline.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2 font-medium">{t.title}</td>
                  <td className="py-2">{t.dueDate}</td>
                  <td className="py-2">{t.category}</td>
                  <td className="py-2 uppercase text-xs font-bold">{t.priority}</td>
                  <td className="py-2">{t.done ? 'Completed' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold border-b pb-1">3. Vendor Checklist</h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Category</th>
                <th className="py-2">Vendor Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">Quote</th>
              </tr>
            </thead>
            <tbody>
              {plan.vendors.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="py-2 font-medium">{v.category}</td>
                  <td className="py-2">{v.vendorName}</td>
                  <td className="py-2 capitalize">{v.status.replace('_', ' ')}</td>
                  <td className="py-2">{plan.brief.currency} {v.quoteAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
