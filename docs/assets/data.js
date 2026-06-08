/* =========================================================================
   Foresight — shared mock dataset
   Numbers are illustrative but grounded in HotelBooking-PRD.pdf:
   - Random Forest: 87.94% test accuracy, 84.71% precision, 77.10% recall
   - Industry cancellation 33% -> target <=25% post-intervention
   - Feature importances: lead_time .22, avg_price .20, arrival_date .15, etc.
   - Default risk threshold 70%; automation requires score>80 AND lead>90d
   ========================================================================= */

const MODEL = {
  name: 'Random Forest', version: 'v2.3', trainedOn: '9,069 + 4,210 live bookings',
  testAccuracy: 87.9, precision: 84.7, recall: 77.1, fpRate: 14.2,
  scoringLatencyMs: 1400, threshold: 70, lastRetrain: 'May 1, 2026', nextRetrain: 'Jun 1, 2026',
};

const KPIS = {
  revenueRecoveredQTD: 128400, revenueDeltaPct: 18,
  atRiskToday: 23, newBookingsToday: 312,
  interventionRate: 62, cancelRateNow: 24.6, cancelRateBaseline: 33,
};

/* Feature importances straight from PRD §5.3 */
const FEATURES = [
  { key: 'lead_time',            label: 'Lead time',        weight: 0.22, note: 'Bookings far in advance cancel more' },
  { key: 'avg_price_per_room',   label: 'Avg price / room', weight: 0.20, note: 'Higher prices trigger reconsideration' },
  { key: 'arrival_date',         label: 'Arrival date',     weight: 0.15, note: 'Day-of-month & holiday patterns' },
  { key: 'no_of_week_nights',    label: 'Week nights',      weight: 0.13, note: 'Longer mid-week stays cancel more' },
  { key: 'arrival_month',        label: 'Arrival month',    weight: 0.11, note: 'Seasonal pattern (peak months 8–10)' },
  { key: 'no_of_weekend_nights', label: 'Weekend nights',   weight: 0.09, note: 'Weekend stays differ from weekday' },
  { key: 'type_of_meal_plan',    label: 'Meal plan',        weight: 0.08, note: 'Meal commitment signals intent' },
  { key: 'no_of_special_requests', label: 'Special requests', weight: 0.05, note: 'More requests = lower risk' },
];

const ACTIONS = {
  upsell:   { label: 'Offer non-refundable upgrade', icon: 'badge-percent', soft: true },
  outreach: { label: 'Send pre-stay outreach',       icon: 'mail',          soft: true },
  deposit:  { label: 'Request deposit confirmation', icon: 'shield-check',  soft: false },
  buffer:   { label: 'Flag for overbooking buffer',  icon: 'layers',        soft: true },
};

function band(score) { return score >= 70 ? 'high' : score >= 40 ? 'med' : 'low'; }
function bandLabel(score) { return score >= 70 ? 'High risk' : score >= 40 ? 'Medium' : 'Low risk'; }
function money(n) { return '$' + n.toLocaleString('en-US'); }

/* Consistent booking set. `drivers` are the top-3 plain-language explanations
   the PRD requires (FR2). `status` tracks the intervention workflow. */
