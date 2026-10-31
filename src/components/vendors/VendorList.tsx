import React, { useState } from 'react';
import { usePlanStore } from '../../store/planStore.js';
import { analyzeQuote } from '../../engine/quotes.js';
import { formatCurrency } from '../../engine/money.js';
import { apiExtractQuote } from '../../services/api.js';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { Building2, Sparkles, AlertCircle, Copy, Check, Plus, Trash2 } from 'lucide-react';

export function VendorList() {
  const plan = usePlanStore((state) => state.plan);
  const addVendorQuote = usePlanStore((state) => state.addVendorQuote);
  const deleteVendor = usePlanStore((state) => state.deleteVendor);

  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [pastedText, setPastedText] = useState('₹1500 per plate, minimum 250 plates, 50% advance, no cancellation after booking');
  const [category, setCategory] = useState('Catering');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  if (!plan) return null;

  const currency = plan.brief.currency;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const data = await apiExtractQuote(category, pastedText);
      const catBudget = plan.budget.find((b) => b.category.toLowerCase().includes(category.toLowerCase()))?.planned || 100000;
      const quoteObj = {
        id: `v_${Date.now()}`,
        category,
        vendorName: data.vendorName || 'Extracted Vendor',
        quoteAmount: data.quoteAmount || 150000,
        pricePerPlate: data.pricePerPlate || null,
        guestMinimum: data.guestMinimum || null,
        taxIncluded: data.taxIncluded ?? null,
        advancePercent: data.advancePercent || null,
        cancellationPolicy: data.cancellationPolicy || null,
        status: 'quoted' as const,
        contact: '',
        notes: pastedText,
      };
      const analysis = analyzeQuote(quoteObj, catBudget, plan.brief.guests, currency);
      setExtractedResult({ quote: quoteObj, analysis });
    } catch {
      // Fallback
      setExtractedResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddExtracted = () => {
    if (extractedResult?.quote) {
      addVendorQuote(extractedResult.quote);
      setIsAnalyzeOpen(false);
      setExtractedResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Vendor Checklists & Quotations</h2>
          <p className="text-xs text-gray-500">Track quotes, examine missing GST or minimum guarantees, and draft inquiries</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAnalyzeOpen(true)}>
          <Sparkles className="h-4 w-4 mr-1.5" />
          Paste & Analyze Raw Quote
        </Button>
      </div>

      {/* 2. Vendor Quotes List */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {plan.vendors.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">No vendor quotes added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Vendor</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Quote Amount</th>
                  <th className="py-3 px-3">Per Plate / Min</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {plan.vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                    <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">{vendor.category}</td>
                    <td className="py-3 px-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#5B3FD9]" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{vendor.vendorName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize bg-indigo-50 dark:bg-indigo-950 text-[#5B3FD9]">
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-white">
                      {formatCurrency(vendor.quoteAmount, currency)}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {vendor.pricePerPlate ? `${formatCurrency(vendor.pricePerPlate, currency)}/plate` : 'Lump sum'}
                      {vendor.guestMinimum ? ` (Min ${vendor.guestMinimum})` : ''}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteVendor(vendor.id)}
                        className="text-gray-400 hover:text-[#B3261E] p-1"
                        aria-label={`Delete ${vendor.vendorName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Paste & Extract Dialog */}
      <Dialog isOpen={isAnalyzeOpen} onClose={() => setIsAnalyzeOpen(false)} title="Analyze Raw Vendor Quote with AI">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="Catering">Catering</option>
              <option value="Venue">Venue</option>
              <option value="Decor">Decor</option>
              <option value="Photography">Photography</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Paste Vendor WhatsApp Message or Quote
            </label>
            <textarea
              rows={4}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="e.g. ₹1500 per plate, minimum 250 plates, 50% advance, no cancellation..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={analyzing || !pastedText.trim()} variant="primary" className="w-full">
            {analyzing ? 'Extracting with Gemini...' : 'Extract Fields & Check Red Flags'}
          </Button>

          {extractedResult && (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Analysis Findings</span>
                <span className="font-mono font-bold text-[#5B3FD9]">
                  Effective: {formatCurrency(extractedResult.analysis.effectiveTotal, currency)}
                </span>
              </div>

              {extractedResult.analysis.flags.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-[#B3261E] flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Red Flags & Gaps:
                  </span>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5">
                    {extractedResult.analysis.flags.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Generated Inquiry Draft:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(extractedResult.analysis.inquiryDraft);
                      setCopiedDraft(true);
                      setTimeout(() => setCopiedDraft(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[#5B3FD9] hover:underline"
                  >
                    {copiedDraft ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedDraft ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-white dark:bg-gray-800 text-[11px] whitespace-pre-wrap font-sans text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {extractedResult.analysis.inquiryDraft}
                </pre>
              </div>

              <Button onClick={handleAddExtracted} variant="primary" size="sm" className="w-full">
                Add Quote to Plan
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
