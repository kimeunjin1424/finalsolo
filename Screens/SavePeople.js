import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
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
import { useDispatch, useSelector } from 'react-redux'
import { removeToSave } from '../slices/userSlice'

const SavePeople = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [people, setPeople] = useState([])

  const route = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  useEffect(() => {
    setPeople(route.params.savePeople)
    console.log('savePeoepl123', route.params.savePeople)
  }, [])

  const { savePeople, likedPeople, userId } = useSelector((state) => state.user)

  const deleteSaveProfile = async (selectedUserId) => {
    await axios
      .post(`${baseUrl}/api/user/delete-save-profile`, {
        userId,
        selectedUserId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert('성공', '삭제가 완료되었습니다. OK를 눌러주세요.', [
            {
              text: 'OK',
              onPress: () => {
                setPeople(people.filter((i) => i._id !== selectedUserId))
                dispatch(removeToSave(selectedUserId))
              },
            },
          ])
        }
      })
  }

  console.log('savePeople', people)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 5, marginLeft: 20, flexDirection: 'row' }}>
        <TouchableOpacity activeOpacity={0.8} style={{}}>
          <MaterialCommunityIcons
            name="arrow-left-circle"
            size={45}
            color="#581845"
            style={{ marginTop: 5 }}
            onPress={() => navigation.navigate('Profile')}
          />
        </TouchableOpacity>
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 10,
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
            내가 찜한 사람들!!
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View>
          <ActivityIndicator size={50} />
        </View>
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          <View style={{}}>
            {people?.map((i, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 1,
                  marginTop: 10,
                  backgroundColor: 'white',
                  borderRadius: 25,
                  //borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginLeft: 5,
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                      }}
                      source={{ uri: i.imageUrls[0] }}
                    />
                  </View>
                  <View style={{ marginLeft: 5, alignSelf: 'center' }}>
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        color: 'black',
                        fontSize: 20,
                      }}
                    >
                      {i.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        color: 'gray',
                        fontSize: 20,
                      }}
                    >
                      {i.region}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 4,
                    marginRight: 10,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ProfileDetail', {
                        userId: i._id,
                      })
                    }}
                    style={{ marginRight: 10 }}
                  >
                    <FontAwesome5 name="user-circle" size={30} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteSaveProfile(i._id)}>
                    <AntDesign name="closecircleo" size={30} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default SavePeople

const styles = StyleSheet.create({})
