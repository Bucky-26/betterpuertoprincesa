import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import PageHeader from '../components/ui/PageHeader';
import { LandmarkMap } from '../components/map/LazyMaps';

// East end of the Baywalk footway (OSM way 1044151898); matches the
// statue's Google Maps pin and an unnamed historic=memorial node there.
const STATUE_LOCATION: [number, number] = [118.734173, 9.744341];
const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${STATUE_LOCATION[1]},${STATUE_LOCATION[0]}`;

// Text sourced from:
// - Palawanderer, "Ang Prinsesa ng Baybay: The Story Behind It"
// - Manila-Mania, "The Princess of the Sea" (2009)
const SOURCES = [
  {
    label: 'Palawanderer — Ang Prinsesa ng Baybay: The Story Behind It',
    href: 'https://palawanderer.net/ang-prinsesa-ng-baybay-the-story-behind-it/',
  },
  {
    label: 'Manila-Mania — The Princess of the Sea',
    href: 'http://manila-mania.blogspot.com/2009/03/princess-of-sea.html',
  },
];

export default function PrinsesaNgBaybay() {
  const { t } = useTranslation('common');
  const history = t('landmark.history', { returnObjects: true }) as string[];
  const trivia = t('landmark.trivia', { returnObjects: true }) as string[];

  return (
    <>
      <SEO
        title={t('landmark.title')}
        description={t('landmark.subtitle')}
        keywords="Prinsesa ng Baybay, Puerto Princesa Baywalk, Puerto Princesa landmark, city history"
      />
      <main className="flex-grow">
        <PageHeader
          title={t('landmark.title')}
          subtitle={t('landmark.subtitle')}
          breadcrumbs={[
            { label: t('navbar.home'), href: '/' },
            { label: t('landmark.title') },
          ]}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div className="max-w-prose space-y-10">
              <div>
                <Heading level={2}>{t('landmark.historyHeading')}</Heading>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-700">
                  {Array.isArray(history) &&
                    history.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>

              <div>
                <Heading level={2}>{t('landmark.triviaHeading')}</Heading>
                <ul className="mt-4 space-y-3">
                  {Array.isArray(trivia) &&
                    trivia.map((fact, i) => (
                      <li key={i} className="flex gap-3 text-gray-700">
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-balayong-400"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{fact}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* The statue on its own patch of shore: pink ground, bay band. */}
            <figure className="order-first lg:order-none lg:sticky lg:top-36 lg:self-start">
              <div className="overflow-hidden rounded-xl bg-balayong-100">
                <img
                  src="/prinsesa-ng-baybay.svg"
                  alt={t('landmark.title')}
                  className="mx-auto h-80 w-auto pt-8 lg:h-[26rem]"
                />
                <div className="h-6 bg-primary-800" />
              </div>
              <figcaption className="mt-3 text-sm text-gray-600">
                {t('landmark.figureCaption')}
              </figcaption>
            </figure>
          </div>
        </Section>

        <Section className="bg-balayong-50">
          <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-16">
            <div>
              <Heading level={2}>{t('landmark.locationHeading')}</Heading>
              <p className="flex gap-2 text-lg leading-relaxed text-gray-700">
                <MapPin
                  className="mt-1.5 h-5 w-5 shrink-0 text-balayong-600"
                  aria-hidden="true"
                />
                {t('landmark.locationBody')}
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-primary-700 px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-800"
              >
                {t('landmark.openInGoogleMaps')}
              </a>
            </div>
            <LandmarkMap
              center={STATUE_LOCATION}
              label={t('landmark.mapLabel')}
              zoom={15}
            />
          </div>
        </Section>

        <Section>
          <div className="max-w-prose">
            <Heading level={3}>{t('landmark.sourcesHeading')}</Heading>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {SOURCES.map(s => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary-700"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>
    </>
  );
}
