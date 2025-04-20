import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

import Background from "../helpers/Background";

const Comment = () => {
  const route = useRoute();
  const { blogId, user } = route.params;

  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/getComments/${blogId}`);
      setComments(response.data.comments);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Failed to fetch total comments" || "Something went wrong",
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
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
        position: "bottom",
        text1: error.response.data.error || "Failed to submit your comment",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleLongPress = (comment) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.patch(`/comments/hideComment/${selectedComment._id}`);
      fetchComments();
      setShowModal(false);
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Comment deleted successfully",
        visibilityTime: 2000,
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Failed to delete comment",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const flagComment = async () => {
    try {
      await axios.post(`/flag/flagComment/${selectedComment._id}`);
      setShowModal(false);
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Comment flagged successfully",
        visibilityTime: 2000,
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error.response.data.error || "Failed to flag comment",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableHighlight
      onLongPress={() => handleLongPress(item)}
      underlayColor="#1E1E1E"
      className
    >
      <View className="mb-4">
        <View className="flex-row">
          <Image
            source={{ uri: `${axios.defaults.baseURL}${item.author.image}` }}
            className="w-10 h-10 rounded-full bg-primaryWhite"
          />
          <View className="bg-secondaryBlack rounded-2xl p-3 mx-1 max-w-[260px]">
            <Text className="text-primaryWhite font-bold">
              {item.author.name}
            </Text>
            <Text className="text-primaryWhite">{item.content}</Text>
          </View>
          <View className="flex-row items-center mt-1 ml-2">
            <Text className="text-lightGray text-xs">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

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
        Comments
      </Text>

      {comments.length === 0 ? (
        <Background>
          <View className="flex-1 justify-center items-center">
            <Text className="text-primaryWhite text-lg">No Comments yet</Text>
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
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          className="mt-3"
          showsVerticalScrollIndicator={false}
        />
      )}

      <View className="flex-row items-center bg-secondaryBlack px-3 py-2 rounded-2xl my-4">
        {user?.image && (
          <Image
            source={{ uri: `${axios.defaults.baseURL}${user.image}` }}
            className="w-8 h-8 rounded-full bg-primaryWhite mr-2"
          />
        )}
        <TextInput
          className="flex-1 text-primaryWhite rounded-full px-4 py-2 mr-2"
          placeholder="Add a comment..."
          placeholderTextColor="#ABABAB"
          value={userComment}
          onChangeText={setUserComment}
          multiline
          scrollEnabled={false}
        />
        <View className="rounded-full p-2 bg-accent">
          <TouchableOpacity onPress={addComment}>
            <Ionicons name="arrow-up-circle" size={28} color="#E4E6E7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for deleting or flagging comment */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-primaryBlack">
          <View className="bg-secondaryBlack p-5 rounded-xl mx-10">
            <Text className="text-center font-semibold text-lg mb-3 text-primaryWhite">
              {user.email === selectedComment?.author.email
                ? "Delete this comment?"
                : "Flag this comment?"}
            </Text>

            {selectedComment && (
              <View className="p-3 rounded-md mb-4">
                <Text className="text-lightGray text-sm ">
                  {selectedComment.author.name}
                </Text>
                <Text
                  className="text-primaryWhite mt-1 text-base"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {selectedComment.content}
                </Text>
              </View>
            )}
            <View className="flex-row justify-around">
              {user.email === selectedComment?.author.email ? (
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteComment();
                    setShowModal(false);
                  }}
                >
                  <Ionicons name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    flagComment();
                    setShowModal(false);
                  }}
                >
                  <Ionicons
                    name="flag"
                    size={24}
                    style={{ color: "#3949AB" }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close-circle" size={24} color="#ABABAB" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Background>
  );
};

export default Comment;
