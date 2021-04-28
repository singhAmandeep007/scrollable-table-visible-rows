import React, { useState, useEffect } from 'react';
import TableRow from './TableRow';
import './App.css';

function App() {

  const [state, setState] = useState({
    students: [],
    topRow: 0,
    bottomRow: 10
  });

  useEffect(() => {
    fetch('https://fakerapi.it/api/v1/persons?_quantity=50').then(res => {
      return res.json()
    }).then((data) => {
      setState((state) => {
        return {
          ...state,
          students: data.data
        }
      });
    })
  }, [])

  function renderTableRows() {
    return state.students.map((student, index) => {
      return <TableRow
        firstname={student.firstname}
        lastname={student.lastname}
        email={student.email}
        gender={student.gender}
        id={index}
        key={student.email}
      />
    })
  }

  if (state.students.length === 0) {
    return <div>loading...</div>
  }
  return (
    <>
      <div
        className="sidebar"
      >
        TR : {state.topRow} BR: {state.bottomRow}
      </div>


      <div
        className="tableFixHead App"
        id="wrapper"
        onScroll={() => console.log('scroling')}
      >

        <table style={{ width: "100%", scrollBehavior: "smooth" }}>
          <thead>
            <tr className="tableRow">
              <th key='SerialNum'>S.No.</th>
              <th key='firstname'>First Name</th>
              <th key='lastname'>Last Name</th>
              <th key='email'>Email</th>
              <th key='gender'>Gender</th>
            </tr>
          </thead>

          <tbody>
            {renderTableRows()}
          </tbody>
        </table>

      </div>
    </>
  );
}

export default App;
