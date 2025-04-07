import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message"; // Import toast

const ExploreDiscussions = ({ navigation }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get("/room/getAllRooms"); // Replace with your API endpoint
        setDiscussions(response.data); // Set the discussions data in state
      } catch (err) {
        setError("Failed to fetch discussions");
        console.error("Error fetching discussions:", err);
      } finally {
        setLoading(false); // Set loading to false when request finishes
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg">Loading discussions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  // Function to join a room
  const joinRoom = async (roomId) => {
    try {
      const response = await axios.put(`/room/joinRoom/${roomId}`);
      if (response.data.message) {
        // Show success toast if the room was joined successfully
        Toast.show({
          type: "success",
          text1: response.data.message,
        });
        // Optionally, navigate to the room's chat screen
        navigation.navigate("RoomChat", { roomId }); // Navigate to the chat room screen
      }
    } catch (error) {
      // Show error toast if there's an issue joining the room\
      console.log(error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Explore Discussions</Text>
      {discussions.length === 0 ? (
        <Text className="text-lg text-gray-500">No discussions available</Text>
      ) : (
        <FlatList
          data={discussions}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-100 p-4 mb-4 rounded-lg shadow-lg">
              <Text className="text-xl font-semibold mb-2">{item.name}</Text>
              <Text className="text-gray-700 mb-2">{item.description}</Text>
              <Text className="text-sm text-gray-500">
                Admin: {item.admin?.name || "Unknown"}
              </Text>
              <TouchableOpacity
                className="mt-4 px-4 py-2 bg-blue-500 rounded-full"
                onPress={() => joinRoom(item._id)} // Call joinRoom when the button is pressed
              >
                <Text className="text-white text-center">Join Room</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Toast />
    </View>
  );
};

export default ExploreDiscussions;
