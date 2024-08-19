import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useNavigation } from '@react-navigation/native'
import { saveRegistrationProgress } from '../Utils/registrationUtils'
import { Feather } from '@expo/vector-icons'

const Password = () => {
  const navigation = useNavigation()
  const [password, setPassword] = useState('')

  const handleNext = () => {
    if (password.trim() !== '') {
      // Save the current progress data including the name
      saveRegistrationProgress('Password', { password })
    }
    // Navigate to the next screen
    navigation.navigate('Birth')
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 90, marginHorizontal: 20 }}>
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
            <Feather name="lock" size={26} color="black" />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 30,
            //fontWeight: 'bold',
            fontFamily: 'Se-Hwa',
            marginTop: 15,
          }}
        >
          당신의 Password를 입력해 주세요~
        </Text>

        <TextInput
          secureTextEntry={true}
          autoFocus={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{
            width: 200,
            marginVertical: 10,
            fontSize: password ? 22 : 22,
            marginTop: 25,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            paddingBottom: 10,
            fontFamily: 'Se-Hwa',
          }}
          placeholder="Enter your password"
          placeholderTextColor={'#BEBEBE'}
        />
        <Text style={{ color: 'gray', fontSize: 13, marginTop: 7 }}>
          Note: 당신의 Password는 외부에 공개되지 않습니다.
        </Text>
        <Text style={{ color: 'gray', fontSize: 13, marginTop: 3 }}>
          Note: 6자리 이상 입력해주세요.
        </Text>
        {password && password.length > 5 ? (
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

export default Password

const styles = StyleSheet.create({})
