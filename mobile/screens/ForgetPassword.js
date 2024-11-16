import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";

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
    <View className="bg-gray-50 flex-1">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="ml-5 mt-10"
      >
        <Ionicons name="arrow-back" size={30} />
      </TouchableOpacity>
      <Text className="text-center mt-4 mx-4 text-3xl text-gray-800">
        Reset Password
      </Text>
      <View className="mt-5 mx-4">
        <View className="flex-row w-full rounded-full bg-gray-100 px-4 py-3 text-base font-medium space-x-4 mb-4">
          <View className="bg-gray-800 rounded-full p-2 h-10 w-10 items-center justify-center">
            <Ionicons name="mail-outline" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Youremail@gmail.com"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="flex-row w-full rounded-full bg-gray-100 px-4 py-3 text-base font-medium space-x-4 mb-4">
          <View className="bg-gray-800 rounded-full p-2 h-10 w-10 items-center justify-center">
            <Ionicons name="key-outline" size={20} color="white" />
          </View>
          <View className="flex-1 justify-center">
            <TextInput
              placeholder="Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!isPasswordVisible}
            />
          </View>
          <TouchableOpacity
            onPress={togglePasswordVisiblity}
            className="justify-center"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row w-full rounded-full bg-gray-100 px-4 py-3 text-base font-medium space-x-4 mb-4">
          <View className="bg-gray-800 rounded-full p-2 h-10 w-10 items-center justify-center">
            <Ionicons name="lock-closed-outline" size={20} color="white" />
          </View>
          <View className="flex-1 justify-center className w-full">
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!isConfPasswordVisible}
              value={verifyNewPassword}
              onChangeText={setVerifyNewPassword}
            />
          </View>
          <TouchableOpacity
            onPress={toggleConfPasswordVisiblity}
            className="justify-center"
          >
            <Ionicons
              name={isConfPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-gray-900 my-4 rounded-full py-4"
          onPress={resetPassword}
        >
          <Text className="text-gray-50 text-center text-lg font-semibold">
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgetPassword;
