import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);
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
      if (error.response.status === 403) {
        setModalVisible(true);
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: error.response.data.error || "Something went wrong",
        });
      }
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-gray-700">
          <View className="w-3/4 p-5 bg-black rounded-xl">
            <Text className="text-center text-lg font-bold text-gray-100">
              Account Deactivated
            </Text>
            <Text className="text-center text-sm font-light text-gray-400 mt-3">
              Your account has been deactivated due to a policy violation. It
              will be reactivated in a few days.
            </Text>

            <TouchableOpacity
              className="items-center mt-4 p-3 rounded-lg bg-[#4E2894]"
              onPress={() => setModalVisible(false)}
            >
              <Text className="font-bold text-gray-100">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;
