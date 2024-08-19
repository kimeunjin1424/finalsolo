import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native'
import React, { useContext, useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const BasicInfo = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 80 }}>
        <Text
          style={{
            fontSize: 35,

            fontFamily: 'Se-Hwa',
            marginLeft: 20,
          }}
        >
          당신도 커플이 될 수 있습니다.
        </Text>
        <Text
          style={{
            fontSize: 33,
            fontFamily: 'Se-Hwa',
            marginLeft: 20,
            marginTop: 10,
          }}
        >
          지금부터 당신의 프로필을 작성해 주세요~
        </Text>
      </View>

      <View>
        <LottieView
          source={require('../assets/heart.json')}
          style={{
            height: 260,
            width: 300,
            alignSelf: 'center',
            marginTop: 40,
            justifyContent: 'center',
          }}
          autoPlay
          loop={true}
          speed={0.7}
        />
      </View>

      <Pressable
        onPress={() => navigation.navigate('Aggrement')}
        style={{
          backgroundColor: '#8A2BE2',
          padding: 15,
          marginTop: 'auto',
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontFamily: 'Se-Hwa',
            fontSize: 40,
          }}
        >
          시작해 볼까요~
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default BasicInfo

const styles = StyleSheet.create({})
