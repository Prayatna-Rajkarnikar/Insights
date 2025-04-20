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
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create room."
      );
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle="flex-1 justify-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
          <Text className="text-primaryWhite text-lg ml-2">Back</Text>
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

        <View className="bg-secondaryBlack px-3 py-2 rounded-2xl mb-3">
          <TextInput
            placeholderTextColor="#ABABAB"
            value={description}
            onChangeText={setDescription}
            multiline
            scrollEnabled={false}
            placeholder="Room Description"
            className=" text-primaryWhite text-lg font-medium h-20"
          />
        </View>

        <Button onPress={handleCreateRoom} label="Create" />
      </ScrollView>
    </Background>
  );
};

export default CreateDiscussionScreen;
