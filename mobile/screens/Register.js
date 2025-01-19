import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import InputField from "../helpers/InputField";
import Button from "../helpers/Button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIspasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfpasswordVisible] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisiblity = () => {
    setIspasswordVisible(!isPasswordVisible);
  };

  const toggleConfPasswordVisiblity = () => {
    setIsConfpasswordVisible(!isConfPasswordVisible);
  };

  const goToRegTwo = async () => {
    try {
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        alert("Please fill all the fields.");
        return;
      }

      await axios.post("/auth/validDetails", {
        email,
        password,
        confirmPassword,
      });

      const userData = { email, password, confirmPassword };
      console.log(userData);
      navigation.navigate("CompleteProfile", { userData });
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
      <TouchableOpacity className="mt-12">
        <Ionicons name="close" size={30} color="#9CA3AF" />
      </TouchableOpacity>

      {/* heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-gray-50">Register</Text>
      </View>

      <View className="mt-1">
        <Text className="text-sm font-normal text-gray-400">
          Password must be at least 8 characters long and must include 1
          uppercase, 1 lowercase, 1 number, and @ or _ .
        </Text>
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
            value={password}
            onChangeText={setPassword}
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
        <Button onPress={goToRegTwo} label="Next" />

        {/* Login Navigation */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="mt-[210px]"
        >
          <Text className="text-purple-800 text-xl font-bold  text-center">
            Go back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
