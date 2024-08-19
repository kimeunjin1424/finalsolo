import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import 'core-js/stable/atob'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'
import { baseUrl } from '../Utils/api'
import { FontAwesome5 } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Octicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

const ChatScreen = () => {
  const [matches, setMatches] = useState([])
  const [getFriendInfo, setGetFriendInfo] = useState([])
  const navigation = useNavigation()

  //console.log('getfriendInfo', getFriendInfo)

  const isFocused = useIsFocused()

  const { userId, user } = useSelector((state) => state.user)

  const fetchMatches = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/user/get-matches/${userId}`
      )
      setMatches(response.data.matches)
      // console.log('res123', response.data.matches)
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  const getFriends = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/user/get-friends`, { myId: userId })
        .then((res) => {
          setGetFriendInfo(res.data.friends)
        })
        .catch((err) => console.log('get friends Error', err))
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchMatches()
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      getFriends()
    }
  }, [userId, isFocused])

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchMatches()
      }
    }, [userId])
  )

  const pushOutRoom = async (fndId) => {
    console.log('push zzim func')
    await axios
      .post(`${baseUrl}/api/user/push-out-room`, {
        userId: fndId,
        myName: user.name,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('send push success')
        }
      })
  }

  const endMatch = async (fndId) => {
    try {
      await axios
        .post(`${baseUrl}/api/user/end-match`, {
          userId,
          selectedUserId: fndId,
        })
        .then((res) => {
          if (res.status === 200) {
            getFriends()
            pushOutRoom(fndId)
          }
        })
        .catch((err) => console.log('end match error', err))
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  //console.log('matches', matches)
  return (
    <SafeAreaView
      style={{ backgroundColor: 'white', flex: 1, paddingVertical: 15 }}
    >
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            borderWidth: 1,
            borderRadius: 15,
            borderColor: 'yellow',
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'pink',
            paddingVertical: 10,
            marginHorizontal: 'auto',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 15 }}>
              <Octicons name="heart" size={24} color="white" />
            </View>
            <Text
              style={{
                fontSize: 35,
                fontFamily: 'Se-Hwa',
                marginBottom: 5,
                color: 'gray',
              }}
            >
              매칭이 되었습니다.
            </Text>
            <View style={{ marginLeft: 15 }}>
              <Octicons name="heart" size={24} color="white" />
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 'auto', width: '90%' }}>
          <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}>
            길게 누르면 매칭을 끊을 수 있습니다.
          </Text>
        </View>
      </View>
      <ScrollView
        style={{ marginTop: 10, padding: 10, backgroundColor: 'white' }}
      >
        <View>
          <View style={{ marginTop: 10 }}>
            {getFriendInfo?.map((item, index) => (
              <TouchableOpacity
                onLongPress={() =>
                  Alert.alert(
                    '매칭끊기',
                    `${item.fndInfo}과의 대화를 종료하시겠습니까?`,
                    [
                      {
                        text: '아니요',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: '네',
                        onPress: () => {
                          endMatch(item.fndId)
                          console.log('cut matching')
                        },
                      },
                    ]
                  )
                }
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    image: item.fndImage,
                    name: item.fndInfo,
                    receviedId: item.fndId,
                    lastMessageId: item.msgInfo ? item.msgInfo.senderId : null,
                  })
                }
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{ uri: item.fndImage }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                    }}
                  />

                  <View
                    style={{
                      marginLeft: 7,
                      display: 'flex',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        fontSize: 23,
                      }}
                    >
                      {item.fndInfo}
                    </Text>
                    {item.msgInfo == null ? (
                      <Text
                        style={{
                          fontFamily: 'Se-Hwa',
                          fontSize: 20,
                          color: 'red',
                        }}
                      >
                        대화를 시작해 보세요... ^_^/
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: 'Se-Hwa',
                          fontSize: 23,
                          color: 'gray',
                        }}
                      >
                        {item.msgInfo.message &&
                        item?.msgInfo?.message?.length > 9
                          ? item?.msgInfo?.message?.slice(0, 9)
                          : item.msgInfo.message}
                        {item.msgInfo.message &&
                        item?.msgInfo?.message?.length > 9 ? (
                          <Text>...</Text>
                        ) : null}
                        {item?.msgInfo?.messageType == 'image' && (
                          <Text>Image Send</Text>
                        )}
                      </Text>
                    )}
                  </View>
                </View>
                <View>
                  {item.msgInfo == null ? null : (
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        fontSize: 20,
                        color: 'gray',
                      }}
                    >
                      {item.msgInfo.timeData}
                    </Text>
                  )}
                  {item.msgInfo == null ? null : (
                    <View style={{ alignItems: 'flex-end', marginTop: 6 }}>
                      {item.msgInfo.senderId == userId &&
                        item.msgInfo.status == 'seen' && (
                          <AntDesign
                            name="checkcircleo"
                            size={15}
                            color="red"
                          />
                        )}
                    </View>
                  )}
                  {item.msgInfo == null ? null : (
                    <View style={{ alignItems: 'flex-end', marginTop: 6 }}>
                      {item.msgInfo.senderId == userId &&
                        item.msgInfo.status == 'unseen' && (
                          <FontAwesome5
                            name="paper-plane"
                            size={15}
                            color="blue"
                            style={{}}
                          />
                        )}
                    </View>
                  )}
                  {item.msgInfo == null ? null : (
                    <View style={{ alignItems: 'flex-end', marginTop: 5 }}>
                      {item.msgInfo.senderId !== userId &&
                      item.msgInfo.status == 'unseen' ? (
                        <View
                          style={{
                            backgroundColor: 'red',
                            paddingHorizontal: 3,
                            //dfgdfpaddingVertical: 1,
                            borderRadius: 25,
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'Se-Hwa',
                              fontSize: 20,
                            }}
                          >
                            New
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})
