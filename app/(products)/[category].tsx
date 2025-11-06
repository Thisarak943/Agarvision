// app/(products)/[category].tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type CategorySlug =
  | 'chips'
  | 'oud-oil'
  | 'perfumes'
  | 'incence'
  // extra detailed pages you can use later:
  | 'wood-beads'
  | 'agar-powder'
  | 'hydrosol'
  | 'burners'
  | 'gift-sets';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 240;

type ToneKey = 'emerald' | 'rose' | 'amber' | 'indigo' | 'cyan';

const toneToClasses: Record<
  ToneKey,
  { ring: string; bg: string; badge: string; shadow: string; tint: string }
> = {
  emerald: {
    ring: 'ring-emerald-400',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-800',
    shadow: 'shadow-emerald-200',
    tint: '#10B981',
  },
  rose: {
    ring: 'ring-rose-400',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-800',
    shadow: 'shadow-rose-200',
    tint: '#F43F5E',
  },
  amber: {
    ring: 'ring-amber-400',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-900',
    shadow: 'shadow-amber-200',
    tint: '#F59E0B',
  },
  indigo: {
    ring: 'ring-indigo-400',
    bg: 'bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-800',
    shadow: 'shadow-indigo-200',
    tint: '#6366F1',
  },
  cyan: {
    ring: 'ring-cyan-400',
    bg: 'bg-cyan-50',
    badge: 'bg-cyan-100 text-cyan-800',
    shadow: 'shadow-cyan-200',
    tint: '#06B6D4',
  },
};

// ------- DATA MODEL -------
type CategoryData = {
  title: string;
  heroIcon?: any;
  heroImage?: any;
  description: string;
  badges: string[];
  features: string[];             // “Highlights”
  specs: Array<{ label: string; value: string }>;
  gallery: any[];
  aroma?: Array<{ note: 'Top' | 'Heart' | 'Base'; facets: string[] }>;
  origin?: { regions: string[]; sourcingNotes: string };
  grading?: string[];             // simple ordered bullets
  processing?: string[];          // QA / process steps
  usage?: string[];               // use & care
  compliance?: string[];          // safety & compliance
  sustainability?: string[];      // responsibility
  faqs?: Array<{ q: string; a: string }>;
  tone: ToneKey;
};

