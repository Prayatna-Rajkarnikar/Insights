import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Background from "../helpers/Background";

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
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#7871AA" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View className="flex-row space-x-4 mb-4">
        <Image
          source={{ uri: `${axios.defaults.baseURL}${item.user.image}` }}
          className="rounded-full h-12 w-12 bg-primaryWhite"
        />
        <View>
          <Text className="text-xl text-primaryWhite font-bold">
            {item.user.name}
          </Text>
          <Text className="text-xs text-darkGray font-bold">
            {item.user.username}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <Background>
      {/* close icon */}
      <View className="mt-8 items-end">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="close" size={30} color="#7871AA" />
        </TouchableOpacity>
      </View>
      <Text
        className="text-center font-bold text-darkGray text-base
         mb-4 mt-2"
      >
        Likes
      </Text>
      {likeList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-primaryWhite">No Likes yet.</Text>
        </View>
      ) : (
        <FlatList
          data={likeList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </Background>
  );
};

export default Likes;
