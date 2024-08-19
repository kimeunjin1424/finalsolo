import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {},
  token: '',
  userId: {},
  token: {},
  users: [],
  likedPeople: '',
  savePeople: '',
  heartCount: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToUser: (state, action) => {
      state.user = action.payload
    },
    addToUserId: (state, action) => {
      state.userId = action.payload
    },
    addToToken: (state, action) => {
      state.token = action.payload
    },
    addToUsers: (state, action) => {
      state.users = action.payload
    },
    addToLike: (state, action) => {
      if (state.likedPeople.includes(action.payload)) {
        return
      } else {
        state.likedPeople = [...state.likedPeople, action.payload]
      }
    },
    removeToLike: (state, action) => {
      state.likedPeople = state.likedPeople.filter((i) => i !== action.payload)
    },
    addToSave: (state, action) => {
      if (state.savePeople.includes(action.payload)) {
        return
      } else {
        state.savePeople = [...state.savePeople, action.payload]
      }
    },
    removeToSave: (state, action) => {
      if (state.savePeople.includes(action.payload)) {
        state.savePeople = state.savePeople.filter((i) => i !== action.payload)
      } else {
        return
      }
    },
    tinderCard: (state, action) => {
      state.users = [...state.users, action.payload]
    },
    removeToken: (state, action) => {
      state.token = ''
    },
    removeFromBasket: (state, action) => {
      let newBasket = [...state.items]
      let itemIndex = state.items.findIndex(
        (item) => item.id == action.payload.id
      )
      console.log('itemIndex', itemIndex)
      if (itemIndex >= 0) {
        newBasket.splice(itemIndex, 1)
      } else {
        console.log('Could not remove item')
      }
      state.items = newBasket
    },
    emptyBasket: (state, action) => {
      state.items = []
    },
  },
})

export const {
  addToToken,
  addToUserId,
  addToUser,
  addToUsers,
  tinderCard,
  addToLike,
  addToSave,
  removeToken,
  removeToLike,
  removeToSave,
} = userSlice.actions

export const selectBasketItems = (state) => state.basket.items

export const selectBasketItemsById = (state, id) =>
  state.basket.items.filter((item) => item.id == id)

export const selectBasketTotal = (state) =>
  state.basket.items.reduce((total, item) => (total = total += item.price), 0)

export default userSlice.reducer
