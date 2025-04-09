import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";

import InputField from "../helpers/InputField";
import Button from "../helpers/Button";
import Background from "../helpers/Background";

const CompleteProfile = ({ route, navigation }) => {
  const { userData } = route.params;
  const { email, password, confirmPassword } = userData;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const registerUser = async () => {
    try {
      await axios.post("/auth/register", {
        name,
        email,
        username,
        password,
        verifyPassword: confirmPassword,
      });
      setName("");
      setUsername("");
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Register Successful",
        visibilityTime: 2000,
        autoHide: true,
      });
      navigation.navigate("Login");
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
      {/* close icon */}
      <TouchableOpacity className="mt-12" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#8B8F92" />
      </TouchableOpacity>

      {/* heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-primaryWhite">
          Complete Profile
        </Text>
      </View>

      <View className="mt-1">
        <Text className="text-sm font-normal text-lightGray">
          Username must range from 4 to 20 characters and can only have letters,
          numbers, and underscores(_).
        </Text>
      </View>

      {/* Input Fields */}
      <View className="mt-6">
        <InputField
          placeholder="Enter Full Name"
          value={name}
          onChangeText={setName}
        />
        <InputField
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <Button onPress={registerUser} label="Done" />
    </Background>
  );
};

export default CompleteProfile;
