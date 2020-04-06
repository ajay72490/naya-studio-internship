const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 6
    },
    registerAs: {
        type: String,
        required: true,
        enum: ["Designer", "Maker", "Both"]
    },
    maker: {
        capacity: {
            type: Number
        },
        material: [
            {
                type: String,
                enum: ["Wood", "Metal", "Glass", "Plastic", "Concrete", "Other"]
            }
        ],
        location: {
            type: String
        }
    },
    designer: {
        capacity: {
            type: Number
        },
        typeOfDesigner: {
            type: String,
            enum: ["Furniture Designer", "Architect", "Interior Designer", "Industrial Designer", "Designer Maker", "Other"]
        },
        training: {
            type: String
        }
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ],
    imgUrls: [
        {
            type: String
        }
    ]
})


//instance methods
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisasecretkey')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//mongoose middleware pre hook
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User