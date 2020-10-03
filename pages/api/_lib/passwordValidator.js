
import axios from "axios"

module.exports = (password) => {
        return new Promise(async (resolve, reject)=>{
            let {data} = await axios.get("https://github.com/poiw-org/SecLists/raw/master/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt")

            if(data.includes(password)) reject("Ο κωδικός που επέλεξες έχει μπλοκαριστεί γιατί είναι αδύναμος. Προσπάθησε να βρείς έναν άλλο.")
            else if(password < 8) reject("Επέλεξε έναν κωδικό μεγαλύτερο από 8 χαρακτήρες")
            
            else resolve()
            
        })
}