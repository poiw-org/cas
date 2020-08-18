import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Logo from '../components/logo'

export default function Login(){
    
    return(
        <div className="container">
            <Form className="login row">
                <p className="col-9"><i className="fas fa-lock"></i> Καλωσήρθατε στο κεντρικό σύστημα ταυτοποίησης (CAS) του po/iw.</p>
                <div className="col-12 col-md-8">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Διεύθυνση Email" />
                    </Form.Group>
                </div>
                <div className="col-12 col-md-4">
                    <Button variant="primary" type="submit">
                        Επόμενο 
                    </Button>                   
                </div>
                <div className="col-12">
                    <p style={{marginTop: 120 + 'px'}}>
                        <u><b>Εισάγετε το email σας και πατήστε επόμενο.</b></u><br/>Αν δεν έχετε λογαριασμό στο po/iw, τότε θα σας ζητηθεί να δημιουργήσετε έναν καινούριο.
                    </p>
                </div>
            </Form>

            <Logo></Logo>
        </div>
    )
}