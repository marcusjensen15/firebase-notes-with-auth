import React from 'react';
import './styles.css'



export default function InstructionsComponent(){



  return(
  <>
    <h2 className="instructionTitle"> Welcome to NimbleNote!</h2>
    <ul>
      <li>Click "New Note" to create a new note</li>
      <li>To edit a note, click on the note title in the left hand column. You can edit the title of the note and the body of the note by modifying the presented text</li>
      <li>NimbleNote Automatically saves your work after you stop typing for 1.5 seconds. There is no 'save' button.</li>
      <li>By clicking the trash can, you will delete your note.</li>
    </ul>
    <h2>Enjoy!</h2>
  </>
  )
}
