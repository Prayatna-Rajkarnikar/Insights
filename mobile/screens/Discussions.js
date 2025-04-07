import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Background from "../helpers/Background";

const Discussions = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        const response = await axios.get(`/room/getUserRooms`);
        setRooms(response.data.rooms);
        setUserId(response.data.userId);
        setUserName(response.data.userName);
      } catch (err) {
        console.error(
          "Error fetching user rooms:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserRooms();
  }, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-2xl shadow mb-4 flex-row items-center space-x-4"
      onPress={() =>
        navigation.navigate("RoomChat", {
          roomId: item._id,
          roomName: item.name,
          userId: userId,
          userName: userName,
        })
      }
    >
      {item.admin?.image && (
        <Image
          source={{ uri: item.admin.image }}
          className="w-12 h-12 rounded-full"
        />
      )}
      <View>
        <Text className="text-lg font-semibold text-gray-800">
          {item.name || "Unknown"}
        </Text>
        <Text className="text-lg font-semibold text-gray-800">
          Admin: {item.admin?.name || "Unknown"}
        </Text>
        <Text className="text-gray-500">{item.admin?.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Background>
      <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#7871AA" />
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-8"
        onPress={() => navigation.navigate("ExploreDiscussions")}
      >
        <Text>Explore rooms</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-8"
        onPress={() => navigation.navigate("CreateDiscussionScreen")}
      >
        <Ionicons name="create" size={30} color="#7871AA" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold mb-4">Your Discussions</Text>
      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : rooms.length === 0 ? (
        <Text className="text-center text-gray-500">No rooms joined yet.</Text>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
        />
      )}
    </Background>
  );
};

export default Discussions;
