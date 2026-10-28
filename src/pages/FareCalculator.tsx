import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  ArrowRightLeft,
  MapPin,
  AlertTriangle,
  FileCheck2,
  Phone,
  ShieldAlert,
  CheckCircle2,
  BadgePercent,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import { LOCATIONS, calculateFare } from '../data/fareMatrix';

export default function FareCalculator() {
  const { t } = useTranslation('common');
  const [originId, setOriginId] = useState<string>('poblacion-center');
  const [destinationId, setDestinationId] =
    useState<string>('san-jose-terminal');
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);

  const swapLocations = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  const fareResult = useMemo(() => {
    return calculateFare(originId, destinationId, isDiscounted);
  }, [originId, destinationId, isDiscounted]);

  return (
    <>
      <SEO
        title="Tricycle Fare Calculator & Route Taripa"
        description="Official Puerto Princesa City ordinance-based tricycle fare estimator with 20% student, senior, and PWD discount calculations and CTMO complaint hotlines."
        keywords="Puerto Princesa tricycle fare, taripa Puerto Princesa, tricycle calculator, student discount tricycle, CTMO Puerto Princesa, San Jose terminal fare"
      />
      <main className="flex-grow">
        <PageHeader
          title="Tricycle Fare Calculator"
          subtitle="Estimate authorized point-to-point tricycle fares based on official City Council (Sangguniang Panlungsod) Taripa guidelines."
          breadcrumbs={[
            { label: t('navbar.home'), href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Tricycle Fare Calculator' },
          ]}
        />

        <Section>
          <div className="grid gap-8 lg:grid-cols-12 max-w-5xl mx-auto">
            {/* Interactive Calculator Box */}
            <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-primary-700">
                  <Calculator className="h-6 w-6" />
                  <h2 className="font-display text-xl font-bold text-gray-900">
                    Route & Fare Estimator
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-balayong-100 text-balayong-800">
                  City Ordinance Tariff
                </span>
              </div>

              {/* Origin Selection */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="origin-select"
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Origin (Where are you coming from?)
                  </label>
                  <select
                    id="origin-select"
                    value={originId}
                    onChange={e => setOriginId(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.zone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap button */}
                <div className="flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={swapLocations}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-balayong-50 hover:text-balayong-700 transition-colors"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    Swap Origin and Destination
                  </button>
                </div>

                {/* Destination Selection */}
                <div>
                  <label
                    htmlFor="dest-select"
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <MapPin className="h-4 w-4 text-primary-600" />
                    Destination (Where are you going?)
                  </label>
                  <select
                    id="dest-select"
                    value={destinationId}
                    onChange={e => setDestinationId(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.zone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Switch */}
                <div className="pt-3 border-t border-gray-100">
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-balayong-200 bg-balayong-50/60 cursor-pointer hover:bg-balayong-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isDiscounted}
                      onChange={e => setIsDiscounted(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-balayong-600 focus:ring-balayong-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">
                          Apply Mandatory 20% Discount
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-balayong-700 bg-balayong-200/70 px-1.5 py-0.5 rounded">
                          <BadgePercent className="h-3 w-3" /> 20% OFF
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Eligible for <strong>Students</strong> (including
                        weekends &amp; holidays per RA 11314),{' '}
                        <strong>Senior Citizens</strong> (RA 9994), and{' '}
                        <strong>Persons with Disabilities</strong> (RA 10754)
                        with valid ID.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Fare Result Output Box */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary-800 to-primary-900 p-6 sm:p-8 text-white shadow-lg">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-200">
                  Estimated Authorized Fare
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-extrabold text-balayong-200 tabular-nums">
                    ₱{fareResult.fare.toFixed(2)}
                  </span>
                  <span className="text-sm text-primary-200">
                    per passenger
                  </span>
                </div>

                {isDiscounted && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-balayong-500/30 px-3 py-1 text-xs text-balayong-100 border border-balayong-300/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-balayong-200" />
                    20% Discount applied (Regular: ₱
                    {calculateFare(originId, destinationId, false).fare.toFixed(
                      2
                    )}
                    )
                  </div>
                )}

                <div className="mt-6 space-y-3 rounded-xl bg-primary-950/40 p-4 border border-primary-700/50 text-xs">
                  <div className="flex justify-between text-primary-100">
                    <span>Approx. Travel Distance:</span>
                    <strong className="text-white tabular-nums">
                      {fareResult.distanceKm} km
                    </strong>
                  </div>
                  <div className="flex justify-between text-primary-100">
                    <span>Base Fare (First 2.0 km):</span>
                    <strong className="text-white tabular-nums">
                      ₱{fareResult.baseFare.toFixed(2)}
                    </strong>
                  </div>
                  {!fareResult.isBaseOnly && (
                    <div className="flex justify-between text-primary-100">
                      <span>
                        Additional Distance ({fareResult.distanceKm - 2.0} km):
                      </span>
                      <strong className="text-white tabular-nums">
                        ₱{fareResult.excessFare.toFixed(2)}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-[11px] text-primary-200 space-y-1">
                  <p>
                    • Estimated for regular public route trips within city
                    roads.
                  </p>
                  <p>
                    • Charter trips (exclusive &quot;pakyaw&quot;) are
                    negotiated or 2-3 passenger equivalent.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-primary-700/60 flex items-center justify-between text-xs text-primary-200">
                <span>Ref: Puerto Princesa SP Taripa</span>
                <a
                  href="/services/infrastructure-public-works/settle-traffic-violation-or-contest-citation"
                  className="underline hover:text-white"
                >
                  CTMO Guidelines
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Passenger Rights & How to Report Overcharging */}
        <Section className="bg-balayong-50 !pt-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <Heading level={2}>Passenger Rights & Taripa Enforcement</Heading>
              <Text className="text-gray-700 mt-2">
                Every motorized tricycle operating in Puerto Princesa City is
                bound by local ordinance and regulatory board standards to
                ensure fair and safe transportation.
              </Text>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="rounded-xl border border-balayong-200 bg-white p-5 shadow-xs">
                <FileCheck2 className="h-6 w-6 text-primary-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">
                  Mandatory Taripa Display
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Drivers must display the laminated official City Fare Matrix
                  conspicuously inside the passenger cab facing the passengers
                  at all times.
                </p>
              </div>

              <div className="rounded-xl border border-balayong-200 bg-white p-5 shadow-xs">
                <BadgePercent className="h-6 w-6 text-balayong-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">
                  Student & Senior Discounts
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The 20% discount is mandated by national law across all days
                  of the year (including summer, weekends, and holidays) upon
                  presentation of an ID.
                </p>
              </div>

              <div className="rounded-xl border border-balayong-200 bg-white p-5 shadow-xs">
                <ShieldAlert className="h-6 w-6 text-amber-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">
                  No Passenger Refusal
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Drivers along designated franchised routes may not refuse to
                  convey passengers within their authorized territory.
                </p>
              </div>
            </div>

            {/* Overcharging Complaint Process */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-amber-950">
                    What to do if you are overcharged or refused service:
                  </h3>
                  <ol className="list-decimal list-inside text-xs text-amber-900 space-y-1.5 leading-relaxed">
                    <li>
                      <strong>Take note of the Tricycle Body Number:</strong>{' '}
                      This 3-to-4 digit number is painted prominently on both
                      sides and the rear of the sidecar.
                    </li>
                    <li>
                      <strong>
                        Note the Plate Number &amp; Time/Location:
                      </strong>{' '}
                      Note the date, time, and exact route where the incident
                      occurred.
                    </li>
                    <li>
                      <strong>File a Complaint:</strong> Report the unit to the{' '}
                      <strong>City Traffic Management Office (CTMO)</strong> or
                      any on-duty police officer/barangay tanod.
                    </li>
                  </ol>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-amber-700" />
                      CTMO Desk: (048) 717-8000
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-amber-700" />
                      PNP Station 1: 0917 311 5746
                    </span>
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
