import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'

const NameScreen = () => {
  const [username, setUsername] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    getRegistrationProgress('Name').then((res) => {
      if (res) {
        setUsername(res.username || '')
      }
    })
  }, [])

  const handleNext = () => {
    if (username.trim() !== '') {
      saveRegistrationProgress('Name', { username })
    }
    navigation.navigate('Email')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 50, marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="newspaper-variant-outline"
              size={26}
              color="black"
            />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
            }}
          />
        </View>

        <View style={{ marginTop: 30, marginLeft: 20 }}>
          <Text
            style={{
              fontSize: 30,
              //fontWeight: 'bold',
              fontFamily: 'Se-Hwa',
            }}
          >
            당신의 이름을 입력해 주세요~
          </Text>
          <TextInput
            autoFocus={true}
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={{
              width: 100,
              marginVertical: 10,
              fontSize: username ? 22 : 22,
              marginTop: 25,
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
              paddingBottom: 10,
              fontFamily: 'Se-Hwa',
              fontSize: 30,
            }}
            placeholder="이름"
            placeholderTextColor={'#BEBEBE'}
          />
        </View>
        {username ? (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={{ marginTop: 30, marginLeft: 'auto' }}
          >
            <MaterialCommunityIcons
              name="arrow-right-circle"
              size={45}
              color="#581845"
              style={{ alignSelf: 'center', marginTop: 20 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  )
}

export default NameScreen

const styles = StyleSheet.create({})
