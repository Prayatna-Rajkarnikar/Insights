import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendings, setTrendings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getTrendingBlogs = async () => {
      try {
        const response = await axios.get("/blog/trending");
        setTrendings(response.data);
      } catch (error) {
        console.error("Error fetching trending blogs:", error);
      }
    };
    getTrendingBlogs();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Display a loading message if data is still being fetched
  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderTrendings = ({ item }) => {
    const firstImg =
      item.content.find((contentItem) => contentItem.type === "image")?.value ||
      null;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogDetail", { blogId: item._id })}
      >
        <View className="h-44 p-4 m-2 bg-gray-50 rounded-xl shadow-md shadow-gray-500">
          <View className="flex-row justify-between">
            <View className="w-44 ">
              <Text
                className="text-xl font-bold text-gray-800"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
            </View>
            {firstImg && (
              <Image
                source={{ uri: `${axios.defaults.baseURL}${firstImg}` }}
                className="w-36 h-28 rounded-xl"
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <View className="justify-center items-center">
        <Text>Home</Text>
        <View className="flex-row items-center justify-between space-x-4">
          <Text className="text-lg font-medium truncate">{user.name}</Text>
          <Image
            source={{ uri: `${axios.defaults.baseURL}${user.image}` }}
            className="w-20 h-20 rounded-full mr-4"
          />
        </View>
      </View>
      <FlatList
        data={trendings}
        renderItem={renderTrendings}
        keyExtractor={(item) => item._id} // Assuming _id is the unique identifier for each blog
        className="flex-1"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;
