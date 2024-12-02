import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const Button = ({ label, onPress, className }) => {
  const StyledView = styled(LinearGradient);
  return (
    <StyledView
      colors={["#312E81", "#4E2894"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`rounded-full py-5 mt-8 ${className}`}
    >
      <TouchableOpacity onPress={onPress}>
        <Text className="text-gray-50 text-xl font-bold  text-center">
          {label}
        </Text>
      </TouchableOpacity>
    </StyledView>
  );
};

export default Button;
