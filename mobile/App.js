import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";

import Login from "./screens/Login";
import Register from "./screens/Register";
import CompleteProfile from "./screens/CompleteProfile";
import ForgetPassword from "./screens/ForgetPassword";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Profile from "./screens/Profile";
import UserBlogs from "./screens/UserBlogs";
import EditBlog from "./screens/EditBlog";
import UpdateProfile from "./screens/UpdateProfile";
import BlogDetail from "./screens/BlogDetail";
import { Create } from "./screens/Create";
import AddTopics from "./screens/AddTopics";
import Preview from "./screens/Preview";
import Comment from "./screens/Comment";
import Like from "./screens/Likes";
import UserProfile from "./screens/UserProfile";
import Discussions from "./screens/Discussions";
import RoomChat from "./screens/RoomChat";
import ExploreDiscussions from "./screens/ExploreDiscussions";
import CreateDiscussionScreen from "./screens/CreateDiscussionScreen";

axios.defaults.baseURL = "http://192.168.1.7:3001";
// axios.defaults.baseURL = "http://100.64.197.40:3001";
axios.defaults.withCredentials = true;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen name="Home" component={MainStack} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Create" component={Create} />
          <Stack.Screen name="AddTopics" component={AddTopics} />
          <Stack.Screen name="Preview" component={Preview} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="UserBlogs" component={UserBlogs} />
          <Stack.Screen name="BlogDetail" component={BlogDetail} />
          <Stack.Screen name="EditBlog" component={EditBlog} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="Like" component={Like} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="Discussions" component={Discussions} />
          <Stack.Screen name="RoomChat" component={RoomChat} />
          <Stack.Screen
            name="CreateDiscussionScreen"
            component={CreateDiscussionScreen}
          />
          <Stack.Screen
            name="ExploreDiscussions"
            component={ExploreDiscussions}
          />
        </Stack.Navigator>
        <Toast />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const BottomNav = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="UserHome"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#121212",
          borderColor: "#1E1E1E",
          borderTopWidth: 1,
          position: "absolute",
          bottom: 0,
          start: 0,
          end: 0,
        },
      }}
    >
      <Tab.Screen
        name="UserHome"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", paddingVertical: 10 }}>
              <Ionicons
                name="home"
                size={24}
                color={focused ? "#3949AB" : "#ABABAB"}
              />
              <Text
                style={{ color: focused ? "#3949AB" : "#ABABAB" }}
                className="text-xs mt-1"
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={Create}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Create");
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", paddingVertical: 10 }}>
              <Ionicons
                name="add-circle"
                size={24}
                color={focused ? "#3949AB" : "#ABABAB"}
              />
              <Text
                style={{ color: focused ? "#3949AB" : "#ABABAB" }}
                className="text-xs mt-1"
              >
                Create
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", paddingVertical: 10 }}>
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? "#3949AB" : "#ABABAB"}
              />
              <Text
                style={{ color: focused ? "#3949AB" : "#ABABAB" }}
                className="text-xs mt-1"
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomNav" component={BottomNav} />
    </Stack.Navigator>
  );
};
