import React from "react";
import { View, Text } from "react-native";
import Button from "../ui/Button";

export default function UniformContents() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">Uniforms and Work Clothes</Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
                Global has been marketing Safety Footwear and Uniforms for the Industrial, Public Safety, and Law Enforcement industries since 1991. We cater to the South Florida market with our two stores located in Miami and Fort Lauderdale. Our store in Orlando caters to the Central, West, and North Florida regions. We also export eligible products worldwide. In addition to providing safety footwear and uniforms, we also Provide:
            </Text>

            <View className="mb-4">
                <Text className="text-gray-700 leading-6 mb-2">• Shoe Mobile service throughout Florida</Text>
                <Text className="text-gray-700 leading-6 mb-2">• In-house Embroidery</Text>
                <Text className="text-gray-700 leading-6 mb-2">• Screen Printing</Text>
                <Text className="text-gray-700 leading-6 mb-2">• Sewing and Alterations</Text>
                <Text className="text-gray-700 leading-6 mb-2">• Embroidery Digitizing</Text>
                <Text className="text-gray-700 leading-6 mb-2">• Graphic Art services</Text>
                <Text className="text-gray-700 leading-6 mb-2">• Embroidered Patches</Text>
                <Text className="text-gray-700 leading-6 mb-2">• Badges and Insignia</Text>
            </View>

            <Button
                title="Learn More"
                onPress={() => alert("Redirecting to detailed information")}
                className="mb-4 mt-6"
            />
        </>
    )
}
