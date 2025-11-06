// components/articles/MarketPricesArticle.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function MarketPricesArticle() {
  return (
    <View className="px-1">
      <Text className="text-2xl font-extrabold text-gray-900 mb-1">
        Global Agarwood Market Prices on the Rise
      </Text>
      <Text className="text-xs text-gray-500 mb-4">
        Editorial Desk • Markets & Trade • Monthly Outlook
      </Text>

      <Text className="text-gray-800 leading-7 mb-3">
        The international agarwood market opened the new quarter to firm pricing across premium
        chips and single-origin oud oils, with traders citing a mix of constrained supply and
        renewed luxury demand in Gulf and East-Asian retail channels. While wholesale volumes
        remain measured, the tone has turned noticeably constructive compared to the lull seen
        mid-year, when buyers prioritized inventory control and deferred discretionary purchases.
      </Text>

      <View className="rounded-xl bg-emerald-50 p-3 mb-4">
        <Text className="text-sm font-semibold text-emerald-900">At a glance</Text>
        <Text className="text-gray-800 mt-1">• Premium chips (resin-dense, batch documented): <Text className="font-semibold">+3–6% q/q</Text></Text>
        <Text className="text-gray-800">• Single-origin oud oil (stable profile, aged): <Text className="font-semibold">+2–4% q/q</Text></Text>
        <Text className="text-gray-800">• Mixed lots & ungraded chips: <Text className="font-semibold">flat to +1%</Text></Text>
        <Text className="text-gray-800">• Bid–ask spreads: <Text className="font-semibold">wider</Text> for heterogeneous inventory</Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Supply picture</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Weather-related disruptions in select origins have delayed harvesting and drying, a
        recurring theme that tightens availability just as buyers shift into seasonal planning.
        Sources report that the best lots—resin-dense, low moisture, and clean smoke profile—are
        attracting multiple bids. Sellers with robust documentation (batch records, moisture logs,
        and optional GC-MS summaries) are achieving small premia over guide prices, reflecting a
        market that rewards traceability and predictability.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Demand & retail signals</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Retail demand remains anchored by fragrance launches and boutique private-label projects,
        most prominently in the GCC. East-Asian demand is steady, with a preference for small,
        frequent restocks to manage currency fluctuations. Anecdotal reports suggest improved
        footfall in specialty stores and a gradual normalization of shipping costs, both supportive
        of margins further down the chain.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Price dispersion widens</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        A defining feature this month is wider price dispersion, particularly for “mixed” lots
        that lack consistent grading. Professional buyers are discounting for uncertainty, while
        paying up for batches with unified cut style, moisture targets within <Text className="font-semibold">6–8%</Text>, and
        panel-verified smoke characteristics. Oils with a stable heart and long, leathered dry-down
        are clearing quickly, whereas sharper profiles require negotiation.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Logistics & currency</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Freight remains manageable after the volatility of the last two years. Currency dynamics
        add nuance: buyers invoiced in USD are negotiating delivery timing, while producers
        consider staged shipments to hedge FX swings. Insurance premiums for high-value parcels
        are unchanged, but carriers continue to emphasize proper declaration and shock-resistant
        packing to reduce claims.
      </Text>

      <View className="rounded-xl bg-white border border-gray-200 p-3 mb-4">
        <Text className="text-sm font-semibold text-gray-900">Trader’s note</Text>
        <Text className="text-gray-700 mt-1 italic">
          “Documentation is the new discount. If you can prove your batch is consistent, you
          won’t have to shave as much off the offer,” said a Singapore-based broker.
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Outlook: cautiously higher</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        With festival calendars approaching and project pipelines improving, spot prices should
        remain biased to the upside for top-tier chips and well-matured oils. Mixed lots may trade
        sideways as buyers stay selective. The best defense against volatility remains rigorous
        QC: batch IDs, moisture logs, and sensory notes. For sellers, small sample splits and
        transparent test results continue to shorten negotiation cycles and support firmer clears.
      </Text>

      <Text className="text-xs text-gray-400">
        Methodology: Composite of wholesale indications, broker interviews, and observed offers across key hubs.
      </Text>
    </View>
  );
}
