import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import socket from "../utils/socket";
import Background from "../helpers/Background";

const RoomChat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const route = useRoute();
  const { roomId, roomName, userId, userName } = route.params;
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    // Join the room
    socket.emit("joinRoom", { roomId });

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/message/getMessages/${roomId}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(
        "Failed to fetch messages:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!msg.trim()) return;

    // Sending the message to the backend
    try {
      const response = await axios.post(`/message/sendMessage/${roomId}`, {
        message: msg,
        userId,
      });
      await fetchMessages();

      // Emit the message to the socket
      socket.emit("sendMessage", {
        roomId,
        message: msg,
        user: {
          name: userName,
          _id: userId,
        },
      });

      setMsg(""); // Clear the input field
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  const handleLeaveRoom = async () => {
    try {
      // Call the backend API to leave the room
      const response = await axios.put(`/room/leaveRoom/${roomId}`);

      // Emit the leave room event via socket
      socket.emit("leaveRoom", { roomId });

      // Navigate back to the previous screen
      navigation.navigate("Discussions");
    } catch (error) {
      console.error(
        "Error leaving room:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Background>
      <View className="flex-row items-center justify-between mt-8 mb-4 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#8B8F92" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primaryWhite">{roomName}</Text>
        <TouchableOpacity
          onPress={handleLeaveRoom}
          className="bg-red-600 px-3 py-1.5 rounded-full"
        >
          <Text className="text-sm text-primaryWhite">Leave</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => {
          const isOwnMessage = item.user._id === userId;

          const prevMsg = messages[index - 1];
          const isDifferentSender =
            !prevMsg || prevMsg.user._id !== item.user._id;

          const marginTopStyle = isDifferentSender ? "mt-4" : "mt-1";

          return (
            <View
              className={`${marginTopStyle} ${
                isOwnMessage
                  ? "self-end bg-accent"
                  : "self-start bg-secondaryBlack"
              } p-2 rounded-xl max-w-[80%]`}
            >
              {!isOwnMessage && isDifferentSender && (
                <View className="flex-row items-center mb-1">
                  <Image
                    source={{
                      uri: `${axios.defaults.baseURL}${item.user.image}`,
                    }}
                    className="rounded-full h-10 w-10 bg-primaryWhite mr-2"
                  />
                  <Text className="font-medium text-sm text-lightGray">
                    {item.user.name}
                  </Text>
                </View>
              )}
              <Text className="text-base text-primaryWhite">
                {item.message}
              </Text>
            </View>
          );
        }}
      />

      <View className="flex-row items-center bg-secondaryBlack px-3 py-2 rounded-2xl my-4">
        <TextInput
          value={msg}
          onChangeText={setMsg}
          placeholder="Type a message..."
          placeholderTextColor="#8B8F92"
          multiline
          scrollEnabled={false}
          className="flex-1 bg-secondaryBlack text-primaryWhite text-base font-normal"
        />
        <View className="rounded-full p-2 bg-accent">
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="arrow-up-circle" size={28} color="#E4E6E7" />
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
};

export default RoomChat;
