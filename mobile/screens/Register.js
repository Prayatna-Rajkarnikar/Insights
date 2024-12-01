import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import logo from "../assets/Insights.png";

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

  const goToRegTwo = () => {
    try {
      const userData = { email, password, confirmPassword };
      console.log(userData);
      navigation.navigate("RegisterTwo", { userData });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="bg-gray-50 flex-1">
      <TouchableOpacity className="ml-5 mt-10">
        <Ionicons name="close" size={30} />
      </TouchableOpacity>
      <View className="items-end">
        <Image source={logo} className="h-16 w-48" />
      </View>
      <View className="mt-4 mx-4">
        <Text className="text-right text-5xl text-gray-800">
          Create a new account
        </Text>
      </View>
      <View className="mt-5 mx-4">
        <View className="flex-row w-full rounded-full bg-gray-100 px-4 py-3 text-base font-medium space-x-4 mb-4">
          <View className="bg-gray-800 rounded-full p-2 h-10 w-10 items-center justify-center">
            <Ionicons name="person-outline" size={20} color="white" />
          </View>
        </View>
        <View className="flex-row w-full rounded-full bg-gray-100 px-4 py-3 text-base font-medium space-x-4 mb-4">
          <View className="bg-gray-800 rounded-full p-2 h-10 w-10 items-center justify-center">
            <Ionicons name="mail-outline" size={20} color="white" />
          </View>
          <TextInput
            placeholder="Youremail@gmail.com"
            value={email}
            onChangeText={setEmail}
            className="w-full"
          />
        </View>
        <View className="flex-row w-full rounded-full bg-gray-100 px-4 py-3 text-base font-medium space-x-4 mb-4">
          <View className="bg-gray-800 rounded-full p-2 h-10 w-10 items-center justify-center">
            <Ionicons name="key-outline" size={20} color="white" />
          </View>
          <View className="flex-1 justify-center w-full">
            <TextInput
              placeholder="Passsword"
              value={password}
              onChangeText={setPassword}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
          onPress={goToRegTwo}
        >
          <Text className="text-gray-50 text-center text-lg font-semibold">
            Join Now
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-3 space-x-1">
          <Text className="text-gray-500 text-sm">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-gray-800 font-medium underline">
              Continue here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;
