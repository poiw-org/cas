import Logo from '../../components/logo'

function success() {
    return (
        <div className="container login">
            <h3>😁 Γειά χαρά!</h3>
            <p>Χαιρόμαστε πολύ που σκέφτεσαι να μπεις στη κοινότητα του po/iw! Η διαδικασία είναι πολύ απλή και εννοείται μη δεσμευτική. <br/><br/>Ο λογαριασμός μέλους του po/iw θα σου χρειαστεί αν θες να χρησιμοποιήσεις ορισμένα πρότζεκτ ή δυνατότητες και είναι απολύτως <b>προαιρετικός</b>! Παρ'όλα αυτά, τον τηρούμε με απόλυτη προσοχή και τον χρησιμοποιούμε σαν "καταστατικό¨ της κοινότητας/διαχειριστικής ομάδας. Σχετικά με τα δεδομένα σου:</p>
            <ul>
                <li>Αποθηκεύονται με μεγάλη προσοχή σε σέρβερ του po/iw</li>
                <li>Οι κωδικοί σου περνάνε μέσα από μια μη αντιστρέψιμη διαδικασία κρυπτογράφησης πριν αποθηκευτούν ή επεξεργαστούν απο το σύστημα. <b>Με λίγα λόγια, δεν μπορούμε ποτέ να διαβάσουμε τον κωδικό σου!</b></li>
                <li>Θα σου ζητηθεί ένα τηλέφωνο επικοινωνίας στην εγγραφή. Αυτό είναι μόνο για πρακτικούς λόγους σε περίπτωση που θέλουμε να επικοινωνήσουμε για κάτι μαζί σου (όχι σπαμ!). <b>Αν δεν είσαι άνετος να υποβάλεις τέτοια πληροφορία, συμπλήρωσε τη φόρμα με μηδενικά.</b></li>
                <li><b>Όλος ο κώδικας που τρέχουμε είναι ανοικτός για ανάγνωση από όλους στο Github, διασφαλίζοντας έτσι την ακεραιότητα του λογισμικού.</b></li>
            </ul>
            <a href="../login?service=https://auth.poiw.org/successful-activation"><button className="btn" variant="primary" style={{color: "#fff"}}>👍 Τέλεια, θέλω να γίνω μέλος!</button></a>
            <Logo></Logo>
        </div>
        
    )
}
  
  export default success

  