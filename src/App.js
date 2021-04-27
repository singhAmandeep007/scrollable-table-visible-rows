import React, { useState, useEffect, useRef } from 'react';
import TableRow from './TableRow';
import './App.css';

function App() {

  const [state, setState] = useState({
    students: [],
    topRow: 0,
    bottomRow: 10
  });

  const topBar = useRef();

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

  useEffect(() => {
    if (state.students.length === 0) return;

    let wrapper = document.getElementById("wrapper");
    let targets = [...document.getElementsByClassName("tableRow")];

    let callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let wrapperCords = wrapper.getBoundingClientRect();
          console.log('ENTRY', entry.boundingClientRect, entry.target)
          console.log('Wrapper', wrapperCords)
          console.log(entry.target.dataset.id)
          if (Math.round(entry.boundingClientRect.bottom) === Math.round(wrapperCords.bottom)) {
            setState((state) => {
              return {
                ...state,
                bottomRow: entry.target.dataset.id,
                topRow: state.topRow
              }
            })
          }

        }
      });
    };

    let observer = new IntersectionObserver(callback, {
      root: null,
      //threshold: [0, 0.1, 0.95, 1],
      threshold: [1],
      rootMargin: '0px'
    });

    targets.forEach(target => observer.observe(target));

    return () => {
      targets.forEach(target => observer.unobserve(target));
    };
  }, [state.students, state])

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
    <div className="App" id="wrapper">
      <div
        className="stickyTop"
        ref={topBar}
      >
        TR : {state.topRow} BR: {state.bottomRow}
      </div>
      <table>
        <tbody>
          <tr >
            <th key='SerialNum'>S.No.</th>
            <th key='firstname'>First Name</th>
            <th key='lastname'>Last Name</th>
            <th key='email'>Email</th>
            <th key='gender'>Gender</th>
          </tr>
          {renderTableRows()}
        </tbody>
      </table>
      {/* <div
        className="stickyBottom"
        ref={bottomBar}
      >
        Top Row : {state.topRow} Bottom Row: {state.bottomRow}
      </div> */}
    </div>
  );
}

export default App;
