import React from "react";
import { View, Text, Linking } from "react-native";
import Button from "../ui/Button";

export default function BlackintonContent() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">
                    Blackinton Badges & Insignia
                </Text>
                <Text className="text-primary/80 text-sm">
                    Official authorized dealer for premium law enforcement badges
                </Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                As an authorized Blackinton dealer, we provide premium quality badges, insignia, 
                and accessories for law enforcement, security, and public safety professionals. 
                Blackinton has been the industry leader in badge manufacturing for over 160 years.
            </Text>

            <View className="bg-blue-50 rounded-xl p-4 mb-4">
                <Text className="text-blue-800 font-semibold text-base mb-2">Available Products:</Text>
                <Text className="text-blue-700 mb-1">• Custom Department Badges</Text>
                <Text className="text-blue-700 mb-1">• Officer Name Tags</Text>
                <Text className="text-blue-700 mb-1">• Rank Insignia & Pins</Text>
                <Text className="text-blue-700 mb-1">• Collar Brass & Accessories</Text>
                <Text className="text-blue-700">• Commemorative Items</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                Each Blackinton badge is individually crafted using traditional techniques 
                combined with modern technology. From initial design consultation to final 
                delivery, we ensure every detail meets your department's specifications 
                and maintains the highest standards of quality.
            </Text>

            <View className="bg-yellow-50 rounded-xl p-4 mb-4">
                <Text className="text-yellow-800 font-semibold text-base mb-2">Quality Features:</Text>
                <Text className="text-yellow-700 mb-1">✓ Hand-finished craftsmanship</Text>
                <Text className="text-yellow-700 mb-1">✓ Durable metal construction</Text>
                <Text className="text-yellow-700 mb-1">✓ Custom design services</Text>
                <Text className="text-yellow-700 mb-1">✓ Fast turnaround times</Text>
                <Text className="text-yellow-700">✓ Lifetime craftsmanship warranty</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-6">
                Contact our badge specialists for custom design consultation, department 
                setup, or to place orders. We work directly with departments of all sizes 
                to create badges that represent your organization with pride and distinction.
            </Text>

            <Button
                title="Request Custom Quote"
                onPress={() => Linking.openURL("mailto:badges@company.com")}
                className="mb-4"
            />

            <Button
                title="View Badge Gallery"
                onPress={() => alert("Opening badge gallery")}
                variant="secondary"
                className="mb-4"
            />

            <Button
                title="Visit Blackinton.com"
                onPress={() => Linking.openURL("https://www.blackinton.com")}
                variant="outline"
            />
        </>
    );
}