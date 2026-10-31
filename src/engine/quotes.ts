import { VendorQuote } from '../../shared/schemas.js';

export interface QuoteAnalysis {
  effectiveTotal: number;
  flags: string[];
  inquiryDraft: string;
  isOverAllocated: boolean;
  variance: number;
}

export function analyzeQuote(quote: VendorQuote, categoryPlannedBudget: number, guestCount: number, currency: string = 'INR'): QuoteAnalysis {
  let effectiveTotal = quote.quoteAmount;
  const flags: string[] = [];

  if (quote.pricePerPlate && quote.pricePerPlate > 0) {
    const billableGuests = Math.max(guestCount, quote.guestMinimum || 0);
    effectiveTotal = quote.pricePerPlate * billableGuests;
    if (quote.guestMinimum && quote.guestMinimum > guestCount) {
      flags.push(`Minimum guarantee of ${quote.guestMinimum} plates applies (exceeds your ${guestCount} guests).`);
    }
  }

  if (quote.taxIncluded === false) {
    flags.push('GST / Taxes not included (estimated +18% on final invoice).');
    effectiveTotal = Math.round(effectiveTotal * 1.18);
  } else if (quote.taxIncluded === null || quote.taxIncluded === undefined) {
    flags.push('Tax / GST line is missing in quote. Confirm if 18% GST is included.');
  }

  if (!quote.cancellationPolicy) {
    flags.push('No cancellation or date-change policy specified.');
  }

  if (quote.advancePercent && quote.advancePercent > 50) {
    flags.push(`High advance requested (${quote.advancePercent}% upfront). Industry standard is 25-40%.`);
  }

  const isOverAllocated = effectiveTotal > categoryPlannedBudget;
  const variance = categoryPlannedBudget - effectiveTotal;

  const inquiryDraft = [
    `Dear ${quote.vendorName || 'Vendor'},`,
    `Thank you for providing the quotation of ${currency} ${effectiveTotal.toLocaleString()} for our upcoming event.`,
    `We would appreciate clarification on a few points:`,
    flags.length > 0 ? flags.map((f, i) => `${i + 1}. ${f}`).join('\n') : '1. Confirmation of payment milestones and delivery schedule.',
    `Looking forward to confirming once these points are aligned.`,
    `Warm regards,`,
    `Event Planning Team`,
  ].join('\n\n');

  return {
    effectiveTotal,
    flags,
    inquiryDraft,
    isOverAllocated,
    variance,
  };
}
