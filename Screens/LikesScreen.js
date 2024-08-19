import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { baseUrl } from '../Utils/api'
import { AuthContext } from '../context/AuthContext'
import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { removeToLike } from '../slices/userSlice'

const LikesScreen = () => {
  const navigation = useNavigation()
  const [option, setOption] = useState('recevied')

  const [likes, setLikes] = useState([])
  const [sendLikes, setSendLikes] = useState([])

  const dispatch = useDispatch()
  const {
    token,
    userId,
    likedPeople,
    savePeople,
    user: userInfo,
  } = useSelector((state) => state.user)

  const isFocused = useIsFocused()

  const fetchReceivedLikes = async () => {
    try {
      await axios
        .get(`${baseUrl}/api/user/recevied-likes/${userId}`)
        .then((res) => {
          setLikes(res.data.receviedLikes)
        })
    } catch (error) {
      console.error('Error fetching received likes:', error)
      // Handle error in the frontend
    }
  }

  const fetchSendLikes = async () => {
    try {
      await axios
        .get(`${baseUrl}/api/user/send-likes/${userId}`)
        .then((res) => {
          setSendLikes(res.data.sendLikes)
          //console.log('sendLikes', res.data)
        })
    } catch (error) {
      console.error('Error fetching received likes:', error)
      // Handle error in the frontend
    }
  }

  useEffect(() => {
    if (userId) {
      fetchReceivedLikes()
      fetchSendLikes()
    }
  }, [userId, isFocused])

  // useFocusEffect(
  //   useCallback(() => {
  //     if (userId) {
  //       fetchReceivedLikes()
  //       fetchSendLikes()
  //     }
  //     console.log('rece likes', likes)
  //   }, [userId])
  // )

  const match = (name, selectedUserId) => {
    Alert.alert('Accept Request?', `Match with ${name}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          createMatch(selectedUserId)
          acceptHeart(selectedUserId)
        },
      },
    ])
    // navigation.goBack()
  }

  const acceptHeart = async (selectedUserId) => {
    await axios
      .post(`${baseUrl}/api/user/push-accept-heart`, {
        userId: selectedUserId,
        myName: userInfo.name,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('send push success')
        }
      })
  }

  const createMatch = async (selectedUserId) => {
    try {
      await axios
        .post(`${baseUrl}/api/user/create-match`, {
          userId,
          selectedUserId,
        })
        .then((res) => {
          console.log('res', res.status)
          if (res.status === 200) {
            navigation.goBack()
          }
        })
      //.catch((err) => console.log('create match 400', err))
    } catch (error) {
      console.log('create Match error', error)
    }
  }

  const sendLikeCancel = async (cancelId) => {
    await axios
      .post(`${baseUrl}/api/user/send-cancel`, { userId, cancelId })
      .then((res) => {
        Alert.alert('성공', '보낸 하트가 성공적으로 취소되었습니다', [
          {
            text: '확인',
            onPress: () => {
              setSendLikes(sendLikes.filter((i) => i._id !== cancelId))
              dispatch(removeToLike(cancelId))
            },
          },
        ])
      })
      .catch((err) => console.log('send cancel Error', err))
  }

  const rejectHeart = async (cancelId) => {
    await axios
      .post(`${baseUrl}/api/user/push-reject-heart`, {
        userId: cancelId,
        myName: userInfo.name,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('send push success')
        }
      })
  }

  const cancelHeart = async (cancelId) => {
    await axios
      .post(`${baseUrl}/api/user/recevied-cancel`, {
        userId,
        cancelId,
      })
      .then((res) => {
        Alert.alert('성공', '거절하기 성공적으로 취소되었습니다', [
          {
            text: '확인',
            onPress: () => {
              setLikes(likes.filter((i) => i.userId !== cancelId))
              rejectHeart(cancelId)
            },
          },
        ])
      })
      .catch((err) => console.log('receviedCancel falied', err))
  }

  console.log('likes', likes)

  return (
    <View
      style={{
        marginTop: 55,
        padding: 1,
        flex: 1,
        //backgroundColor: 'white',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: option === 'recevied' ? '#D65076' : 'white',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            display: 'flex',
            borderRadius: 25,
            paddingHorizontal: 20,
            paddingVertical: 5,
            gap: 5,
            borderColor: '#D65076',
            marginLeft: 20,
          }}
          onPress={() => setOption('recevied')}
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: 'Se-Hwa',
              textAlign: 'center',
              marginBottom: 5,
              color: option === 'recevied' ? 'white' : '#D65076',
            }}
          >
            받은하트
          </Text>
          <AntDesign
            name="hearto"
            size={24}
            color={option === 'recevied' ? 'white' : '#D65076'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: option === 'send' ? '#45B8AC' : 'white',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            display: 'flex',
            borderRadius: 25,
            paddingHorizontal: 20,
            paddingVertical: 5,
            gap: 5,
            borderColor: '#45B8AC',
            marginRight: 20,
          }}
          onPress={() => setOption('send')}
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: 'Se-Hwa',
              textAlign: 'center',
              marginBottom: 5,
              color: option === 'send' ? 'white' : '#45B8AC',
            }}
          >
            보낸하트
          </Text>
          <AntDesign
            name="hearto"
            size={24}
            color={option === 'send' ? 'white' : '#45B8AC'}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {option === 'recevied' ? (
          <View style={{ marginBottom: 40 }}>
            {likes && likes.length > 0 ? (
              <View style={{ alignItems: 'center' }}>
                {likes.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      padding: 20,
                      borderColor: '#E0E0E0',
                      borderWidth: 1,
                      borderRadius: 7,
                      backgroundColor: 'white',
                      marginTop: 10,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 3,
                        height: 3,
                      },
                      shadowOpacity: 0.27,
                      shadowRadius: 4.65,
                      elevation: 20,
                      width: '90%',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingHorizontal: 16,
                        paddingVertical: 5,
                        borderRadius: 25,
                        marginBottom: 8,
                        width: 200,
                        backgroundColor: '#D65076',
                      }}
                    >
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Se-Hwa',
                            fontSize: 25,
                          }}
                        >
                          From : {item?.name}
                        </Text>
                        <AntDesign name="hearto" size={24} color={'white'} />
                      </View>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 5,
                        borderColor: 'gray',
                        marginTop: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="comment-processing-outline"
                        size={24}
                        color="gray"
                      />
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: 25,
                          fontFamily: 'Se-Hwa',
                          marginBottom: 10,
                        }}
                      >
                        {' '}
                        : {item.comment}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',

                        justifyContent: 'space-between',
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: '50%',
                          height: 150,
                          resizeMode: 'cover',
                          borderRadius: 10,
                          marginTop: 20,
                        }}
                      />
                      <View
                        style={{
                          marginTop: 20,
                          marginLeft: 25,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: 'rgb(220, 20, 60)',
                            padding: 5,
                            borderRadius: 20,
                            paddingHorizontal: 18,
                          }}
                          onPress={() =>
                            navigation.navigate('ProfileDetail', {
                              userId: item.userId,
                            })
                          }
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              fontFamily: 'Se-Hwa',
                              color: 'rgb(220, 20, 60)',
                            }}
                          >
                            프로필보기
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: 'rgb(139, 0, 139)',
                            padding: 5,
                            borderRadius: 20,
                            marginTop: 10,
                            paddingHorizontal: 18,
                          }}
                          onPress={() => match(item.name, item.userId)}
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              fontFamily: 'Se-Hwa',
                              color: 'rgb(139, 0, 139)',
                            }}
                          >
                            받아들이기
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: 'rgb(0, 0, 138)',
                            padding: 5,
                            borderRadius: 20,
                            marginTop: 10,
                            paddingHorizontal: 18,
                          }}
                          onPress={() => cancelHeart(item.userId)}
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              fontFamily: 'Se-Hwa',
                              color: 'rgb(0, 0, 138)',
                            }}
                          >
                            거절하기
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontFamily: 'Se-Hwa',
                          color: 'gray',
                          fontSize: 15,
                        }}
                      >
                        받아들이기를 누르시면 {item.name}님과 채팅을 대화를
                        시작할 수 있습니다.
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={{ marginTop: 20 }}>
                <LottieView
                  source={require('../assets/lonelyMen.json')}
                  style={{
                    height: 200,
                    width: 200,
                    alignSelf: 'center',
                    marginTop: 40,
                    justifyContent: 'center',
                  }}
                  autoPlay
                  loop={true}
                  speed={2.7}
                />
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  받은 하트가 없습니다. ㅠㅠ
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={{ marginBottom: 40 }}>
            {sendLikes && sendLikes.length > 0 ? (
              <View style={{ marginHorizontal: 20 }}>
                {sendLikes.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      padding: 20,
                      borderColor: '#E0E0E0',
                      borderWidth: 1,
                      borderRadius: 7,
                      backgroundColor: 'white',

                      marginTop: 10,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 3,
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
                        alignItems: 'flex-start',
                        paddingHorizontal: 16,
                        paddingVertical: 5,
                        borderRadius: 25,
                        marginBottom: 8,
                        width: 200,
                        backgroundColor: '#45B8AC',
                      }}
                    >
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Se-Hwa',
                            fontSize: 25,
                          }}
                        >
                          to : {item?.name}
                        </Text>
                        <AntDesign name="hearto" size={24} color={'white'} />
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Image
                        source={{ uri: item.imageUrls[0] }}
                        style={{
                          width: '50%',
                          height: 150,
                          resizeMode: 'cover',
                          borderRadius: 10,
                          marginTop: 5,
                        }}
                      />
                      <View
                        style={{
                          marginLeft: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            borderColor: 'rgb(139, 0, 139)',
                            padding: 5,

                            paddingHorizontal: 18,
                          }}
                          onPress={() => match(item.name, item.userId)}
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              fontFamily: 'Se-Hwa',
                              color: 'rgb(139, 0, 139)',
                            }}
                          >
                            to : {item?.name}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: 'rgb(220, 20, 60)',
                            padding: 5,
                            borderRadius: 20,
                            marginTop: 5,
                            paddingHorizontal: 18,
                          }}
                          onPress={() =>
                            navigation.navigate('ProfileDetail', {
                              userId: item._id,
                            })
                          }
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              color: 'rgb(220, 20, 60)',
                              fontFamily: 'Se-Hwa',
                            }}
                          >
                            프로필보기
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: 'rgb(0, 0, 138)',
                            padding: 5,
                            borderRadius: 20,
                            marginTop: 5,
                            paddingHorizontal: 18,
                          }}
                          onPress={() => sendLikeCancel(item._id)}
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              fontFamily: 'Se-Hwa',
                              color: 'rgb(0, 0, 138)',
                            }}
                          >
                            취소하기
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={{ marginTop: 20 }}>
                <LottieView
                  source={require('../assets/lonelyWomen.json')}
                  style={{
                    height: 250,
                    width: 250,
                    alignSelf: 'center',
                    marginTop: 40,
                    justifyContent: 'center',
                  }}
                  autoPlay
                  loop={true}
                  speed={1.7}
                />
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  보낸 하트가 없습니다. ㅠㅠ
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 20,
        }}
      ></View>
    </View>
  )
}

export default LikesScreen

const styles = StyleSheet.create({})
