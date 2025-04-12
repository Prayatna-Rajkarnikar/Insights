import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Background from "../helpers/Background";

const Discussions = () => {
  const [loading, setLoading] = useState(true);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigation = useNavigation();

  const fetchUserRooms = useCallback(async () => {
    try {
      const response = await axios.get("/room/getUserRooms");
      setFilteredRooms(response.data.rooms);
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserRooms();
    }, [fetchUserRooms])
  );

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      if (query.trim() === "") {
        await fetchUserRooms();
      } else {
        const response = await axios.get(
          `/search/searchUserChat?query=${query}`
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

  return (
    <Background>
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
          <Text className="text-primaryWhite text-lg ml-2">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateDiscussionScreen")}
        >
          <Ionicons name="create" size={30} color="#E8E8E8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TouchableOpacity
          className="bg-accent px-4 py-3 rounded-lg mb-6"
          onPress={() => navigation.navigate("ExploreDiscussions")}
        >
          <Text className="text-primaryWhite text-lg font-bold text-center">
            Explore rooms
          </Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold mb-4 text-primaryWhite">
          Your Discussions
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

        {loading ? (
          <View className="flex-1 justify-center items-center bg-primaryBlack">
            <ActivityIndicator size="large" color="#3949AB" />
          </View>
        ) : filteredRooms.length === 0 ? (
          <Text className="text-center text-lightGray">
            No rooms joined yet.
          </Text>
        ) : (
          filteredRooms.map((item) => (
            <TouchableOpacity
              key={item._id}
              className="p-4 mb-4 bg-secondaryBlack rounded-lg"
              onPress={() =>
                navigation.navigate("RoomChat", {
                  roomId: item._id,
                  roomName: item.name,
                  userId: userId,
                  userName: userName,
                })
              }
            >
              <Text
                className="text-xl font-bold text-primaryWhite"
                numberOfLines={1}
              >
                {item.name || "Unknown"}
              </Text>
              <Text className="text-xs font-thin text-accent">Message</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Background>
  );
};

export default Discussions;
