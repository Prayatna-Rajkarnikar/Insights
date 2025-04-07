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
        Alert.alert("Success", "Room created successfully!", [
          {
            text: "Go to Room",
            onPress: () =>
              navigation.navigate("RoomChat", {
                roomId: response.data.room._id,
                roomName: response.data.room.name,
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
    <ScrollView contentContainerStyle="flex-1 justify-center px-4 bg-white">
      <Text className="text-2xl font-bold text-center mb-8">
        Create New Discussion Room
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Room Name"
        className="h-12 border border-gray-300 rounded-lg p-3 mb-4"
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Room Description"
        className="h-24 border border-gray-300 rounded-lg p-3 mb-4"
        multiline
      />

      <TouchableOpacity
        onPress={handleCreateRoom}
        className="bg-blue-500 p-3 rounded-lg items-center"
      >
        <Text className="text-white font-semibold text-lg">Create Room</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateDiscussionScreen;
