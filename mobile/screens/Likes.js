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
import Toast from "react-native-toast-message";
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

  const renderItem = ({ item }) => {
    return (
      <View className="flex-row justify-between items-center py-3 border-b border-primaryBlack">
        <TouchableOpacity className="flex-row items-center">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${item.user.image}` }}
            className="w-14 h-14 rounded-full bg-primaryWhite"
          />
          <View className="ml-3">
            <Text className="text-primaryWhite font-bold text-lg">
              {item.user.name}
            </Text>
            <Text className="text-lightGray text-xs">{item.user.username}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Background>
      {/* close icon */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>
      <Text className="text-primaryWhite text-xl font-bold mt-6 text-center">
        Likes
      </Text>

      {likeList.length === 0 ? (
        <Background>
          <View className="flex-1 justify-center items-center">
            <Text className="text-primaryWhite text-lg">No Likes yet</Text>
            <TouchableOpacity
              className="mt-4 bg-accent px-4 py-2 rounded-lg"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-primaryWhite">Go Back</Text>
            </TouchableOpacity>
          </View>
        </Background>
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
