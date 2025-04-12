import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserBlogs from "./UserBlogs";
import Background from "../helpers/Background";

const UserProfile = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { userId } = params;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const imageUrl = user?.image
    ? `${axios.defaults.baseURL}${user.image}`
    : `${axios.defaults.baseURL}/default-user.png`;

  const renderHeader = () => (
    <>
      <View className="flex justify-center items-center mt-4">
        <Image
          source={{ uri: imageUrl }}
          className="w-40 h-40 rounded-full bg-primaryWhite shadow-lg"
          style={{ borderWidth: 4, borderColor: "#3949AB" }}
        />
      </View>

      <View className="bg-secondaryBlack mx-4 p-4 mt-4 rounded-xl shadow-lg">
        <Text className="text-primaryWhite text-2xl font-bold text-center">
          {user?.name}
        </Text>
        <Text className="text-lightGray text-sm text-center">
          @{user?.username}
        </Text>

        {user?.bio ? (
          <Text className="text-primaryWhite text-sm text-center mt-2">
            {user.bio}
          </Text>
        ) : (
          <Text className="text-lightGray text-sm text-center mt-2">
            No bio added.
          </Text>
        )}
      </View>
    </>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <Text className="text-primaryWhite text-lg">User not found.</Text>
      </View>
    );
  }

  return (
    <Background>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center"
      >
        <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
        <Text className="text-primaryWhite text-lg ml-2">Back</Text>
      </TouchableOpacity>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<UserBlogs userId={userId} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Background>
  );
};
export default UserProfile;
