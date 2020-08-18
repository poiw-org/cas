import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Logo from '../components/logo'
import { Component } from "react"
import axios from "axios";
import Head from 'next/head'
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'

class Login extends Component {

    static getInitialProps({ query: { service } }){
        return { service: unescape(service) || false}
    }

    constructor(props) {
        super(props)

        this.state = {
            email: "kiagias@protonmail.com",
            emailValidation: {tried: false, emailExists: false},
            password: "",
            message: {text:'', variant:'danger'},
            processing: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }

    async handleSubmit(event) {
        this.setState({
            processing: true,
            message: {text:""}
        })
        event.preventDefault()
        const email = this.state.email;
        const password = this.state.password;
        const service = this.state.service;
        const url = this.props.apiUrl;

        if(email && !password){
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
                    email: email,
                    password: password,
                    service
                })
            ticket = data.ticket || false
            }catch(e){
                this.setState({
                    message: {
                        text: "Λάθος κωδικός πρόσβασης",
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
                console.log(ticket)
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
                            <Button className="btn" variant="primary" type="submit">
                                Επόμενο
                            </Button>                   
                        </div>
                        <div className="col-12">
                            <p style={{marginTop: 120 + 'px'}}>
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
                            <Button className="btn" variant="primary" type="submit">
                                Είσοδος 
                            </Button>                   
                        </div>
                        <div className="col-12">
                            <p style={{marginTop: 120 + 'px'}}>
                                <u><b>Ξεχάσατε τον κωδικό πρόσβασης;</b></u><br/>Το σύστημα επαναφοράς κωδικού είναι ακόμη υπό ανάπτυξη. Παρακαλούμε επικοινωνίστε με την ομάδα.
                            </p>
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