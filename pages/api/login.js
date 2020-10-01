const karavaki = require('./_lib/karavaki')
const sha256 = require('crypto-js/sha256')
var chance = require('chance')
chance = new chance()

module.exports = (req, res) => {
    if (req.method != 'POST') res.redirect(`../../login${req.query.service != null ? '?service='+escape(req.query.service) : ""}`)

    karavaki()
        .then(db => {
            let {
                email,
                password,
                service
            } = req.body

            if (!email || !service) {
                res.status(400).json({
                    message: "Insufficient amount of data given."
                })
            }

            if (password) {
                password = sha256(password).toString()

                db.collection("users").find({
                    email,
                    password
                }).toArray(async (err, user) => {
                    if (user.length > 0) {
                        let ticket = "ST-2156453-"+chance.string({
                            length: 20,
                            alpha: true,
                            numeric: true
                        })

                        await db.collection("tickets").insert({
                            ticket,
                            email,
                            service
                        })

                        res.json({
                            ticket: ticket
                        })
                    } else {
                        res.status(400).json({
                            message: 'Email or password incorrect.'
                        })
                    }
                })
            } else {
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