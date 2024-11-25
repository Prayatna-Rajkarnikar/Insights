import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const AddTopics = ({ route, navigation }) => {
  const { blogData } = route.params;

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  const goToPreview = () => {
    if (selectedTopics.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select at least one topic before creating the blog.",
      });
      return;
    }

    const updatedBlogData = {
      ...blogData,
      selectedTopics,
    };
    navigation.navigate("Preview", { blogData: updatedBlogData });
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`/search/searchTopic?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to fetch topics. Please try again.");
    }
  };

  const handleSelectedTopics = (topic) => {
    if (selectedTopics.some((selectedItem) => selectedItem._id === topic._id)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "This topic is already selected.",
      });
      return;
    }

    if (selectedTopics.length >= 5) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "You can select up to 5 topics only.",
      });
      return;
    }

    setSelectedTopics((prevTopics) => [...prevTopics, topic]);
  };

  const handleDeselectedTopic = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.filter((item) => item._id !== topic._id)
    );
  };

  useEffect(() => {
    if (query.trim()) {
      fetchTopics();
    } else {
      setResults([]);
    }
  }, [query]);

  console.log(
    "Selected Topics:",
    selectedTopics.map((topic) => topic._id)
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        <TouchableOpacity onPress={() => navigation.navigate("Create")}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text>AddTopics</Text>
        {/* Search bar */}
        <TextInput
          className="text-base py-2 px-3 bg-gray-200 rounded-xl"
          placeholder="Search topics..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchTopics}
        />

        <Text className="text-base font-medium mb-2">Selected Topics:</Text>
        {/* Selected topic */}
        {selectedTopics && (
          <View className=" px-2 mb-2 min-h-20">
            <View className="flex-row flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <View key={topic._id} className="flex-row">
                  <View className="bg-gray-300 rounded-lg p-2">
                    <Text>{topic.name}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeselectedTopic(topic)}
                    className="bg-gray-600 rounded-full items-center justify-center w-4 h-4"
                  >
                    <Ionicons name="close" size={15} color="gray" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Search Result */}
        {results.length > 0 && (
          <FlatList
            className="bg-gray-200 p-1 max-h-48"
            data={results}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectedTopics(item)}
                className="p-2"
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity className="bg-slate-600" onPress={goToPreview}>
          <Text>Preview</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddTopics;
