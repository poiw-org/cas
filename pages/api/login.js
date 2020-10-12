const karavaki = require('./_lib/karavaki')
const sha256 = require('crypto-js/sha256')
var chance = require('chance')
chance = new chance()
import captcha from './_lib/recaptcha'
import {send} from "./_lib/email"


module.exports = (req, res) => {
    if (req.method != 'POST') res.redirect(`../../login${req.query.service != null ? '?service='+escape(req.query.service) : ""}`)
    console.log(req.body)
    karavaki()
        .then(async db => {
            let {
                email,
                password,
                service,
                recaptcha,
                twofactor
            } = req.body

            if (!email || !service) {
                res.status(400).json({
                    message: "Insufficient amount of data given."
                })
            }
            if (twofactor) {
                console.log(twofactor)
                await captcha
                    .validate(recaptcha)
                    .catch(e=>res.status(400).send('Recaptcha verification failed'))

                password = sha256(password).toString()

                let user = await db.collection("users").findOne({ email, password })

                let unfinished_ticket = await db.collection("tickets").findOne({ email, twofactor})

                if (unfinished_ticket){
                    let ticket = 
                    `ST-${chance.string({
                        length: 7,
                        numeric: true
                    })}-${chance.string({
                        length: 20,
                        alpha: true,
                        numeric: true
                    })}`

                    await db.collection("users").updateOne(
                        {email: user.email},
                        {$set: {
                                passwordResetToken: ""
                            }
                        }, 
                    )


                    await db.collection("tickets").updateOne(
                        {_id: unfinished_ticket._id},
                        {$set: {
                                ticket,
                                twofactor: ""
                            }
                        }, 
                    )

                    send({
                        text: `Νέα είσοδος από IP ${req.headers['x-forwarded-for']} στην υπηρεσία ${service}. Αν δεν ήσουν εσύ, άλλαξε κωδικό άμεσα και ενημέρωσε την ομάδα!`,
                        email,
                        subject: "Νέα είσοδος μέσω του po/iw CAS"
                    })

                    res.json({
                        ticket: ticket
                    })
                } else {
                    await db.collection("tickets").deleteMany({
                        email
                    })

                    res.status(400).json({
                        message: 'Email, password or 2Factor code incorrect.'
                    })
                }
            } 
            if(password){
                await captcha
                .validate(recaptcha)
                .catch(e=>res.status(400).send('Recaptcha verification failed'))

                let twofactor = chance.string({
                    length: 5,
                    numeric: true
                })

                await db.collection("tickets").deleteMany({
                    email
                })

                await db.collection("tickets").insertOne({
                    createdAt: new Date(),
                    email,
                    twofactor,
                    service
                })

                send({
                    text: `Ο κωδικός επαλήθευσης για την είσοδό σου μέσω του po/iw CAS είναι: ${twofactor}`,
                    email,
                    subject: "Κωδικός επαλήθευσης"
                })

                res.json({
                    requiresTwoFactor: true
                })
            }
            else {
                res.status(400).json({
                    message: 'No authentication method available.'
                })
            }
        })
        .catch(e => {
            console.log(e)
            res.status(500)
        })
}