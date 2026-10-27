/**
 * Scraper for PALECO (Palawan Electric Cooperative) & PPCWD (Puerto Princesa City Water District)
 * Fetches latest power advisories, outage bulletins, water interruptions, and utility news
 * directly from official WordPress REST API endpoints.
 *
 * Run manually or via CI cron:
 *   npm run scrape:utilities
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(
  __dirname,
  '../src/data/utilityAdvisories.json'
);

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9,fil;q=0.8',
  'Cache-Control': 'no-cache',
};

// All 66 official barangays of Puerto Princesa City + notable zones/landmarks
const PPC_BARANGAYS = [
  'Babuyan',
  'Bacungan',
  'Bagong Bayan',
  'Bagong Pag-asa',
  'Bagong Sikat',
  'Bagong Silang',
  'Bahile',
  'Bancao-Bancao',
  'Barangay ng mga Mangingisda',
  'Binduyan',
  'Buenavista',
  'Cabayugan',
  'Concepcion',
  'Inagawan',
  'Inagawan Sub-Colony',
  'Irawan',
  'Iwahig',
  'Kalipay',
  'Kamuning',
  'Langogan',
  'Liwanag',
  'Lucbuan',
  'Luzviminda',
  'Mabuhay',
  'Macarascas',
  'Magkakaibigan',
  'Maligaya',
  'Manalo',
  'Mandaragat',
  'Manggahan',
  'Maningning',
  'Maoyon',
  'Marufinas',
  'Maruyogon',
  'Masigla',
  'Masikap',
  'Masipag',
  'Matahimik',
  'Matiyaga',
  'Maunlad',
  'Milagrosa',
  'Model',
  'Montible',
  'Napsan',
  'New Panggangan',
  'Pagkakaisa',
  'Princesa',
  'Salvacion',
  'San Jose',
  'San Manuel',
  'San Miguel',
  'San Pedro',
  'San Rafael',
  'Santa Cruz',
  'Santa Lourdes',
  'Santa Lucia',
  'Santa Monica',
  'Seaside',
  'Sicsican',
  'Simpocan',
  'Tagabinet',
  'Tagabinit',
  'Tagburos',
  'Tagumpay',
  'Tanabag',
  'Tanglaw',
  'Tiniguiban',
];

const LOCAL_ZONES = [
  'Abanico',
  'Baltan',
  'Chariot',
  'Paleco Compound',
  'Wescom',
  'BM Road',
  'Mitra Road',
  'Libis',
  'Rafols',
  'Jacana',
  'Rizal Avenue',
  'Malvar',
  'Valencia',
  'Bgy. Tiniguiban Heights',
  'Campo',
];

/**
 * Decode common HTML entities and strip unwanted HTML tags while preserving line breaks.
 */
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

/**
 * Detect mentioned Puerto Princesa barangays and notable areas in text.
 */
function extractAffectedAreas(text) {
  const detected = new Set();
  const lower = text.toLowerCase();

  for (const b of PPC_BARANGAYS) {
    const bLower = b.toLowerCase();

    // Special cases for generic words or "Puerto Princesa"
    if (b === 'Princesa') {
      if (
        /\b(?:brgy\.?|barangay)\s+princesa\b/i.test(text) ||
        /\bprincesa\b/i.test(text.replace(/puerto\s+princesa/gi, ''))
      ) {
        detected.add(b);
      }
      continue;
    }

    if (
      b === 'Model' ||
      b === 'Seaside' ||
      b === 'Liwanag' ||
      b === 'Mabuhay'
    ) {
      if (
        new RegExp(`\\b(?:brgy\\.?|barangay)\\s+${bLower}\\b`, 'i').test(
          text
        ) ||
        new RegExp(`\\b${b}\\b`).test(text) // exact capital match
      ) {
        detected.add(b);
      }
      continue;
    }

    // Standard check
    const wordBoundaryRegex = new RegExp(
      `\\b${bLower.replace(/[-]/g, '[- ]')}\\b`,
      'i'
    );
    if (
      wordBoundaryRegex.test(lower) ||
      lower.includes(`brgy. ${bLower}`) ||
      lower.includes(`brgy ${bLower}`) ||
      lower.includes(`barangay ${bLower}`)
    ) {
      detected.add(b);
    }
  }

  for (const z of LOCAL_ZONES) {
    const zRegex = new RegExp(`\\b${z.toLowerCase()}\\b`, 'i');
    if (zRegex.test(lower)) {
      detected.add(z);
    }
  }

  return Array.from(detected);
}

/**
 * Extract feeder references (e.g. Feeder 1, Feeder 2, Feeder 4, Feeder 7, etc.)
 */
