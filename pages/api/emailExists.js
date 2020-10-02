const karavaki = require('./_lib/karavaki')

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

            let {email} = req.body

            db.collection("users").find({email: email}).toArray(async (err,user)=>{
                if(user.length > 0){
                    res.json({
                       emailExists: true 
                    })
                }else{
                    res.json({
                        emailExists: false 
                     })
                }
            })
        })
        .catch(e=>{
            console.log(e)
            res.status(500)
        })
}