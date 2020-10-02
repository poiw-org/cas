import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Logo from '../components/logo'
import { Component } from "react"
import axios from "axios";
import Head from 'next/head'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Router from 'next/router'

class Login extends Component {

    static getInitialProps({ query: { service } }){
        return { 
            service: unescape(service) || false
        }
    }
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            emailValidation: {tried: false, emailExists: false},
            password: "",
            message: {text:'', variant:'danger'},
            processing: false,
            fullName: "",
            phone: "",
            service: props.service,
            schools:[
                "Ανωτάτη Σχολή Καλών Τεχνών (Α.Σ.Κ.Τ.)",
                "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης (Α.Π.Θ.)",
                "Διεθνές Πανεπιστήμιο Ελλάδος",
                "Εθνικό Μετσόβιο Πολυτεχνείο (Ε.Μ.Π.)",
                "Ελληνικό Μεσογειακό Πανεπιστήμιο (ΕΛ.ΜΕ.ΠΑ.)",
                "Γεωπονικό Πανεπιστήμιο Αθηνών (Γ.Π.Α.)",
                "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών (Ε.Κ.Π.Α.)",
                "Πανεπιστήμιο Δυτικής Αττικής (ΠΑ.Δ.Α.)",
                "Πανεπιστήμιο Πατρών",
                "Πανεπιστήμιο Κρήτης",
                "Πολυτεχνείο Κρήτης",
                "Πανεπιστήμιο Ιωαννίνων",
                "Δημοκρίτειο Πανεπιστήμιο Θράκης (Δ.Π.Θ.)",
                "Πανεπιστήμιο Θεσσαλίας",
                "Οικονομικό Πανεπιστήμιο Αθηνών (Ο.Π.Α.)",
                "Πάντειο Πανεπιστήμιο Κοινωνικών και Πολιτικών Επιστημών",
                "Πανεπιστήμιο Πειραιώς (ΠΑ.ΠΕΙ.)",
                "Πανεπιστήμιο Μακεδονίας (ΠΑ.ΜΑΚ.)",
                "Πανεπιστήμιο Δυτικής Μακεδονίας",
                "Πανεπιστήμιο Πελοποννήσου (ΠΑ.ΠΕΛ.)",
                "Πανεπιστήμιο Αιγαίου",
                "Ιόνιο Πανεπιστήμιο",
                "Χαροκόπειο Πανεπιστήμιο",
                "Ελληνικό Ανοικτό Πανεπιστήμιο (Ε.Α.Π.)",
                "Ανώτατη Σχολή Παιδαγωγικής και Τεχνολογικής Εκπαίδευσης (Α.Σ.ΠΑΙ.Τ.Ε.)",
                "Δευτεροβάθμια Εκπαίδευση (Γυμνάσιο/Λύκειο)",
                "ΙΕΚ",
                "Δεν φοιτώ σε κανένα ίδρυμα αυτήν τη στιγμή"
            ],
            school: "Ελληνικό Μεσογειακό Πανεπιστήμιο (ΕΛ.ΜΕ.ΠΑ.)",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    handleChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }

    async resetPassword(event){    
        event.preventDefault()    
        this.setState({
            processing: true,
            message: {text:""}
        })

        let {email} = this.state
        await axios.post('../../api/resetPassword',{
            email
        })
        
        this.setState({
            processing:false,
            message:{
                text: "Έχουμε στείλει ένα link επαναφοράς κωδικού στο mail σου. Αφού τελειώσεις την διαδικασία σε άλλο παράθυρο, επέστρεψε εδώ.",
                variant: "success"
            }
        })
    }

    async handleSubmit(event) {
        this.setState({
            processing: true,
            message: {text:""}
        })
        event.preventDefault()
        const {email, password, service, fullName, phone, school, emailValidation} = this.state;
        const url = this.props.apiUrl;

        if(emailValidation.tried && !emailValidation.emailExists){
            let self = this 

            self.setState({
                processing: true
            })

            await axios.post('../../api/register',{
                email,
                fullName,
                phone,
                school,
                password
            }).then(({body})=>{
                self.setState({
                    message: {
                        text: `Σούπερ! Σου έχουμε στείλει ένα email που περιέχει ένα σύνδεσμο ενεργοποίησης λογαριασμού. Μόλις ολοκληρώσεις την διαδικασία, δοκίμασε να συνδεθείς πάλι σε αυτό το παράθυρο.`,
                        variant: "success"
                    }
                })

                self.setState({
                    processing: false,
                    emailValidation:{
                        tried: false,
                        emailExists: false
                    },
                    password: ""
                })

            })
        }
        else if(email && !password){
            let {data:{emailExists}} = await axios
                .post('../../api/emailExists',{
                    email: email
                })
            console.log(emailExists)
            this.setState({
                emailValidation:{
                    tried: true,
                    emailExists: emailExists
                }
            })

        }else if(email && password){
            let ticket
            try{
            const {data} = await axios
                .post('../../api/login',{
                    email,
                    password,
                    service
                })
            ticket = data.ticket || false
            }catch(e){
                this.setState({
                    message: {
                        text: "Λάθος κωδικός πρόσβασης ή μη επιτρεπτή χρήση (401).",
                        variant: "danger"
                    }
                })
            }
            if(ticket){
                this.setState({
                    message: {
                        text: `Επιτυχής είσοδος! Ανακατεύθυνση σε ${this.props.service}...`,
                        variant: "success"
                    }
                })
                
                Router.push(`${service}?ticket=${ticket}`)
            }


        }

        this.setState({
            processing: false
        })
    }

    render() {
        let error
        if(!this.props.service) error = "GET parameter \"service\" is empty."
        
        if(error) return(
            <div className="container p-4">
                <h1>Σφάλμα:</h1>
                <h3>{error}</h3>
                <Logo></Logo>
            </div>
        )

        return(
            <div>
                {this.state.message.text ? (
                    <Alert variant={this.state.message.variant} style={{borderRadius: 0}}>
                        {this.state.message.text}
                    </Alert>
                ):false}

                {this.state.processing ? (
                    <ProgressBar animated now={100} style={{borderRadius: 0}}/>
                ):false} 

                <div className="container">
                    <Head>
                        <title>po/iw CAS</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    </Head>
                        
                    { !this.state.emailValidation.tried ? (
                    <Form className="login email row" onSubmit={this.handleSubmit} >
                        <p className="col-9"><i className="fas fa-lock"></i> Καλωσήρθατε στο κεντρικό σύστημα ταυτοποίησης (CAS) του po/iw.</p>
                        <div className="col-12 col-md-8">
                            <Form.Group>
                                <Form.Control type="email" value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder="Διεύθυνση Email" required/>
                            </Form.Group>
                        </div>
                        <div className="col-12 col-md-4">
                            {!this.state.processing ? (
                                <Button className="btn" variant="primary" type="submit">
                                    Επόμενο
                                </Button>  
                            ):false}              
                        </div>
                        <div className="col-12">
                            <p style={{marginTop: 40 + 'px'}}>
                                <u><b>Εισάγετε το email σας και πατήστε επόμενο.</b></u><br/>Αν δεν έχετε λογαριασμό στο po/iw, τότε θα σας ζητηθεί να δημιουργήσετε έναν καινούριο.
                            </p>
                        </div>
                    </Form>
                    ):false}

                    { this.state.emailValidation.tried && this.state.emailValidation.emailExists ? (
                    <Form className="login password row" onSubmit={this.handleSubmit}>
                        <p className="col-9"><i className="fas fa-lock"></i> Εισάγετε τον κωδικό πρόσβασής σας στο po/iw.</p>
                        <div className="col-12 col-md-8">
                            <Form.Group>
                                <Form.Control type="password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} placeholder="Κωδικός Πρόσβασης" required/>
                            </Form.Group>
                        </div>
                        <div className="col-12 col-md-4">
                            {!this.state.processing ? (
                                <Button className="btn" variant="primary" type="submit">
                                    Είσοδος
                                </Button>  
                            ):false}                    
                        </div>
                        <div className="col-12"> 
                            <p style={{marginTop: 40 + 'px'}}>
                                <u><b>Ξεχάσατε τον κωδικό πρόσβασης;</b></u> <a href="#" onClick={this.resetPassword}>Επαναφορά κωδικού πρόσβασης</a>
                            </p>
                        </div>
                    </Form>
                    ):false}

                    { this.state.emailValidation.tried && !this.state.emailValidation.emailExists ? (
                        <Form className="register row" onSubmit={this.handleSubmit}>
                            <p className="col-9"><i className="fas fa-lock"></i> Τρομερό! Φαίνεται ότι δεν είσαι μέλος στο po/iw! <b>Φτιάξε έναν λογαριασμό εδώ:</b></p>
                            <div className="col-12">
                                <Form.Group className="row">
                                    <Form.Control type="text" className="col-12 col-md-6" value={this.state.fullName} onChange={this.handleChange.bind(this, 'fullName')} placeholder="Ονοματεπώνυμο" required/>
                                    <Form.Control type="text" className="col-12 col-md-6" value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder="Τηλ. Επικοινωνίας" required/>
                                    <Form.Control type="text" className="col-12 col-md-6" value={this.state.phone} onChange={this.handleChange.bind(this, 'phone')} placeholder="Τηλ. Επικοινωνίας" required/>
                                    <Form.Control type="password" className="col-12 col-md-6" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} placeholder="Κωδικός πρόσβασης" required/>
                                    <label className="col-12 p-2">Ίδρυμα φοίτησης:</label>
                                    <Form.Control as="select" size="md" value={this.state.school} className="col-12 col-md-8 schoolSelector" onChange={this.handleChange.bind(this, 'school')}>
                                        {this.state.schools.map(school=>{
                                            return(
                                                <option>{school}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Button className="btn register" variant="primary" type="submit">
                                    Εγγραφή 
                                </Button>                   
                            </div>
                        </Form>
                    ):false}
                    <Logo></Logo>
                </div>
            </div>
        )
  }
}
  
export default Login;