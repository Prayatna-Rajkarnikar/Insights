import React, { useEffect, useId, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import socket from "../utils/socket"; // ✅ import from the utils

const RoomChat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const route = useRoute();
  const { roomId, roomName, userId, userName } = route.params;

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        {roomName}
      </Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          console.log("Rendering item:", item);
          return (
            <View
              style={{
                backgroundColor: "#f2f2f2",
                padding: 8,
                marginBottom: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: "600" }}>{item.user.name}</Text>
              <Text>{item.message}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f2f2f2",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <TextInput
          value={msg}
          onChangeText={setMsg}
          placeholder="Type a message..."
          style={{ flex: 1, fontSize: 16 }}
        />
        <TouchableOpacity onPress={handleSend}>
          <Text style={{ color: "#007AFF", fontWeight: "600", marginLeft: 8 }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RoomChat;
