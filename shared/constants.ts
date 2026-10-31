export const TOKENS = {
  primary: '#5B3FD9',
  accent: '#E4572E',
  success: '#1B7F4C',
  warning: '#8A5A00',
  danger: '#B3261E',
  surface: '#FFFFFF',
  background: '#F7F5FF',
  text: '#1B1B1F',
};

export const DEFAULT_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
];

export const FALLBACK_BUDGET_PERCENTAGES: Record<string, Record<string, number>> = {
  wedding: {
    'Venue & Rental': 25,
    'Catering & Bar': 30,
    'Decor & Florals': 10,
    'Photography & Video': 10,
    'Attire & Beauty': 8,
    'Music & Entertainment': 5,
    'Invitations & Stationery': 3,
    'Travel & Misc': 4,
    'Contingency': 5,
  },
  birthday: {
    'Venue & Permits': 20,
    'Food & Snacks': 30,
    'Cake & Desserts': 8,
    'Entertainment': 15,
    'Decor & Setup': 10,
    'Return Gifts & Favors': 10,
    'Photography': 4,
    'Contingency': 3,
  },
  community: {
    'Venue & Permits': 20,
    'Catering & Refreshments': 25,
    'Sound & Stage': 15,
    'Marketing & Outreach': 10,
    'Volunteers & Supplies': 10,
    'Safety & First Aid': 8,
    'Cleanup & Waste': 5,
    'Contingency': 7,
  },
};

export const IDEA_GROUPS = [
  'Theme & Vibe',
  'Food & Drink',
  'Entertainment',
  'Decor & Aesthetics',
  'Activities & Games',
  'Budget Savers',
];
