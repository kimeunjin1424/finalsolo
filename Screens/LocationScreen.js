import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
//import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Location from 'expo-location'
import axios from 'axios'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import { Ionicons } from '@expo/vector-icons'

const LocationScreen = () => {
  const [mapRegion, setMapRegion] = useState('')
  const [address, setAddress] = useState('')
  const navigation = useNavigation()
  const [location, setLocation] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)
  const [region, setRegion] = useState('')

  const regionData = [
    { id: 1, name: '서울' },
    { id: 2, name: '경기도' },
    { id: 3, name: '충북' },
    { id: 4, name: '충남' },
    { id: 5, name: '강원' },
    { id: 6, name: '광주전남' },
    { id: 7, name: '전북' },
    { id: 8, name: '경남' },
    { id: 9, name: '경북' },
    { id: 10, name: '부산울산' },
    { id: 11, name: '제주' },
  ]

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      console.log('status', status)
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }
      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
      console.log(currentLocation)
    }
    getPermissions()
  }, [])

  // useEffect(() => {
  //   ;(async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync()
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied')
  //       return
  //     }

  //     let location = await Location.getCurrentPositionAsync({})
  //     setLocation(location)
  //     console.log('location', location)
  //   })()
  // }, [])

  useEffect(() => {
    if (location) {
      const getAddress = async () => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&language=ko&key=AIzaSyDuBiFAUi7V_0SJBjSTlDnysSjuBBZFL1I`
        const { data } = await axios.get(url)
        console.log('data', data.results[0].formatted_address)
        setAddress(data.results[0].formatted_address)
      }

      getAddress()

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03333,
        longitudeDelta: 0.02221,
      })
    }
  }, [location])

  // useEffect(() => {
  //   if (region) {
  //     const getAddress = async () => {
  //       const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapRegion.latitude},${mapRegion.longitude}&language=ko&key=AIzaSyDJqEKwV49K0ycxK_os6f9ZgKuv6pJHINA`
  //       const { data } = await axios.get(url)
  //       console.log('data', data)
  //     }
  //     getAddress()
  //   }
  // }, [region])

  let text = 'Waiting.. 10초만 기다려 주세요!!'
  let text1 = 'Waiting.. 10초만 기다려 주세요!!'
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location.coords.latitude)
    text1 = JSON.stringify(location.coords.longitude)
  }

  // const handleMarkerDragEnd = (coordinate) => {
  //   // Use reverse geocoding to get the location name from latitude and longitude
  //   fetch(
  //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=AIzaSyDJqEKwV49K0ycxK_os6f9ZgKuv6pJHINA`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('New location:', data)
  //       if (data.results.length > 0) {
  //         const addressComponents = data.results[0].address_components
  //         let formattedAddress = ''
  //         for (let component of addressComponents) {
  //           if (component.types.includes('route')) {
  //             formattedAddress += component.long_name + ', '
  //           }
  //           if (component.types.includes('sublocality_level_1')) {
  //             formattedAddress += component.long_name + ', '
  //           }
  //           if (component.types.includes('locality')) {
  //             formattedAddress += component.long_name + ', '
  //           }
  //         }
  //         // Remove the trailing comma and space
  //         formattedAddress = formattedAddress.trim().slice(0, -1)
  //         setLocation(formattedAddress)
  //       }
  //     })
  //     .catch((error) => console.error('Error fetching location:', error))
  // }

  const handleNext = () => {
    console.log('go to Gender')
    saveRegistrationProgress('Location', {
      location: {
        lat: location?.coords.latitude,
        lng: location?.coords.longitude,
      },
    })
    saveRegistrationProgress('Region', { region })

    // Navigate to the next screen
    navigation.navigate('Gender')
  }
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
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
              <Ionicons name="location-outline" size={26} color="black" />
            </View>
            <View>
              <View>
                <Text style={{ color: 'red', fontSize: 10 }}>{text}</Text>
              </View>
              <View>
                <Text style={{ color: 'red', fontSize: 10 }}>{text1}</Text>
              </View>
            </View>

            <Image
              style={{ width: 100, height: 40 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
              }}
            />
          </View>
          <View>
            <Text style={{ color: 'gray' }}>위치가 Denied로 나오시는 분은</Text>
          </View>
          <View>
            <Text style={{ color: 'red' }}>
              Settings - 나혼자 솔로 - Toggle - Location Permission 위치허용을
              부탁드립니다.{' '}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 30,
              //fontWeight: 'bold',
              fontFamily: 'Se-Hwa',
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            당신이 사는 곳은 어디입니까?
          </Text>
          {/* {mapRegion ? (
            <MapView
              style={{
                width: Dimensions.get('screen').width * 0.9,
                height: Dimensions.get('screen').height * 0.35,
                borderRadius: 20,
              }}
              provider={PROVIDER_GOOGLE}
              //showsUserLocation={true}
              region={mapRegion}
            >
              <Marker title="you" coordinate={mapRegion}>
                <View
                  style={{
                    backgroundColor: 'lightgray',
                    borderColor: 'gray',
                    borderRadius: 50,
                  }}
                ></View>
                <View>
                  <Image
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: 'red',
                      borderRadius: 999,
                    }}
                  />
                </View>
              </Marker>
            </MapView>
          ) : (
            <MapView />
          )} */}
          <View
            style={{
              borderColor: '#581845',
              borderWidth: 1,
              borderRadius: 20,
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{ color: '#581845', fontSize: 25, fontFamily: 'Se-Hwa' }}
            >
              {address}
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: 'Se-Hwa', color: 'gray', fontSize: 20 }}>
              당신의 위치는 공개되지 않습니다.
            </Text>
          </View>
          <View style={{ marginTop: 15 }}>
            <Text
              style={{ fontSize: 30, fontWeight: 600, fontFamily: 'Se-Hwa' }}
            >
              당신이 사는 지역을 클릭해 주세요!
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              gap: 5,
              flexWrap: 'wrap',
            }}
          >
            {regionData.map((r, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  borderColor: '#581845',
                  borderWidth: 1,
                  paddingHorizontal: 3,
                  paddingVertical: 7,
                  borderRadius: 30,
                  gap:3,
                  backgroundColor: region === r.name ? '#581845' : 'white',
                }}
                onPress={() => setRegion(r.name)}
              >
                <Text
                  style={{ color: region === r.name ? 'white' : '#581845', fontSize:20 }}
                >
                  {r.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {region && location ? (
            <TouchableOpacity
              onPress={handleNext}
              style={{ marginTop: -5, marginLeft: 'auto' }}
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
    </ScrollView>
  )
}

export default LocationScreen

const styles = StyleSheet.create({})
