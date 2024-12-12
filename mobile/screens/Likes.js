import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Likes = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [likeList, setLikeList] = useState([]);
  const [loading, setLoading] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      fetchLikeList();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLikeList = async () => {
    try {
      const response = await axios.get(`/like/getUserLike/${blogId}`);
      setLikeList(response.data.likeList);
    } catch (error) {
      console.error("Failed to get likes.", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View className="flex-row space-x-4 mb-4">
        <Image
          source={{ uri: `${axios.defaults.baseURL}${item.user.image}` }}
          className="rounded-full h-12 w-12"
        />
        <View>
          <Text className="text-xl text-gray-50 font-bold">
            {item.user.name}
          </Text>
          <Text className="text-xs text-gray-400 font-bold">
            {item.user.username}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View className="flex-1 bg-gray-900 px-5">
      {/* close icon */}
      <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color="#9CA3AF" />
      </TouchableOpacity>
      <Text
        className="text-center font-bold text-gray-400 text-base
         mb-4"
      >
        Likes
      </Text>
      {likeList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-100">No Comments yet.</Text>
        </View>
      ) : (
        <FlatList
          data={likeList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default Likes;
