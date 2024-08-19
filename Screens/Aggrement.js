import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import { AuthContext } from '../context/AuthContext'
import { useIsFocused } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Aggrement = () => {
  const [aggrement, setAggrement] = useState(false)
  const [promise1, setPromise1] = useState(false)
  const [promise2, setPromise2] = useState(false)
  const [promise3, setPromise3] = useState(false)
  const [promise4, setPromise4] = useState(false)
  const [promise5, setPromise5] = useState(false)
  const [promise6, setPromise6] = useState(false)

  const navigation = useNavigation()

  const handleNext = () => {
    saveRegistrationProgress('Aggrement', { aggrement })

    navigation.navigate('Name')
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 10 }}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            backgroundColor: 'white',
            padding: 10,
          }}
        >
          <View>
            <Text>
              앱 서비스 이용에 꼭 필요한 항목만 필수적 접근권한을 받고 있습니다.
              앱 실행을 위해 반드시 필요합니다.
            </Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 700, fontSize: 15 }}>위치</Text>
            <Text>이용자 간 거리 계산을 위한 권한</Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 700, fontSize: 15 }}>저장공간</Text>
            <Text>사진 및 동영상 저장 및 불러오기를 위한 권한</Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 700, fontSize: 15 }}>카메라</Text>
            <Text>게시물 첨부 사진 촬영을 위한 권한</Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 700, fontSize: 15 }}>이메일</Text>
            <Text>
              사용자 식별 및 이용중 문의사항 처리 및 패스워드 찾기등의 사항을
              처리하기 위한 권한
            </Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 700, fontSize: 15 }}>전화번호</Text>
            <Text>이용중 문의사항 처리를 위한 권한</Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 700, fontSize: 15 }}>나이</Text>
            <Text>본 어플은 20세이상 혹은 만19세 이상만 사용가능합니다.</Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => navigation.navigate('Promise1')}
          >
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}
              >
                이용약관 내용확인(클릭)
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>동의함</Text>
              </View>
              <TouchableOpacity onPress={() => setPromise1(!promise1)}>
                {promise1 == false ? (
                  <AntDesign name="checksquareo" size={24} color="black" />
                ) : (
                  <AntDesign name="checksquare" size={24} color="blue" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => navigation.navigate('Promise2')}
          >
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}
              >
                개인정보수집 내용확인(클릭)
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>동의함</Text>
              </View>
              <TouchableOpacity onPress={() => setPromise2(!promise2)}>
                {promise2 == true ? (
                  <AntDesign name="checksquare" size={24} color="blue" />
                ) : (
                  <AntDesign name="checksquareo" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => navigation.navigate('Promise3')}
          >
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}
              >
                개인 위치정보 이용 내용확인(클릭)
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>동의함</Text>
              </View>
              <TouchableOpacity onPress={() => setPromise3(!promise3)}>
                {promise3 == true ? (
                  <AntDesign name="checksquare" size={24} color="blue" />
                ) : (
                  <AntDesign name="checksquareo" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => navigation.navigate('Promise4')}
          >
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}
              >
                가상아이템 정책 내용확인(클릭)
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>동의함</Text>
              </View>
              <TouchableOpacity onPress={() => setPromise4(!promise4)}>
                {promise4 == true ? (
                  <AntDesign name="checksquare" size={24} color="blue" />
                ) : (
                  <AntDesign name="checksquareo" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => navigation.navigate('Promise5')}
          >
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}
              >
                이용가이드라인 내용확인(클릭)
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>동의함</Text>
              </View>
              <TouchableOpacity onPress={() => setPromise5(!promise5)}>
                {promise5 == true ? (
                  <AntDesign name="checksquare" size={24} color="blue" />
                ) : (
                  <AntDesign name="checksquareo" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text
                style={{
                  fontWeight: 700,
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}
              >
                20세 이상 혹은 만19세 이상입니다.
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 15 }}>동의함</Text>
              </View>
              <TouchableOpacity onPress={() => setPromise6(!promise6)}>
                {promise6 == true ? (
                  <AntDesign name="checksquare" size={24} color="blue" />
                ) : (
                  <AntDesign name="checksquareo" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <View>
            <Text style={{ textDecorationLine: 'underline' }}>
              이용약관 내용확인, 개인정보 수집이용, 개인 위치정보 이용,
              가상아이템 정책, 이용가이드라인 내용에
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 15,
              padding: 10,
              backgroundColor:
                promise1 === true &&
                promise2 === true &&
                promise3 === true &&
                promise4 === true &&
                promise5 === true &&
                promise6 === true &&
                'blue',
            }}
            onPress={() => {
              setPromise1(true)
              setPromise2(true)
              setPromise3(true)
              setPromise4(true)
              setPromise5(true)
              setPromise6(true)
            }}
          >
            <Text
              style={{
                color:
                  promise1 === true &&
                  promise2 === true &&
                  promise3 === true &&
                  promise4 === true &&
                  promise5 === true &&
                  promise6 === true &&
                  'white',
                textAlign: 'center',
                fontSize: 20,
              }}
            >
              {' '}
              모두 동의합니다.
            </Text>
          </TouchableOpacity>
        </View>

        {promise1 === true &&
          promise2 === true &&
          promise3 === true &&
          promise4 === true &&
          promise5 === true &&
          promise6 === true && (
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={{ marginTop: 5, marginLeft: 'auto' }}
            >
              <MaterialCommunityIcons
                name="arrow-right-circle"
                size={45}
                color="#581845"
                style={{ alignSelf: 'center', marginTop: 5 }}
              />
            </TouchableOpacity>
          )}
      </View>
    </SafeAreaView>
  )
}

export default Aggrement

const styles = StyleSheet.create({})