function extractFeeders(text) {
  const feeders = new Set();
  const matches = text.matchAll(/\b(?:Feeder|FDR)\s*#?\s*([0-9]+[A-Z]?)\b/gi);
  for (const m of matches) {
    feeders.add(`Feeder ${m[1]}`);
  }
  return Array.from(feeders);
}

/**
 * Parse PALECO WordPress post into standard UtilityAdvisory object
 */
function parsePalecoPost(post) {
  const rawTitle = post.title?.rendered || '';
  const rawContent = post.content?.rendered || '';
  const rawExcerpt = post.excerpt?.rendered || '';

  const title = cleanHtml(rawTitle);
  const cleanContent = cleanHtml(rawContent);
  const cleanExcerpt = cleanHtml(rawExcerpt);
  const fullText = `${title}\n${cleanContent}\n${cleanExcerpt}`;

  // Structured extraction from PALECO advisory templates
  const timeOutMatch = fullText.match(
    /(?:Oras\s*(?:Na)?\s*Nawalan|Time\s*(?:of)?\s*Interruption):\s*([^\n\r]+)/i
  );
  const timeRestoredMatch = fullText.match(
    /(?:Oras\s*(?:Na)?\s*Naibalik|Time\s*(?:of)?\s*Restoration):\s*([^\n\r]+)/i
  );
  const reasonMatch = fullText.match(
    /(?:Detalye|Dahilan|Reason|Cause):\s*([^\n\r]+)/i
  );
  const dateMentionMatch = fullText.match(/(?:Petsa|Date):\s*([^\n\r]+)/i);

  const affectedAreas = extractAffectedAreas(fullText);
  const feeders = extractFeeders(fullText);

  // Determine status
  let status = 'Advisory';
  const isFinalUpdate = /Final\s*Update/i.test(title);
  const hasRestoredTime = Boolean(timeRestoredMatch);
  const isScheduled =
    /Scheduled\s*Power\s*Interruption/i.test(title) ||
    /Pabatid/i.test(title) ||
    /Nakatakdang/i.test(title);

  if (isFinalUpdate || hasRestoredTime) {
    status = 'Restored';
  } else if (isScheduled) {
    status = 'Scheduled';
  } else if (/Emergency/i.test(title) || timeOutMatch) {
    status = 'Ongoing / Investigating';
  }

  // Determine category
  let category = 'power-advisory';
  if (isScheduled) {
    category = 'power-interruption';
  } else if (
    /Power\s*Service\s*Advisory/i.test(title) ||
    /Outage/i.test(title) ||
    /Brownout/i.test(title)
  ) {
    category = 'power-outage';
  } else if (/Warriors of Light|Line clearing|Tapping/i.test(title)) {
    category = 'maintenance';
  } else if (/Bid|Registration|Power Run|Tuklas/i.test(title)) {
    category = 'news';
  }

  // Generate clean concise summary
  let summary = '';
  if (timeOutMatch || timeRestoredMatch || reasonMatch) {
    const parts = [];
    if (dateMentionMatch) parts.push(`Date: ${dateMentionMatch[1].trim()}`);
    if (timeOutMatch) parts.push(`Outage: ${timeOutMatch[1].trim()}`);
    if (timeRestoredMatch)
      parts.push(`Restored: ${timeRestoredMatch[1].trim()}`);
    if (reasonMatch) parts.push(`Details: ${reasonMatch[1].trim()}`);
    summary = parts.join(' • ');
  } else if (cleanExcerpt) {
    summary = cleanExcerpt.replace(/\.\.\.$/, '').slice(0, 260) + '...';
  } else {
    summary =
      cleanContent.slice(0, 260) + (cleanContent.length > 260 ? '...' : '');
  }

  return {
    id: `paleco-${post.id}`,
    source: 'PALECO',
    providerName: 'Palawan Electric Cooperative',
    utilityType: 'Electric Power',
    title,
    date: post.date || post.date_gmt,
    url: post.link,
    category,
    status,
    isUrgent: status === 'Ongoing / Investigating',
    timeOut: timeOutMatch ? timeOutMatch[1].trim() : undefined,
    timeRestored: timeRestoredMatch ? timeRestoredMatch[1].trim() : undefined,
    reason: reasonMatch ? reasonMatch[1].trim() : undefined,
    affectedAreas,
    feeders,
    summary,
    rawContentSnippet: cleanContent.slice(0, 800),
  };
}

/**
 * Parse PPCWD WordPress post into standard UtilityAdvisory object
 */
function parsePpcwdPost(post) {
  const rawTitle = post.title?.rendered || '';
  const rawContent = post.content?.rendered || '';
  const rawExcerpt = post.excerpt?.rendered || '';

  const title = cleanHtml(rawTitle);
  const cleanContent = cleanHtml(rawContent);
  const cleanExcerpt = cleanHtml(rawExcerpt);
  const fullText = `${title}\n${cleanContent}\n${cleanExcerpt}`;

  const affectedAreas = extractAffectedAreas(fullText);

  // Categorize PPCWD post
  let category = 'water-advisory';
  let status = 'Advisory';

  const isInterruption =
    /Interruption|Low\s*Pressure|Water\s*Advisories|Water\s*Cut|Maintenance|Pipeline/i.test(
      title
    );
  const isEmergency = /Emergency|Leak|Emergency\s*Repair/i.test(fullText);
  const isQuality = /Laboratory|Testing|Safe\s*Water|Potability/i.test(
    fullText
  );

  if (isInterruption) {
    category = 'water-interruption';
    status = isEmergency ? 'Ongoing / Emergency' : 'Scheduled / Advisory';
  } else if (isQuality) {
    category = 'water-quality';
    status = 'Info';
  } else if (/Transmission\s*Line|Inaugurates|Project|Works/i.test(title)) {
    category = 'maintenance';
    status = 'Project Update';
  } else {
    category = 'news';
    status = 'Official News';
  }

  let summary = '';
  if (cleanExcerpt && cleanExcerpt.length > 30) {
    summary = cleanExcerpt.replace(/\.\.\.$/, '').slice(0, 260) + '...';
  } else {
    summary =
      cleanContent.slice(0, 260) + (cleanContent.length > 260 ? '...' : '');
  }

  return {
    id: `ppcwd-${post.id}`,
    source: 'PPCWD',
    providerName: 'Puerto Princesa City Water District',
    utilityType: 'Water Supply',
    title,
    date: post.date || post.date_gmt,
    url: post.link,
    category,
    status,
    isUrgent: isEmergency,
    affectedAreas,
    summary,
    rawContentSnippet: cleanContent.slice(0, 800),
  };
}

/**
 * Fetch PALECO posts from WP REST API
 */
async function fetchPaleco() {
  console.log('[PALECO] Fetching latest posts from paleco.net...');
  // Category IDs: 58 = POWER_ADVISORY, 9 = INTERRUPTIONS, 11 = ADVISORIES, 10 = INFORMATIONS
  const url =
    'https://paleco.net/paleco/wp-json/wp/v2/posts?categories=58,9,11,10&per_page=20';

  const res = await fetch(url, { headers: REQUEST_HEADERS });
  if (!res.ok) {
    throw new Error(`PALECO responded with HTTP status ${res.status}`);
  }

  const posts = await res.json();
  if (!Array.isArray(posts)) {
    throw new Error('PALECO returned unexpected non-array response');
  }

  console.log(`[PALECO] Successfully received ${posts.length} posts.`);
  return posts.map(parsePalecoPost);
}

/**
 * Fetch PPCWD posts from WP REST API
 */
async function fetchPpcwd() {
  console.log('[PPCWD] Fetching latest posts from ppcwater.gov.ph...');
  const url = 'https://ppcwater.gov.ph/wp-json/wp/v2/posts?per_page=20';

  const res = await fetch(url, { headers: REQUEST_HEADERS });
  if (!res.ok) {
    throw new Error(`PPCWD responded with HTTP status ${res.status}`);
  }

  const posts = await res.json();
  if (!Array.isArray(posts)) {
    throw new Error('PPCWD returned unexpected non-array response');
  }

  console.log(`[PPCWD] Successfully received ${posts.length} posts.`);
  return posts.map(parsePpcwdPost);
}

/**
 * Main scraper workflow
 */
async function main() {
  console.log('--- Starting Utility Advisories Scraper (PALECO & PPCWD) ---');

  let existingData = null;
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    } catch {
      existingData = null;
    }
  }

  let palecoItems = [];
  let ppcwdItems = [];

  // Fetch PALECO
  try {
    palecoItems = await fetchPaleco();
  } catch (err) {
    console.warn('[PALECO] Scrape failed:', err.message);
    if (existingData?.advisories) {
      console.log('[PALECO] Preserving existing cached PALECO records.');
      palecoItems = existingData.advisories.filter(a => a.source === 'PALECO');
    }
  }

  // Fetch PPCWD
  try {
    ppcwdItems = await fetchPpcwd();
  } catch (err) {
    console.warn('[PPCWD] Scrape failed:', err.message);
    if (existingData?.advisories) {
      console.log('[PPCWD] Preserving existing cached PPCWD records.');
      ppcwdItems = existingData.advisories.filter(a => a.source === 'PPCWD');
    }
  }

  // Combine and sort by date descending
  const combined = [...palecoItems, ...ppcwdItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const payload = {
    metadata: {
      lastUpdated: new Date().toISOString(),
      palecoCount: palecoItems.length,
      ppcwdCount: ppcwdItems.length,
      totalCount: combined.length,
      sources: [
        {
          name: 'PALECO',
          fullName: 'Palawan Electric Cooperative',
          url: 'https://paleco.net/',
          emergencyHotline: '0917 553 2836 / (048) 433-9144',
          apiEndpoint: 'https://paleco.net/paleco/wp-json/wp/v2/posts',
        },
        {
          name: 'PPCWD',
          fullName: 'Puerto Princesa City Water District',
          url: 'https://ppcwater.gov.ph/',
          emergencyHotline: '0917 310 8865 / (048) 433-2342',
          apiEndpoint: 'https://ppcwater.gov.ph/wp-json/wp/v2/posts',
        },
      ],
    },
    advisories: combined,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(
    `\nSuccessfully saved ${combined.length} advisories to ${OUTPUT_FILE}`
  );
  console.log(`- PALECO advisories: ${palecoItems.length}`);
  console.log(`- PPCWD advisories: ${ppcwdItems.length}`);
  console.log('--- Scrape Finished ---');
}

main().catch(err => {
  console.error('Fatal scraper error:', err);
  process.exit(1);
});
