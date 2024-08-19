import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'
import { useSelector } from 'react-redux'

const ProfileDetailsScreen = () => {
  const [user, setUser] = useState('')
  const route = useRoute()
  const { userId } = route.params
  const navigation = useNavigation()

  console.log('route.params.userId', userId)

  const {
    userId: myId,
    likedPeople,
    savePeople,
  } = useSelector((state) => state.user)

  useEffect(() => {
    console.log('fetch User profile detail')
    const fetchUser = async () => {
      await axios
        .post(`${baseUrl}/api/user/user-profile/`, { userId })
        .then((res) => {
          setUser(res.data.user)
          console.log('userDetail', res.data.user)
        })
        .catch((err) => console.log('profile Error', err))
    }
    fetchUser()
  }, [userId])

  console.log('123123User', user)

  const saveProfile = async (fdId) => {
    try {
      await axios
        .post(`${baseUrl}/api/user/save-profiles`, {
          userId: myId,
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

  return (
    <View style={[{ backgroundColor: '#ffcbcb' }]}>
      <View style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
        <SafeAreaView style={{ paddingVertical: 0 }}>
          {user && user !== undefined && (
            <ScrollView
              style={{
                padding: 0,
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  padding: 10,
                  marginTop: 20,
                  borderColor: 'gray',
                  borderRadius: 25,
                  marginBottom: 20,
                  marginHorizontal: 8,
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
                        {user?.name}
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
                        {user?.age}세
                      </Text>
                    </View>
                    <View
                      style={{
                        borderColor: '#452c63',
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 20,
                        marginLeft: 5,
                        borderWidth: 1,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 20,
                          color: '#452c63',
                          fontFamily: 'Se-Hwa',
                        }}
                      >
                        {user?.region}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: 'flex-end',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 15,
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
                      {user?.lookingFor} 을/를 찾고 있습니다.
                    </Text>
                  </View>
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
                          uri: user?.imageUrls[0],
                        }}
                      />
                      {likedPeople?.includes(userId) ? null : (
                        <Pressable
                          onPress={() =>
                            navigation.navigate('SendLike', {
                              image: user?.imageUrls[0],
                              name: user?.name,
                              userId: myId,
                              likedUserId: user?._id,
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
                      {savePeople?.includes(userId) ? null : (
                        <Pressable
                          onPress={() => saveProfile(userId)}
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
                          <AntDesign name="staro" size={40} color="yellow" />
                        </Pressable>
                      )}
                    </View>

                    <View>
                      {user?.prompts?.map((p, index) => (
                        <View style={{ marginTop: 7 }} key={index}>
                          {p.answer ? (
                            <View
                              key={index}
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
                    {user?.imageUrls?.map((item, index) => (
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
                  {likedPeople?.includes(userId) ? (
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
                          image: user?.imageUrls[0],
                          name: user?.name,
                          userId: myId,
                          likedUserId: user?._id,
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
                          {user.name}님께 하트보내기
                        </Text>
                      </View>
                      <View>
                        <AntDesign name="hearto" size={25} color="#f70776" />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={{
                  marginTop: -10,
                  //marginRight: 'auto',
                  //justifyContent: 'flex-end',
                  alignSelf: 'flex-end',
                  marginRight: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-left-circle"
                  size={45}
                  color="#581845"
                  style={{ alignSelf: 'center', marginTop: 1 }}
                />
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </View>
  )
}

export default ProfileDetailsScreen
