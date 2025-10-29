import React from "react";
import { View, Text, Linking } from "react-native";
import Button from "../ui/Button";

export default function FRClothingContent() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">
                    Flame Resistant Clothing
                </Text>
                <Text className="text-primary/80 text-sm">
                    Premium FR clothing for industrial safety and protection
                </Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                Our comprehensive line of flame-resistant clothing provides superior protection 
                for workers in high-risk environments. Designed to meet or exceed industry safety 
                standards including NFPA 70E, NFPA 2112, and OSHA requirements.
            </Text>

            <View className="bg-orange-50 rounded-xl p-4 mb-4">
                <Text className="text-orange-800 font-semibold text-base mb-2">Safety Standards:</Text>
                <Text className="text-orange-700 mb-1">• NFPA 70E Arc Flash Protection</Text>
                <Text className="text-orange-700 mb-1">• NFPA 2112 Flash Fire Protection</Text>
                <Text className="text-orange-700 mb-1">• ASTM F1506 Performance Standards</Text>
                <Text className="text-orange-700">• OSHA Compliant Materials</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                Available in multiple fabric weights and protection levels, our FR clothing 
                collection includes coveralls, shirts, pants, and accessories. All garments 
                feature reinforced stress points, industrial laundering capabilities, and 
                comfortable designs for all-day wear.
            </Text>

            <View className="bg-green-50 rounded-xl p-4 mb-6">
                <Text className="text-green-800 font-semibold text-base mb-2">Key Features:</Text>
                <Text className="text-green-700 mb-1">✓ Self-extinguishing fabric technology</Text>
                <Text className="text-green-700 mb-1">✓ Moisture-wicking properties</Text>
                <Text className="text-green-700 mb-1">✓ Industrial laundry tested</Text>
                <Text className="text-green-700 mb-1">✓ Multiple color options available</Text>
                <Text className="text-green-700">✓ Custom sizing and embroidery services</Text>
            </View>

            <Button
                title="Download FR Catalog"
                onPress={() => alert("Downloading FR clothing catalog")}
                className="mb-4"
            />

            <Button
                title="Request Safety Consultation"
                onPress={() => Linking.openURL("mailto:safety@company.com")}
                variant="secondary"
            />
        </>
    );
}