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
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
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
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
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
          visibilityTime: 8000,
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
      {/* Header */}
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

      {/* Search bar */}
      <View className="mb-4">
        <View className="flex-row items-center bg-secondaryBlack rounded-full px-4 py-2">
          <Ionicons name="search-outline" size={20} color="#ABABAB" />
          <TextInput
            placeholder="Search rooms..."
            placeholderTextColor="#ABABAB"
            value={searchQuery}
            onChangeText={handleSearch}
            className="flex-1 text-primaryWhite ml-2"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={async () => {
                setSearchQuery("");
                await fetchDiscussions();
              }}
            >
              <Ionicons name="close-circle" size={20} color="#ABABAB" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search result */}
      {filteredRooms.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 bg-secondaryBlack rounded-xl">
          <Ionicons name="chatbubbles-outline" size={60} color="#ABABAB" />
          <Text className="text-primaryWhite text-lg font-bold mt-4">
            No discussions found
          </Text>
          <Text className="text-lightGray text-center mt-2 px-6">
            {searchQuery
              ? `No results matching "${searchQuery}"`
              : "You haven't joined any discussion rooms yet"}
          </Text>
        </View>
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
