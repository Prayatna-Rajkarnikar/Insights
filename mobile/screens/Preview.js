import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Preview = ({ route }) => {
  const { blogData } = route.params;
  const { title, subtitle, contentSections, selectedTopics } = blogData;
  const navigation = useNavigation();

  // const [results, setResults] = useState([]);
  // const [query, setQuery] = useState("");
  // const [selectedTopics, setSelectedTopics] = useState([]);

  // const fetchTopics = async () => {
  //   try {
  //     const response = await axios.get(`/search/searchTopic?query=${query}`);
  //     setResults(response.data);
  //   } catch (error) {
  //     console.error("Error fetching topics:", error);
  //     setError("Failed to fetch topics. Please try again.");
  //   }
  // };

  // const handleSelectedTopics = (topic) => {
  //   if (selectedTopics.some((selectedItem) => selectedItem._id === topic._id)) {
  //     Toast.show({
  //       type: "error",
  //       position: "top",
  //       text1: "This topic is already selected.",
  //     });
  //     return;
  //   }

  //   if (selectedTopics.length >= 5) {
  //     Toast.show({
  //       type: "error",
  //       position: "top",
  //       text1: "You can select up to 5 topics only.",
  //     });
  //     return;
  //   }

  //   setSelectedTopics((prevTopics) => [...prevTopics, topic]);
  // };

  // const handleDeselectedTopic = (topic) => {
  //   setSelectedTopics((prevTopics) =>
  //     prevTopics.filter((item) => item._id !== topic._id)
  //   );
  // };

  // useEffect(() => {
  //   if (query.trim()) {
  //     fetchTopics();
  //   } else {
  //     setResults([]);
  //   }
  // }, [query]);

  // console.log(
  //   "Selected Topics:",
  //   selectedTopics.map((topic) => topic._id)
  // );

  const createBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle);
      formData.append("content", JSON.stringify(contentSections));
      formData.append(
        "topics",
        JSON.stringify(selectedTopics.map((topic) => topic._id))
      );

      contentSections
        .filter((section) => section.type === "image")
        .forEach((section) => {
          formData.append("image", {
            uri: section.value.uri,
            type: section.value.mimeType,
            name: section.value.fileName || section.value.uri.split("/").pop(),
          });
        });

      await axios.post("/blog/createBlog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast.show({
        type: "success",
        position: "top",
        text1: "Yay! You just created a blog",
      });

      navigation.navigate("Home");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.error
          : error.message || "Something went wrong";
      Toast.show({
        type: "error",
        position: "top",
        text1: errorMessage,
      });
    }
  };

  console.log(
    "Selected Topics:",
    selectedTopics.map((topic) => topic._id)
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <TouchableOpacity
        onPress={() => navigation.navigate("AddTopics", { blogData })}
      >
        <Ionicons name="arrow-back-outline" size={30} />
      </TouchableOpacity>

      {/* Heading */}
      <Text className="text-3xl font-bold">Preview</Text>

      {/* Search bar */}
      {/* <TextInput
          className="text-base py-2 px-3 bg-gray-200 rounded-xl"
          placeholder="Search topics..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchTopics}
        />

        <Text className="text-base font-medium mb-2">Selected Topics:</Text> */}
      {/* Selected topic */}
      {/* {selectedTopics && (
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
        )} */}

      {/* Search Result */}
      {/* {results.length > 0 && (
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
        )} */}
      <Text className="text-sm font-extralight">
        This is how the blog will be shown to readers in public places.
      </Text>

      {/* Card for Preview */}
      <View className="h-36 p-4 m-2 bg-gray-50 rounded-xl shadow-md shadow-gray-500">
        <View className="flex-row justify-between">
          <View className="w-44">
            <Text className="text-xl font-semibold mb-2">{title}</Text>
            <Text className="text-gray-600">{subtitle}</Text>
          </View>

          {contentSections.some((section) => section.type === "image") && (
            <View className="mb-4">
              <Image
                source={{
                  uri: contentSections.find(
                    (section) => section.type === "image"
                  ).value.uri,
                }}
                className="w-36 h-28 rounded-xl"
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>

      {selectedTopics.map((topic) => (
        <Text key={topic._id}>{topic.name}</Text>
      ))}

      {/* Publish button */}

      <TouchableOpacity
        onPress={createBlog}
        className="bg-gray-900 py-3 rounded-lg items-center justify-center"
      >
        <Text className="text-lg font-semibold text-gray-50">Create Blog</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Preview;
