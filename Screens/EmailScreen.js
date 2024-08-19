import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useNavigation } from '@react-navigation/native'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import axios from 'axios'
import { baseUrl } from '../Utils/api'

const EmailScreen = () => {
  const [email, setEmail] = useState('')
  const [verifyEmail, setVerifyEmail] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    getRegistrationProgress('Email').then((progressData) => {
      if (progressData) {
        setEmail(progressData.email || '')
      }
    })
  }, [])

  const handleNext = () => {
    if (email.trim() !== '') {
      console.log('email', email)
      // Save the current progress data including the name
      saveRegistrationProgress('Email', { email })
    }
    // Navigate to the next screen
    navigation.navigate('Password')
  }

  const emailVerify = async () => {
    try {
      console.log('Email verify')

      await axios
        .post(`${baseUrl}/api/user/email-verify`, { email })
        .then((res) => {
          console.log(res.data)
          if (res.data.status == true) {
            setVerifyEmail(true)
          } else {
            setVerifyEmail(false)
            Alert.alert('실패', '이미 존재하는 Email 입니다', [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ])
          }
        })
        .catch((err) => console.log('email verify', err))
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 50, marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Fontisto name="email" size={26} color="black" />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 30,
            //fontWeight: 'bold',
            fontFamily: 'Se-Hwa',
            marginTop: 20,
          }}
        >
          당신의 e-mail을 입력해 주세요!
        </Text>

        <Text style={{ marginTop: 10, fontSize: 13, color: 'gray' }}>
          당신의 email은 외부에 공개되지않고, 안전하게 관리됩니다.
        </Text>
        <Text style={{ marginTop: 3, fontSize: 13, color: 'gray' }}>
          비밀번호 분실시, 위의 Email로 비밀번호가 보내집니다.
        </Text>
        <TextInput
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            width: 340,
            marginVertical: 10,
            fontSize: email ? 30 : 30,
            marginTop: 25,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            paddingBottom: 10,
            fontFamily: 'Se-Hwa',
          }}
          placeholder="Enter your email"
          placeholderTextColor={'#BEBEBE'}
        />
        <TouchableOpacity
          style={{
            borderColor: '#581845',
            padding: 5,
            borderWidth: 2,
            borderRadius: 25,
            alignItems: 'center',
          }}
          onPress={emailVerify}
        >
          <Text
            style={{
              color: 'gray',
              color: '#581845',
              fontSize: 25,
              marginTop: 7,
              fontFamily: 'Se-Hwa',
              alignItems: 'center',
              marginBottom: 3,
            }}
          >
            이메일 중복 확인하기(Click)
          </Text>
        </TouchableOpacity>
        {verifyEmail ? (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={{
              marginTop: 5,
              marginLeft: 'auto',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              color: '#581845',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#581845',
                textDecorationLine: 'underline',
              }}
            >
              사용 가능한 Email입니다.
            </Text>
            <MaterialCommunityIcons
              name="arrow-right-circle"
              size={45}
              color="#581845"
              style={{ alignSelf: 'center' }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  )
}

export default EmailScreen

const styles = StyleSheet.create({})
