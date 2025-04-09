import React from "react";
import { View, TextInput } from "react-native";

const InputField = ({ placeholder, value, onChangeText, ...props }) => {
  return (
    <View className="bg-secondaryBlack px-3 py-2 rounded-2xl mb-3">
      <TextInput
        placeholder={placeholder}
        value={value}
        placeholderTextColor="#8B8F92"
        onChangeText={onChangeText}
        scrollEnabled={false}
        {...props}
        className=" w-full text-xl font-medium text-primaryWhite"
      />
    </View>
  );
};

export default InputField;
