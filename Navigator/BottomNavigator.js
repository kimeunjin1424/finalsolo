import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from '../Screens/HomeScreen'
import LikesScreen from '../Screens/LikesScreen'
import ChatScreen from '../Screens/ChatScreen'
import ProfileScreen from '../Screens/ProfileScreen'
import { Tinder } from '../Screens/Tinder'
import { FontAwesome6 } from '@expo/vector-icons'
import LightScreen from '../Screens/LightScreen'
import { FontAwesome } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarStyle: { backgroundColor: '#f5eeee' },
          tabBarLabelStyle: { color: 'gray' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="home" size={30} color="black" />
            ) : (
              <FontAwesome name="home" size={30} color="lightgray" />
            ),
        }}
      />

      <Tab.Screen
        name="Tinder"
        component={Tinder}
        options={{
          tabBarStyle: { backgroundColor: '#f5eeee' },
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons name="card" size={35} color="black" />
            ) : (
              <MaterialCommunityIcons name="card" size={35} color="lightgray" />
            ),
        }}
      />

      <Tab.Screen
        name="Likes"
        component={LikesScreen}
        options={{
          tabBarStyle: { backgroundColor: '#f5eeee' },
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="heart" size={30} color="black" />
            ) : (
              <Entypo name="heart" size={30} color="lightgray" />
            ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarStyle: { backgroundColor: '#f5eeee' },
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialIcons
                name="chat-bubble-outline"
                size={30}
                color="black"
              />
            ) : (
              <MaterialIcons
                name="chat-bubble-outline"
                size={30}
                color="lightgray"
              />
            ),
        }}
      />

      <Tab.Screen
        name="Light"
        component={LightScreen}
        options={{
          tabBarStyle: { backgroundColor: '#f5eeee' },
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome6 name="bolt" size={30} color="black" />
            ) : (
              <FontAwesome6 name="bolt" size={30} color="lightgray" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarStyle: { backgroundColor: '#f5eeee' },
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person-circle-outline" size={35} color="black" />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={35}
                color="lightgray"
              />
            ),
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavigator

const styles = StyleSheet.create({})