const CATEGORY_DATA: Record<CategorySlug, CategoryData> = {
  // ===== CHIPS =====
  'chips': {
    title: 'Agarwood Chips',
    heroIcon: require('../../assets/icons/chips.png'),
    heroImage: require('../../assets/images/chips2.jpg'),
    description:
      'Premium-grade agarwood chips graded for resin density, origin, and aroma profile. Ideal for personal use, gifting, or small-batch incense blends.',
    badges: ['Premium Grade', 'Batch Tracked', 'Low Moisture'],
    features: [
      'Resin-density grading & moisture check',
      'Smoke profile & ignition testing',
      'Batch-level origin traceability',
      'Humidity-safe, resealable packaging',
    ],
    specs: [
      { label: 'Moisture', value: '6–8% RH' },
      { label: 'Cut', value: 'Mixed shards & splinters' },
      { label: 'Packaging', value: 'Vacuum-sealed 50g / 100g' },
      { label: 'Use', value: 'Heating, fumigation, blending' },
    ],
    gallery: [
      require('../../assets/images/chips1.jpg'),
      require('../../assets/images/chips3.jpg'),
      require('../../assets/images/chips2.jpg'),
    ],
    aroma: [
      { note: 'Top', facets: ['Dry balsamic', 'Light smoke', 'Resin lift'] },
      { note: 'Heart', facets: ['Sweet woody', 'Ambered', 'Honeyed'] },
      { note: 'Base', facets: ['Deep resin', 'Leather nuance', 'Bitter-sweet'] },
    ],
    origin: {
      regions: ['Sri Lanka', 'Cambodia', 'Laos'],
      sourcingNotes:
        'Selected from long-cured stock; batches recorded with harvest & curing metadata for traceability.',
    },
    grading: [
      'Visual density of resin (veining, darkness)',
      'Ignition quality & smoke character',
      'Moisture measurement (target 6–8%)',
      'Foreign matter removal & hand-trimming',
    ],
    processing: [
      'Hand selection and density sorting',
      'Moisture equilibration & QC logging',
      'Sensory panel smoke evaluation',
      'Vacuum seal & label with batch ID',
    ],
    usage: [
      'Use a mica plate or low-heat heater—avoid direct flame to reduce charring.',
      'Store cool & dry (≤25°C); reseal after each use.',
      'Blend tiny shards to modulate smoke character.',
    ],
    compliance: [
      'Non-food product. Keep away from children.',
      'Indoor burning: ensure ventilation.',
      'No additives; batch notes available upon request.',
    ],
    sustainability: [
      'Preference for cultivated sources where available.',
      'Traceable lots; documents for customs on request.',
      'Packaging chosen to reduce moisture loss and waste.',
    ],
    faqs: [
      { q: 'Can I crush chips into powder?', a: 'Yes—use a clean grinder and store in airtight jars; expect faster aroma release but reduced longevity.' },
      { q: 'Why do chip colors vary?', a: 'Natural resin distribution and origin cause color variation; grading focuses on performance, not just color.' },
    ],
    tone: 'emerald',
  },

  // ===== OUD OIL =====
  'oud-oil': {
    title: 'Oud Oil',
    heroIcon: require('../../assets/icons/oil.png'),
    heroImage: require('../../assets/images/oil3.jpg'),
    description:
      'Single-origin oud oil distilled for a balanced, long-lasting sillage. Crafted for collectors and luxury perfume houses.',
    badges: ['Single Origin', 'GC-MS Ready', 'Macerated'],
    features: [
      'Consistent aroma profile by batch',
      'Aging & maceration guidance',
      'Purity with dilution best practices',
      'Amber bottle, light-protected storage',
    ],
    specs: [
      { label: 'Purity', value: '100% (no extenders)' },
      { label: 'Aging', value: '6–18 months' },
      { label: 'Bottle', value: '3ml / 6ml / 12ml' },
      { label: 'Use', value: 'Layering, attars, EDP base' },
    ],
    gallery: [
      require('../../assets/images/oil1.jpg'),
      require('../../assets/images/oil2.jpg'),
      require('../../assets/images/oil4.jpg'),
    ],
    aroma: [
      { note: 'Top', facets: ['Bright balsam', 'Citrus lift'] },
      { note: 'Heart', facets: ['Animalic-woody', 'Honeyed amber'] },
      { note: 'Base', facets: ['Leathered resin', 'Long drydown'] },
    ],
    origin: {
      regions: ['Sri Lanka', 'Cambodia'],
      sourcingNotes:
        'Hydro-distilled from chipped heartwood; cuts blended to unify profile; batch sample retained.',
    },
    grading: [
      'Pre-distillation chip quality & moisture',
      'Fraction cuts (head/heart/base) composition',
      'GC-MS optional report per batch',
    ],
    processing: [
      'Careful soak & hydro-distillation',
      'Resting & maceration (light-protected)',
      'Organoleptic panel & recordkeeping',
    ],
    usage: [
      'Apply tiny swipe on pulse points; avoid fabrics.',
      'For perfumery, start at 1–3% in base; adjust to taste.',
      'Store cool, dark; minimize air exposure.',
    ],
    compliance: [
      'Cosmetic use external only; patch test first.',
      'IFRA considerations depend on finished formula.',
    ],
    sustainability: [
      'Small-batch sourcing; exploring cultivated inputs.',
      'Glass bottles; recyclable outer packaging.',
    ],
    faqs: [
      { q: 'Why does color deepen over time?', a: 'Natural oxidation and maceration darken hue and can round sharp facets—it’s normal.' },
      { q: 'Does viscosity indicate quality?', a: 'Not directly. Aroma development, balance, and longevity are better indicators.' },
    ],
    tone: 'rose',
  },

  // ===== PERFUMES =====
  'perfumes': {
    title: 'Perfumes',
    heroIcon: require('../../assets/icons/perfume.png'),
    heroImage: require('../../assets/images/perfume3.jpg'),
    description:
      'Curated perfume lines featuring natural agarwood accents and balanced florals, citrus, and ambers—formulated for daily wear.',
    badges: ['IFRA Mindful', 'Skin-safe', 'Everyday Wear'],
    features: [
      'Top/Heart/Base balance & longevity',
      'Stability and compatibility checks',
      'Batch and lot labelling',
      'Private-label options available',
    ],
    specs: [
      { label: 'Concentration', value: 'EDT / EDP' },
      { label: 'Longevity', value: '6–10 hours' },
      { label: 'Bottle', value: '30ml / 50ml / 100ml' },
      { label: 'Use', value: 'Daily, special occasions' },
    ],
    gallery: [
      require('../../assets/images/perfume4.jpg'),
      require('../../assets/images/perfume1.jpg'),
      require('../../assets/images/perfume2.jpg'),
    ],
    aroma: [
      { note: 'Top', facets: ['Citrus zest', 'Green sparkle'] },
      { note: 'Heart', facets: ['Jasmine/rose accord', 'Oud whisper'] },
      { note: 'Base', facets: ['Amber-woody', 'Musk'] },
    ],
    origin: {
      regions: ['Blend (multi-origin ingredients)'],
      sourcingNotes:
        'Oils & absolutes vetted for quality and IFRA documentation; fixatives chosen for stability.',
    },
    grading: [
      'Accelerated stability (heat/shake)',
      'Color, clarity, phase separation',
      'Pre-shipment panel verification',
    ],
    processing: [
      'Measured blend & chilled rest',
      'Filter polish & bottle fill',
      'Batch label & documentation',
    ],
    usage: [
      '2–4 sprays at 20–30cm distance.',
      'Avoid direct sunlight on bottle; store cool.',
    ],
    compliance: [
      'IFRA categories per final formula.',
      'Allergens labelled where applicable.',
    ],
    sustainability: [
      'Refill options planned; recyclable glass.',
      'Supplier code aligned with fair sourcing.',
    ],
    faqs: [
      { q: 'Why does it smell different outdoors?', a: 'Temperature, humidity, and airflow alter perception; base notes project better in warmth.' },
    ],
    tone: 'amber',
  },

  // ===== INCENSE =====
  'incence': {
    title: 'Incense',
    heroIcon: require('../../assets/icons/incence.png'),
    heroImage: require('../../assets/images/incense1.jpg'),
    description:
      'Hand-rolled incense with calibrated burn rate and fragrance throw—crafted for consistent rituals and calm indoor burn.',
    badges: ['Hand Rolled', 'Calibrated Burn', 'Low Smoke'],
    features: [
      'Binder & charcoal proportion tuning',
      'Even burn with minimal ash',
      'Fragrance throw testing',
      'Moisture-controlled packaging',
    ],
    specs: [
      { label: 'Burn Time', value: '30–45 mins / stick' },
      { label: 'Form', value: 'Sticks / Cones' },
      { label: 'Count', value: '20 / 50 / 100' },
      { label: 'Use', value: 'Meditation, ambience' },
    ],
    gallery: [
      require('../../assets/images/incense2.jpg'),
      require('../../assets/images/incense3.jpg'),
      require('../../assets/images/incense4.jpg'),
    ],
    aroma: [
      { note: 'Top', facets: ['Gentle smoke'] },
      { note: 'Heart', facets: ['Warm woody'] },
      { note: 'Base', facets: ['Resinous, calm'] },
    ],
    origin: {
      regions: ['Sri Lanka'],
      sourcingNotes:
        'Base powders screened for consistency; fragrance additions standardized by batch.',
    },
    grading: [
      'Stick density & straightness',
      'Ignition time and stability',
      'Ash consistency',
    ],
    processing: [
      'Powder prep & hydration window',
      'Hand rolling & air-dry',
      'Controlled RH cure & box pack',
    ],
    usage: [
      'Use a stable holder; ensure airflow.',
      'Do not leave unattended.',
      'Keep sticks dry; reseal after opening.',
    ],
    compliance: [
      'Indoor use—ventilation recommended.',
      'Keep away from children and pets.',
    ],
    sustainability: [
      'Paper-based cartons; reduced plastic.',
      'Optimized shipping pack density.',
    ],
    faqs: [
      { q: 'Why is smoke too strong sometimes?', a: 'Lower draft or try half-stick burns; humidity can also affect smoke feel.' },
    ],
    tone: 'indigo',
  },

  // ===== EXTRA DETAIL PAGES (optional to link later) =====
  'wood-beads': {
    title: 'Agarwood Beads',
    heroIcon: require('../../assets/icons/chips.png'),
    heroImage: require('../../assets/images/quality.jpg'),
    description:
      'Hand-carved agarwood beads with natural grain and light resin aroma—made for bracelets and mala strings.',
    badges: ['Hand Carved', 'Natural Grain', 'Light Aroma'],
    features: ['Consistent sizing', 'Silk/elastic threading', 'Matte finish'],
    specs: [
      { label: 'Diameter', value: '6–10 mm' },
      { label: 'Finish', value: 'Matte' },
      { label: 'Thread', value: 'Silk/Elastic' },
      { label: 'Use', value: 'Bracelets, mala' },
    ],
    gallery: [require('../../assets/images/quality.jpg')],
    tone: 'cyan',
    origin: { regions: ['Sri Lanka'], sourcingNotes: 'From chips-grade wood with stable density.' },
    grading: ['Roundness tolerance', 'Drill hole centering', 'Surface uniformity'],
    processing: ['Rough shape', 'Lathe finish', 'Bead polish & string test'],
    usage: ['Avoid soaking; wipe with dry cloth', 'Store away from perfumes'],
    compliance: ['Non-toy item'],
    sustainability: ['Small-batch making to reduce waste'],
    faqs: [{ q: 'Do beads smell strongly?', a: 'A gentle natural aroma; not as intense as heated chips.' }],
  },
  'agar-powder': {
    title: 'Agarwood Powder',
    heroIcon: require('../../assets/icons/chips.png'),
    heroImage: require('../../assets/images/market.jpg'),
    description:
      'Finely milled agarwood powder for incense blends and experimental perfumery tinctures.',
    badges: ['Fine Grind', 'Blend-Ready'],
    features: ['Uniform milling', 'Low moisture', 'Easy blending'],
    specs: [
      { label: 'Mesh', value: '80–120' },
      { label: 'Moisture', value: '6–8% RH' },
      { label: 'Pack', value: '250g / 500g' },
      { label: 'Use', value: 'Incense blends, tinctures' },
    ],
    gallery: [require('../../assets/images/market.jpg')],
    tone: 'emerald',
    origin: { regions: ['Sri Lanka'], sourcingNotes: 'From graded chip selections.' },
    grading: ['Mesh uniformity', 'Moisture target', 'Foreign matter removal'],
    processing: ['Grind', 'Sieve', 'Vacuum seal'],
    usage: ['Blend with makko/binders', 'Store airtight'],
    compliance: ['Not for ingestion'],
    sustainability: ['Uses off-cuts to minimize waste'],
    faqs: [{ q: 'Will powder lose aroma faster?', a: 'Slightly faster than chips—airtight storage is key.' }],
  },
  'hydrosol': {
    title: 'Oud Hydrosol',
    heroIcon: require('../../assets/icons/oil.png'),
    heroImage: require('../../assets/images/diesease.jpg'),
    description:
      'Steam-distilled hydrosol capturing delicate top notes of agarwood—room mist and skincare friendly (patch test).',
    badges: ['Steam Distilled', 'Delicate Top Notes'],
    features: ['Light oud nuance', 'Mist-friendly', 'Cooling'],
    specs: [
      { label: 'pH', value: '5.5–6.0' },
      { label: 'Pack', value: '100ml / 250ml' },
      { label: 'Use', value: 'Room mist, linen, skincare (test)' },
      { label: 'Storage', value: 'Cool & dark' },
    ],
    gallery: [require('../../assets/images/diesease.jpg')],
    tone: 'rose',
    origin: { regions: ['Sri Lanka'], sourcingNotes: 'Byproduct of oil distillation—filtered and rested.' },
    grading: ['Clarity', 'Aroma stability', 'Micro safety (where applicable)'],
    processing: ['Distill', 'Cool & filter', 'Bottle'],
    usage: ['Mist from 20–30cm', 'Avoid eyes; patch test for skin'],
    compliance: ['If used on skin, follow cosmetic best practices'],
    sustainability: ['Low-waste product from distillation'],
    faqs: [{ q: 'Does it stain fabrics?', a: 'Typically no—always test on a small patch first.' }],
  },
  'burners': {
    title: 'Low-Heat Burners',
    heroIcon: require('../../assets/icons/data.png'),
    heroImage: require('../../assets/images/quality.jpg'),
    description:
      'Electric and charcoal burners tuned for agarwood chips—supporting low, even heating with minimal charring.',
    badges: ['Low Heat', 'Even Burn'],
    features: ['Thermostat options', 'Mica plate compatible', 'Stable base'],
    specs: [
      { label: 'Power', value: '15–25W (electric)' },
      { label: 'Modes', value: 'Low/Med/High' },
      { label: 'Deck', value: 'Ceramic/Mica' },
      { label: 'Use', value: 'Chips & resins' },
    ],
    gallery: [require('../../assets/images/quality.jpg')],
    tone: 'indigo',
    origin: { regions: ['Sourced components'], sourcingNotes: 'QC tested for temperature stability.' },
    grading: ['Deck evenness', 'Temp drift', 'Safety clearances'],
    processing: ['Assembly QC', 'Electrical test', 'Pack'],
    usage: ['Start low; increase gradually', 'Keep away from flammables'],
    compliance: ['Electrical safety varies by region'],
    sustainability: ['Durable builds reduce waste'],
    faqs: [{ q: 'Can I use charcoal?', a: 'Yes—use natural charcoal and allow it to ash before placing chips.' }],
  },
  'gift-sets': {
    title: 'Gift Sets',
    heroIcon: require('../../assets/icons/perfume.png'),
    heroImage: require('../../assets/images/market.jpg'),
    description:
      'Curated sets combining chips, hydrosol, and incense—ready for ceremonial gifting or discovery.',
    badges: ['Ready to Gift', 'Curated Picks'],
    features: ['Mixed selections', 'Reusable box', 'Guide leaflet'],
    specs: [
      { label: 'Variants', value: 'Mini / Classic / Deluxe' },
      { label: 'Includes', value: 'Chips + Incense + Hydrosol' },
      { label: 'Box', value: 'Rigid, reusable' },
      { label: 'Use', value: 'Gifting, discovery' },
    ],
    gallery: [require('../../assets/images/market.jpg')],
    tone: 'amber',
    origin: { regions: ['Mixed'], sourcingNotes: 'Products drawn from standard lines.' },
    grading: ['Set balance', 'Presentation QC', 'Shock-resistance test'],
    processing: ['Pick & pack', 'Insert leaflet', 'Seal'],
    usage: ['Store cool & dry', 'Follow each item’s guidance'],
    compliance: ['Label set for components'],
    sustainability: ['Paper-based trays & instruction cards'],
    faqs: [{ q: 'Can I customize?', a: 'Yes—swap items by request where available.' }],
  },
};

