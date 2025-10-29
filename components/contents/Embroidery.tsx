import React from "react";
import { View, Text, Linking } from "react-native";
import Button from "../ui/Button";

export default function EmbroideryContents() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">Embroidery Digitizing Service</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                Global offers quality embroidery digitizing service for all types of embroidery machines since 1991.
                Our digitizers have more than 16 years experience in embroidery digitizing.{" "}
                <Text
                    className="text-blue-600 underline"
                    onPress={() => Linking.openURL("https://www.superdigitizing.com")}
                >
                    www.superdigitizing.com
                </Text>
            </Text>

            <View className="bg-primary/10 rounded-xl p-4 mb-6 mt-4">
                <Text className="text-primary font-bold text-lg mb-2">Embroidery Digitizing Service</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                We can personalize your T-shirts, Polo Shirts, Jackets, Caps, Bags, Shorts, Work uniforms and other accessories with Screen Printing & Embroidery services. We also provide a 24 hour Embroidery Digitizing and Graphic Art services for Screen Printing. In addition, we can help create a logo for you and customize any promotional item you require such as cups, mugs, pens etc. Visit{" "}
                <Text
                    className="text-blue-600 underline"
                    onPress={() => Linking.openURL("https://www.logofactory.com")}
                >
                    www.superdigitizing.com
                </Text>
            </Text>

            <Button
                title="Learn More"
                onPress={() => alert("Redirecting to detailed information")}
                className="mb-4 mt-6"
            />
        </>
    )
}
