import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { FontAwesome6 } from '@expo/vector-icons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import * as ImagePicker from 'expo-image-picker'
import { useSelector } from 'react-redux'
// router.post('/create-suggest', suggestController.createSuggest)
// router.post('/get-suggests', suggestController.getSuggests)
// router.post('/get-suggest', suggestController.getSuggest)
// router.post('/delete-suggest', suggestController.deleteSuggest)
// router.put('/suggest-reply', suggestController.suggestReply)

const SuggestPage = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { userId, user } = useSelector((state) => state.user)

  const [coner, setConer] = useState('client')
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('')
  const [reply, setReply] = useState('')
  const [suggests, setSuggests] = useState([])
  const [mySuggest, setMySuggest] = useState([])

  const createSuggest = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/suggest/create-suggest`, {
          userId,
          username: user.name,
          text,
        })
        .then((res) => {
          console.log('trsdfs', res)
          if (res.status === 200) {
            Alert.alert(
              'Success',
              '건의하기가 완료되었습니다. 처리하는데 1~5일 정도 시간이 걸립니다.'
            )
            navigation.goBack()
            // Handle success, such as updating UI or showing a success message
          } else {
            console.error('create-Suggest Error')
            // Handle failure, such as showing an error message
          }
        })
    } catch (error) {
      console.error('create-Suggest Error', error)
      // Handle error, such as showing an error message
    }
  }

  const getSuggests = async () => {
    try {
      await axios.get(`${baseUrl}/api/suggest/get-suggests`).then((res) => {
        if (res.status === 200) {
          setSuggests(res.data.suggests)
          console.log('get suggests', res.data.suggests)
        }
      })
    } catch (error) {
      console.error('Get Suggests:', error)
      // Handle error, such as showing an error message
    }
  }

  const getMySuggest = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/suggest/get-suggest`, { userId })
        .then((res) => {
          if (res.status === 200) {
            console.log('mysingo', res.data.suggest)
            setMySuggest(res.data.suggest)
          }
        })
    } catch (error) {
      console.error('get My singo error', error)
      // Handle error, such as showing an error message
    }
  }

  const inputReply = async (suggestId) => {
    try {
      await axios
        .put(`${baseUrl}/api/suggest/suggest-reply`, {
          suggestId,
          reply,
        })
        .then((res) => {
          if (res.status === 200) {
            Alert.alert('Success', '건의하기 답글 달기가 성공했습니다.')
            setReply('')
          }
        })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  const suggestDelete = async (suggestId) => {
    try {
      await axios
        .post(`${baseUrl}/api/suggest/delete-suggest`, {
          suggestId,
        })
        .then((res) => {
          if (res.status === 200) {
            Alert.alert('Success', '건의하기 삭제가 잘 되었습니다.')
            getSuggests()
          }
        })
    } catch (error) {
      console.error('delete-suggest error:', error)
      // Handle error, such as showing an error message
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, padding: 5, width: '100%' }}
      keyboardVerticalOffset={20}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ marginTop: 30 }}
      >
        <ScrollView>
          <View
            style={{
              marginTop: 35,
              marginLeft: 20,
              flexDirection: 'row',
              marginBottom: 10,
            }}
          >
            <TouchableOpacity activeOpacity={0.8} style={{}}>
              <MaterialCommunityIcons
                name="arrow-left-circle"
                size={45}
                color="#581845"
                style={{ marginTop: 5 }}
                onPress={() => navigation.navigate('Profile')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConer('client')}
              style={{
                marginTop: 10,
                marginHorizontal: 5,
                borderWidth: 1,
                borderRadius: 25,
                borderColor: '#581845',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  alignSelf: 'center',
                  fontSize: 30,
                  color: '#581845',
                }}
              >
                건의하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setConer('result')
                getMySuggest()
              }}
              style={{
                marginTop: 10,
                marginHorizontal: 5,
                borderWidth: 1,
                borderRadius: 25,
                borderColor: '#581845',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  alignSelf: 'center',
                  fontSize: 30,
                  color: '#581845',
                }}
              >
                건의결과 보기
              </Text>
            </TouchableOpacity>
            {user.admin == 'true' && (
              <TouchableOpacity
                onPress={() => {
                  setConer('admin')
                  getSuggests()
                }}
                style={{ alignSelf: 'center', marginTop: 5, marginLeft: 5 }}
              >
                <AntDesign name="checkcircleo" size={40} color="red" />
              </TouchableOpacity>
            )}
          </View>
          {coner == 'client' && (
            <View style={{ marginTop: 10, marginHorizontal: 10 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: 'black',
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'black' }}
                >
                  더 나은 나 혼자 솔로를 위해서 개선방안이나 기능이 있으면,
                  자유롭게 건의 부탁드립니다.
                </Text>
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'black' }}
                >
                  -좋은 개선방안이나, 건의사항이면, 하트 20개를 선물로 드립니다.
                </Text>
              </View>
              <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                <View>
                  <Text
                    style={{
                      color: 'gray',
                      fontFamily: 'Se-Hwa',
                      fontSize: 25,
                    }}
                  >
                    {' '}
                    1.건의할 내용 입력하기
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      padding: 10,
                      borderRadius: 15,
                      marginTop: 10,
                      backgroundColor: 'white',
                    }}
                  >
                    <TextInput
                      onChangeText={(text) => setText(text)}
                      style={{ fontSize: 25, fontFamily: 'Se-Hwa', height: 90 }}
                      placeholder="건의내용 입력하기.. "
                      placeholderTextColor="lightgray"
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      borderRadius: 25,
                      borderWidth: 1,
                      backgroundColor: 'green',
                      marginTop: 10,
                      paddingVertical: 10,
                    }}
                    onPress={createSuggest}
                  >
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        fontSize: 30,
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      건의하기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {coner == 'admin' && (
            <View style={{ marginBottom: 20, paddingVertical: 20 }}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 300,
                }}
              >
                {suggests &&
                  suggests?.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        marginHorizontal: 5,
                        borderRadius: 15,
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.username}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.text}
                        </Text>
                      </View>

                      {i.reply ? (
                        <View
                          style={{
                            marginHorizontal: 5,
                            marginVertical: 5,
                            borderWidth: 1,
                            borderRadius: 15,
                            backgroundColor: 'lightgray',
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 30,
                              textAlign: 'center',
                              fontFamily: 'Se-Hwa',
                            }}
                          >
                            {i.reply}
                          </Text>
                        </View>
                      ) : null}
                      <View
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'white',
                          paddingVertical: 5,
                        }}
                      >
                        <TextInput
                          value={reply}
                          onChangeText={(text) => setReply(text)}
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => inputReply(i._id)}
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'white',
                          paddingVertical: 5,
                          backgroundColor: 'gray',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                            color: 'white',
                          }}
                        >
                          결과 입력하기
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => suggestDelete(i._id)}
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'white',
                          paddingVertical: 5,
                          backgroundColor: 'red',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                            color: 'white',
                          }}
                        >
                          삭제하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
          {coner == 'result' && (
            <View style={{ marginBottom: 20, paddingVertical: 20 }}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 300,
                }}
              >
                {mySuggest &&
                  mySuggest?.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        marginHorizontal: 5,
                        borderRadius: 15,
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.username}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.text}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'lightgray',
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                          }}
                        >
                          {i.reply}
                        </Text>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default SuggestPage

const styles = StyleSheet.create({})