// ------- PAGE -------
export default function ProductCategoryScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const nav = useNavigation();

  const data = useMemo(() => {
    const key = (category ?? '').toLowerCase() as CategorySlug;
    return CATEGORY_DATA[key];
  }, [category]);

  const toneCls = data ? toneToClasses[data.tone] : toneToClasses.emerald;

  React.useLayoutEffect(() => {
    if (data?.title) {
      // @ts-ignore expo-router setOptions typing ok
      nav.setOptions({ title: data.title });
    }
  }, [data, nav]);

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-xl font-semibold mb-2">Not found</Text>
          <Text className="text-gray-500">This category does not exist.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 28 }}>
        {/* ===== HERO ===== */}
        <View className="mb-4">
          <ImageBackground
            source={data.heroImage}
            style={{ width, height: HERO_HEIGHT }}
            imageStyle={{ resizeMode: 'cover' }}
          >
            <View style={{ width, height: HERO_HEIGHT }} className="bg-black/30">
              <View className="px-5 pt-4 flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => {
                    // @ts-ignore
                    nav.goBack();
                  }}
                  className="bg-white/90 rounded-full p-2"
                >
                  <Ionicons name="arrow-back" size={20} color="#111827" />
                </TouchableOpacity>

                <View className="bg-white/90 rounded-full px-3 py-1 flex-row items-center">
                  {data.heroIcon && (
                    <Image
                      source={data.heroIcon}
                      style={{ width: 18, height: 18, marginRight: 6 }}
                    />
                  )}
                  <Text className="text-xs font-semibold text-gray-800">
                    {data.title}
                  </Text>
                </View>
              </View>

              <View className="px-5 mt-auto pb-5">
                <Text className="text-white text-2xl font-bold">{data.title}</Text>
                <Text className="text-white/90 mt-1">
                  Curated quality • Trusted sourcing
                </Text>

                {/* quick badges */}
                <View className="flex-row flex-wrap mt-3">
                  {data.badges.map((b, i) => (
                    <View
                      key={i}
                      className={`mr-2 mb-2 px-2.5 py-1 rounded-full ${toneCls.badge}`}
                    >
                      <Text className="text-xs font-medium">{b}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* ===== INFO CARD ===== */}
        <View className={`mx-5 -mt-10 rounded-2xl bg-white p-4 shadow ${toneCls.shadow}`} style={{ elevation: 2 }}>
          <Text className="text-gray-700 leading-6">{data.description}</Text>

          {/* specs row */}
          <View className="mt-4 border-t border-gray-100 pt-4">
            <View className="flex-row flex-wrap -mx-2">
              {data.specs.slice(0, 3).map((s, i) => (
                <View key={i} className="w-1/3 px-2 mb-3">
                  <View className={`rounded-xl ${toneCls.bg} p-3`}>
                    <Text className="text-[11px] text-gray-500">{s.label}</Text>
                    <Text className="text-sm font-semibold text-gray-800 mt-0.5">
                      {s.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ===== AROMA PROFILE ===== */}
        {data.aroma && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Aroma Profile</Text>
            {data.aroma.map((row, idx) => (
              <View key={idx} className="mb-2">
                <Text className="text-xs font-semibold text-gray-500">{row.note} Notes</Text>
                <Text className="text-gray-800">{row.facets.join(' • ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== ORIGIN & SOURCING ===== */}
        {data.origin && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Origin & Sourcing</Text>
            <View className={`rounded-2xl ${toneCls.bg} p-4`}>
              <Text className="text-gray-800">
                Regions: <Text className="font-semibold">{data.origin.regions.join(', ')}</Text>
              </Text>
              <Text className="text-gray-700 mt-2">{data.origin.sourcingNotes}</Text>
            </View>
          </View>
        )}

        {/* ===== HIGHLIGHTS ===== */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Highlights</Text>
          {data.features.map((f, idx) => (
            <View key={idx} className="flex-row items-start mb-2">
              <View className={`w-6 h-6 mr-3 rounded-full items-center justify-center ${toneCls.bg}`}>
                <Ionicons name="checkmark" size={16} color={toneCls.tint} />
              </View>
              <Text className="text-gray-700 flex-1">{f}</Text>
            </View>
          ))}
        </View>

        {/* ===== GALLERY ===== */}
        {data.gallery?.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {data.gallery.map((img, i) => (
                  <View
                    key={i}
                    className={`mr-3 rounded-2xl overflow-hidden border border-gray-100 ${toneCls.shadow}`}
                    style={{ width: 180, height: 120 }}
                  >
                    <Image source={img} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* ===== GRADING SCALE ===== */}
        {data.grading && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Grading</Text>
            <View className="rounded-2xl border border-gray-100 overflow-hidden">
              {data.grading.map((g, i) => (
                <View key={i} className={`px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <Text className="text-gray-800">{g}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== PROCESS / QA ===== */}
        {data.processing && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Processing & Quality</Text>
            {data.processing.map((step, i) => (
              <View key={i} className="flex-row items-start mb-2">
                <Ionicons name="leaf" size={16} color={toneCls.tint} style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-gray-700 flex-1">{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== USAGE & CARE ===== */}
        {data.usage && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Usage & Care</Text>
            {data.usage.map((u, i) => (
              <View key={i} className="flex-row items-start mb-2">
                <Ionicons name="information-circle" size={16} color={toneCls.tint} style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-gray-700 flex-1">{u}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== COMPLIANCE ===== */}
        {data.compliance && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Compliance & Safety</Text>
            {data.compliance.map((c, i) => (
              <View key={i} className="flex-row items-start mb-2">
                <Ionicons name="shield-checkmark" size={16} color={toneCls.tint} style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-gray-700 flex-1">{c}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== SUSTAINABILITY ===== */}
        {data.sustainability && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Sustainability</Text>
            {data.sustainability.map((s, i) => (
              <View key={i} className="flex-row items-start mb-2">
                <Ionicons name="earth" size={16} color={toneCls.tint} style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-gray-700 flex-1">{s}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== FULL SPECS ===== */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Specifications</Text>
          <View className="rounded-2xl border border-gray-100 overflow-hidden">
            {data.specs.map((s, i) => (
              <View key={i} className={`px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <Text className="text-[11px] text-gray-500">{s.label}</Text>
                <Text className="text-gray-800 font-medium">{s.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== FAQ ===== */}
        {data.faqs && data.faqs.length > 0 && (
          <View className="px-5 mt-6 mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-3">FAQ</Text>
            <View className="rounded-2xl border border-gray-100 overflow-hidden">
              {data.faqs.map((f, i) => (
                <View key={i} className={`px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <Text className="font-semibold text-gray-900 mb-1">{f.q}</Text>
                  <Text className="text-gray-700">{f.a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
