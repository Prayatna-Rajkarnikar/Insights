import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const EditBlog = () => {
  const route = useRoute();
  const { blogId } = route.params;
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`/blog/getBlogDetail/${blogId}`);
        setTitle(response.data.title);
        setSubtitle(response.data.subTitle);
        setContent(response.data.content);
        // setImages(
        //   response.data.images.map((img) => `${axios.defaults.baseURL}${img}`)
        // );
        // console.log("Fetched images:", response.data.images);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const editBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle);
      formData.append("content", content);

      // if (images === 0) {
      //   const existingImgs = await axios.get(`/blog/getBlogDetail/${blogId}`);
      //   existingImgs.data.images.forEach((imageUri) => {
      //     formData.append("images", {
      //       uri: `${axios.defaults.baseURL}${imageUri}`,
      //       type: "image/jpeg",
      //       name: imageUri.split("/").pop(),
      //     });
      //   });
      // } else {
      //   images.forEach((imageUri) => {
      //     if (imageUri) {
      //       formData.append("images", {
      //         uri: imageUri,
      //         type: "image/jpeg",
      //         name: imageUri.split("/").pop(),
      //       });
      //     } else {
      //       console.error("Image URI is undefined:", imageUri);
      //     }
      //   });
      // }

      images.forEach((image) => {
        formData.append("images", {
          uri: image.uri,
          type: image.mimeType,
          name: image.fileName || image.uri.split("/").pop(),
        });
      });

      await axios.put(`/blog/editBlog/${blogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigation.goBack();
      Toast.show({
        type: "success",
        position: "top",
        text1: "Changes made successfully",
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.error
          : error.message || "Something went wrong";
      console.error("Edit blog error", error);

      Toast.show({
        type: "error",
        position: "top",
        text1: errorMessage,
      });
    }
  };

  const pickImage = async () => {
    if (Platform.OS === "android") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log("Image picker result:", result);

        // if (!result.canceled && result.assets && result.assets.length > 0) {
        //   const selectedImgs = result.assets.map((asset) => asset.uri);
        //   const totalImgs = images.length + selectedImgs.length;

        //   if (totalImgs > 5) {
        //     Toast.show({
        //       type: "error",
        //       position: "top",
        //       text1: "You cannot upload more than 5 images.",
        //     });
        //     return;
        //   }

        //   // Log the selected images
        //   console.log("Selected images:", selectedImgs);

        //   setImages((prevImgs) => [...prevImgs, ...selectedImgs]);
        // } else {
        //   alert("No images were selected.");
        // }
        if (!result.canceled) {
          if (images.length < 5) {
            setImages([...images, result.assets[0]]);
          } else {
            alert("You can only upload up to 5 images.");
          }
        }
      } catch (error) {
        console.error("Error picking image:", error);
        alert("Error picking image, please try again.");
      }
    } else {
      alert("This feature is only available on Android devices.");
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images]; // Create a copy of the images array
    updatedImages.splice(index, 1); // Remove the image at the specified index
    setImages(updatedImages); // Update the state with the new array
  };

  return (
    <View className="flex-1 px-6 pt-5">
      <View className="flex-row justify-end items-center space-x-3">
        <TouchableOpacity
          className="p-1 bg-gray-800 rounded-xl"
          onPress={editBlog}
        >
          <Text className="text-gray-50">Save changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-1 bg-gray-200 rounded-xl"
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={30} className="text-gray-800" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1">
        <TextInput
          className="text-3xl font-black mt-5"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          multiline
        />
        <TextInput
          className="text-xl font-semibold mt-1"
          placeholder="Subtitle"
          value={subtitle}
          onChangeText={setSubtitle}
          multiline
        />
        <TextInput
          className="text-justify text-lg font-normal mt-3"
          placeholder="Blog content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* {images && images.length > 0 && (
          <View className="mt-3 mb-3">
            {images.map((image, index) => (
              <View key={index} className="flex-row flex-wrap m1">
                <Image
                  source={{
                    uri: image,
                  }}
                  className="w-full h-40 rounded-lg mt-2"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )} */}

        {images && images.length > 0 && (
          <View className="flex-row flex-wrap mt-3 mb-3">
            {images.map((uri, index) => (
              <View key={index} className="relative m-1">
                <Image
                  source={{ uri: images[index].uri }}
                  className="w-80 h-40 rounded-sm"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 rounded-full"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View className="h-5" />
      </ScrollView>
    </View>
  );
};

export default EditBlog;
