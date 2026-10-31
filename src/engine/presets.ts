import { Occasion, BudgetItem, Task, RunsheetItem, Idea } from '../../shared/schemas.js';

export interface OccasionConfig {
  label: string;
  defaultTitle: string;
  defaultBudget: number;
  defaultGuests: number;
  categories: { id: string; category: string; percent: number; isContingency?: boolean }[];
  tasks: Omit<Task, 'dueDate'>[];
  runsheet: RunsheetItem[];
  defaultIdeas: Idea[];
}

export const OCCASION_PRESETS: Record<Occasion, OccasionConfig> = {
  wedding: {
    label: 'Wedding',
    defaultTitle: 'Emma & David Wedding',
    defaultBudget: 25000,
    defaultGuests: 150,
    categories: [
      { id: 'cat_cat', category: 'Catering & Bar', percent: 35 },
      { id: 'cat_ven', category: 'Venue & Logistics', percent: 20 },
      { id: 'cat_dec', category: 'Decor & Florals', percent: 12 },
      { id: 'cat_pho', category: 'Photography & Film', percent: 10 },
      { id: 'cat_ent', category: 'Entertainment & DJ', percent: 8 },
      { id: 'cat_mis', category: 'Attire & Favors', percent: 5 },
      { id: 'cat_cnt', category: 'Contingency Buffer', percent: 10, isContingency: true },
    ],
    tasks: [
      { id: 't_ven', title: 'Lock Wedding Venue & Date', category: 'Venue', phase: 'Foundation', priority: 'high', done: false, daysBeforeEvent: 180, delayedDays: 0, notes: 'Anchor for all dependent vendor bookings' },
      { id: 't_cat', title: 'Finalize Caterer & Menu Tasting', category: 'Catering', phase: 'Key Vendors', priority: 'high', done: false, daysBeforeEvent: 140, dependsOn: 't_ven', delayedDays: 0, notes: 'Confirm per-plate quote & menu' },
      { id: 't_pho', title: 'Book Photographer & Videographer', category: 'Photography', phase: 'Key Vendors', priority: 'high', done: false, daysBeforeEvent: 130, dependsOn: 't_ven', delayedDays: 0, notes: 'Secure dates for pre-wedding & day-of' },
      { id: 't_dec', title: 'Approve Floral & Lighting Design', category: 'Decor', phase: 'Design & Detail', priority: 'med', done: false, daysBeforeEvent: 90, dependsOn: 't_ven', delayedDays: 0, notes: 'Match botanical theme' },
      { id: 't_inv', title: 'Send Digital & Physical Invitations', category: 'Stationery', phase: 'Communication', priority: 'high', done: false, daysBeforeEvent: 60, dependsOn: 't_ven', delayedDays: 0, notes: 'Collect RSVPs by 3 weeks before' },
      { id: 't_fin', title: 'Final Headcount & Balance Payments', category: 'Management', phase: 'Final Stretch', priority: 'high', done: false, daysBeforeEvent: 14, dependsOn: 't_cat', delayedDays: 0, notes: 'Lock final headcount with caterer' },
    ],
    runsheet: [
      { id: 'rs_1', time: '10:00 AM', activity: 'Bridal Preparation & Morning Photography', lead: 'Wedding Coordinator', notes: 'Hair, makeup & bridal party photos' },
      { id: 'rs_2', time: '03:30 PM', activity: 'Guest Arrival & Welcome Refreshments', lead: 'Ushers', notes: 'Welcome music and beverage service' },
      { id: 'rs_3', time: '05:00 PM', activity: 'Wedding Ceremony & Vows Exchange', lead: 'Officiant', notes: 'Ceremony music & ring exchange' },
      { id: 'rs_4', time: '07:00 PM', activity: 'Cocktail Hour & Grand Dinner Reception', lead: 'Catering Captain', notes: 'First dance, toasts & buffet service' },
    ],
    defaultIdeas: [
      { id: 'id_1', group: 'Theme & Vibe', title: 'Botanical Candlelight & Fairy Lights', description: 'Suspended greenery rings with warm fairy lights create an intimate, elegant ambiance.', estCost: '$1,200', pinned: true, dismissed: false },
      { id: 'id_2', group: 'Food & Drink', title: 'Artisanal Grazing Table & Signature Cocktails', description: 'Curated cheese, fruits, and custom bride & groom cocktails.', estCost: '$800', pinned: false, dismissed: false },
      { id: 'id_3', group: 'Budget Savers', title: 'Digital RSVP & Wedding Website Automation', description: 'Streamline dietary preferences and RSVPs with a modern online portal.', estCost: '$50', pinned: true, dismissed: false },
    ],
  },
  birthday: {
    label: "Kid's Birthday",
    defaultTitle: "Aiden's 7th Birthday Party",
    defaultBudget: 1500,
    defaultGuests: 40,
    categories: [
      { id: 'cat_cat', category: 'Food & Snacks', percent: 30 },
      { id: 'cat_ent', category: 'Games & Entertainment', percent: 20 },
      { id: 'cat_ven', category: 'Party Hall / Venue', percent: 15 },
      { id: 'cat_dec', category: 'Theme Balloon Decor', percent: 15 },
      { id: 'cat_pho', category: 'Photo & Video', percent: 5 },
      { id: 'cat_mis', category: 'Party Favors & Cake', percent: 5 },
      { id: 'cat_cnt', category: 'Contingency Buffer', percent: 10, isContingency: true },
    ],
    tasks: [
      { id: 't_ven', title: 'Reserve Party Hall or Event Space', category: 'Venue', phase: 'Booking', priority: 'high', done: false, daysBeforeEvent: 30, delayedDays: 0, notes: 'Verify child-safe play area' },
      { id: 't_cak', title: 'Order Custom Themed Birthday Cake', category: 'Food', phase: 'Orders', priority: 'high', done: false, daysBeforeEvent: 14, dependsOn: 't_ven', delayedDays: 0, notes: 'Design with favorite motif' },
      { id: 't_mag', title: 'Book Entertainer / Magician', category: 'Entertainment', phase: 'Activities', priority: 'med', done: false, daysBeforeEvent: 12, dependsOn: 't_ven', delayedDays: 0, notes: '45-minute interactive show' },
      { id: 't_fav', title: 'Assemble Party Favor Gift Bags', category: 'Gifts', phase: 'Final', priority: 'med', done: false, daysBeforeEvent: 5, delayedDays: 0, notes: 'Activity books and creative kits' },
    ],
    runsheet: [
      { id: 'rs_1', time: '02:00 PM', activity: 'Kids Arrival & Face Painting', lead: 'Host Team', notes: 'Welcome snacks and juice boxes' },
      { id: 'rs_2', time: '03:15 PM', activity: 'Magic & Interactive Games', lead: 'Entertainer', notes: 'Fun prizes for game winners' },
      { id: 'rs_3', time: '04:15 PM', activity: 'Cake Cutting & Birthday Song', lead: 'Parents', notes: 'Candles, celebration music & photos' },
      { id: 'rs_4', time: '05:00 PM', activity: 'Snacks Buffet & Favor Distribution', lead: 'Host Team', notes: 'Handing out gift bags to departing guests' },
    ],
    defaultIdeas: [
      { id: 'id_1', group: 'Activities', title: 'DIY Cupcake Decorating Station', description: 'Kids frost their own mini cupcakes with sprinkles and toppings.', estCost: '$100', pinned: true, dismissed: false },
      { id: 'id_2', group: 'Budget Savers', title: 'Balloon Garland Photo Backdrop', description: 'A vibrant photo corner with Polaroid cameras for instant keepsakes.', estCost: '$60', pinned: false, dismissed: false },
    ],
  },
  milestone: {
    label: 'Milestone Anniversary / 50th Birthday',
    defaultTitle: "Golden Jubilee Celebration",
    defaultBudget: 12000,
    defaultGuests: 100,
    categories: [
      { id: 'cat_cat', category: 'Dinner & Cocktails', percent: 35 },
      { id: 'cat_ven', category: 'Banquet Venue', percent: 20 },
      { id: 'cat_dec', category: 'Elegant Decor', percent: 10 },
      { id: 'cat_pho', category: 'Candid Photography', percent: 10 },
      { id: 'cat_ent', category: 'Tribute Video & Live Band', percent: 10 },
      { id: 'cat_mis', category: 'Keepsakes & Invitations', percent: 5 },
      { id: 'cat_cnt', category: 'Contingency Buffer', percent: 10, isContingency: true },
    ],
    tasks: [
      { id: 't_ven', title: 'Reserve Banquet Hall with AC', category: 'Venue', phase: 'Booking', priority: 'high', done: false, daysBeforeEvent: 90, delayedDays: 0, notes: 'Confirm elevator and senior accessibility' },
      { id: 't_vid', title: 'Compile Family Tribute Video', category: 'Media', phase: 'Prep', priority: 'high', done: false, daysBeforeEvent: 30, dependsOn: 't_ven', delayedDays: 0, notes: 'Gather family photos and video messages' },
      { id: 't_mus', title: 'Book Live Band or Acoustic Musician', category: 'Entertainment', phase: 'Vendors', priority: 'med', done: false, daysBeforeEvent: 45, dependsOn: 't_ven', delayedDays: 0, notes: 'Select classic celebration playlist' },
    ],
    runsheet: [
      { id: 'rs_1', time: '06:30 PM', activity: 'Guest Welcome & Cocktail Reception', lead: 'Family Hosts', notes: 'Guestbook signing and photo wall' },
      { id: 'rs_2', time: '07:45 PM', activity: 'Memory Tribute Video & Speeches', lead: 'Master of Ceremonies', notes: 'Projector and wireless microphones ready' },
      { id: 'rs_3', time: '08:45 PM', activity: 'Gourmet Dinner & Live Music', lead: 'Catering Lead', notes: 'Plated dinner and dance floor open' },
    ],
    defaultIdeas: [
      { id: 'id_1', group: 'Theme & Vibe', title: 'Memory Lane Photo Gallery', description: 'Chronological timeline of framed milestones illuminated with warm candlelight.', estCost: '$150', pinned: true, dismissed: false },
    ],
  },
  community: {
    label: 'Community Festival',
    defaultTitle: 'Annual Community Gala & Festival',
    defaultBudget: 8000,
    defaultGuests: 350,
    categories: [
      { id: 'cat_cat', category: 'Community Feast & Refreshments', percent: 25 },
      { id: 'cat_ven', category: 'Ground / Stage / Lighting', percent: 20 },
      { id: 'cat_ent', category: 'Cultural Stage & Sound', percent: 15 },
      { id: 'cat_dec', category: 'Festive Banners & Lighting', percent: 15 },
      { id: 'cat_mis', category: 'Permits & Sanitation', percent: 10 },
      { id: 'cat_pho', category: 'Coverage & Live Stream', percent: 5 },
      { id: 'cat_cnt', category: 'Contingency Buffer', percent: 10, isContingency: true },
    ],
    tasks: [
      { id: 't_per', title: 'Obtain Municipal & Event Permits', category: 'Permits', phase: 'Compliance', priority: 'high', done: false, daysBeforeEvent: 60, delayedDays: 0, notes: 'Sound ordinance and safety clearances' },
      { id: 't_stg', title: 'Set Up Main Stage & Sound System', category: 'Logistics', phase: 'Infrastructure', priority: 'high', done: false, daysBeforeEvent: 30, dependsOn: 't_per', delayedDays: 0, notes: 'Generator and audio check' },
      { id: 't_vol', title: 'Assign Volunteer Coordination Teams', category: 'Coordination', phase: 'Team', priority: 'med', done: false, daysBeforeEvent: 14, dependsOn: 't_per', delayedDays: 0, notes: 'Safety, food distribution, and greeting' },
    ],
    runsheet: [
      { id: 'rs_1', time: '04:00 PM', activity: 'Gates Open & Community Booths', lead: 'Volunteer Lead', notes: 'Welcome desk and badge distribution' },
      { id: 'rs_2', time: '06:00 PM', activity: 'Live Stage & Cultural Performances', lead: 'Stage Coordinator', notes: 'Community music and dance presentations' },
      { id: 'rs_3', time: '08:00 PM', activity: 'Community Dinner Feast', lead: 'Food Service Team', notes: 'Eco-friendly compostable dinnerware' },
    ],
    defaultIdeas: [
      { id: 'id_1', group: 'Activities', title: 'Community Art & Interactive Mural', description: 'Collaborative wall where all attendees can leave their mark and memories.', estCost: '$120', pinned: true, dismissed: false },
    ],
  },
};
