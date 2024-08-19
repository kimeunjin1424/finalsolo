import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { AuthProvider } from './context/AuthContext'
import StackNavigator from './Navigator/StackNavigator'
import { ModalPortal } from 'react-native-modals'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import * as Font from 'expo-font'
import { Provider } from 'react-redux'
import { store } from './store'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { withIAPContext } from 'react-native-iap'

//SplashScreen.preventAutoHideAsync()

function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Se-Hwa': require('./assets/fonts/Se-Hwa.ttf'),
    'Ga-Ram': require('./assets/fonts/garam.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <AuthProvider>
        <Provider store={store}>
          <StackNavigator />
          <ModalPortal />
        </Provider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

export default withIAPContext(App)