const BOOKINGS = [
  { id: 'INN-48201', guest: 'Daniel Whitmore', channel: 'Online', segment: 'Online', room: 'Ocean Suite',
    arrival: 'Oct 15, 2026', leadTime: 187, price: 312, weekNights: 4, weekendNights: 1, meal: 'Not Selected',
    special: 0, repeat: false, prevCancel: 1, parking: false, score: 91, status: 'new',
    recommended: 'upsell',
    drivers: [
      { f: 'lead_time', dir: 'up', text: '187-day lead time — bookings this far out cancel ~2.4× more often.' },
      { f: 'avg_price_per_room', dir: 'up', text: '$312/night — premium rooms see higher last-minute reconsideration.' },
      { f: 'no_of_special_requests', dir: 'up', text: 'Zero special requests — low engagement signals weaker intent.' },
    ] },
  { id: 'INN-48177', guest: 'Priya Raman', channel: 'Online', segment: 'Online', room: 'Deluxe King',
    arrival: 'Oct 12, 2026', leadTime: 142, price: 268, weekNights: 4, weekendNights: 0, meal: 'Breakfast',
    special: 1, repeat: false, prevCancel: 0, parking: false, score: 84, status: 'flagged',
    recommended: 'outreach',
    drivers: [
      { f: 'lead_time', dir: 'up', text: '142-day lead time sits well above the 90-day high-risk band.' },
      { f: 'avg_price_per_room', dir: 'up', text: '$268/night is in the top price quartile for this segment.' },
      { f: 'no_of_week_nights', dir: 'up', text: '4 week-nights — longer mid-week stays cancel more (possible itinerary change).' },
    ] },
  { id: 'INN-48155', guest: 'Marcus Lee', channel: 'Offline', segment: 'Corporate', room: 'Standard Twin',
    arrival: 'Sep 30, 2026', leadTime: 96, price: 241, weekNights: 3, weekendNights: 0, meal: 'Half Board',
    special: 2, repeat: false, prevCancel: 0, parking: true, score: 78, status: 'intervened',
    recommended: 'deposit',
    drivers: [
      { f: 'avg_price_per_room', dir: 'up', text: '$241/night above the corporate-segment median.' },
      { f: 'lead_time', dir: 'up', text: '96-day lead time just over the high-risk threshold.' },
      { f: 'arrival_month', dir: 'up', text: 'September arrival falls in the peak-volume window.' },
    ] },
  { id: 'INN-48133', guest: 'Sofia Alvarez', channel: 'Offline', segment: 'Offline', room: 'Deluxe King',
    arrival: 'Oct 3, 2026', leadTime: 73, price: 228, weekNights: 2, weekendNights: 0, meal: 'Breakfast',
    special: 1, repeat: false, prevCancel: 0, parking: false, score: 73, status: 'new',
    recommended: 'outreach',
    drivers: [
      { f: 'lead_time', dir: 'up', text: '73-day lead time crosses the 70% risk threshold.' },
      { f: 'avg_price_per_room', dir: 'up', text: '$228/night moderately above segment median.' },
      { f: 'arrival_date', dir: 'up', text: 'Early-October arrival aligns with a higher-cancellation pattern.' },
    ] },
  { id: 'INN-48120', guest: 'James Okafor', channel: 'Online', segment: 'Online', room: 'Standard Twin',
    arrival: 'Sep 22, 2026', leadTime: 61, price: 205, weekNights: 3, weekendNights: 1, meal: 'Breakfast',
    special: 2, repeat: false, prevCancel: 0, parking: false, score: 68, status: 'new',
    recommended: 'outreach',
    drivers: [
      { f: 'lead_time', dir: 'up', text: '61-day lead time elevates risk but stays below the auto-action band.' },
      { f: 'no_of_week_nights', dir: 'up', text: '3 week-nights adds mild cancellation pressure.' },
      { f: 'no_of_special_requests', dir: 'down', text: '2 special requests slightly lower the score.' },
    ] },
  { id: 'INN-48098', guest: 'Emma Thompson', channel: 'Online', segment: 'Online', room: 'Ocean Suite',
    arrival: 'Nov 2, 2026', leadTime: 54, price: 298, weekNights: 1, weekendNights: 2, meal: 'Breakfast',
    special: 3, repeat: false, prevCancel: 0, parking: true, score: 55, status: 'new',
    recommended: 'buffer',
    drivers: [
      { f: 'avg_price_per_room', dir: 'up', text: '$298/night premium room raises baseline risk.' },
      { f: 'no_of_special_requests', dir: 'down', text: '3 special requests — engaged guest, lowers risk.' },
      { f: 'no_of_weekend_nights', dir: 'up', text: 'Weekend-heavy stay carries a distinct risk profile.' },
    ] },
  { id: 'INN-48066', guest: 'Henrik Solberg', channel: 'Corporate', segment: 'Corporate', room: 'Executive Suite',
    arrival: 'Sep 18, 2026', leadTime: 38, price: 256, weekNights: 2, weekendNights: 0, meal: 'Half Board',
    special: 2, repeat: true, prevCancel: 0, parking: true, score: 41, status: 'new',
    recommended: 'buffer',
    drivers: [
      { f: 'avg_price_per_room', dir: 'up', text: '$256/night above median nudges risk up.' },
      { f: 'lead_time', dir: 'down', text: '38-day lead time keeps risk moderate.' },
      { f: 'type_of_meal_plan', dir: 'down', text: 'Half-board commitment signals intent to stay.' },
    ] },
  { id: 'INN-48041', guest: 'Aisha Bello', channel: 'Online', segment: 'Online', room: 'Deluxe King',
    arrival: 'Sep 12, 2026', leadTime: 21, price: 189, weekNights: 1, weekendNights: 1, meal: 'Breakfast',
    special: 4, repeat: true, prevCancel: 0, parking: false, score: 23, status: 'new',
    recommended: 'buffer',
    drivers: [
      { f: 'lead_time', dir: 'down', text: '21-day lead time strongly lowers risk.' },
      { f: 'no_of_special_requests', dir: 'down', text: '4 special requests — highly engaged guest.' },
      { f: 'avg_price_per_room', dir: 'down', text: '$189/night near segment median.' },
    ] },
];

