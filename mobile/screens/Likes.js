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

  if (likeList.length == 0) {
    return (
      <View className="flex-1 p-4 bg-gray-100">
        <TouchableOpacity
          className="items-end"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={30} />
        </TouchableOpacity>
        <Text
          className="text-center font-semibold text-gray-800 text-base
         mb-3"
        >
          Likes
        </Text>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-800">No Likes yet.</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View className="flex-row space-x-2 mt-2">
        <Image
          source={{ uri: `${axios.defaults.baseURL}${item.user.image}` }}
          className="rounded-full h-14 w-14"
        />
        <View>
          <Text className="text-base text-gray-800 font-medium">
            {item.user.name}
          </Text>
          <Text className="text-base text-gray-500 font-medium">
            {item.user.username}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <Modal
      transparent={true}
      visible={true}
      animationType="slide"
      onRequestClose={() => navigation.goBack()}
    >
      <View className="flex-1 p-4 bg-gray-100">
        <TouchableOpacity
          className="items-end"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={30} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 text-base mb-3">
          Likes
        </Text>
        <FlatList
          data={likeList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </View>
    </Modal>
  );
};

export default Likes;
