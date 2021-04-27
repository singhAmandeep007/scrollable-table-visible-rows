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
  const bottomBar = useRef()

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
    let rect = topBar.current.getBoundingClientRect()
    console.log(rect, topBar.current)
    let el = document.getElementById("wrapper");
    let targets = [...document.getElementsByClassName("tableRow")];

    let callback = (entries, observer) => {

      entries.forEach(entry => {
        let doesOverlap = entry.boundingClientRect.y <= topBar.bottom;
        if (doesOverlap) {
          // let background = entry.target.style.background;
          // setColor(background);
          console.log(entry.target.dataset.id)
        }
      });
    };

    let observer = new IntersectionObserver(callback, {
      root: el,
      // threshold: [0, 0.1, 0.95, 1]
      threshold: [0]
    });

    targets.forEach(target => observer.observe(target));

    return () => {
      if (state.students.length === 0) return
      targets.forEach(target => observer.unobserve(target));
    };
  }, [state.students])

  function handleIntersection(index) {
    setState({
      ...state,
      bottomRow: index
    })
  }

  function renderTableRows() {
    return state.students.map((student, index) => {
      return <TableRow
        firstname={student.firstname}
        lastname={student.lastname}
        email={student.email}
        gender={student.gender}
        id={index}
        key={student.email}
        handleIntersection={(index) => handleIntersection(index)}
      // topBar={topBar}
      // bottomBar={bottomBar}
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
        Top Row : {state.topRow} Bottom Row: {state.bottomRow}
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
      <div
        className="stickyBottom"
        ref={bottomBar}
      >
        Top Row : {state.topRow} Bottom Row: {state.bottomRow}
      </div>
    </div>
  );
}

export default App;
