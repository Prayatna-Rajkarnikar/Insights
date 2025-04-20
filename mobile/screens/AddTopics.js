import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

import Background from "../helpers/Background";
import Button from "../helpers/Button";

const AddTopics = ({ route, navigation }) => {
  const { blogData } = route.params;

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const goToPreview = () => {
    if (selectedTopics.length === 0) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Please select at least one topic.",
        visibilityTime: 2000,
        autoHide: true,
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
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/search/searchTopic?query=${query}`);
      setResults(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Failed to fetch topics",
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedTopics = (topic) => {
    if (selectedTopics.some((selectedItem) => selectedItem._id === topic._id)) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "This topic is already selected.",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    if (selectedTopics.length >= 5) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "You can select up to 5 topics only.",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    setSelectedTopics((prevTopics) => [...prevTopics, topic]);
    setQuery(""); // Clear search after selection
  };

  const handleDeselectedTopic = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.filter((item) => item._id !== topic._id)
    );
  };

  useEffect(() => {
    if (query.trim()) {
      const delayDebounceFn = setTimeout(() => {
        fetchTopics();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <Background>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E8E8E8" />
          <Text className="text-primaryWhite text-base ml-2">Back</Text>
        </TouchableOpacity>

        <Text className="text-primaryWhite text-lg font-bold">Add Topics</Text>

        <View style={{ width: 70 }} />
      </View>

      <View className="mb-6">
        <Text className="text-primaryWhite text-lg font-bold mb-2">
          Select Topics
        </Text>
        <Text className="text-lightGray mb-4">
          Choose topics that best describe your blog post. This helps readers
          find your content. You can select up to 5 topics.
        </Text>

        {/* Search bar */}
        <View className="bg-secondaryBlack rounded-xl p-4 mb-4">
          <View className="flex-row items-center bg-primaryBlack rounded-full px-4 py-2">
            <Ionicons name="search-outline" size={20} color="#ABABAB" />
            <TextInput
              className="flex-1 text-primaryWhite ml-2"
              placeholder="Search topics..."
              placeholderTextColor="#ABABAB"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={fetchTopics}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={20} color="#ABABAB" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results */}
          {loading ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="small" color="#3949AB" />
            </View>
          ) : results.length > 0 && query.trim() ? (
            <View className="mt-4 border-t border-primaryBlack pt-3">
              <Text className="text-primaryWhite font-bold mb-2">
                Search Results
              </Text>
              <FlatList
                data={results}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectedTopics(item)}
                    className="flex-row justify-between items-center py-3 px-2 border-b border-primaryBlack"
                  >
                    <Text className="text-lightGray text-base">
                      {item.name}
                    </Text>
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="#3949AB"
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : query.trim() ? (
            <View className="items-center justify-center py-4 mt-2">
              <Text className="text-lightGray">
                No topics found matching "{query}"
              </Text>
            </View>
          ) : null}
        </View>

        {/* Selected Topics */}
        <View className="bg-secondaryBlack rounded-xl p-4 mb-4">
          <Text className="text-primaryWhite font-bold mb-3">
            Selected Topics ({selectedTopics.length}/5)
          </Text>

          {selectedTopics.length > 0 ? (
            <View className="flex-row flex-wrap">
              {selectedTopics.map((topic) => (
                <View key={topic._id} className="mr-2 mb-2">
                  <TouchableOpacity
                    onPress={() => handleDeselectedTopic(topic)}
                    className="bg-accent rounded-full px-3 py-2 flex-row items-center"
                  >
                    <Text className="text-primaryWhite">{topic.name}</Text>
                    <View className="ml-2 bg-primaryWhite rounded-full w-5 h-5 items-center justify-center">
                      <Ionicons name="close" size={14} color="#000000" />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-6 bg-primaryBlack rounded-lg">
              <Ionicons name="pricetags-outline" size={40} color="#ABABAB" />
              <Text className="text-lightGray mt-2">
                No topics selected yet
              </Text>
              <Text className="text-lightGray text-xs mt-1">
                Search and select topics above
              </Text>
            </View>
          )}
        </View>
      </View>

      <Button onPress={goToPreview} label="Save" />
    </Background>
  );
};

export default AddTopics;
