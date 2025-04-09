import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import Button from "../helpers/Button";
import Background from "../helpers/Background";

const AddTopics = ({ route, navigation }) => {
  const { blogData } = route.params;

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

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
    try {
      const response = await axios.get(`/search/searchTopic?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
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

  return (
    <Background>
      {/* Back Icon */}
      <View className="mt-8">
        <TouchableOpacity onPress={() => navigation.navigate("Create")}>
          <Ionicons name="arrow-back-outline" size={30} color="#8B8F92" />
        </TouchableOpacity>
      </View>
      {/* heading */}
      <View className="mt-5">
        <Text className="text-3xl font-bold text-primaryWhite">Add Topics</Text>
      </View>
      {/*sub heading */}
      <View className="mt-1">
        <Text className="text-sm font-normal text-lightGray">
          Add topics to let readers know what your topic is about.
        </Text>
      </View>
      {/* Search bar */}
      <View className="flex-row bg-secondaryBlack rounded-xl px-2 py-1 items-center mt-4">
        <Ionicons name="search-outline" size={26} color="#8B8F92" />
        <TextInput
          className="text-lg font-normal text-primaryWhite w-full"
          placeholder="Search topics"
          placeholderTextColor="#8B8F92"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchTopics}
          scrollEnabled={false}
        />
      </View>
      {/* Selected topic */}
      {selectedTopics && (
        <View className="mt-2 px-2 mb-2 min-h-20">
          <View className="flex-row flex-wrap gap-1">
            {selectedTopics.map((topic) => (
              <View key={topic._id} className="flex-row">
                <View className="bg-darkGray rounded-full p-2">
                  <Text className="text-primaryWhite text-xs font-medium">
                    {topic.name}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeselectedTopic(topic)}
                  className="bg-primaryWhite rounded-full  w-4 h-4"
                >
                  <Ionicons name="close" size={15} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Search Result */}
      {results.length > 0 && (
        <FlatList
          className="bg-secondaryBlack p-1 max-h-48"
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectedTopics(item)}
              className="p-2"
            >
              <Text className="text-lightGray text-base">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button onPress={goToPreview} label="Save" />
    </Background>
  );
};

export default AddTopics;
