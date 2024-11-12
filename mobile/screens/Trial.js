import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const CommentModal = ({ route, navigation }) => {
  const { blogId } = route.params;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/getComments/${blogId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return; // Prevent empty comments

    try {
      await axios.post(`/comments/addComment`, { blogId, comment });
      Alert.alert("Success", "Comment added successfully!");
      setComment(""); // Clear input field
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Failed to add comment:", error);
      Alert.alert("Error", "Failed to add comment.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)} // Handle back press
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Comments</Text>
          {/* <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          /> */}
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Type your comment..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCommentSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    height: "75%", // Modal covers 75% of screen height
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CommentModal;
