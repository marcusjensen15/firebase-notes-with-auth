import React from 'react';
import '../App.css';
import SidebarComponent from '../sidebar/sidebar';
import EditorComponent from '../editor/editor';
import { Button, withStyles } from '@material-ui/core';



const firebase = require('firebase');

//componentDidMount - executing all of the code within the function as the component mounts.
//firebase notes: collection is basically a table within a database.
//onSnapshot - automatically gets called every time the 'notes' collection is updated inside of firebase. The paramater (function) within on snapShot is what is called everytime 'notes' updates
//serverUpdate is what we are calling the parameter passed into onSnapshot. The serverUpdate object has a docs property.
// data() is a function that grabs the data from the doc.
//data['id'] -> adding the id property to our data object.

//Our selectNote/deleteNote will live at the app.js level. It is handy to keep all of the functions that interact with firebase in the same place.

//noteUpdate function is interacting with firebase. update is an out of the box firebase method (i believe).
//within noteUpdate, the: firebase.firestore.FieldValue.serverTimestamp() are all built in firebase methods.

class Dashboard extends React.Component {

//need logged in person email state var
//notes will be filtered by this logged in user. Only show that user's notes.

  constructor(){
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null,
      email: null

    };
  }

  render(){
    return(
      <div className="app-container">
        <button onClick={this.signOut} id="logoutButton"> Logout </button>
        <SidebarComponent
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}>
        </SidebarComponent>
        {
        this.state.selectedNote ?
        <EditorComponent
          selectedNote={this.state.selectedNote}
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          noteUpdate={this.noteUpdate}
          email={this.state.email}>
        </EditorComponent>
        :
        null
        }
      </div>);
  }

  // componentDidMount =() => {
  //   firebase.firestore().collection('notes').onSnapshot(serverUpdate => {
  //     const notes = serverUpdate.docs.map(_doc => {
  //       const data = _doc.data();
  //       data['id'] = _doc.id;
  //       return data;
  //     });
  //     console.log(notes);
  //     this.setState({ notes: notes});
  //   });
  // }

// flitering the notes by the user logged-in

//set email state needs to be before everything else. the bug is when I'm filtering the notes, it isn't letting me add new ones
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if(!_usr)
        this.props.history.push('/login');
      else {
      await this.setState({ email: _usr.email});
        firebase.firestore().collection('notes').onSnapshot(serverUpdate => {
            const notes = serverUpdate.docs.map(_doc => {

              const data = _doc.data();
              data['id'] = _doc.id;
              // console.log(data);
              return data;
            });


            const usersNotes = notes.filter(_note => _note.email === this.state.email);



            this.setState({ notes: usersNotes,
            email: _usr.email});



            // console.log(this.state.email);
            // console.log(usersNotes);
          });
      }
  });
}

//above from chat tutorial

selectNote = (note, index) => this.setState({ selectedNoteIndex: index, selectedNote: note});

noteUpdate = (id, noteObj) => {
  firebase
  .firestore()
  .collection('notes')
  .doc(id)
  .update({
    title: noteObj.title,
    body: noteObj.body,
    email: this.state.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
}

//signout from chat tutorial
signOut = () => firebase.auth().signOut();

//added email to .add method
newNote = async (title) => {
  const note = {
    title: title,
    body: ' '
  }
  const newFromDB = await firebase
    .firestore()
    .collection('notes')
    .add({
      title: note.title,
      body: note.body,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      email: this.state.email
    })
    const newID = newFromDB.id;
    await this.setState({notes: [...this.state.notes, note]});
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note => _note.id === newID)[0]);
    this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex});

    console.log(this.state.email)
}


deleteNote = async (note) =>{
  const noteIndex = this.state.notes.indexOf(note);
  await this.setState({notes: this.state.notes.filter(_note => _note !== note)});
  if(this.state.selectedNoteIndex === noteIndex){
    this.setState({ selectedNoteIndex: null, selectedNote: null});
  }

  //experimental conditionall right here. tyring to get note to not deselect if you delete another one.if you click one below it will de-select.

  else if(this.state.selectedNoteIndex !== noteIndex){
    if(this.state.notes === 0){
    this.setState({ selectedNoteIndex: null, selectedNote: null});
    }
  }

  //above is end of experimental conditional if deleted it will return to the same as origional master


  else{
    this.state.notes.length > 1 ?
    this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1)
    :
    this.setState({ selectedNoteIndex: null, selectedNote: null});
  }
  firebase
  .firestore()
  .collection('notes')
  .doc(note.id)
  .delete();

}

}

export default Dashboard;
