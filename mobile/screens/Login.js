import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../helpers/InputField";
import Button from "../helpers/Button";

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
    <View className="bg-gray-900 flex-1 px-5">
      {/* close icon */}
      <TouchableOpacity className="mt-12">
        <Ionicons name="close" size={30} color="#9CA3AF" />
      </TouchableOpacity>

      {/* heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-gray-50">Login</Text>
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
      </View>

      {/* Forget password */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgetPassword")}
        className="mt-1 mb-6"
      >
        <Text className="text-gray-400 font-medium  text-base text-right">
          Forget Password ?
        </Text>
      </TouchableOpacity>

      {/* Login Btn */}
      <Button onPress={handleLogin} label="Login" />

      {/* Go to Register Btn */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        className="rounded-full py-5 border-2 border-purple-800 mt-64"
      >
        <Text className="text-gray-50 text-xl font-bold  text-center">
          Create new account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
