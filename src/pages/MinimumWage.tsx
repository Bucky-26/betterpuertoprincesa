import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Banknote,
  Calculator,
  CalendarCheck,
  Building,
  ShieldCheck,
  Home,
  Phone,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import {
  CURRENT_WAGE_ORDER,
  CURRENT_KASAMBAHAY_ORDER,
  ESTIMATED_MONTHLY_RATES,
  WAGE_HISTORY,
  DAY_TYPES,
  STATUTORY_BENEFITS,
  KASAMBAHAY_RIGHTS,
  DOLE_PALAWAN_CONTACT,
  calculateGrossWage,
  type DayType,
} from '../data/minimumWage';

export default function MinimumWage() {
  const { t } = useTranslation('common');

  // Calculator State
  const [dailyRate, setDailyRate] = useState<number>(
    CURRENT_WAGE_ORDER.dailyRate
  );
  const [regularHours, setRegularHours] = useState<number>(8);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [nightHours, setNightHours] = useState<number>(0);
  const [dayType, setDayType] = useState<DayType>('regular');

  const calculation = useMemo(() => {
    return calculateGrossWage({
      dailyRate: Number(dailyRate) || 0,
      regularHoursWorked: Number(regularHours) || 0,
      overtimeHours: Number(overtimeHours) || 0,
      nightShiftHours: Number(nightHours) || 0,
      dayType,
    });
  }, [dailyRate, regularHours, overtimeHours, nightHours, dayType]);

  const currencyFormat = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  });

  return (
    <>
      <SEO
        title="Current Minimum Wage in Puerto Princesa City & Palawan"
        description="Official DOLE MIMAROPA Minimum Wage Order No. RB-MIMAROPA-13 rates (₱455.00/day private sector, ₱7,000.00/month domestic workers), overtime calculator, and labor rights."
        keywords="Puerto Princesa minimum wage, Palawan minimum wage 2026, DOLE MIMAROPA wage order 13, kasambahay wage Puerto Princesa, overtime calculator Philippines, DOLE Palawan hotline"
      />
      <main className="flex-grow">
        <PageHeader
          title="Current Minimum Wage in Puerto Princesa"
          subtitle="Official DOLE MIMAROPA wage rates, take-home overtime calculator, monthly equivalent formulas, and statutory labor protections."
          breadcrumbs={[
            { label: t('navbar.home'), href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Minimum Wage' },
          ]}
        />

        <Section>
          <div className="mx-auto max-w-6xl space-y-10">
            {/* Top Official Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-balayong-200 bg-gradient-to-br from-balayong-50/60 via-white to-primary-50/40 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-balayong-100 px-3 py-1 text-xs font-bold text-balayong-800">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      Effective January 1, 2026 • Wage Order No. RB-MIMAROPA-13
                    </span>
                  </div>
                  <Heading
                    level={2}
                    className="text-2xl sm:text-3xl font-extrabold text-gray-900"
                  >
                    Unified Minimum Wage: ₱455.00 / day
                  </Heading>
                  <Text className="text-sm text-gray-600 max-w-2xl">
                    By order of the Regional Tripartite Wages and Productivity
                    Board (RTWPB) MIMAROPA, a single streamlined minimum wage
                    rate applies to{' '}
                    <strong>all private sector establishments</strong> in Puerto
                    Princesa City and the Province of Palawan, removing the
                    former employee-count distinction.
                  </Text>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <a
                    href="#calculator"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-800 transition-colors"
                  >
                    <Calculator className="h-4 w-4" />
                    Wage & Overtime Calculator
                  </a>
                  <a
                    href="#reporting"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Report Non-Compliance
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Daily Rate */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Daily Rate
                  </span>
                  <Banknote className="h-4 w-4 text-primary-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">₱455.00</div>
                <div className="text-xs text-gray-500 mt-1">
                  Private sector workers (Agri & Non-Agri)
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Hourly Rate
                  </span>
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">₱56.88</div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on standard 8-hour working day
                </div>
              </div>

              {/* Kasambahay Rate */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Domestic Worker
                  </span>
                  <Home className="h-4 w-4 text-balayong-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  ₱
                  {CURRENT_KASAMBAHAY_ORDER.monthlyRate.toLocaleString(
                    'en-US',
                    { minimumFractionDigits: 2 }
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Per month ({CURRENT_KASAMBAHAY_ORDER.orderNumber})
                </div>
              </div>

              {/* Monthly Equivalent (313 Days) */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Monthly Est. (6-Day)
                  </span>
                  <CalendarCheck className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  ₱11,867.92
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  For workers with 313 working days/yr
                </div>
              </div>
            </div>

            {/* Interactive Calculator Section */}
            <div
              id="calculator"
              className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <Heading
                    level={2}
                    className="text-xl font-bold text-gray-900"
                  >
                    Interactive Wage & Overtime Calculator
                  </Heading>
                  <Text className="text-xs text-gray-500">
                    Compute legally mandated take-home wages including overtime,
                    rest day premiums, and night differential.
                  </Text>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-12">
                {/* Inputs Form */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Daily Rate Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Daily Wage Rate (₱)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-bold text-sm">
                        ₱
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={dailyRate}
                        onChange={e =>
                          setDailyRate(Number(e.target.value) || 0)
                        }
                        className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm font-semibold text-gray-900 focus:border-primary-600 focus:outline-hidden"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">
                      Standard minimum in Puerto Princesa: ₱455.00/day
                    </p>
                  </div>

                  {/* Day Type Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Day Type / Holiday Classification
                    </label>
                    <select
                      value={dayType}
                      onChange={e => setDayType(e.target.value as DayType)}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm font-medium text-gray-900 focus:border-primary-600 focus:outline-hidden bg-white"
                    >
                      {Object.values(DAY_TYPES).map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-primary-700 font-medium">
                      {DAY_TYPES[dayType].description}
                    </p>
                  </div>

                  {/* Regular Hours, Overtime Hours & Night Differential */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Regular Hours (Max 8)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={regularHours}
                        onChange={e => setRegularHours(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-900 focus:border-primary-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Overtime Hours
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={overtimeHours}
                        onChange={e => setOvertimeHours(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-900 focus:border-primary-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Night Shift (10PM-6AM)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={nightHours}
                        onChange={e => setNightHours(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-900 focus:border-primary-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-gray-50/80 p-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Gross Pay Breakdown
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Base Hourly Rate</span>
                      <span className="font-semibold">
                        {currencyFormat.format(calculation.hourlyRate)}/hr
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      <span>Base Pay ({regularHours} hrs)</span>
                      <span className="font-semibold">
                        {currencyFormat.format(calculation.basePay)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      <span>Overtime Pay ({overtimeHours} hrs)</span>
                      <span className="font-semibold text-emerald-700">
                        +{currencyFormat.format(calculation.overtimePay)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      <span>Night Differential ({nightHours} hrs)</span>
                      <span className="font-semibold text-purple-700">
                        +
                        {currencyFormat.format(
                          calculation.nightDifferentialPay
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-gray-900">
                        Total Gross Pay
                      </span>
                      <span className="text-2xl font-black text-primary-700">
                        {currencyFormat.format(calculation.totalGrossPay)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">
                      * Exclusive of statutory deductions (SSS, PhilHealth,
                      Pag-IBIG).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Monthly Equivalent Factors */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <Heading
                level={2}
                className="text-xl font-bold text-gray-900 mb-2"
              >
                Estimated Monthly Equivalents (DOLE Factors)
              </Heading>
              <Text className="text-sm text-gray-600 mb-6">
                To compute monthly basic pay from a daily rate, the Department
                of Labor and Employment (DOLE) prescribes specific annual day
                factors:
              </Text>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {ESTIMATED_MONTHLY_RATES.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-2"
                  >
                    <div className="text-xs font-bold uppercase text-primary-700">
                      Factor {item.factor} Days
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      ₱
                      {item.monthlyEquivalent.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                      <span className="text-xs font-normal text-gray-500">
                        {' '}
                        / month
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {item.description}
                    </div>
                    <div className="rounded-md bg-white border border-gray-200 px-2 py-1 text-[11px] font-mono text-gray-500">
                      {item.formula}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Benefits & Kasambahay Rights */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Private Sector Rights */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-primary-800">
                  <ShieldCheck className="h-5 w-5" />
                  <Heading
                    level={2}
                    className="text-lg font-bold text-gray-900"
                  >
                    Mandatory Worker Protections
                  </Heading>
                </div>
                <div className="space-y-3">
                  {STATUTORY_BENEFITS.map((benefit, i) => (
                    <div
                      key={i}
                      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="text-xs font-bold text-gray-900">
                        {benefit.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {benefit.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kasambahay Rights */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-balayong-700">
                  <Home className="h-5 w-5" />
                  <Heading
                    level={2}
                    className="text-lg font-bold text-gray-900"
                  >
                    Domestic Workers Rights (RA 10361)
                  </Heading>
                </div>
                <div className="space-y-3">
                  {KASAMBAHAY_RIGHTS.map((right, i) => (
                    <div
                      key={i}
                      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="text-xs font-bold text-gray-900">
                        {right.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {right.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Historical Wage Orders Table */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <Heading
                level={2}
                className="text-xl font-bold text-gray-900 mb-2"
              >
                MIMAROPA Wage Order History
              </Heading>
              <Text className="text-xs text-gray-500 mb-4">
                Historical progression of regional wage orders set by
                RTWPB-MIMAROPA for Palawan and Puerto Princesa:
              </Text>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Wage Order</th>
                      <th className="px-4 py-3">Effective Date</th>
                      <th className="px-4 py-3">Daily Rate (10+ Workers)</th>
                      <th className="px-4 py-3">Daily Rate (&lt;10 Workers)</th>
                      <th className="px-4 py-3">Kasambahay (Monthly)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {WAGE_HISTORY.map((row, i) => (
                      <tr
                        key={i}
                        className={
                          row.isCurrent ? 'bg-balayong-50/50 font-bold' : ''
                        }
                      >
                        <td className="px-4 py-3 text-gray-900">
                          {row.order}
                          {row.isCurrent && (
                            <span className="ml-2 rounded-full bg-balayong-100 px-2 py-0.5 text-[10px] text-balayong-800">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.effectiveDate}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          ₱{row.largeRate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {row.smallRate === row.largeRate
                            ? '₱' + row.smallRate.toFixed(2) + ' (Unified)'
                            : '₱' + row.smallRate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          ₱{row.domesticRate.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reporting Non-Compliance & DOLE Palawan Contact */}
            <div
              id="reporting"
              className="scroll-mt-24 rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-4">
                  <div>
                    <Heading
                      level={2}
                      className="text-xl font-bold text-gray-900"
                    >
                      Report Minimum Wage Non-Compliance
                    </Heading>
                    <Text className="text-xs text-gray-600 mt-1">
                      Paying below the mandated minimum wage is a violation of
                      Republic Act No. 6727 (Wage Rationalization Act). Under RA
                      8188, non-compliant employers may face double indemnity,
                      fines, and criminal penalties.
                    </Text>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-white p-5 space-y-3">
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary-700" />
                      {DOLE_PALAWAN_CONTACT.office}
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Address:</strong> {DOLE_PALAWAN_CONTACT.address}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {DOLE_PALAWAN_CONTACT.hotlines.map((num, i) => (
                        <a
                          key={i}
                          href={`tel:${num.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-balayong-100 transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5 text-primary-600" />
                          <span>{num}</span>
                        </a>
                      ))}
                      <a
                        href="tel:1349"
                        className="inline-flex items-center gap-1.5 rounded-full bg-red-600 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-red-700 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Hotline 1349</span>
                      </a>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600 flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Single Entry Approach (SEnA):</strong>{' '}
                        {DOLE_PALAWAN_CONTACT.senaInfo}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-500">
                    Source:{' '}
                    <a
                      href="https://nwpc.dole.gov.ph/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-700 underline font-semibold"
                    >
                      National Wages and Productivity Commission (NWPC) / DOLE
                      MIMAROPA
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
