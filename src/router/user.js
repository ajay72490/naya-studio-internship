const express = require('express')
const router = new express.Router()
const User = require("../models/user")
const auth = require("../middleware/auth")
const multer = require("multer")
const fs = require('fs')
const path = require('path')


router.post('/users', async (req, res) => {

    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


const storage = multer.diskStorage({
    destination: "images",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '.jpg')
      }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 2000000,
        files: 5
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|bmp)$/)) {
            cb(new Error("Please upload an image file"))
        }
        cb(undefined, true)
    }
})

router.post('/users/images', auth, upload.array('upload'), async (req, res) => {
    const user = req.user

    req.files.forEach(file => {
        user.imgUrls = user.imgUrls.concat(`localhost:3000/users/${user._id}/${file.filename}`)
    });

    await user.save()
    res.send()
}, (error, req, res, next) => {
    res.send({ error: error.message })
})

router.get('/users/:id/:filename', async (req, res) => {

    const filename = req.params.filename

    res.set('Content-Type', 'image/jpg')
    res.sendFile(path.join(__dirname, `../../images/${filename}`))
})

router.get('/users', auth, (req, res) => {
    res.send(req.user)
})

module.exports = router