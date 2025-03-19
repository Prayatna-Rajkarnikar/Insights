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
import { View } from "react-native";

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

// axios.defaults.baseURL = "http://192.168.1.7:3001";
axios.defaults.baseURL = "http://100.64.214.65:3001";
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
        </Stack.Navigator>
        <Toast />
        <StatusBar style="auto" />
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
          height: 62,
          backgroundColor: "#2D3135",
          borderColor: "#E9ECEF",
          borderTopWidth: 2,
          borderWidth: 2,
          borderRadius: 25,
          overflow: "hidden",
          position: "absolute",
          bottom: 40,
          width: 220,
          left: "50%",
          transform: [{ translateX: -110 }],
        },
      }}
    >
      <Tab.Screen
        name="UserHome"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              <Ionicons
                name="home"
                size={24}
                color={focused ? "#7871AA" : "#4B5563"}
              />
              {focused && (
                <View className="w-8 h-1 rounded-xl bg-[#7871AA] mt-1" />
              )}
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
            <View style={{ alignItems: "center" }}>
              <Ionicons
                name="add-circle"
                size={26}
                color={focused ? "#7871AA" : "#4B5563"}
              />
              {focused && (
                <View className="w-8 h-1 rounded-xl bg-[#7871AA] mt-1" />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              <Ionicons
                name="person-circle-outline"
                size={26}
                color={focused ? "#7871AA" : "#4B5563"}
              />
              {focused && (
                <View className="w-8 h-1 rounded-xl bg-[#7871AA] mt-1" />
              )}
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
