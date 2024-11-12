import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const registerUser = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      await axios.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Register Successful",
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
    <View className="bg-gray-200 flex-1">
      <TouchableOpacity className="m-3">
        <Ionicons name="close" size={30} />
      </TouchableOpacity>
      <View className="flex-1 items-center justify-center">
        <View className="bg-gray-50 p-5 rounded-xl shadow-lg w-4/5">
          <Text className="text-2xl font-semibold text-center mb-4">
            Register
          </Text>
          <TextInput
            className="w-full border-2 border-gray-100 rounded-2xl bg-transparent p-4 my-3 text-base font-medium"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="w-full border-2 border-gray-100 rounded-2xl bg-transparent p-4 my-3 text-base font-medium"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="w-full border-2 border-gray-100 rounded-2xl bg-transparent p-4 my-3 text-base font-medium"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            className="w-full border-2 border-gray-100 rounded-2xl bg-transparent p-4 my-3 text-base font-medium"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="bg-gray-900 my-4 rounded-2xl p-4"
            onPress={registerUser}
          >
            <Text className="text-gray-50 text-center text-base font-semibold">
              Join now
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
    </View>
  );
};

export default Register;
