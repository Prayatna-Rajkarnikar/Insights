import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const Comment = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const StyledView = styled(LinearGradient);

  useEffect(() => {
    try {
      fetchComments();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/getComments/${blogId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments");
    }
  };

  const addComment = async () => {
    try {
      await axios.post("/comments/createComment", {
        blogId,
        content: userComment,
      });
      setUserComment("");
      fetchComments();
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to submit your comment",
      });
    }
  };

  const renderItem = ({ item }) => (
    <View className="flex-row bg-gray-800 rounded-lg p-2 mt-3">
      <Image
        source={{ uri: `${axios.defaults.baseURL}${item.author.image}` }}
        className="rounded-full h-9 w-9"
      />
      <View className="ml-3 flex-1">
        <Text className="text-gray-50 font-bold text-base">
          {item.author.name}
        </Text>
        <Text className="text-gray-400 text-xs font-semibold">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </Text>
        <Text className="text-gray-100 mt-1 text-base font-medium">
          {item.content}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 px-5 pb-4">
      {/* close icon */}
      <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color="#9CA3AF" />
      </TouchableOpacity>

      {/* heading */}
      <Text
        className="text-center font-bold text-gray-400 text-base
         mb-3"
      >
        Comments
      </Text>

      {comments.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-100">No Comments yet.</Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          className="mt-3"
          showsVerticalScrollIndicator={false}
        />
      )}

      <View className="flex-row items-center bg-gray-800 p-3 rounded-full mt-4">
        <TextInput
          className="flex-1 border border-gray-400 rounded-full px-4 py-2 mr-2 bg-gray-800 text-gray-100 text-sm font-semibold"
          placeholder="Add a comment..."
          placeholderTextColor="#f3f4f6"
          value={userComment}
          onChangeText={setUserComment}
          multiline
          scrollEnabled={false}
        />

        <StyledView
          colors={["#312E81", "#4E2894"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-full p-2"
        >
          <TouchableOpacity onPress={addComment}>
            <Ionicons name="arrow-up-circle" size={28} color="white" />
          </TouchableOpacity>
        </StyledView>
      </View>
    </View>
  );
};

export default Comment;
