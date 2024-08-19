import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import BottomNavigator from './BottomNavigator'
import AnimationScreen from '../Screens/AnimationScreen'
import ProfileDetailsScreen from '../Screens/ProfileDetailsScreen'
import SendLikeScreen from '../Screens/SendLikeScreen'
import HandleLikeScreen from '../Screens/HandleLikeScreen'
import ChatRoom from '../Screens/ChatRoom'
import { AuthContext } from '../context/AuthContext'
import AuthStack from './AuthStack'
import ChargeHeart from '../Screens/ChargeHeart'
import SavePeople from '../Screens/SavePeople'
import JobVerify from '../Screens/JobVerify'
import SingoPage from '../Screens/SingoPage'
import SuggestPage from '../Screens/SuggestPage'
import Notifi from '../Screens/Notifi'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  //const { isLoading, token, userId } = useContext(AuthContext)

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size={'large'} />
  //     </View>
  //   )
  // }

  const MainStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Animation"
          component={AnimationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={ProfileDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendLike"
          component={SendLikeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HandleLike"
          component={HandleLikeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen
          name="ProfileDetail"
          component={ProfileDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChargeHeart"
          component={ChargeHeart}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SavePeople"
          component={SavePeople}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobVerify"
          component={JobVerify}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Singo"
          component={SingoPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Suggest"
          component={SuggestPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifi"
          component={Notifi}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainStack"
          component={MainStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
  // return (
  //   <NavigationContainer>
  //     {token === null || token === '' ? <AuthStack /> : <MainStack />}
  //   </NavigationContainer>
  // )
}

export default StackNavigator

const styles = StyleSheet.create({})
