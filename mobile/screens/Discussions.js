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
import Toast from "react-native-toast-message";

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
    } catch (error) {
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
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <Background>
      {/* Headers */}
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

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primaryWhite text-lg font-bold">
            Your Discussions
          </Text>
          <Text className="text-accent">{filteredRooms.length} rooms</Text>
        </View>

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
                  await fetchUserRooms();
                }}
              >
                <Ionicons name="close-circle" size={20} color="#ABABAB" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Result */}
        {loading ? (
          <View className="flex-1 justify-center items-center bg-primaryBlack">
            <ActivityIndicator size="large" color="#3949AB" />
          </View>
        ) : filteredRooms.length === 0 ? (
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
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-xl font-bold text-primaryWhite"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs font-thin text-accent">Message</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#ABABAB"
                  className="ml-2"
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Background>
  );
};

export default Discussions;
