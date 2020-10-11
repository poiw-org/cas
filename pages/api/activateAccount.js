import karavaki from "./_lib/karavaki"

module.exports = async ({query},res) => {
    if(!query.t) res.status(401).send("No token provided.")

    karavaki()
        .then(async db=>{
            let user = await db.collection("pendingRegistrations").findOne({registrationToken: query.t})

            if(!user){
                res.redirect("../../failed-activation")
                return
            }

            delete user.registrationToken
            delete user._id

            await db.collection("pendingRegistrations").deleteMany({email: user.email})
            await db.collection("users").insertOne(user)

            res.redirect("../../successful-activation")
        })

}
