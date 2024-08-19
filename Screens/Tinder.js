import TinderCard from './TinderCard'
import { useEffect, useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import {
  interpolate,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign } from '@expo/vector-icons'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { useDispatch, useSelector } from 'react-redux'

export const Tinder = () => {
  const dispatch = useDispatch()
  const {
    token,
    userId,
    likedPeople,
    savePeople,
    user: userInfo,
  } = useSelector((state) => state.user)

  const activeIndex = useSharedValue(0)
  const [index, setIndex] = useState(0)
  const [region, setRegion] = useState('')
  const [decade, setDecade] = useState('')
  const [questionModal, setQuestionModal] = useState(false)
  const [apiUser, setApiUser] = useState([])

  const [loading, setIsLoading] = useState(false)

  const { width } = useWindowDimensions()

  const regionData = [
    { id: 11, name: '서울' },
    { id: 22, name: '경기도' },
    { id: 33, name: '충북' },
    { id: 44, name: '충남' },
    { id: 55, name: '강원' },
    { id: 66, name: '광주전남' },
    { id: 77, name: '전북' },
    { id: 88, name: '경남' },
    { id: 99, name: '경북' },
    { id: 100, name: '부산울산' },
    { id: 111, name: '제주' },
  ]

  const decadeData = [
    { id: 2, name: '20대' },
    { id: 3, name: '30대' },
    { id: 4, name: '40대' },
    { id: 5, name: '50대' },
  ]

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prevValue) => {
      if (Math.floor(value) !== index) {
        runOnJS(setIndex)(Math.floor(value))
      }
    }
  )

  useEffect(() => {
    const getApiUsers = async () => {
      try {
        await axios
          .post(`${baseUrl}/api/user/api-users`, {
            userId: userInfo._id,
            gender: userInfo.gender,
            region: userInfo.region,
          })
          .then((res) => {
            setApiUser(res.data.users)
            setIsLoading(false)
          })
          .catch((err) => {
            console.log('err', err)
          })
      } catch (err) {
        console.log('fetch Users', err)
      }
    }
    setIsLoading(true)
    getApiUsers()
  }, [userInfo])

  useEffect(() => {
    if (apiUser && index > apiUser.length - 10) {
      setApiUser((usrs) => [...usrs, ...apiUser])
    }
  }, [index])

  const onResponse = () => {
    //console.log('on Response: ', res)
  }

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
          gender: userInfo.gender,
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

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: 'white',
      }}
    >
      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      {/* <Text style={{ top: 10, position: 'absolute' }}>
        Current index: {index}
      </Text> */}

      {apiUser &&
        apiUser?.map((user, index) => (
          <TinderCard
            key={`${user._id}-${index}`}
            user={user}
            numOfCards={apiUser.length}
            index={index}
            activeIndex={activeIndex}
            onResponse={onResponse}
            setApiUser={setApiUser}
            setQuestionModal={setQuestionModal}
            region={region}
            setRegion={setRegion}
            decade={decade}
            setDecade={decade}
            userInfo={userInfo}
          />
        ))}
      <View style={{ position: 'absolute', bottom: 30 }}>
        <Pressable
          onPress={() => setQuestionModal(true)}
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            paddingVertical: 5,
            width: width * 0.9,
            borderWidth: 1,
            borderColor: '#3baea0',
            borderRadius: 25,
            justifyContent: 'space-around',
            marginHorizontal: 2,
            paddingHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Text
            style={{ fontFamily: 'Se-Hwa', color: '#3baea0', fontSize: 25 }}
          >
            {region} ,{decade}, Search(찾기)
          </Text>
        </Pressable>
      </View>
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
    </GestureHandlerRootView>
  )
}
