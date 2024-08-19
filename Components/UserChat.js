import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { baseUrl } from '../Utils/api'
import axios from 'axios'

const UserChat = ({ item, userId, fetchMatches }) => {
  const navigation = useNavigation()

  const endMatch = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/user/end-match`, {
          userId,
          selectedUserId: item._id,
        })
        .then((res) => fetchMatches())
        .catch((err) => console.log('end match error', err))
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  return (
    <Pressable
      onLongPress={() =>
        Alert.alert('매칭끊기', `${item.name}과의 대화를 종료하시겠습니까?`, [
          {
            text: '아니요',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: '네',
            onPress: () => {
              endMatch()
              console.log('cut matching')
            },
          },
        ])
      }
      onPress={() =>
        navigation.navigate('ChatRoom', {
          image: item?.imageUrls[0],
          name: item?.name,
          receviedId: item?._id,
        })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingVertical: 8,
      }}
    >
      <View>
        <Image
          style={{ width: 50, height: 50, borderRadius: 99 }}
          source={{ uri: item?.imageUrls[0] }}
        />
      </View>

      <View>
        <Text
          style={{
            fontFamily: 'Se-Hwa',
            fontSize: 25,
            color: 'gray',
          }}
        >
          {item?.name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontSize: 20,
            marginTop: 6,
            color: 'gray',
            fontFamily: 'Se-Hwa',
          }}
        >
          {`Start Chat with ${item?.name}`}
        </Text>
      </View>
    </Pressable>
  )
}

export default UserChat

const styles = StyleSheet.create({})
