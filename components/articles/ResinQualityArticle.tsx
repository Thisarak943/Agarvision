// components/articles/ResinQualityArticle.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function ResinQualityArticle() {
  return (
    <View className="px-1">
      <Text className="text-2xl font-extrabold text-gray-900 mb-1">
        Resin Quality Boost Through New Cultivation Methods
      </Text>
      <Text className="text-xs text-gray-500 mb-4">
        Research Brief • Trials 18–24 Months • Cultivation & Processing
      </Text>

      <Text className="text-gray-800 leading-7 mb-3">
        A new wave of low-stress induction methods and moisture management protocols is changing
        how producers approach resin formation. Across pilot plots monitored over 18–24 months,
        growers report denser, cleaner resins and a smoother smoke profile—attributes that command
        stronger bids in today’s selective market. While results vary by origin and clone, the
        common denominator appears to be a disciplined approach to wounding and post-wound care.
      </Text>

      <View className="rounded-xl bg-indigo-50 p-3 mb-4">
        <Text className="text-sm font-semibold text-indigo-900">Trial highlights</Text>
        <Text className="text-gray-800 mt-1">• Average resin density vs. controls: <Text className="font-semibold">+8–12%</Text></Text>
        <Text className="text-gray-800">• Smoke character: <Text className="font-semibold">reduced harshness</Text>, cleaner top</Text>
        <Text className="text-gray-800">• Post-harvest stabilization: <Text className="font-semibold">faster</Text> curing to target moisture</Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Low-stress induction, explained</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Traditional high-intensity wounding can trigger resin formation but carries a greater risk
        of pathogen entry and erratic outcomes. The low-stress approach uses smaller, spaced
        interventions with longer rest windows, encouraging gradual resin buildup without
        overwhelming the tree’s defenses. Trials that paired this with canopy thinning to improve
        airflow saw the best results during wet seasons.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Moisture discipline</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Moisture influences both resin creation and subsequent smoke quality. Farmers in the study
        used basic meters to monitor chip moisture during curing, targeting <Text className="font-semibold">6–8% RH</Text> before
        sealing. Lots packed above that threshold showed more variable ignition and a sharper top.
        Conversely, over-dry lots risk brittleness and aroma flattening. The sweet spot remains
        narrow—and measurable.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Documentation wins bids</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Markets increasingly reward transparency. Trial participants attached batch IDs, wounding
        dates, moisture logs, and sensory notes to each lot. Buyers responded with faster decisions
        and smaller discounts. For oils, producers logged soak time, distillation cuts, and rest
        periods; aged, stable profiles achieved the strongest premiums.
      </Text>

      <View className="rounded-xl bg-white border border-gray-200 p-3 mb-4">
        <Text className="text-sm font-semibold text-gray-900">Grower perspective</Text>
        <Text className="text-gray-700 mt-1 italic">
          “Once we spaced the wounds and tightened curing targets, the smoke turned rounder and
          bids climbed. The biggest change wasn’t equipment—it was discipline,” said a pilot farmer.
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Scaling & next steps</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        The next phase will compare clones across regions and test whether partial shade nets can
        stabilize humidity without inviting disease. Standardized smoke panels and shared grading
        rubrics are also in development to reduce subjectivity between buyers and sellers. If
        successful, the playbook could lift baseline quality while lowering waste, with benefits
        accruing to both smallholders and high-end retailers.
      </Text>

      <Text className="text-xs text-gray-400">
        This brief summarizes multi-site pilot observations, batch records, and independent sensory panels.
      </Text>
    </View>
  );
}
