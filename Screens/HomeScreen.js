import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import 'core-js/stable/atob'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { AuthContext } from '../context/AuthContext'
//import Modal, { ModalContent, onPress } from 'react-native-modals'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToUserId,
  addToUser,
  addToUsers,
  addToSave,
} from '../slices/userSlice'
import { BackHandler } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

const HomeScreen = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('잠깐만요!', '나 혼자 솔로에서 나가시겠습니까?', [
        {
          text: '취소',
          onPress: () => null,
          style: 'cancel',
        },
        { text: '나가기', onPress: () => BackHandler.exitApp() },
      ])
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  const dispatch = useDispatch()
  const { token, userId, user, likedPeople, savePeople } = useSelector(
    (state) => state.user
  )

  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [apiUser, setApiUser] = useState('')
  const [region, setRegion] = useState('')
  const [decade, setDecade] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questionModal, setQuestionModal] = useState(false)
  //const [user, setuser] = useState('')

  const { width } = useWindowDimensions()

  const regionData = [
    { id: 1, name: '서울' },
    { id: 2, name: '경기도' },
    { id: 3, name: '충북' },
    { id: 4, name: '충남' },
    { id: 5, name: '강원' },
    { id: 6, name: '광주전남' },
    { id: 7, name: '전북' },
    { id: 8, name: '경남' },
    { id: 9, name: '경북' },
    { id: 10, name: '부산울산' },
    { id: 11, name: '제주' },
  ]

  const decadeData = [
    { id: 2, name: '20대' },
    { id: 3, name: '30대' },
    { id: 4, name: '40대' },
    { id: 5, name: '50대' },
  ]

  useEffect(() => {
    const getApiUsers = async () => {
      console.log('getApiUser')

      try {
        await axios
          .post(`${baseUrl}/api/user/api-users`, {
            userId: user?._id,
            gender: user?.gender,
            region: user?.region,
          })
          .then((res) => {
            setApiUser(res.data.users)
            dispatch(addToUsers(res.data.users))
            // console.log('apiUser', res.data.users)
          })
          .catch((err) => {
            console.log('err', err)
          })
      } catch (err) {
        console.log('fetch Users', err)
      }
    }
    //setIsLoading(true)
    if (user) {
      getApiUsers()
    }
  }, [user])

  const firstSearch = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/user/first-search`, {
          name: username,
        })
        .then((res) => {
          setApiUser(res.data.users)
          setQuestionModal(false)
        })
        .catch((err) => {
          console.log('err', err)
        })
    } catch (err) {
      console.log('fetch Users', err)
    }
  }

  const secondSearch = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/user/second-search`, {
          region,
          decade,
          gender: user.gender,
        })
        .then((res) => {
          setApiUser(res.data.users)
          setQuestionModal(false)
        })
        .catch((err) => {
          console.log('err', err)
        })
    } catch (err) {
      console.log('fetch Users', err)
    }
  }

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1) // deg2rad below
    var dLon = deg2rad(lon2 - lon1)
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c // Distance in km
    return roundToTwoDecimals(d)
  }

  const roundToTwoDecimals = (num) => {
    return +(Math.round(num + 'e+2') + 'e-2')
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const saveProfile = async (fdId) => {
    try {
      await axios
        .post(`${baseUrl}/api/user/save-profiles`, {
          userId: user._id,
          saveUserId: fdId,
        })
        .then((res) => {
          Alert.alert('success', '찜하기가 성공되었습니다.')
          dispatch(addToSave(fdId))
        })
        .catch((err) => {
          console.log('save profile err user', err)
        })
    } catch (err) {
      console.log('save profile', err)
    }
  }

  const pushSave = async (fdId) => {
    console.log('push zzim func')
    await axios
      .post(`${baseUrl}/api/user/push-zzim`, {
        userId: fdId,
        myName: user.name,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('send push success')
        }
      })
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError(
          'Permission not granted to get push token for push notification!'
        )
        return
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId
      if (!projectId) {
        handleRegistrationError('Project ID not found')
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data
        console.log(pushTokenString)
        return pushTokenString
      } catch (e) {
        handleRegistrationError(`${e}`)
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications')
    }
  }

  const updatePushToken = async (pushToken) => {
    try {
      await axios
        .put(`${baseUrl}/api/user/update-pushToken`, {
          userId: userId,
          pushToken,
        })
        .then((res) => {
          console.log(res.data.status)
        })
        .catch((err) => {
          console.log('err', err)
        })
    } catch (err) {
      console.log('fetch Users', err)
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && updatePushToken(token)
    )
  }, [])

  const sendMe = async () => {
    await axios
      .post(`${baseUrl}/api/user/send-push`, {
        userId,
      })
      .then((res) => {
        if (res.status == 200) {
          Alert.alert('success', '보내기 성공되었습니다.')
        }
      })
  }

  return (
    <View style={[{ backgroundColor: '#ffcbcb', flex: 1 }]}>
      <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', flex: 1 }}>
        <ScrollView
          style={{
            marginTop: 30,
          }}
        >
          {isLoading ? (
            <View style={{ flex: 1 }}>
              <ActivityIndicator size={50} />
            </View>
          ) : (
            <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
              {apiUser.length > 0 ? (
                apiUser?.map((item, index) => (
                  <View
                    key={item._id}
                    style={{
                      //borderWidth: 1,
                      padding: 10,
                      marginTop: 40,
                      marginBottom: 20,
                      //borderColor: 'lightgray',
                      borderRadius: 25,
                      backgroundColor: 'white',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.27,
                      shadowRadius: 4.65,

                      elevation: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            borderColor: '#3baea0',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderWidth: 1,
                            borderRadius: 25,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 30,
                              fontFamily: 'Se-Hwa',
                              color: '#3baea0',
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: '#ff7e67',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderWidth: 1,
                            borderRadius: 25,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 30,
                              fontFamily: 'Se-Hwa',
                              color: '#ff7e67',
                            }}
                          >
                            {item.age}세
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: '#452c63',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderWidth: 1,
                            borderRadius: 25,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 30,
                              color: '#452c63',
                              fontFamily: 'Se-Hwa',
                            }}
                          >
                            {item.region}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'flex-end',
                        alignItems: 'center',
                        //justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          borderColor: '#ff7e67',
                          borderWidth: 1,
                          padding: 8,
                          borderRadius: 25,
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Se-Hwa',
                            fontSize: 20,
                            color: '#ff7e67',
                            borderRadius: 25,
                          }}
                        >
                          {item.lookingFor} 을/를 찾고 있습니다.
                        </Text>
                      </View>
                      {item.location ? (
                        <View
                          style={{
                            borderColor: '#452c63',
                            borderWidth: 1,
                            padding: 3,
                            borderRadius: 25,
                            marginTop: 10,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 30,
                              marginBottom: 5,
                              color: '#452c63',
                              fontFamily: 'Se-Hwa',
                            }}
                          >
                            {Math.floor(
                              getDistanceFromLatLonInKm(
                                user?.location?.lat,
                                user?.location?.lng,
                                item?.location?.lat,
                                item?.location?.lng
                              )
                            )}
                            Km
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={{ marginVertical: 15 }}>
                      <View>
                        <View>
                          <Image
                            style={{
                              width: '100%',
                              height: 350,
                              resizeMode: 'cover',
                              borderRadius: 10,
                            }}
                            source={{
                              uri: item?.imageUrls[0],
                            }}
                          />
                          {likedPeople?.includes(item._id) ? null : (
                            <Pressable
                              onPress={() =>
                                navigation.navigate('SendLike', {
                                  image: item?.imageUrls[0],
                                  name: item?.name,
                                  userId: user._id,
                                  likedUserId: item?._id,
                                })
                              }
                              style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                width: 52,
                                height: 52,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <AntDesign name="hearto" size={38} color="pink" />
                            </Pressable>
                          )}
                          {savePeople?.includes(item._id) ? null : (
                            <Pressable
                              onPress={() => {
                                pushSave(item._id)
                                saveProfile(item._id)
                              }}
                              style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 70,
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                width: 52,
                                height: 52,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <AntDesign
                                name="staro"
                                size={40}
                                color="yellow"
                              />
                            </Pressable>
                          )}
                        </View>

                        <View>
                          {item?.prompts?.map((p, index) => (
                            <View style={{ marginTop: 7 }} key={index}>
                              {p.answer ? (
                                <View
                                  style={{
                                    backgroundColor: '#F5F5F5',
                                    padding: 2,
                                    borderRadius: 10,
                                    height: 100,
                                    justifyContent: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: {
                                      width: 0,
                                      height: 3,
                                    },
                                    shadowOpacity: 0.27,
                                    shadowRadius: 4.65,

                                    elevation: 3,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      //textDecorationLine: 'underline',
                                      color: 'gray',
                                      fontFamily: 'Se-Hwa',
                                      marginHorizontal: 5,
                                    }}
                                  >
                                    {p.question}
                                  </Text>

                                  <Text
                                    style={{
                                      fontSize: 23,
                                      textDecorationLine: 'underline',
                                      fontWeight: '500',
                                      fontFamily: 'Se-Hwa',
                                      marginHorizontal: 5,
                                    }}
                                  >
                                    {p.answer}
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          ))}
                        </View>

                        {/* Profile Details */}
                      </View>

                      <View>
                        {item?.imageUrls?.map((item, index) => (
                          <View key={index} style={{ marginVertical: 10 }}>
                            <Image
                              style={{
                                width: '100%',
                                height: 350,
                                resizeMode: 'cover',
                                borderRadius: 10,
                              }}
                              source={{
                                uri: item,
                              }}
                            />
                          </View>
                        ))}
                      </View>
                      {likedPeople?.includes(item._id) ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            borderRadius: 25,
                            padding: 10,
                            gap: 10,
                            marginTop: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f70776',
                          }}
                        >
                          <View style={{ alignContent: 'center' }}>
                            <Text
                              style={{
                                fontFamily: 'Se-Hwa',
                                color: 'white',
                                fontSize: 25,
                                textAlign: 'center',
                                marginBottom: 5,
                              }}
                            >
                              이미 하트를 보냈습니다.
                            </Text>
                          </View>
                          <View>
                            <AntDesign name="hearto" size={25} color="white" />
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('SendLike', {
                              image: item?.imageUrls[0],
                              name: item?.name,
                              userId: user?._id,
                              likedUserId: item?._id,
                            })
                          }
                          style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderRadius: 25,
                            padding: 10,
                            gap: 10,
                            marginTop: 10,
                            borderColor: '#f70776',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <View style={{ alignContent: 'center' }}>
                            <Text
                              style={{
                                fontFamily: 'Se-Hwa',
                                color: '#f70776',
                                fontSize: 25,
                                textAlign: 'center',
                                marginBottom: 5,
                              }}
                            >
                              {item.name}님께 하트보내기
                            </Text>
                          </View>
                          <View>
                            <AntDesign
                              name="hearto"
                              size={25}
                              color="#f70776"
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View
                  style={{
                    marginTop: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                  }}
                >
                  <Text style={{ fontSize: 40, fontFamily: 'Se-Hwa' }}>
                    해당 지역의 사용자가 없습니다.
                  </Text>
                </View>
              )}
            </View>
          )}
          <Modal
            visible={questionModal}
            onTouchOutside={() => {
              setQuestionModal(false)
            }}
            animationType="fade"
            transparent={true}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  borderRadius: 20,
                  padding: 15,
                  alignItems: 'center',
                  shadowColor: 'white',
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.55,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    paddingVertical: 5,
                    width: width * 0.7,
                    borderWidth: 2,
                    borderColor: 'orange',
                    borderRadius: 25,
                    justifyContent: 'space-around',
                    marginHorizontal: 2,
                    paddingHorizontal: 20,
                    marginBottom: 20,
                  }}
                >
                  <TextInput
                    style={{ flex: 1, fontFamily: 'Se-Hwa', fontSize: 25 }}
                    placeholder="남자XX호, XX호..."
                    placeholderTextColor={'lightgray'}
                    onChangeText={(text) => setUsername(text)}
                  />
                  <TouchableOpacity
                    onPress={firstSearch}
                    style={{
                      borderRadius: 25,
                      padding: 7,
                      backgroundColor: 'orange',
                    }}
                  >
                    <AntDesign name="search1" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={{ borderTopWidth: 1, borderColor: 'gray' }}>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 25,
                      color: '#3baea0',
                      fontFamily: 'Se-Hwa',
                    }}
                  >
                    지역과 연령대 2개를 골라주세요!!!
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    width: '90%',
                    flexWrap: 'wrap',
                  }}
                >
                  {regionData.map((i, index) => (
                    <TouchableOpacity
                      onPress={() => setRegion(i.name)}
                      key={index}
                      style={{
                        marginTop: 10,
                        marginRight: 7,
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 25,
                        borderColor: region == `${i.name}` ? 'white' : 'gray',
                        backgroundColor:
                          region == `${i.name}` ? '#3baea0' : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 25,
                          fontFamily: 'Se-Hwa',
                          color: region == `${i.name}` ? 'white' : 'gray',
                        }}
                      >
                        {i.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    width: '90%',
                    flexWrap: 'wrap',
                    borderTopColor: 'gray',
                    borderTopWidth: 1,
                  }}
                >
                  {decadeData.map((i, index) => (
                    <TouchableOpacity
                      onPress={() => setDecade(i.name)}
                      key={index}
                      style={{
                        marginTop: 5,
                        marginRight: 1,
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 25,
                        borderColor: decade == `${i.name}` ? 'white' : 'gray',
                        backgroundColor:
                          decade == `${i.name}` ? '#3baea0' : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 25,
                          fontFamily: 'Se-Hwa',
                          color: decade == `${i.name}` ? 'white' : 'gray',
                        }}
                      >
                        {i.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View>
                  <TouchableOpacity
                    onPress={secondSearch}
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      paddingVertical: 5,
                      width: width * 0.7,
                      backgroundColor: '#3baea0',
                      borderRadius: 25,
                      justifyContent: 'space-around',
                      marginHorizontal: 2,
                      paddingHorizontal: 20,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        color: 'white',
                        fontSize: 25,
                      }}
                    >
                      {region} ,{decade}, Search(찾기)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setQuestionModal(false)}
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      paddingVertical: 5,
                      width: width * 0.7,
                      backgroundColor: 'pink',
                      borderRadius: 25,
                      justifyContent: 'space-around',
                      marginHorizontal: 2,
                      paddingHorizontal: 20,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        color: 'white',
                        fontSize: 25,
                      }}
                    >
                      닫기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>

        <Pressable
          onPress={() => setQuestionModal(true)}
          style={{
            opacity: 0.8,
            position: 'absolute',
            bottom: 15,
            left: 12,
            backgroundColor: 'pink',
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            //borderWidth: 2,
            borderRadius: 25,
            borderColor: '#3baea0',
            shadowColor: '#3baea0',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 20,
          }}
        >
          <Feather name="search" size={35} color="white" />
        </Pressable>
      </View>
    </View>
  )
}

//807 Line할 차례입니다~

export default HomeScreen

const styles = StyleSheet.create({})
