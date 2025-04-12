import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Background from "../helpers/Background";

const ExploreDiscussions = () => {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchDiscussions = async () => {
    try {
      const response = await axios.get("/room/getAllRooms");
      setFilteredRooms(response.data);
    } catch (err) {
      setError("Failed to fetch discussions");
      console.error("Error fetching discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    try {
      if (query.trim() === "") {
        await fetchDiscussions();
      } else {
        const response = await axios.get(
          `/search/searchAllChat?query=${query}`
        );
        setFilteredRooms(response.data);
      }
    } catch (error) {
      console.error(
        "Error searching user chats:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  // Function to join a room
  const joinRoom = async (roomId, roomName) => {
    try {
      const response = await axios.put(`/room/joinRoom/${roomId}`);
      if (response.data.message) {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: response.data.message,
          visibilityTime: 2000,
          autoHide: true,
        });
        const { userId, userName, roomName } = response.data;

        navigation.navigate("RoomChat", { roomId, roomName, userId, userName });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response?.data?.message || error.message,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <Background>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold my-4 text-primaryWhite">
        Explore Discussions
      </Text>
      <View className="flex-row bg-secondaryBlack rounded-xl p-2 items-center space-x-2 mb-4">
        <Ionicons name="search-outline" size={24} color="#E8E8E8" />
        <TextInput
          placeholder="Search rooms..."
          placeholderTextColor="#ABABAB"
          value={searchQuery}
          onChangeText={handleSearch}
          className="text-base font-normal text-primaryWhite flex-1"
        />
      </View>
      {filteredRooms.length === 0 ? (
        <Text className="text-lg text-lightGray">No discussions available</Text>
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View className="bg-secondaryBlack p-4 mb-4 rounded-lg ">
              <Text className="text-xl font-bold mb-2 text-primaryWhite">
                {item.name}
              </Text>
              <Text className="text-lightGray mb-2">{item.description}</Text>
              <Text className="text-sm text-lightGray">
                Admin: {item.admin?.name || "Unknown"}
              </Text>
              <TouchableOpacity
                className="mt-4 px-4 py-3 bg-accent rounded-xl"
                onPress={() => joinRoom(item._id)}
              >
                <Text className="text-white text-center">Join Room</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </Background>
  );
};

export default ExploreDiscussions;
