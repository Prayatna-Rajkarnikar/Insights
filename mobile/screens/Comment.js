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
      console.error("Failed to fetch comments");
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
        position: "top",
        text1: "Failed to submit your comment",
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
        position: "top",
        text1: "Comment deleted successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to delete comment",
      });
    }
  };

  const flagComment = async () => {
    try {
      await axios.post(`/flag/flagComment/${selectedComment._id}`);
      setShowModal(false);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Comment flagged successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to flag comment",
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableHighlight
      onLongPress={() => handleLongPress(item)}
      underlayColor="#2D3135"
    >
      <View className="flex-row bg-secondaryBlack rounded-lg p-3 mt-3">
        <Image
          source={{ uri: `${axios.defaults.baseURL}${item.author.image}` }}
          className="rounded-full h-9 w-9 bg-primaryWhite"
        />
        <View className="ml-3 flex-1">
          <Text className="text-primaryWhite font-normal text-base">
            {item.author.name}
          </Text>
          <Text className="text-lightGray text-xs font-thin">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "2-digit",
            })}
          </Text>
          <Text className="text-primaryWhite mt-1 text-base font-medium">
            {item.content}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondaryBlack">
        <ActivityIndicator size="large" color="#2840B5" />
      </View>
    );
  }

  return (
    <Background>
      {/* close icon */}
      <View className="mt-8 items-end">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="close" size={30} color="#8B8F92" />
        </TouchableOpacity>
      </View>

      {/* heading */}
      <Text className="text-center font-bold text-lightGray text-base mb-4 mt-2">
        Comments
      </Text>

      {comments.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-primaryWhite">No Comments yet.</Text>
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

      <View className="flex-row items-center bg-secondaryBlack px-3 py-2 rounded-2xl my-4">
        <TextInput
          className="flex-1 bg-secondaryBlack text-primaryWhite text-base font-normal"
          placeholder="Add a comment..."
          placeholderTextColor="#8B8F92"
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
        <View className="flex-1 justify-center items-center">
          <View className="bg-secondaryBlack p-5 rounded-xl">
            <Text className="text-center font-semibold text-lg mb-3 text-primaryWhite">
              {user.email === selectedComment?.author.email
                ? "Delete this comment?"
                : "Flag this comment?"}
            </Text>

            {selectedComment && (
              <View className="p-3 rounded-md mb-4">
                <Text className="text-lightGray">
                  {selectedComment.author.name}
                </Text>
                <Text
                  className="text-primaryWhite mt-1 "
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
                  <Ionicons name="trash-bin" size={30} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    flagComment();
                    setShowModal(false);
                  }}
                >
                  <Ionicons name="flag" size={30} color="#2840B5" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close-circle" size={30} color="#25292D" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Background>
  );
};

export default Comment;
