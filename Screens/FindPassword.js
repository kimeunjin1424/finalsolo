import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { useNavigation } from '@react-navigation/native'
import { Keyboard } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const FindPassword = () => {
  const [reEmail, setReEmail] = useState('')

  const navigation = useNavigation()

  const reEmailfind = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/user/find-email`, { reEmail })
        .then((res) => {
          if (res.status == 200) {
            Alert.alert('성공', '입력하신 Email로 Password가 전송되었습니다', [
              {
                text: '확인',
                onPress: () => navigation.goBack(),
              },
            ])
          }
        })
        .catch((err) => console.log('find rereemail 4004040 error', err))
    } catch (error) {
      console.log('find Email error', error)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ marginTop: 70, marginLeft: 30 }}>
        <View>
          <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
            Password 찾기
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'gray' }}>
            가입시 입력한 Email을 입력해 주세요.
          </Text>
          <Text style={{ color: 'gray' }}>
            입력한 Email로 Password가 전송됩니다.
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderColor: 'gray',
            marginTop: 20,
            width: '80%',
            //alignSelf: 'center',
          }}
        >
          <TextInput
            onChangeText={(text) => setReEmail(text)}
            placeholderTextColor={'gray'}
            placeholder="type your Email.."
            style={{ width: '80%', height: 50, fontSize: 20 }}
          />
        </View>
        <TouchableOpacity
          onPress={reEmailfind}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            marginTop: 20,
            borderRadius: 25,
            paddingVertical: 4,
            width: '80%',
            backgroundColor: 'gray',
            // alignSelf: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Se-Hwa',
              fontSize: 30,
              textAlign: 'center',
              color: 'white',
            }}
          >
            Password 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'flex-end', marginRight:70 }}
        >
          <MaterialCommunityIcons
            name="arrow-left-circle"
            size={45}
            color="#581845"
            style={{ marginTop: 5 }}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default FindPassword

const styles = StyleSheet.create({})
