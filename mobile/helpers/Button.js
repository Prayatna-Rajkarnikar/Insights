import { Text, TouchableOpacity, View } from "react-native";
import React from "react";

const Button = ({ label, onPress, className }) => {
  return (
    <View className={`rounded-3xl py-5 mt-8 bg-accent ${className}`}>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-primaryWhite text-xl font-bold  text-center">
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
