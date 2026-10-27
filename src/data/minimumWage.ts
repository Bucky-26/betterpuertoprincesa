// Official Minimum Wage Data & Rules for Puerto Princesa City & Palawan (MIMAROPA Region IV-B)
// Governed by the Regional Tripartite Wages and Productivity Board (RTWPB) - DOLE MIMAROPA
// Sources:
// - Wage Order No. RB-MIMAROPA-13 (Effective January 1, 2026 for Private Sector)
// - Wage Order No. RB-MIMAROPA-DW-06 (Effective January 1, 2026 for Domestic Workers / Kasambahay)

export interface WageOrderInfo {
  orderNumber: string;
  effectiveDate: string;
  dailyRate: number;
  hourlyRate: number;
  coverage: string;
  notes: string;
}

export interface KasambahayWageInfo {
  orderNumber: string;
  effectiveDate: string;
  monthlyRate: number;
  coverage: string;
  notes: string;
}

export interface WageHistoryItem {
  order: string;
  effectiveDate: string;
  largeRate: number;
  smallRate: number;
  domesticRate: number;
  isCurrent?: boolean;
}

export const CURRENT_WAGE_ORDER: WageOrderInfo = {
  orderNumber: 'RB-MIMAROPA-13',
  effectiveDate: 'January 1, 2026',
  dailyRate: 455.0,
  hourlyRate: 56.88, // 455.00 / 8 hours
  coverage:
    'All private sector workers in Puerto Princesa City and Palawan, regardless of industry or number of employees.',
  notes:
    'Streamlined by RTWPB-MIMAROPA into a single unified rate, eliminating the previous distinction between establishments with 10+ employees and fewer than 10 employees.',
};

export const CURRENT_KASAMBAHAY_ORDER: KasambahayWageInfo = {
  orderNumber: 'RB-MIMAROPA-DW-06',
  effectiveDate: 'January 1, 2026',
  monthlyRate: 7000.0,
  coverage:
    'All domestic workers (househelpers, yayas, cooks, gardeners, laundry personnel) in Puerto Princesa City and Palawan.',
  notes:
    'Applies to both live-in and live-out arrangements. Employers are prohibited from deducting food, lodging, or medical expenses from this minimum wage.',
};

export const ESTIMATED_MONTHLY_RATES = [
  {
    factor: 313,
    description: 'Working 6 days a week (Monday to Saturday)',
    formula: '(₱455.00 × 313 days) ÷ 12 months',
    monthlyEquivalent: 11867.92,
  },
  {
    factor: 261,
    description: 'Working 5 days a week (Monday to Friday)',
    formula: '(₱455.00 × 261 days) ÷ 12 months',
    monthlyEquivalent: 9896.25,
  },
  {
    factor: 365,
    description: 'Continuous daily operations (all days in the year)',
    formula: '(₱455.00 × 365 days) ÷ 12 months',
    monthlyEquivalent: 13840.63,
  },
];

export const WAGE_HISTORY: WageHistoryItem[] = [
  {
    order: 'Wage Order No. RB-MIMAROPA-13',
    effectiveDate: 'January 1, 2026',
    largeRate: 455.0,
    smallRate: 455.0, // Unified rate
    domesticRate: 7000.0,
    isCurrent: true,
  },
  {
    order: 'Wage Order No. RB-MIMAROPA-12',
    effectiveDate: 'December 7, 2023',
    largeRate: 430.0,
    smallRate: 404.0,
    domesticRate: 6500.0,
  },
  {
    order: 'Wage Order No. RB-MIMAROPA-11',
    effectiveDate: 'June 10, 2022',
    largeRate: 355.0,
    smallRate: 329.0,
    domesticRate: 4500.0,
  },
];

export type DayType =
  | 'regular'
  | 'rest_day'
  | 'special_holiday'
  | 'special_holiday_rest_day'
  | 'regular_holiday'
  | 'regular_holiday_rest_day';

export interface DayTypeConfig {
  id: DayType;
  label: string;
  baseMultiplier: number;
  otMultiplier: number;
  description: string;
}

export const DAY_TYPES: Record<DayType, DayTypeConfig> = {
  regular: {
    id: 'regular',
    label: 'Regular Working Day',
    baseMultiplier: 1.0,
    otMultiplier: 1.25,
    description: 'Normal working day (100% daily wage; 125% per hour for OT)',
  },
  rest_day: {
    id: 'rest_day',
    label: 'Scheduled Rest Day',
    baseMultiplier: 1.3,
    otMultiplier: 1.69, // 1.3 * 1.3
    description: 'Work rendered on weekly rest day (+30% premium pay)',
  },
  special_holiday: {
    id: 'special_holiday',
    label: 'Special Non-Working Holiday',
    baseMultiplier: 1.3,
    otMultiplier: 1.69,
    description: 'Work rendered on Special Non-Working Day (+30% premium pay)',
  },
  special_holiday_rest_day: {
    id: 'special_holiday_rest_day',
    label: 'Special Holiday falling on Rest Day',
    baseMultiplier: 1.5,
    otMultiplier: 1.95, // 1.5 * 1.3
    description:
      'Special non-working day coinciding with worker rest day (+50%)',
  },
  regular_holiday: {
    id: 'regular_holiday',
    label: 'Regular Holiday (Double Pay)',
    baseMultiplier: 2.0,
    otMultiplier: 2.6, // 2.0 * 1.3
    description: 'Regular national holiday worked (200% double daily pay)',
  },
  regular_holiday_rest_day: {
    id: 'regular_holiday_rest_day',
    label: 'Regular Holiday falling on Rest Day',
    baseMultiplier: 2.6, // 200% + 30% of 200%
    otMultiplier: 3.38, // 2.6 * 1.3
    description:
      'Regular holiday coinciding with worker rest day (+160% premium)',
  },
};

