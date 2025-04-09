import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Background from "../helpers/Background";
import InputField from "../helpers/InputField";
import Button from "../helpers/Button";

const CreateDiscussionScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigation();

  const handleCreateRoom = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Validation Error", "Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post("/room/createRoom", {
        name,
        description,
      });

      if (response.status === 201) {
        const userInfo = {
          userId: response.data.userId,
          name: response.data.name,
        };
        Alert.alert("Success", "Room created successfully!", [
          {
            text: "Go to Room",
            onPress: () =>
              navigation.navigate("RoomChat", {
                roomId: response.data.room._id,
                roomName: response.data.room.name,
                userId: userInfo.userId,
                userName: userInfo.name,
              }),
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create room."
      );
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle="flex-1 justify-center">
        <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#8B8F92" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center mb-8 mt-2 text-primaryWhite">
          Create New Discussion Room
        </Text>

        <InputField
          value={name}
          onChangeText={setName}
          placeholder="Room Name"
          className="text-lg font-medium"
        />

        <InputField
          value={description}
          onChangeText={setDescription}
          placeholder="Room Description"
          multiline
          className="text-lg font-medium h-20"
        />

        <Button onPress={handleCreateRoom} label="Create" />
      </ScrollView>
    </Background>
  );
};

export default CreateDiscussionScreen;
