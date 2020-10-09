import karavaki from "./_lib/karavaki"

module.exports = async ({query},res) => {
    if(!query.t) res.status(401).send("No token provided.")

    karavaki()
        .then(async db=>{
            let user = await db.collection("pendingRegistrations").findOne({registrationToken: query.t})

            if(!user){
                res.status(401).send("Ο σύνδεσμός έχει ήδη χρησιμοποιηθεί, έχει λήξει ή δεν αντιστοιχεί σε κάποιο χρήστη.")
                return
            }

            delete user.registrationToken
            delete user._id

            await db.collection("pendingRegistrations").deleteMany({email: user.email})
            await db.collection("users").insertOne(user)

            res.redirect("../../success")
        })

}
