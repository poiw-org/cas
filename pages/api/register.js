import karavaki from "./_lib/karavaki"
import {send} from "./_lib/email"
const sha256 = require('crypto-js/sha256')
var chance = require('chance')
chance = new chance()

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = (req,res) => {
    karavaki()
        .then(async db=>{
            let {email, fullName, school, password} = req.body

            if(!email || !fullName || !school || !password) res.status(400).send('Missing required information.')
            
            if(!validateEmail(email)) res.status(400).send('Incorrect email format.')

            let emailExists = await db.collection('users').findOne({email})

            if(emailExists) res.status(400).send('User already exists.')

            password = sha256(password).toString()

            let registrationToken = chance.string({ length: 128,  alpha: true, numeric: true })

            let usernameIsAvailable = false
            let username
            while(!usernameIsAvailable){
                username = `poiw_${chance.string({ length: 12,  alpha: true, numeric: true })}`
                usernameIsAvailable = await db.collection("users").findOne({username})
                console.log(username,usernameIsAvailable)


                if(usernameIsAvailable == null) usernameIsAvailable = true
            }
            
            await db.collection("pendingRegistrations").insertOne({
                email,
                password,
                school,
                fullName,
                username,
                registrationToken
            })

            let activationLink = `${process.env.NODE_ENV == "development" ? "http://localhost:3000/api/activateAccount?t=" : "https://cas.poiw.org/api/activateAccount?t="}${registrationToken}`
            await send({
                email,
                fullName,
                subject: "Ενεργοποίηση λογαριασμού po/iw",
                text: `Καλωσήρθες στο po/iw! Για να ενεργοποιήσεις το account σου, πάτα αυτό το λίνκ: ${activationLink}.`,
                html: `Καλωσήρθες στο po/iw! Για να ενεργοποιήσεις το account σου, πάτα εδώ: <b><a href="${activationLink}">${activationLink}</a>.`
            })
            res.send('OK')
        })
}