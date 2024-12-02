import { View, Text } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

const InputField = ({ placeholder, value, onChangeText, ...props }) => {
  return (
    <View className="bg-gray-800 px-3 py-2 rounded-2xl mb-3">
      <TextInput
        placeholder={placeholder}
        value={value}
        placeholderTextColor="#9CA3AF"
        onChangeText={onChangeText}
        {...props}
        className=" w-full text-xl font-semibold text-gray-400"
      />
    </View>
  );
};

export default InputField;
