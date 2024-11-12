import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

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
    <View className="bg-gray-200 flex-1">
      <TouchableOpacity className="m-3">
        <Ionicons name="close" size={30} />
      </TouchableOpacity>
      <View className="flex-1 items-center justify-center">
        <View className="bg-gray-50 p-5 rounded-xl shadow-lg w-4/5">
          <Text className="text-2xl font-semibold text-center mb-4">Login</Text>
          <TextInput
            className="w-full border-2 border-gray-100 rounded-2xl bg-transparent p-4 my-4 text-base font-medium"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="w-full border-2 border-gray-100 rounded-2xl bg-transparent p-4 my-3 text-base font-medium"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-gray-900 my-4 rounded-2xl p-4"
            onPress={handleLogin}
          >
            <Text className="text-gray-50 text-center text-base font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-3 space-x-1">
            <Text className="text-gray-500 text-sm">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-gray-800 font-medium underline">
                Start Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
