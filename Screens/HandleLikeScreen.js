import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { baseUrl } from '../Utils/api'

const HandleLikeScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  console.log('handle Likes', route?.params.userId)

  const createMatch = async () => {
    try {
      const currentUserId = route?.params?.userId // Example currentUserId
      const selectedUserId = route?.params?.selectedUserId // Example selectedUserId
      const response = await axios.post(`${baseUrl}/api/usercreate-match`, {
        currentUserId,
        selectedUserId,
      })
      if (response.status === 200) {
        navigation.goBack()
        // Handle success, such as updating UI or showing a success message
      } else {
        console.error('Failed to create match')
        // Handle failure, such as showing an error message
      }
    } catch (error) {
      console.error('Error creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  const match = () => {
    Alert.alert('Accept Request?', `Match with ${route?.params?.name}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: createMatch },
    ])
    // navigation.goBack()
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white', marginTop: 55, padding: 12 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '500' }}>
          All {route?.params?.likes}
        </Text>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>Back</Text>
      </View>

      <View style={{ marginVertical: 12 }}>
        <Image
          style={{
            width: '100%',
            height: 100,
            borderRadius: 7,
            resizeMode: 'cover',
          }}
          source={{ uri: route?.params.image }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
            marginBottom: 8,
            width: 145,
            position: 'absolute',
            bottom: -22,
          }}
        >
          <View />
          <View>
            <Text>Liked your photo</Text>
          </View>
        </View>
      </View>

      <View style={{ marginVertical: 25 }}>
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
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
              {route?.params?.name}
            </Text>
            <View
              style={{
                backgroundColor: '#452c63',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>
                new here
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <Entypo name="dots-three-horizontal" size={22} color="black" />
          </View>
        </View>

        <View style={{ marginVertical: 15 }}>
          <View>
            {route?.params?.imageUrls?.length > 0 && (
              <View>
                <Image
                  style={{
                    width: '100%',
                    height: 350,
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: route?.params?.imageUrls[0],
                  }}
                />
                <Pressable
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'white',
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AntDesign name="hearto" size={25} color="#C5B358" />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HandleLikeScreen

const styles = StyleSheet.create({})
