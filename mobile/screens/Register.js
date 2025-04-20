import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import InputField from "../helpers/InputField";
import Button from "../helpers/Button";
import Background from "../helpers/Background";

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
      await axios.post("/auth/validDetails", {
        email,
        password,
        confirmPassword,
      });

      // If validation is successful, pass the user data object to the next screen
      const userData = { email, password, confirmPassword };
      navigation.navigate("CompleteProfile", { userData });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <Background>
      {/* Heading Section */}
      <View className="mt-14">
        <Text className="text-3xl font-bold text-primaryWhite">Register</Text>
      </View>

      {/* Password Requirements Notice */}
      <View className="mt-1">
        <Text className="text-sm font-normal text-lightGray">
          Password must be at least 8 characters long and must include 1
          uppercase, 1 lowercase, 1 number, and @ or _ .
        </Text>
      </View>

      {/* Input Fields */}
      <View className="mt-6">
        {/* Email Input Field */}
        <InputField
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input Field */}
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
              color="#ABABAB"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input Field */}
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
              color="#ABABAB"
            />
          </TouchableOpacity>
        </View>

        {/*Next Btn */}
        <Button onPress={goToRegTwo} label="Next" />

        {/* Login Navigation */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="mt-40 flex-row justify-center space-x-1"
        >
          <Text className="text-lightGray text-base font-normal  text-center">
            Already have an account?
          </Text>
          <Text className="text-accent text-base font-normal  text-center">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default Register;
