import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";

import InputField from "../helpers/InputField";
import Button from "../helpers/Button";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [isPasswordVisible, setIspasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfpasswordVisible] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisiblity = () => {
    setIspasswordVisible(!isPasswordVisible);
  };

  const toggleConfPasswordVisiblity = () => {
    setIsConfpasswordVisible(!isConfPasswordVisible);
  };

  const resetPassword = async () => {
    try {
      await axios.put("/auth/forgetPassword", {
        email,
        newPassword,
        verifyNewPassword,
      });
      setEmail("");
      setNewPassword("");
      setVerifyNewPassword("");
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Password reset successful. You can now log in",
      });
      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
      });
    }
  };

  return (
    <View className="bg-gray-900 flex-1 px-5">
      {/* close icon */}
      <TouchableOpacity className="mt-12" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#9CA3AF" />
      </TouchableOpacity>

      {/* heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-gray-50">Forget Password</Text>
      </View>

      {/* Input Fields */}
      <View className="mt-6">
        <InputField
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
        />

        <View className="relative">
          <InputField
            placeholder="Enter Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={togglePasswordVisiblity}
            className="absolute right-4 top-1/4 w-7 h-7 justify-center items-center"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#F3F4F6"
            />
          </TouchableOpacity>
        </View>

        <View className="relative">
          <InputField
            placeholder="Enter Confirm Password"
            value={verifyNewPassword}
            onChangeText={setVerifyNewPassword}
            secureTextEntry={!isConfPasswordVisible}
          />
          <TouchableOpacity
            onPress={toggleConfPasswordVisiblity}
            className="absolute right-4 top-1/4 w-7 h-7 justify-center items-center"
          >
            <Ionicons
              name={isConfPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#F3F4F6"
            />
          </TouchableOpacity>
        </View>

        {/* Btn */}
        <Button onPress={resetPassword} label="Done" />

        {/* Login Navigation */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="mt-[278px]"
        >
          <Text className="text-purple-800 text-xl font-bold  text-center">
            Go back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgetPassword;
