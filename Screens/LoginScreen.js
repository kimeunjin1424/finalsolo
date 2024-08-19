import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LottieView from 'lottie-react-native'
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { baseUrl } from '../Utils/api'
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
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [option, setOption] = useState('start')
  const [token, setToken] = useState('')

  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const { userId } = useSelector((state) => state.user)
  console.log('userId', userId)

  const route = useRoute()
  const navigation = useNavigation()

  const createAccount = () => {
    navigation.navigate('Basic')
  }

  const login = async () => {
    await axios
      .post(`${baseUrl}/api/user/login`, { email, password })
      .then((res) => {
        console.log(res.status)
        AsyncStorage.setItem('hinge_token', res.data.token)
        setToken(res.data)
        navigation.navigate('MainStack', { screen: 'Main' })
      })
      .catch((err) => console.log('login Error', err))
  }

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token123 = await AsyncStorage.getItem('hinge_token')
  //     const decodedToken = jwtDecode(token123)
  //     const uId = decodedToken.userId
  //     dispatch(addToUserId(uId))
  //     dispatch(addToToken(token123))
  //   }
  //   fetchUser()
  // }, [])

  // const fetchUserInfo = async () => {
  //   console.log('fetchUserInfo start')
  //   await axios
  //     .get(`${baseUrl}/api/user/user-profile/${userId}`)
  //     .then((res) => {
  //       console.log('rererere', res.status, res.data)
  //       if (res.data.status == true) {
  //         //setUserInfo(res.data.user)
  //         console.log('fetchUserInfo123', res.data.user)
  //         dispatch(addToUser(res.data.user))

  //         // for (i = 0; i < res.data.user.likedProfiles.length; i++)
  //         //   console.log('aaaaaaa', res.data?.user?.likedProfiles[i]._id)
  //         // dispatch(addToLike(res.data?.user?.likedProfiles[i]._id))

  //         // for (i = 0; i < res.data.user.saveProfiles.length; i++)
  //         //   dispatch(addToSave(res.data?.user?.saveProfiles[i]._id))

  //         navigation.navigate('MainStack', { screen: 'Main' })
  //       }
  //     })
  //     .catch((err) => console.log('profile Error', err))
  // }

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
  useEffect(() => {
    if (userId) fetchUserInfo()
  }, [userId])

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <LottieView
            source={require('../assets/lonelyMen.json')}
            style={{
              height: 100,
              width: 100,
              alignSelf: 'center',
              marginTop: 40,
              justifyContent: 'center',
              marginLeft: 50,
            }}
            autoPlay
            loop={true}
            speed={2}
          />
          <LottieView
            source={require('../assets/lonelyWomen.json')}
            style={{
              height: 150,
              width: 150,
              alignSelf: 'center',
              marginTop: 40,
              marginRight: 20,
              justifyContent: 'center',
            }}
            autoPlay
            loop={true}
            speed={0.7}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={fetchUserInfo}>
              <Text
                style={{
                  fontSize: 50,
                  fontFamily: 'Se-Hwa',
                  color: '#581845',
                  marginBottom: 1,
                }}
              >
                나 혼자 솔로
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 100, height: 80, resizeMode: 'cover' }}
            source={{
              uri: 'https://branditechture.agency/brand-logos/wp-content/uploads/wpdm-cache/Hinge-App-900x0.png',
            }}
          />
        </View> */}

          <View style={{ marginTop: 20 }}>
            {option == 'Sign In' ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    //backgroundColor: '#581845',
                    paddingVertical: 1,
                    borderRadius: 15,
                    marginTop: 10,
                    width: '80%',
                    marginHorizontal: 'auto',
                    borderWidth: 1,
                    borderColor: 'gray',
                  }}
                >
                  <MaterialIcons
                    style={{ marginLeft: 8 }}
                    name="email"
                    size={26}
                    color="gray"
                  />
                  <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Enter your email"
                    placeholderTextColor={'gray'}
                    style={{
                      color: 'black',
                      marginVertical: 10,
                      width: 300,
                      fontFamily: 'Se-Hwa',
                      fontSize: 25,
                      // fontSize: password ? 17 : 17,
                    }}
                  />
                </View>

                <View style={{ width: '80%' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      //backgroundColor: '#581845',
                      paddingVertical: 2,
                      borderRadius: 15,
                      marginTop: 30,
                      borderColor: 'gray',
                      borderWidth: 1,
                    }}
                  >
                    <AntDesign
                      style={{ marginLeft: 8 }}
                      name="lock1"
                      size={24}
                      color="gray"
                    />
                    <TextInput
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      secureTextEntry={true}
                      placeholder="Enter your password..."
                      style={{
                        color: 'black',
                        marginVertical: 10,
                        width: 300,
                        fontFamily: 'Se-Hwa',
                        fontSize: 25,
                        //   fontSize: password ? 17 : 17,
                      }}
                      placeholderTextColor="gray"
                    />
                  </View>
                </View>
                <View style={{ width: '80%', marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={login}
                    style={{
                      borderWidth: 1,
                      padding: 3,
                      borderRadius: 25,
                      borderColor: '#8A2BE2',
                      alignItems: 'center',
                      paddingVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        color: '#8A2BE2',
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      로그인
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: '80%', marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => setOption('start')}
                    style={{
                      borderWidth: 1,
                      padding: 3,
                      borderRadius: 30,
                      borderColor: '#8A2BE2',
                      alignItems: 'center',
                      paddingVertical: 5,
                      backgroundColor: '#8A2BE2',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        color: 'white',
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      회원가입하기
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('FindPassword')}
                  style={{
                    marginTop: 12,
                    marginTop: 20,
                    borderRadius: 30,
                    borderColor: '#007FFF',
                    borderWidth: 1,
                    width: '80%',
                  }}
                >
                  <Text
                    style={{
                      color: '#007FFF',
                      fontFamily: 'Se-Hwa',
                      fontSize: 30,
                      textAlign: 'center',
                    }}
                  >
                    Password찾기
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <LottieView
                  source={require('../assets/heart.json')}
                  style={{
                    height: 300,
                    width: 400,
                    alignSelf: 'center',
                    marginTop: 10,
                    justifyContent: 'center',
                  }}
                  autoPlay
                  loop={true}
                  speed={0.7}
                />
              </View>
            )}

            <View style={{ marginTop: 40 }} />
            {option == 'start' && (
              <View>
                <Pressable
                  onPress={createAccount}
                  style={{
                    width: 300,
                    backgroundColor: '#8A2BE2',
                    borderRadius: 6,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: 10,
                    borderRadius: 30,

                    marginTop: -30,
                    fontSize: 20,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: option == 'Create account' ? 'white' : 'black',
                      fontSize: 30,
                      fontFamily: 'Se-Hwa',
                      color: 'white',
                    }}
                  >
                    회원 가입하기
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setOption('Sign In')}
                  style={{
                    width: 300,
                    backgroundColor:
                      option == 'Sign In' ? '#581845' : 'transparent',
                    borderRadius: 6,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: 10,
                    borderRadius: 30,
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: '#8A2BE2',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: option == 'Sign In' ? 'white' : 'black',
                      fontSize: 30,
                      color: '#8A2BE2',
                      fontFamily: 'Se-Hwa',
                    }}
                  >
                    로그인
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
