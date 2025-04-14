import { Text, TouchableOpacity, View } from "react-native";
import React from "react";

const Button = ({ label, onPress, className }) => {
  return (
    <View className={`rounded-2xl py-4 mt-8 bg-accent ${className}`}>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-primaryWhite text-lg font-bold  text-center">
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
