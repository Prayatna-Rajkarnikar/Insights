import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const Comment = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
    <View className="flex-row bg-white rounded-lg p-4 my-1 shadow-md">
      <Image
        source={{ uri: `${axios.defaults.baseURL}${item.author.image}` }}
        className="rounded-full h-12 w-12"
      />
      <View className="ml-3 flex-1">
        <Text className="text-gray-800 font-semibold">{item.author.name}</Text>
        <Text className="text-gray-500 text-xs">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </Text>
        <Text className="text-gray-700 mt-1 text-base">{item.content}</Text>
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

  if (comments.length == 0) {
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
          Comments
        </Text>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-800">No comments yet.</Text>
        </View>
        <View className="flex-row items-center bg-white p-3 rounded-full shadow-lg mt-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 bg-gray-50"
            placeholder="Add a comment..."
            value={userComment}
            onChangeText={setUserComment}
            multiline
          />
          <TouchableOpacity
            onPress={addComment}
            className="bg-violet-500 rounded-full p-2"
          >
            <Ionicons name="arrow-up-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={() => navigation.goBack()}
    >
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
          Comments
        </Text>
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />
        <View className="flex-row items-center bg-white p-3 rounded-full shadow-lg mt-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 bg-gray-50"
            placeholder="Add a comment..."
            value={userComment}
            onChangeText={setUserComment}
            multiline
          />
          <TouchableOpacity
            onPress={addComment}
            className="bg-violet-500 rounded-full p-2"
          >
            <Ionicons name="arrow-up-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Comment;