/* Score-history points for the detail page (score at creation / 30d / 7d pre-arrival) */
const SCORE_HISTORY = {
  'INN-48201': [ { t: 'At booking', v: 88 }, { t: '30 days out', v: 90 }, { t: '7 days out', v: 91 } ],
};

/* Per-arrival forecast for the overbooking page */
const FORECAST = [
  { date: 'Sep 18, 2026', bookings: 142, predicted: 31, lo: 27, hi: 35, buffer: 9,  actual: 33 },
  { date: 'Sep 22, 2026', bookings: 168, predicted: 38, lo: 33, hi: 43, buffer: 11, actual: 36 },
  { date: 'Sep 30, 2026', bookings: 201, predicted: 49, lo: 43, hi: 55, buffer: 14, actual: 51 },
  { date: 'Oct 03, 2026', bookings: 188, predicted: 44, lo: 39, hi: 49, buffer: 13, actual: null },
  { date: 'Oct 12, 2026', bookings: 224, predicted: 58, lo: 51, hi: 65, buffer: 17, actual: null },
  { date: 'Oct 15, 2026', bookings: 239, predicted: 63, lo: 55, hi: 71, buffer: 18, actual: null },
  { date: 'Oct 20, 2026', bookings: 197, predicted: 47, lo: 41, hi: 53, buffer: 13, actual: null },
];

/* Automation rules (PRD Flow 3 / FR7) */
const RULES = [
  { id: 'R-01', name: 'Premium long-lead auto-protect', on: true,
    cond: 'score > 80% AND lead_time > 90d AND segment = Online',
    action: 'Switch to non-refundable rate + send confirmation email', fires: 47, fp: 3.1, mode: 'Auto' },
  { id: 'R-02', name: 'High-value deposit request', on: true,
    cond: 'score > 75% AND avg_price_per_room > $250',
    action: 'Request refundable deposit hold', fires: 31, fp: 4.4, mode: 'Auto' },
  { id: 'R-03', name: 'Corporate soft outreach', on: false,
    cond: 'score > 70% AND segment = Corporate',
    action: 'Queue personalised pre-stay email for RM review', fires: 0, fp: null, mode: 'Review' },
];

