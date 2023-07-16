if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const Restaurant = require('../restaurant') // 載入 restaurant model
const restaurantSeed = require('../../restaurant.json')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const SEED_USERS = [{
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678' // 擁有 #1, #2, #3 號餐廳
}, {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678' // 擁有 #4, #5, #6 號餐廳

}]

db.once('open', () => {
    console.log('mongodb connected!')
    SEED_USERS.forEach(SEED_USER => {
        bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(SEED_USER.password, salt))
            .then(hash => User.create({
                name: SEED_USER.name,
                email: SEED_USER.email,
                password: hash
            }))
            .then(user => {
                const userId = user._id
                if (SEED_USER.name === 'user1') {
                    const restaurantList = restaurantSeed.results.slice(0, 3)
                    return Promise.all(
                        restaurantList.forEach(restaurant => {
                            restaurant["userId"] = userId
                            Restaurant.create(restaurant)
                        })
                    )
                } else {
                    const restaurantList = restaurantSeed.results.slice(3, 6)
                    return Promise.all(
                        restaurantList.forEach(restaurant => {
                            restaurant["userId"] = userId
                            Restaurant.create(restaurant)
                        })
                    )
                }

            })
            .then(() => {
                console.log('done.')
                process.exit()
            })
    })
})