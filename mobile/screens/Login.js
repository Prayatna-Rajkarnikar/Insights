import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import logo from "../assets/Insights.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIspasswordVisible] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisiblity = () => {
    setIspasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    try {
      await axios.post("/auth/login", {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Login Successful",
      });
      navigation.navigate("Home");
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
      <TouchableOpacity className="ml-5 mt-10">
        <Ionicons name="close" size={30} />
      </TouchableOpacity>
      <View className="items-end">
        <Image source={logo} className="h-16 w-48" />
      </View>
      <Text className="text-right mt-4 mx-4 text-5xl text-gray-800">
        Welcome to Insights
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

        <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
          <Text className="text-indigo-400 font-medium text-right underline">
            Forget Password ?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-indigo-400 my-4 rounded-full py-4"
          onPress={handleLogin}
        >
          <Text className="text-gray-50 text-center text-lg font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center mt-56 space-x-1">
        <Text className="text-gray-500 text-sm">Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-indigo-400 font-medium underline">
            Start Here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
