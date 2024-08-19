import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'
import { getRegistrationProgress } from '../Utils/registrationUtils'
import LottieView from 'lottie-react-native'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToLike,
  addToSave,
  addToToken,
  addToUser,
  addToUserId,
} from '../slices/userSlice'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'

const PreFinalScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [userData, setUserData] = useState('')
  const dispatch = useDispatch()

  const { userId, token } = useSelector((state) => state.user)

  const getAllUserData = async () => {
    try {
      const screens = [
        'Name',
        'Email',
        'Password',
        'Birth',
        'Location',
        'Gender',
        'Type',
        'Dating',
        'LookingFor',
        'Hometown',
        'Photos',
        'Prompts',
        'Age',
        'Decade',
        'Location',
        'Region',
        'Aggrement',
      ]
      let data = {}
      for (const screenName of screens) {
        const screenData = await getRegistrationProgress(screenName)
        if (screenData) {
          data = { ...data, ...screenData }
        }
      }
      setUserData(data)
      console.log('data', userData)
    } catch (error) {
      console.error('Error retrieving user data:', error)
      return null
    }
  }

  useEffect(() => {
    getAllUserData()
    console.log('userDat11a', userData)
  }, [])

  const clearAllScreenData = async () => {
    try {
      const screens = [
        'Name',
        'Email',
        'Birth',
        'Location',
        'Gender',
        'Type',
        'Dating',
        'LookingFor',
        'Hometown',
        'Photos',
      ]
      for (const screenName of screens) {
        const key = `registration_progress_${screenName}`
        await AsyncStorage.removeItem(key)
      }
      console.log('All screen data cleared successfully')
    } catch (error) {
      console.error('Error clearing screen data:', error)
    }
  }

  const registerUser = async () => {
    try {
      console.log('userData', userData)
      await axios
        .post(`${baseUrl}/api/user/register`, userData)
        .then((res) => {
          console.log('res', res)
          console.log('token', res.data.token)
          const token = res.data.token
          AsyncStorage.setItem('hinge_token', token)
          if (token) {
            const decodedToken = jwtDecode(token)
            const uId = decodedToken.userId
            dispatch(addToUserId(uId))
            dispatch(addToToken(token))
            if (uId) fetchUserInfo()
          }
        })
        .catch((err) => console.log('register Errror', err))
    } catch (error) {
      console.error('Error registering user:', error)
      throw error // Throw the error for handling in the component
    }
  }

  const fetchUserInfo = async () => {
    await axios
      .post(`${baseUrl}/api/user/user-profile`, { userId })
      .then((res) => {
        dispatch(addToUser(res.data.user))
        for (i = 0; i < res.data.user.likedProfiles.length; i++)
          dispatch(addToLike(res.data?.user?.likedProfiles[i]._id))
        //  console.log('aaaaaaa', res.data?.user?.likedProfiles[i]._id)
        for (i = 0; i < res.data.user.saveProfiles.length; i++)
          dispatch(addToSave(res.data?.user?.saveProfiles[i]._id))

        navigation.navigate('MainStack', { screen: 'Main' })
      })
      .catch((err) => console.log('fetch user Error', err))

    console.log('hello world')
  }
  // useEffect(() => {
  //   fetchUserInfo()
  // }, [token])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 80 }}>
        <Text
          style={{
            fontSize: 35,
            fontFamily: 'Se-Hwa',
            marginLeft: 20,
            textAlign: 'center',
          }}
        >
          회원 가입이 끝났습니다.
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 25,
            fontFamily: 'Se-Hwa',
            color: 'gray',
            marginTop: 10,
          }}
        >
          아래 내용을 꼭 읽어주세요.
        </Text>
      </View>

      <View>
        <LottieView
          source={require('../assets/heart.json')}
          style={{
            height: 260,
            width: 300,
            alignSelf: 'center',
            marginTop: 5,
            justifyContent: 'center',
          }}
          autoPlay
          loop={true}
          speed={0.7}
        />
      </View>
      <ScrollView style={{ padding: 10 }}>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          1. 이제부터 당신의 이름은 남자00호/여자00호 입니다.(프로필 페이지에서
          확인 사능합니다.)
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          2. 마음에 드는 이성에게 하트를 보낸 후, 상대방이 받아들이면, 대화를 할
          수 있습니다.
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          3. 상대방이 대화방을 나가면 자동적으로 매칭은 끝이나게 됩니다.
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          4. 기본적으로 남자는 하트30개, 여자는 100개가 주어집니다
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          5. 직업 확인은 급여명세서, 재직증명서 신분증과 명함, 사원증, 학생증 중
          하나로 확인하나, 그 결과를 100% 보장하지는 않습니다.
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          6. 만남을 가지시면 반드시 직업은 다시 한번 확인을 해 주세요.
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          7. 본 어플은 단 한명의 광고나 허위의 인물 가입은 허용하지 않습니다.
          광고나 허위의 인물이 드러날 경우 바로 계정이 삭제됨을 알려드립니다.
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          8. 어플 사용 중 허위 인물이나 광고를 보시면 꼭 신고하기 부탁드립니다.
        </Text>
        <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 20 }}>
          9. 더 나은 어플을 위해 필요한 기능이 있으시면 꼭 건의하기에 건의
          부탁드립니다.
        </Text>
        <Text
          style={{
            color: 'gray',
            fontFamily: 'Se-Hwa',
            fontSize: 20,
            marginBottom: 30,
          }}
        >
          10. 그럼, 여러분의 연예를 응원합니다. ^_^/
        </Text>
      </ScrollView>

      {/* 1.2024년 중 어느 한 달의 월급명세서{' '}
            </Text>
            <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}>
              2.재직증명서 3.신분증과 명함{' '}
            </Text>

            <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}>
              4.사원증과 명함 5.학생일 경우 학생증 */}

      <Pressable
        onPress={registerUser}
        style={{ backgroundColor: 'yellow', padding: 15, marginTop: 'auto' }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 30,
            fontFamily: 'Se-Hwa',
          }}
        >
          나혼자 솔로 시작하기
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default PreFinalScreen

const styles = StyleSheet.create({})
