import React from "react";
import { View, Text } from "react-native";
import Button from "../ui/Button";

export default function UniformContents() {
    return (
        <>
            <View className="bg-primary/10 rounded-xl p-4 mb-6">
                <Text className="text-primary font-bold text-lg mb-2">Alteration and Sewing services</Text>
            </View>

            <Text className="text-gray-700 font-bold text-lg leading-6 mb-4">
                Sewing services
            </Text>

            <Text className="text-gray-700 leading-6 mb-4">
                We provide in-house alterations and sewing services. These include hemming pants, sewing on patches and emblems, minor alterations to uniforms for a better custom fit.
            </Text>

            <Button
                title="Learn More"
                onPress={() => alert("Redirecting to detailed information")}
                className="mb-4 mt-6"
            />
        </>
    )
}
