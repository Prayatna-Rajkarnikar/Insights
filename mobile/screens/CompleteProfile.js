import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";

const CompleteProfile = ({ route, navigation }) => {
  const { userData } = route.params;
  const { email, password, confirmPassword } = userData;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const registerUser = async () => {
    try {
      const response = await axios.post("/auth/register", {
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
      });
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        text1Style: {
          color: "black",
          fontSize: 8,
        },
      });
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Your Full Name"
        value={name}
        onChangeText={setName}
        className="w-full"
      />
      <TextInput
        placeholder="Your_username"
        value={username}
        onChangeText={setUsername}
        className="w-full"
      />
      <TouchableOpacity onPress={registerUser}>
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompleteProfile;
