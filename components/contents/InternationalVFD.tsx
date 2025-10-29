// components/content/VFDContent.tsx
import React from "react";
import { View, Text, Linking } from "react-native";
import Button from "../ui/Button";

export default function VFDContent() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">We Export - Se Habla Español</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                Global is an official international distributor for VF Imagewear, Inc. The brands we represent include Red Kap, Horace Small, Bulwark and Wrangler. If needed, we can also provide customization of your garments. Please email your inquiries to{" "}
                <Text
                    className="text-blue-600 underline"
                    onPress={() => Linking.openURL("mailto:exports@gtim.com")}
                >
                    exports@gtim.com
                </Text>
            </Text>

            <Text className="text-gray-700 leading-6 mb-4">
                Global provides Industrial and Public Safety Uniforms and Safety Footwear. We offer a range of ancillarry services such as Embroidery, Screen Printing, Badges, Sewing and Alterations, Embroidery Digitizing, and Customized Honor Guard Uniforms. Our Industrial and public safety footwear brands include Timberland Pro, Reebok Work, Wolverine, Caterpillar, Georgia Boot, Merrell, Nautilus, Iron Age, Knap, Ariat, Skechers Work, Red Back, and a few other known brands. and a few other brands.. As part of our law enforcement and Public Safety line we carry Thorogood, Bates, 511 Tactical, and Original Swat
            </Text>

            <Text className="text-gray-700 leading-6 mb-6">
                Our industrial, Public Safety and dress uniform brands are Red Kap, Horace Small, Edwards Garment, Fechheimer, Bulwark, Liberty, Sanmar, AlphaBroder, Van Heusen and other well known brands.
            </Text>

            <Text className="text-gray-700 leading-6 mb-6">
                We have three showroom/warehouses in Miami, Fort Lauderdale,Orlando and Palm Beach. We have been in business since 1991.
            </Text>

            <Button
                title="Learn More"
                onPress={() => alert("Redirecting to detailed information")}
                className="mb-4 mt-6"
            />
        </>
    );
}