/* Intervention log + A/B holdout (PRD Story 4 / North Star counterfactual) */
const AB = { treatmentRate: 18.2, controlRate: 31.5, relReduction: 42, holdoutPct: 10, sample: 1840 };
const INTERVENTIONS = [
  { id: 'INN-48155', type: 'Deposit request',   date: 'May 28', cost: 0,  outcome: 'Honoured',  saved: true },
  { id: 'INN-47990', type: 'Non-refund upgrade', date: 'May 27', cost: 35, outcome: 'Honoured',  saved: true },
  { id: 'INN-47921', type: 'Pre-stay outreach',  date: 'May 26', cost: 4,  outcome: 'Cancelled', saved: false },
  { id: 'INN-47888', type: 'Non-refund upgrade', date: 'May 25', cost: 35, outcome: 'Honoured',  saved: true },
  { id: 'INN-47812', type: 'Deposit request',    date: 'May 24', cost: 0,  outcome: 'Honoured',  saved: true },
];
const ROI_BY_TYPE = [
  { type: 'Deposit request',    savedPer100: 8.1, costPer: 0 },
  { type: 'Non-refund upgrade', savedPer100: 6.4, costPer: 35 },
  { type: 'Pre-stay outreach',  savedPer100: 3.2, costPer: 4 },
];

/* Model comparison (PRD §5.1) */
const MODEL_COMPARE = [
  { model: 'Decision Tree',          train: 99.65, test: 83.20, recall: 76.77, precision: 73.23, gap: 16.5, best: false },
  { model: 'Decision Tree (Pruned)', train: 95.64, test: 84.34, recall: 76.09, precision: 76.09, gap: 11.3, best: false },
  { model: 'Random Forest',          train: 98.47, test: 87.94, recall: 77.10, precision: 84.71, gap: 10.5, best: true },
  { model: 'Random Forest (Pruned)', train: 87.32, test: 85.04, recall: 66.22, precision: 84.77, gap: 2.3,  best: false },
];
const ACCURACY_TREND = [86.9, 87.2, 86.4, 87.8, 88.1, 87.6, 87.9, 88.3, 87.4, 87.9];
const CONFUSION = { tp: 686, fp: 124, fn: 204, tn: 1707 }; /* illustrative on a 30-day holdout */

/* Segment analytics (PRD §2.1 channel mix, §2.6) */
const SEGMENTS = [
  { name: 'Online',    volume: 64, cancelRate: 29.8 },
  { name: 'Offline',   volume: 29, cancelRate: 18.2 },
  { name: 'Corporate', volume: 6,  cancelRate: 11.4 },
  { name: 'Aviation',  volume: 1,  cancelRate: 9.0 },
];
const LEAD_BANDS = [
  { band: '0–30 d',   rate: 9.2 },
  { band: '31–90 d',  rate: 21.6 },
  { band: '91–180 d', rate: 38.4 },
  { band: '181+ d',   rate: 47.1 },
];
const PRICE_BANDS = [
  { band: '< $150',     rate: 14.1 },
  { band: '$150–$250',  rate: 26.7 },
  { band: '$250–$350',  rate: 35.9 },
  { band: '> $350',     rate: 41.3 },
];

/* Alerts feed */
const ALERTS = [
  { kind: 'high',  icon: 'alert-triangle', text: 'INN-48201 scored 91% at booking — above 70% threshold', time: '4m ago' },
  { kind: 'high',  icon: 'alert-triangle', text: 'INN-48177 scored 84% — recommended: pre-stay outreach', time: '22m ago' },
  { kind: 'auto',  icon: 'workflow',       text: 'Rule R-01 auto-switched INN-48066-A to non-refundable', time: '1h ago' },
  { kind: 'info',  icon: 'activity',       text: 'Daily model check passed — 87.9% (≥ 85% gate)', time: '3h ago' },
  { kind: 'warn',  icon: 'database',       text: 'INN-48119 scored on partial data (11/16 features)', time: '5h ago' },
];
