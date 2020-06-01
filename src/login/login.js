import { Link } from 'react-router-dom';
import React from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Header from '../header/header';

const firebase = require("firebase");

class LoginComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      serverError: false
    };
  }

  render() {

    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <Header></Header>
        <CssBaseline/>
        <Paper className={classes.paper} id="logInFormContainer">
          <Typography component="h1" variant="h5">
            Log In!
          </Typography>
          <form onSubmit={(e) => this.submitLogin(e)} className={classes.form}>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='login-email-input'>Enter Your Email</InputLabel>
              <Input autoComplete='email' autoFocus onChange={(e) => this.userTyping('email', e)} id='login-email-input'></Input>
            </FormControl>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='login-password-input'>Enter Your Password</InputLabel>
              <Input autoComplete="current-password" type="password" onChange={(e) => this.userTyping('password', e)} id='login-password-input'></Input>
            </FormControl>
            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Log In</Button>
          </form>
          { this.state.serverError ?
            <Typography className={classes.errorText} component='h5' variant='h6'>
              Incorrect Login Information
            </Typography> :
            null
          }
          
          <Link className={classes.signUpLink} to='/signup'>Sign Up!</Link>
          <Link className={classes.signUpLink} to='https://marcus-notes.web.app'>Demo Version (no Sign Up required)</Link>
        </Paper>
      </main>
    );
  }


//added this to redirect to the dashboard if the user is already logged in. will do the same for signup.
//   componentDidMount = () => {
//     firebase.auth().onAuthStateChanged(async _usr => {
//       if(!_usr)
//         this.props.history.push('/login');
//       else {
//         this.props.history.push('/dashboard');
//
//       }
//   });
// }


  userTyping = (whichInput, event) => {
    switch (whichInput) {
      case 'email':
        this.setState({ email: event.target.value });
        break;

      case 'password':
        this.setState({ password: event.target.value });
        break;

      default:
        break;
    }
  }

  submitLogin = async (e) => {
    e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.

    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push('/dashboard');
      }, err => {
        this.setState({ serverError: true });
        console.log('Error logging in: ', err);
      });
  };

}

export default withStyles(styles)(LoginComponent);
