import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import ProfileBlog from "./screens/ProfileBlog";
import UserBlogs from "./screens/UserBlogs";
import EditBlog from "./screens/EditBlog";
import UpdateProfile from "./screens/UpdateProfile";
import BlogDetail from "./screens/BlogDetail";
import Create from "./screens/Create";
import Comment from "./screens/Comment";
import Like from "./screens/Likes";
import AboutMe from "./screens/AboutMe";
import Trial from "./screens/Trial";
import axios from "axios";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// axios.defaults.baseURL = "http://192.168.1.5:3001";
axios.defaults.baseURL = "http://100.64.209.105:3001";
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
          <Stack.Screen name="Home" component={BottomNav} />
          <Stack.Screen name="Create" component={BottomNav} />
          <Stack.Screen name="ProfileBlog" component={ProfileBlog} />
          <Stack.Screen name="UserBlogs" component={UserBlogs} />
          <Stack.Screen name="BlogDetail" component={BlogDetail} />
          <Stack.Screen name="EditBlog" component={EditBlog} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="Like" component={Like} />
          <Stack.Screen name="AboutMe" component={AboutMe} />
          <Stack.Screen name="Trial" component={Trial} />
        </Stack.Navigator>
        <Toast />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="UserHome"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#2a2a2a",
          borderTopColor: "#151515",
          borderTopWidth: 3,
        },
      }}
    >
      <Tab.Screen
        name="UserHome"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={27}
              color={focused ? "#fff" : "#d3d3d3"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={27}
              color={focused ? "#fff" : "#d3d3d3"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileBlog"
        component={ProfileBlog}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={27}
              color={focused ? "#fff" : "#d3d3d3"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
