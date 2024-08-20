import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { FontAwesome } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { useIAP } from 'react-native-iap'

//heart10, heart25, heart40
const ChargeHeart = () => {
  const route = useRoute()

  const {
    connected,
    products,
    currentPurchase,
    currentPurchaseError,
    finishTransaction,
    getProducts,
    requestPurchase,
  } = useIAP()

  const { userId, user } = useSelector((state) => state.user)

  const [price, setPrice] = useState('')
  const [count, setCount] = useState('')
  const [userData, setUserData] = useState()
  const [chargeModal, setChargeModal] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    if (!connected || products.length > 0) return
    getProducts({
      skus: ['heart10', 'heart25', 'heart40'],
    }).catch((e) => {
      console.log(e)
    })
  }, [connected, products.length, getProducts])

  useEffect(() => {
    setUserData(user)
  }, [user])

  const fetchUser = async () => {
    await axios
      .post(`${baseUrl}/api/user/user-profile`, { userId: user._id })
      .then((res) => {
        setUserData(res.data.user)
      })
      .catch((err) => console.log('profile Error', err))
  }

  const updateHeartCount = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-heartCount`, {
        userId: user._id,
        count,
      })
      .then((res) => {
        if (res.data.status == true) {
          Alert.alert('성공', '하트갯수가 성공적으로 업데이트 되었습니다')

          fetchUser()
          navigation.navigate('Profile')
        }
      })
      .catch((err) => console.log('heart count update Errro', err))
  }

  console.log('user', count, price)

  const onSuccess = async (purchase) => {
    try {
      const count = Number(purchase.productId.split('heart')[1])
      await axios
        .put(`${baseUrl}/api/user/update-heartCount`, {
          userId: user._id,
          count,
        })
        .then((res) => {
          if (res.data.status == true) {
            Alert.alert('성공', '하트갯수가 성공적으로 업데이트 되었습니다')

            fetchUser()
            navigation.navigate('Profile')
          }
        })
        .catch((err) => console.log('heart count update Errro', err))
      await finishTransaction({ purchase, isConsumable: true })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!currentPurchase) return
    onSuccess(currentPurchase)
  }, [currentPurchase, onSuccess])

  useEffect(() => {
    console.log(currentPurchaseError)
    if (!currentPurchaseError) return
    if (currentPurchaseError.code === ErrorCode.E_USER_CANCELLED) return
    Alert.alert(currentPurchaseError.name, currentPurchaseError.message)
  }, [currentPurchaseError])

  return (
    <SafeAreaView
      style={{ backgroundColor: 'white', flex: 1, alignItems: 'center' }}
    >
      <View>
        <View
          style={{
            marginHorizontal: 20,
            borderBottomWidth: 1,
            paddingVertical: 5,
            marginTop: 20,
            borderBottomColor: 'gray',
          }}
        >
          <Text style={{ fontFamily: 'Se-Hwa', fontSize: 27 }}>
            <Text style={{ color: '#ff7e67' }}>{userData?.name}</Text>님의 남의
            하트갯수 :{' '}
            <Text style={{ color: '#ff7e67' }}>{userData?.heartCount}개</Text>
          </Text>
        </View>
        <View>
          <LottieView
            source={require('../assets/heart.json')}
            style={{
              height: 300,
              width: 200,
              alignSelf: 'center',
              marginTop: 2,
              //justifyContent: 'center',
            }}
            autoPlay
            loop={true}
            speed={1}
          />
        </View>
        <View style={{ marginTop: -60 }}>
          <Text style={{ fontFamily: 'Se-Hwa', fontSize: 25, color: 'gray' }}>
            결제할 상품을 골라 주세요.
          </Text>
        </View>
        <View>
          {products.map((product) => (
            <TouchableOpacity
              key={product.productId}
              onPress={async () => {
                try {
                  await requestPurchase({
                    sku: product.productId,
                    skus: [product.productId],
                    andDangerouslyFinishTransactionAutomaticallyIOS: false,
                  })
                } catch (error) {
                  console.log(error)
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                borderWidth: 1,
                borderColor: 'gray',
                marginTop: 30,
                paddingVertical: 10,
                borderRadius: 15,
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <AntDesign name="hearto" size={30} color={'gray'} />
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 20,
                  }}
                >
                  {' '}
                  X {Number(product.productId.split('heart')[1])}개
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 20,
                  }}
                >
                  {product.localizedPrice}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ChargeHeart

const styles = StyleSheet.create({})
