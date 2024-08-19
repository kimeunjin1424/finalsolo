import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Platform,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Alert,
  LogBox,
  Modal,
  ScrollView,
} from 'react-native'
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useRef,
} from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { io } from 'socket.io-client'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { FontAwesome5 } from '@expo/vector-icons'
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux'
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view'

const ChatRoom = () => {
  const { height, width } = Dimensions.get('window')
  const [message, setMessage] = useState([])
  const navigation = useNavigation()
  const route = useRoute()
  const { userId, user } = useSelector((state) => state.user)

  //const { socket } = useContext(AuthContext)

  //console.log('route123123', route)
  //ChatRoom-nybHnIY5nwDre8qq8fyzC

  const socket = io(`${baseUrl}`)
  const [messages, setMessages] = useState([])
  const [pickImages, setPickImages] = useState([])
  const [photoLength, setPhotoLength] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('')
  const [push, setPush] = useState(true)

  console.log('push', push)

  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'Cannot',
      'VirtualizedList: You have a large list that is slow to update',
    ])
  }, [])

  useEffect(() => {
    socket.emit('pushControll', {
      userId,
      receviedId: route.params.receviedId,
      message: 'I am connected',
      // timeData,
      // messageType: 'text',
    })
  }, [socket])

  useEffect(() => {
    socket.on('pushControllRe', (data) => {
      if (data.userId === route.params.receviedId) setPush(false)
      socket.emit('pushControllRere', data)
    })
  }, [socket])

  useEffect(() => {
    socket.on('pushControllRere', (data) => {
      if (data.userId === userId) setPush(false)
      // socket.emit('pushControllRere', data)
    })
  }, [socket])

  useEffect(() => {
    socket.on('pushTrue', (data) => {
      if (data.userId === route.params.receviedId) setPush(true)
      // socket.emit('pushControllRere', data)
    })
  }, [socket])

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => [...prev, emoji])
    console.log('emoji', emoji)
    setShowPicker(false)
    setModalVisible(false)
  }

  const scrollViewRef = useRef(null)

  useEffect(() => {
    if (photoLength > 0) setModalVisible(true)
  }, [photoLength])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    //setPickImages('')
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    })

    if (result.assets.length > 0) {
      setPhotoLength(result.assets.length)
    }

    if (!result.canceled) {
      if (result.assets.length == null) {
        console.log('image null')
      } else {
        for (i = 0; i < result.assets.length; i++) {
          setPickImages((prev) => [...prev, result.assets[i].uri])
        }
      }
    } else {
      console.log('sdfsdfsdfsd')
    }
    console.log('userImageurl', pickImages)
  }

  useEffect(() => {
    if (userId) socket.emit('addUser', userId)
    setPush(true)
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false })
    }
  }

  const handleContentSizeChange = () => {
    scrollToBottom()
  }

  socket.on('connect', () => {
    console.log('Connected to the Socket.IO server')
  })

  useEffect(() => {
    socket.on('receviedMessage', (newMessage) => {
      //console.log('recevied Message', newMessage)

      //console.log('12312312', newMessage.userId, route.params.receviedId)
      if (newMessage.userId === route.params.receviedId)
        setMessages((prevMessages) => [...prevMessages, newMessage])
    })
  }, [socket])

  const sendMessage = async (userId, receviedId) => {
    //const receviedId = route?.params?.receviedId
    //
    if (message === '') {
      Alert.alert('실패', '메세지를 입력해 주세요.^^')
    } else {
      const timeData = moment().format('MM/DD일 h:mm a')

      const meMessage = {
        userId,
        receviedId,
        message,
        timeData,
        messageType: 'text',
      }

      await axios
        .post(`${baseUrl}/api/message/create-message`, {
          userId,
          receviedId,
          message,
          timeData,
          messageType: 'text',
        })
        .then((res) => {
          setMessage('')
          if (res.status === 200) {
            socket.emit('sendMessage', {
              userId,
              receviedId,
              message,
              timeData,
              messageType: 'text',
            })
            setMessages((prevMessages) => [...prevMessages, meMessage])
            if (push) {
              pushSendMessage()
            } else {
              console.log('push is false')
            }
          }
        })
        .catch((err) => console.log('create MEssage Error', err))
    }

    // call the fetchMessages() function to see the UI update
  }

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              socket.emit('forceDisconnect', {
                userId,
                receviedId: route.params.receviedId,
              })
              setPush(true)
              navigation.goBack()
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              style={{ width: 35, height: 35, borderRadius: 20 }}
              source={{ uri: route.params?.image }}
            />
            <Text style={{ fontFamily: 'Se-Hwa', fontSize: 25 }}>
              {route?.params?.name}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <>
          <Text>{push}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileDetail', {
                userId: route.params.receviedId,
              })
            }
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
        </>
      ),
    })
  }, [])

  const fetchMessages = async () => {
    try {
      const senderId = userId
      const receviedId = route?.params?.receviedId

      const response = await axios.get(
        `${baseUrl}/api/message/${senderId}/${receviedId}`
      )
      //console.log('chat data', response.data)
      setMessages(response.data)
      // console.log('123123', response.data[0].senderId, userId)
    } catch (error) {
      console.log('Error fetching the messages', error)
    }
  }

  const sendImages = () => {
    if (pickImages.length < 7) {
      let formData = new FormData()
      for (i = 0; i < pickImages.length; i++) {
        const newImageUri = 'file:///' + pickImages[i].split('file:/').join('')
        const sImage = {
          uri: newImageUri,
          type: 'image/*',
          name: newImageUri.split('/').pop(),
        }
        //multiple file을 보낼때는 'file'이라는 동일한 이름에
        //for문을 써서 넣든지, map을 써던지 해야함.
        //이거때메 3일 날림 ㅠ
        formData.append(`images`, sImage)
      }
      console.log('sendImages', sendImages)
      //formData.append('image', sendImages)

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          //Authorization: `Bearer ${token}`,
        },
      }
      setIsLoading(true)
      axios
        .post(`${baseUrl}/api/user/upload-profile-images`, formData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            for (i = 0; i < res.data.imageUrls.length; i++) {
              setImageUrls((prev) => [...prev, res.data.imageUrls[i].url])
              console.log(res.data.imageUrls[i].url)
            }
            setIsLoading(false)
            if (imageUrls && imageUrls.length > 0) {
              Alert.alert(
                'Success',
                'OK/완료를 누르시면 이미지 보내기가 완료됩니다',
                [
                  {
                    text: 'ok',
                  },
                ]
              )
            }
          }
        })
        .catch((error) => {
          console.log('Image Upload Failed', error)
        })
    } else {
      Alert.alert('실패', '이미지는 6장까지 업로드 가능합니다.', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ])
    }
  }

  const finalSendImages = async () => {
    //const receviedId = route?.params?.receviedId
    //

    const timeData = moment().format('MM/DD, h:mm a')
    const meMessage = {
      userId,
      receviedId: route?.params?.receviedId,
      timeData,
      imageUrls,
      messageType: 'image',
    }

    await axios
      .post(`${baseUrl}/api/message/create-images`, {
        userId,
        receviedId: route?.params?.receviedId,
        imageUrls,
        timeData,
        messageType: 'image',
      })
      .then((res) => {
        setPickImages('')
        setModalVisible(false)
        if (res.data.status == true)
          socket.emit('sendMessage', {
            userId,
            receviedId: route?.params?.receviedId,
            imageUrls,
            timeData,
            messageType: 'image',
          })
        setMessages((prevMessages) => [...prevMessages, meMessage])
        setImageUrls('')
      })
      .catch((err) => console.log('create MEssage Error', err))

    // call the fetchMessages() function to see the UI update
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const messageSeen = async () => {
      try {
        await axios
          .post(`${baseUrl}/api/message/message-seen`, {
            userId: userId,
            receviedId: route.params.receviedId,
          })
          .then((res) => console.log('update message', res.data.message))
          .catch((err) => console.log('message update Err', err))
      } catch (error) {
        console.log('message update failed', err)
      }
    }
    console.log(
      'rece last',
      route.params.lastMessageId,
      route.params.receviedId
    )
    if (route.params.receviedId == route.params.lastMessageId) messageSeen()
  }, [])

  // const formatTime = (time) => {
  //   const options = { hour: 'numeric', minute: 'numeric' }
  //   return new Date(time).toLocaleString('en-US', options)
  // }

  const pushSendMessage = async () => {
    await axios
      .post(`${baseUrl}/api/user/push-send-message`, {
        userId: route?.params?.receviedId,
        myName: user.name,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('send push success')
        }
      })
  }

  const deletePick = (url) => {
    setPickImages(pickImages.filter((i) => i !== url))
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: 'white',
      }}
      extraHeight={110}
      keyboardShouldPersistTaps={
        Platform.OS === 'android' ? (keyboardShouldPersistTaps = 'none') : null
      }
      // contentInset={{ bottom: 1 }}
      keyboardDismissMode="none"
      enableResetScrollToCoords={true}
    >
      <KeyboardAwareFlatList
        initialNumToRender={5}
        disableVirtualization={true}
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
        data={messages}
        keyExtractor={(item, index) => {
          return index.toString()
        }}
        renderItem={({ item, index }) => (
          <View key={item._id}>
            {item.messageType == 'text' ? (
              <View>
                {item?.senderId?._id === userId || item?.userId === userId ? (
                  <View style={{ marginBottom: 5 }}>
                    <View
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: 'white',
                        padding: 8,
                        maxWidth: '60%',
                        borderRadius: 7,
                        margin: 5,
                        borderWidth: 1,
                        marginBottom: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Se-Hwa',
                          fontSize: 20,
                          textAlign: 'left',
                          color: 'black',
                          fontWeight: '300',
                        }}
                      >
                        {item?.message}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                        textAlign: 'right',
                        color: 'gray',
                        marginRight: 7,
                      }}
                    >
                      {item.timeData}
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginBottom: 7 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ marginLeft: 5, marginRight: 5 }}>
                        <Image
                          style={{ width: 35, height: 35, borderRadius: 20 }}
                          source={{ uri: route.params?.image }}
                        />
                      </View>
                      <View
                        style={{
                          alignSelf: 'flex-start',
                          borderWidth: 1,
                          borderColor: 'lightgray',
                          padding: 8,
                          borderRadius: 7,
                          maxWidth: '60%',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'left',
                            color: 'gray',
                            fontWeight: '300',
                            fontSize: 20,
                            fontFamily: 'Se-Hwa',
                          }}
                        >
                          {item?.message}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 9,
                        textAlign: 'right',
                        color: 'gray',
                        alignSelf: 'flex-start',
                        marginLeft: 5,
                        marginTop: 5,
                        fontSize: 20,
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      {item.timeData}
                    </Text>
                  </View>
                )}
              </View>
            ) : item.messageType == 'image' ? (
              item?.imageUrls?.map((i, index) => (
                <View key={index}>
                  <Pressable
                    key={index}
                    style={[
                      item?.senderId?._id === userId || item?.userId === userId
                        ? {
                            alignSelf: 'flex-end',
                            backgroundColor: 'lightgray',
                            padding: 3,
                            width: 170,
                            borderRadius: 7,
                            margin: 10,
                            height: 230,
                          }
                        : {
                            alignSelf: 'flex-start',
                            backgroundColor: 'lightgray',
                            padding: 3,
                            margin: 10,
                            borderRadius: 7,
                            height: 230,
                            width: 170,
                          },
                    ]}
                  >
                    <View>
                      <Image
                        style={{ width: '400', height: '95%' }}
                        source={{ uri: i }}
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 9,
                        textAlign: 'right',
                        color: 'gray',
                      }}
                    >
                      {item.timeData}
                    </Text>
                  </Pressable>
                </View>
              ))
            ) : null}
          </View>
        )}
        //style={{ height: height * 0.86 }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: Platform.OS == 'android' ? 10 : 20,

          //position: 'absolute',
        }}
      >
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline={true}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 8,
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            <Entypo name="camera" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <Pressable
          onPress={() => sendMessage(userId, route?.params?.receviedId)}
          style={{
            backgroundColor: 'yellow',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'lightgray',
          }}
        >
          <View>
            <FontAwesome5 name="paper-plane" size={20} color="gray" />
          </View>
        </Pressable>
      </View>
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={isModalVisible}
        onTouchOutside={() => {
          setModalVisible(false)
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
              marginTop: 10,
              borderRadius: 20,
              width: width * 0.9,
              height: height * 0.9,
              padding: 5,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 3,
                height: 6,
              },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View style={{ width: '90%' }}>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                Image 보내기
              </Text>
              <Text
                style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}
              >
                이미지 보내기는 6장까지 가능합니다.
              </Text>
              <ScrollView style={{ marginTop: 5 }}>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    {pickImages &&
                      pickImages.slice(0, 3).map((url, index) => (
                        <Pressable
                          onPress={() => deletePick(url)}
                          key={index}
                          style={{
                            borderColor: '#581845',
                            borderWidth: url ? 0 : 2,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle: 'dashed',
                            borderRadius: 10,
                            height: 100,
                          }}
                        >
                          {url ? (
                            <>
                              <Image
                                source={{ uri: url }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 10,
                                  resizeMode: 'cover',
                                }}
                              />
                              <View
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                <AntDesign
                                  name="closecircleo"
                                  size={24}
                                  color="white"
                                />
                              </View>
                            </>
                          ) : (
                            <EvilIcons name="image" size={22} color="black" />
                          )}
                        </Pressable>
                      ))}
                  </View>
                </View>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    {pickImages &&
                      pickImages.slice(3, 6).map((url, index) => (
                        <Pressable
                          onPress={() => deletePick(url)}
                          key={index}
                          style={{
                            borderColor: '#581845',
                            borderWidth: url ? 0 : 2,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle: 'dashed',
                            borderRadius: 10,
                            height: 100,
                          }}
                        >
                          {url ? (
                            <>
                              <Image
                                source={{ uri: url }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 10,
                                  resizeMode: 'cover',
                                }}
                              />
                              <View
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                <AntDesign
                                  name="closecircleo"
                                  size={24}
                                  color="white"
                                />
                              </View>
                            </>
                          ) : (
                            <EvilIcons name="image" size={22} color="black" />
                          )}
                        </Pressable>
                      ))}
                  </View>
                </View>
                {pickImages?.length > 0 ? (
                  <>
                    <TouchableOpacity onPress={sendImages}>
                      <View
                        style={{
                          marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          borderWidth: 2,
                          borderColor: 'red',
                          justifyContent: 'space-around',
                          borderRadius: 25,
                          width: '90%',
                          alignSelf: 'center',
                        }}
                      >
                        <AntDesign name="picture" size={30} color="red" />
                        <Text
                          style={{
                            color: 'red',
                            textAlign: 'center',
                            fontSize: 25,
                            fontFamily: 'Se-Hwa',
                            marginBottom: 8,
                          }}
                        >
                          사진 업로드하기
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {imageUrls && imageUrls?.length > 0 ? (
                      <View>
                        <Text style={{ marginLeft: 20 }}>
                          사진 보내기를 꼭 눌러주세요.
                        </Text>
                        <TouchableOpacity
                          style={{
                            alignSelf: 'center',
                            borderColor: 'red',
                            borderRadius: 25,
                            padding: 10,
                            backgroundColor: 'pink',
                            width: '90%',
                          }}
                          onPress={finalSendImages}
                        >
                          <Text
                            style={{
                              fontSize: 30,
                              textAlign: 'center',
                              fontFamily: 'Se-Hwa',
                              color: 'white',
                            }}
                          >
                            사진 보내기
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </>
                ) : (
                  <View>
                    <Text>이미지 추가하기를 눌러 주세요</Text>
                  </View>
                )}
                {isLoading && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.35)',
                      flex: 1,
                    }}
                  >
                    <ActivityIndicator size="large" color="white" />
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        color: 'white',
                        fontSize: 50,
                      }}
                    >
                      다소 시간이 걸릴 수 있습니다.
                    </Text>
                  </View>
                )}
              </ScrollView>
              <View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    borderRadius: 25,
                    paddingVertical: 5,
                    backgroundColor: 'gray',
                    marginTop: 20,
                    marginHorizontal: 2,
                    paddingHorizontal: 20,
                    width: 200,
                    marginBottom: 30,
                    alignSelf: 'center',
                    width: '90%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 25,
                    }}
                  >
                    닫기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* <BottomModal
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        onHardwareBackPress={() => setModalVisible(!isModalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Send Image" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        visible={isModalVisible}
        onSwipeOut={() => setModalVisible(false)}
        onTouchOutside={() => setModalVisible(!isModalVisible)}
      >
        <ModalContent style={{ width: '100%', height: 600 }}>
          <View style={{ marginVertical: 10 }}>
            {pickImages.length > 0 ? (
              <View>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',

                      gap: 20,
                    }}
                  >
                    {pickImages.slice(0, 3).map((url, index) => (
                      <Pressable
                        onPress={() => deletePicture(url)}
                        key={index}
                        style={{
                          borderColor: '#581845',
                          borderWidth: url ? 0 : 2,
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderStyle: 'dashed',
                          borderRadius: 10,
                          height: 100,
                        }}
                      >
                        {url ? (
                          <>
                            <Image
                              source={{ uri: url }}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                                resizeMode: 'cover',
                              }}
                            />
                            <View
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                              }}
                            >
                              <AntDesign
                                name="closecircleo"
                                size={24}
                                color="white"
                              />
                            </View>
                          </>
                        ) : (
                          <EvilIcons name="image" size={22} color="black" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    {pickImages.slice(3, 6).map((url, index) => (
                      <Pressable
                        onPress={() => deletePicture(url)}
                        key={index}
                        style={{
                          borderColor: '#581845',
                          borderWidth: url ? 0 : 2,
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderStyle: 'dashed',
                          borderRadius: 10,
                          height: 100,
                        }}
                      >
                        {url ? (
                          <>
                            <Image
                              source={{ uri: url }}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                                resizeMode: 'cover',
                              }}
                            />
                            <View
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                              }}
                            >
                              <AntDesign
                                name="closecircleo"
                                size={24}
                                color="white"
                              />
                            </View>
                          </>
                        ) : (
                          <EvilIcons name="image" size={22} color="black" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>
                <TouchableOpacity onPress={sendImages}>
                  <View
                    style={{
                      marginVertical: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 5,
                      borderWidth: 2,
                      borderColor: 'red',
                      justifyContent: 'space-around',
                      borderRadius: 25,
                    }}
                  >
                    <AntDesign name="picture" size={30} color="red" />
                    <Text
                      style={{
                        color: 'red',
                        textAlign: 'center',
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        marginBottom: 8,
                      }}
                    >
                      사진보내기
                    </Text>
                  </View>
                </TouchableOpacity>
                {imageUrls && imageUrls.length > 0 ? (
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      borderWidth: 1,
                      borderColor: 'red',
                      borderRadius: 25,
                      padding: 10,
                    }}
                    onPress={finalSendImages}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        textAlign: 'center',
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      완료
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
            {isLoading && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  flex: 1,
                }}
              >
                <ActivityIndicator size={100} />
                <Text
                  style={{ fontFamily: 'Se-Hwa', color: 'white', fontSize: 50 }}
                >
                  다소 시간이 걸릴 수 있습니다.
                </Text>
              </View>
            )}
            {showPicker && (
              <TouchableOpacity style={{ width: '100%', height: '100%' }}>
                <EmojiSelector
                  onEmojiSelected={handleEmojiSelect}
                  category={Categories.emotion}
                  showTabs={false}
                  showSearchBar={false}
                  showHistory={false}
                  columns={10}
                  //placeholder="Search emoji..."
                />
              </TouchableOpacity>
            )}
          </View>
        </ModalContent>
      </BottomModal> */}
    </KeyboardAwareScrollView>
  )
}

export default ChatRoom

const styles = StyleSheet.create({})
