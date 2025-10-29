import React from "react";
import { View, Text, Linking } from "react-native";
import Button from "../ui/Button";

export default function GovernmentBuyersContent() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">
                    Government Procurement Solutions
                </Text>
                <Text className="text-primary/80 text-sm">
                    Specialized services for government agencies and departments
                </Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                We provide comprehensive procurement solutions specifically designed for government 
                agencies and departments. Our team understands the unique requirements, compliance 
                standards, and procurement processes that government entities must follow.
            </Text>

            <Text className="text-gray-700 leading-6 mb-4">
                With over 30 years of experience serving government clients, we offer streamlined 
                procurement processes, competitive pricing, and full compliance with federal and 
                state regulations. Our dedicated government sales team ensures smooth transactions 
                and timely delivery of all orders.
            </Text>

            <View className="bg-blue-50 rounded-xl p-4 mb-4">
                <Text className="text-blue-800 font-semibold mb-2">✓ GSA Contract Holder</Text>
                <Text className="text-blue-800 font-semibold mb-2">✓ Federal Tax ID Verified</Text>
                <Text className="text-blue-800 font-semibold mb-2">✓ Cage Code Registered</Text>
                <Text className="text-blue-800 font-semibold">✓ Minority Business Enterprise</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-6">
                Contact our government sales specialists to learn more about our procurement 
                solutions, volume discounts, and specialized services available exclusively 
                for government buyers.
            </Text>

            <Button
                title="Contact Government Sales"
                onPress={() => Linking.openURL("mailto:government@company.com")}
                className="mb-4"
            />

            <Button
                title="View GSA Contract"
                onPress={() => alert("Redirecting to GSA contract details")}
                variant="secondary"
            />
        </>
    );
}