export interface WageCalculationInput {
  dailyRate: number;
  regularHoursWorked: number;
  overtimeHours: number;
  nightShiftHours: number;
  dayType: DayType;
}

export interface WageCalculationResult {
  hourlyRate: number;
  basePay: number;
  overtimePay: number;
  nightDifferentialPay: number;
  totalGrossPay: number;
  rateDescription: string;
}

export function calculateGrossWage({
  dailyRate,
  regularHoursWorked,
  overtimeHours,
  nightShiftHours,
  dayType,
}: WageCalculationInput): WageCalculationResult {
  const standardHourlyRate = dailyRate / 8;
  const config = DAY_TYPES[dayType] || DAY_TYPES.regular;

  // Base Pay
  // If unworked on regular holiday, employee receives 100% of daily rate anyway
  const effectiveHours = Math.min(8, Math.max(0, regularHoursWorked));
  const baseRatePerHour = standardHourlyRate * config.baseMultiplier;
  const basePay = baseRatePerHour * effectiveHours;

  // Overtime Pay
  const otRatePerHour = standardHourlyRate * config.otMultiplier;
  const overtimePay = otRatePerHour * Math.max(0, overtimeHours);

  // Night Shift Differential (10:00 PM to 6:00 AM) - +10% of regular hourly rate worked at night
  const nightDiffRatePerHour = baseRatePerHour * 0.1;
  const nightDifferentialPay =
    nightDiffRatePerHour * Math.max(0, nightShiftHours);

  const totalGrossPay = basePay + overtimePay + nightDifferentialPay;

  return {
    hourlyRate: Number(standardHourlyRate.toFixed(2)),
    basePay: Number(basePay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    nightDifferentialPay: Number(nightDifferentialPay.toFixed(2)),
    totalGrossPay: Number(totalGrossPay.toFixed(2)),
    rateDescription: config.description,
  };
}

export const STATUTORY_BENEFITS = [
  {
    title: '13th Month Pay (P.D. 851)',
    description:
      'Mandatory for all rank-and-file employees who have worked for at least 1 month. Equivalent to 1/12 of the total basic salary earned during the calendar year, payable not later than December 24.',
  },
  {
    title: 'Service Incentive Leave / SIL (Art. 95, Labor Code)',
    description:
      '5 days of leave with pay for employees who have rendered at least 1 year of continuous service. Commutable to cash if unused at the end of the year.',
  },
  {
    title: 'Mandatory Social Contributions (SSS, PhilHealth, Pag-IBIG)',
    description:
      'Employers must register workers and pay the statutory employer share. Deducting the employer portion from the worker’s wage is strictly illegal under Philippine law.',
  },
  {
    title: 'Weekly Rest Day (Art. 91, Labor Code)',
    description:
      'Every employee is entitled to a rest period of not less than 24 consecutive hours after every 6 consecutive normal work days.',
  },
  {
    title: 'Meal and Rest Periods (Art. 85, Labor Code)',
    description:
      'Not less than 60 minutes time-off for regular meals. Rest periods of short duration (coffee breaks of 5 to 20 minutes) count as compensable working hours.',
  },
];

export const KASAMBAHAY_RIGHTS = [
  {
    title: 'Minimum Wage (₱7,000/month)',
    description:
      'Under Wage Order No. RB-MIMAROPA-DW-06, effective January 1, 2026. Paid in cash directly to the domestic worker at least once a month.',
  },
  {
    title: 'Basic Necessities Free of Charge',
    description:
      'Employer must provide suitable sleeping quarters, 3 adequate meals a day, and humane treatment without any deductions from pay.',
  },
  {
    title: 'Mandatory SSS, PhilHealth, and Pag-IBIG',
    description:
      'For domestic workers earning ₱5,000 and above, the employer is legally required to pay the full employer share of government social security contributions.',
  },
  {
    title: 'Daily Rest & Weekly Rest Period',
    description:
      'Entitled to an aggregate daily rest of at least 8 hours per day, and at least 24 consecutive hours of rest per week.',
  },
];

export const DOLE_PALAWAN_CONTACT = {
  office: 'DOLE Palawan Provincial Field Office',
  address:
    '2nd Floor, Grand Royale Building, Rizal Avenue, Barangay Bancao-Bancao, Puerto Princesa City, Palawan',
  hotlines: ['(048) 433-2358', '(048) 433-1492', '0917-814-3653'],
  email: 'dolepalawan@gmail.com',
  doleHotline: '1349 (DOLE National Hotline)',
  senaInfo:
    'If you are being paid below ₱455.00/day or ₱7,000/month, you may file a Request for Assistance (RFA) under the Single Entry Approach (SEnA) at the DOLE Palawan Field Office for a free, speedy 30-day conciliation-mediation procedure.',
};
