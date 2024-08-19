import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const BirthScreen = () => {
  const navigation = useNavigation()
  const monthRef = useRef(null)
  const yearRef = useRef(null)

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [decade, setDecade] = useState('')

  const decadeData = [
    { id: 2, name: '20대' },
    { id: 3, name: '30대' },
    { id: 4, name: '40대' },
    { id: 5, name: '50대' },
  ]

  const handleDayChange = (text) => {
    setDay(text)
    if (text.length == 2) {
      monthRef.current.focus()
    }
  }

  const handleMonthChange = (text) => {
    setMonth(text)
    if (text.length == 2) {
      yearRef.current.focus()
    }
  }

  const handleYearChange = (text) => {
    setYear(text)
  }

  // useEffect(() => {
  //   getRegistrationProgress('Birth').then((progressData) => {
  //     if (progressData) {
  //       const { dateOfBirth } = progressData
  //       const [dayValue, monthValue, yearValue] = dateOfBirth.split('/')

  //       setDay(dayValue)
  //       setMonth(monthValue)
  //       setYear(yearValue)
  //     }
  //   })
  // }, [])

  const handleNext = () => {
    const dateOfBirth = '07/07/7777'
    //saveRegistrationProgress('Birth', { '12/12/1212' })
    saveRegistrationProgress('Age', { age })
    saveRegistrationProgress('Decade', { decade })

    navigation.navigate('Location')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 60, marginHorizontal: 20 }}>
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
              name="cake-variant-outline"
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
        <Text
          style={{
            fontSize: 30,
            //fontWeight: 'bold',
            fontFamily: 'Se-Hwa',
            marginTop: 15,
          }}
        >
          당신의 나이와 연령대를 입력해 주세요!!
        </Text>
        <Text
          style={{
            fontSize: 15,
            //fontWeight: 'bold',
            //fontFamily: 'Se-Hwa',
            marginTop: 15,
            color: 'gray',
            fontFamily: 'Se-Hwa',
            fontSize: 20,
          }}
        >
          -당신의 연령대에 맞게 상대방이 추천됩니다!
        </Text>
        <View>
          <Text
            style={{
              color: 'gray',
              marginLeft: 5,
              fontFamily: 'Se-Hwa',
              fontSize: 20,
            }}
          >
            -본인의 연령대를 클릭해 주세요!
          </Text>
        </View>

        <ScrollView
          horizontal={true}
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignSelf: 'center',
            width: '95%',
            paddingVertical: 4,
          }}
        >
          {decadeData.map((i, index) => (
            <TouchableOpacity
              onPress={() => setDecade(i.name)}
              key={index}
              style={{
                marginRight: 7,
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
        </ScrollView>
        <View>
          <Text
            style={{
              color: 'gray',
              marginLeft: 5,
              fontFamily: 'Se-Hwa',
              fontSize: 20,
            }}
          >
            -본인의 나이를 입력해 주세요!
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: 10,
          }}
        >
          <TextInput
            style={{
              borderBottomWidth: 1,
              borderColor: 'black',
              padding: 10,
              width: 75,
              fontSize: day ? 30 : 30,
              fontFamily: 'Se-Hwa',
            }}
            placeholder="나이"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={(text) => setAge(text)}
            value={age}
          />
          <Text
            style={{
              marginTop: 10,
              marginLeft: -10,
              fontFamily: 'Se-Hwa',
              fontSize: 25,
            }}
          >
            세
          </Text>
        </View>

        {age && decade ? (
          <View style={{ marginTop: 30 }}>
            <View style={{ gap: 20 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 25,
                    backgroundColor: '#3baea0',
                    width: 100,
                    marginRight: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontFamily: 'Se-Hwa',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    {age}세
                  </Text>
                </View>
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 25,
                    backgroundColor: '#3baea0',
                    width: 100,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontFamily: 'Se-Hwa',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    {decade}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleNext}
                  activeOpacity={0.8}
                  style={{ marginTop: 1, marginLeft: 'auto' }}
                >
                  <MaterialCommunityIcons
                    name="arrow-right-circle"
                    size={45}
                    color="#581845"
                    style={{ alignSelf: 'center', marginTop: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  )
}

export default BirthScreen

const styles = StyleSheet.create({})

// <View
// style={{
//   flexDirection: 'row',
//   gap: 10,
//   marginTop: 50,
//   justifyContent: 'flex-start',
//   marginLeft: 10,
// }}
// >

// <TextInput
//   autoFocus={true}
//   style={{
//     borderBottomWidth: 1,
//     borderColor: 'black',
//     padding: 10,
//     width: 50,
//     fontSize: day ? 30 : 30,
//     fontFamily: 'Se-Hwa',
//   }}
//   placeholder="DD"
//   keyboardType="numeric"
//   maxLength={2}
//   onChangeText={handleDayChange}
//   value={day}
// />
// <Text
//   style={{
//     marginTop: 25,
//     marginLeft: -10,
//     fontFamily: 'Se-Hwa',
//     fontSize: 25,
//   }}
// >
//   일
// </Text>

// {/* Month Input Field */}
// <TextInput
//   ref={monthRef}
//   style={{
//     borderBottomWidth: 1,
//     borderColor: 'black',
//     padding: 10,
//     width: 60,
//     fontSize: day ? 30 : 30,
//     fontFamily: 'Se-Hwa',
//   }}
//   placeholder="MM"
//   keyboardType="numeric"
//   maxLength={2}
//   onChangeText={handleMonthChange}
//   value={month}
// />
// <Text
//   style={{
//     marginTop: 25,
//     marginLeft: -10,
//     fontFamily: 'Se-Hwa',
//     fontSize: 25,
//   }}
// >
//   월
// </Text>

// {/* Year Input Field */}
// <TextInput
//   ref={yearRef}
//   style={{
//     borderBottomWidth: 1,
//     borderColor: 'black',
//     padding: 10,
//     width: 75,
//     fontSize: day ? 30 : 30,
//     fontFamily: 'Se-Hwa',
//   }}
//   placeholder="YYYY"
//   keyboardType="numeric"
//   maxLength={4}
//   onChangeText={handleYearChange}
//   value={year}
// />
// <Text
//   style={{
//     marginTop: 25,
//     marginLeft: -10,
//     fontFamily: 'Se-Hwa',
//     fontSize: 25,
//   }}
// >
//   년
// </Text>
// </View>
// <View>
// <Text
//   style={{
//     color: 'gray',
//     marginLeft: 5,
//     fontFamily: 'Se-Hwa',
//     fontSize: 20,
//   }}
// >
//   - 당신의 생년월일은 공개되지 않습니다.
// </Text>
// </View>
// <View
// style={{
//   flexDirection: 'row',
//   justifyContent: 'flex-start',
//   marginLeft: 10,
// }}
// >
// <TextInput
//   ref={yearRef}
//   style={{
//     borderBottomWidth: 1,
//     borderColor: 'black',
//     padding: 10,
//     width: 75,
//     fontSize: day ? 30 : 30,
//     fontFamily: 'Se-Hwa',
//   }}
//   placeholder="나이"
//   keyboardType="numeric"
//   maxLength={2}
//   onChangeText={(text) => setAge(text)}
//   value={age}
// />
// <Text
//   style={{
//     marginTop: 10,
//     marginLeft: -10,
//     fontFamily: 'Se-Hwa',
//     fontSize: 25,
//   }}
// >
//   세
// </Text>
// </View>  */}
