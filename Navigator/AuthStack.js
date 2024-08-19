import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from '../Screens/LoginScreen'
import BasicInfo from '../Screens/BasicInfo'
import NameScreen from '../Screens/NameScreen'
import EmailScreen from '../Screens/EmailScreen'
import Password from '../Screens/Password'
import BirthScreen from '../Screens/BirthScreen'
import LocationScreen from '../Screens/LocationScreen'
import GenderScreen from '../Screens/GenderScreen'
import TypeScreen from '../Screens/TypeScreen'
import DatingType from '../Screens/DatingType'
import LookingFor from '../Screens/LookingFor'
import HomeTown from '../Screens/HomeTown'
import PhotoScreen from '../Screens/PhotoScreen'
import PromptsScreen from '../Screens/PromptsScreen'
import ShowPromptsScreen from '../Screens/ShowPromptsScreen'
import PreFinalScreen from '../Screens/PreFinalScreen'
import { Tinder } from '../Screens/Tinder'
import SavePeople from '../Screens/SavePeople'
import Aggrement from '../Screens/Aggrement'
import Promise1 from '../Screens/Promise1'
import Promise4 from '../Screens/Promise4'
import Promise5 from '../Screens/Promise5'
import Promise3 from '../Screens/Promise3'
import Promise2 from '../Screens/Promise2'
import PreLogin from '../Screens/PreLogin'
import Notifi from '../Screens/Notifi'
import FindPassword from '../Screens/FindPassword'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PreLogin"
        component={PreLogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Basic"
        component={BasicInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Name"
        component={NameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Email"
        component={EmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Password"
        component={Password}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Birth"
        component={BirthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FindPassword"
        component={FindPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Gender"
        component={GenderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Type"
        component={TypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dating"
        component={DatingType}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LookingFor"
        component={LookingFor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Hometown"
        component={HomeTown}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Photos"
        component={PhotoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Prompts"
        component={PromptsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowPrompts"
        component={ShowPromptsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Aggrement"
        component={Aggrement}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Promise1"
        component={Promise1}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Promise2"
        component={Promise2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Promise3"
        component={Promise3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Promise4"
        component={Promise4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Promise5"
        component={Promise5}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreFinal"
        component={PreFinalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifi"
        component={Notifi}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tinder"
        component={Tinder}
        options={{ headerShown: true }}
      />

      {/* Other authentication screens */}
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})
