const karavaki = require('./_lib/karavaki')
const sha256 = require('crypto-js/sha256')
var chance = require('chance')
chance = new chance()

module.exports = (req,res) =>{
    if(req.method != 'POST') res.status(400).json({
        message: 'This endpoint receives only POST requests.'
    })

    karavaki()
        .then(db=>{
            if(!req.body.email){
                res.status(400).json({
                    message: "No email was supplied."
                })
            }

            let email = req.body.email

            if(req.body.password){
                let password = req.body.password
                password = sha256(sha256(password.length) + password + sha256(email)).toString()
                
                db.collection("users").find({email: email, password: password}).toArray(async (err,user)=>{
                    if(user.length > 0){
                        let ticket = chance.string({ length: 128,  alpha: true, numeric: true })

                        await db.collection("tickets").insert({
                            ticket: ticket,
                            email: email
                        })

                        res.json({
                            ticket: ticket
                        })
                    }else{
                        res.status(400).json({
                            message: 'Email or password incorrect.'
                        })
                    }
                })
            }
        })
        .catch(e=>{
            console.log(e)
            res.status(500)
        })
}