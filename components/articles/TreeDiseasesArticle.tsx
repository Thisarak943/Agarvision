// components/articles/TreeDiseasesArticle.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function TreeDiseasesArticle() {
  return (
    <View className="px-1">
      <Text className="text-2xl font-extrabold text-gray-900 mb-1">
        Common Agarwood Tree Diseases and Prevention Tips
      </Text>
      <Text className="text-xs text-gray-500 mb-4">
        Field Desk • Cultivation & Agronomy • Monsoon Watch
      </Text>

      <Text className="text-gray-800 leading-7 mb-3">
        As humidity climbs and soils stay wet for longer, smallholders report a seasonal uptick in
        disease pressure across young and mid-growth agarwood stands. Experts emphasize that
        early detection and disciplined sanitation are the best tools to protect yields and the
        long-term resin potential of each tree. While intervention options vary by farm size and
        budget, the fundamentals—water management, pruning hygiene, and canopy airflow—are within
        reach for most producers.
      </Text>

      <View className="rounded-xl bg-amber-50 p-3 mb-4">
        <Text className="text-sm font-semibold text-amber-900">Fast symptom checklist</Text>
        <Text className="text-gray-800 mt-1">• Leaf: speckling, yellowing, premature drop</Text>
        <Text className="text-gray-800">• Stem: sunken cankers, sap oozing, bark cracking</Text>
        <Text className="text-gray-800">• Root: wilting despite moist soil, foul odor in severe rot</Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Drainage & soil health</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Water-logging remains the number-one risk driver. Raised beds, contour drains, and
        periodic mulching improve infiltration and reduce stagnant pockets where pathogens thrive.
        Simple field tests—like percolation timing after rainfall—help farmers prioritize
        sections for corrective work. Organic matter should be used carefully: it improves soil
        structure but can trap excess moisture if applied too thickly.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Pruning hygiene</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Dull or contaminated tools are a silent vector. Producers are urged to clean blades with a
        mild disinfectant between trees and to avoid pruning immediately after rainfall. Cut
        surfaces should be small and clean, with angles that shed water. Infected twigs and leaves
        must be removed from the plot and destroyed—leaving debris under the canopy invites a new
        cycle of infection.
      </Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Airflow & spacing</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        Dense canopies trap humidity. Thinning interior shoots and maintaining proper row spacing
        improve airflow and lower leaf wetness duration, a key variable for fungal growth. Where
        feasible, windbreaks should be designed to slow damaging gusts without creating stagnant
        eddies inside the stand.
      </Text>

      <View className="rounded-xl bg-white border border-gray-200 p-3 mb-4">
        <Text className="text-sm font-semibold text-gray-900">Extension advice</Text>
        <Text className="text-gray-700 mt-1 italic">
          “Most outbreaks we investigate started with a drainage problem and ended with poor
          sanitation. Fix the water, clean the tools, and you’ve solved 70% of the battle,” a
          regional agronomist told our desk.
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">Intervention ladder</Text>
      <Text className="text-gray-800 leading-7 mb-2">1) Cultural controls: drainage, pruning hygiene, debris removal</Text>
      <Text className="text-gray-800 leading-7 mb-2">2) Monitoring: weekly scouting logs with photos and rainfall notes</Text>
      <Text className="text-gray-800 leading-7 mb-2">3) Targeted treatment: consult local guidance for approved products</Text>
      <Text className="text-gray-800 leading-7 mb-3">4) Escalation: severe canker spread or root collapse → seek extension support</Text>

      <Text className="text-lg font-bold text-gray-900 mt-2 mb-2">When to seek help</Text>
      <Text className="text-gray-800 leading-7 mb-3">
        If lesions expand rapidly around the stem or multiple trees exhibit wilting despite moist
        soil, call your extension officer. Capture clear photos, note dates, recent weather, and
        any pruning/fertilizer activities. This documentation speeds identification and reduces
        trial-and-error in the field.
      </Text>

      <Text className="text-xs text-gray-400">
        This report compiles field notes from growers, extension interviews, and seasonal disease bulletins.
      </Text>
    </View>
  );
}
