import React, { useState, useEffect, useCallback, useRef } from 'react';
import TableRow from './TableRow';
import './App.css';

function App() {

  const [state, setState] = useState({
    students: [],
    topRow: 0,
    bottomRow: 20,
    currentQuantity: 50,
    isFetching: false
  });

  const tblCont = useRef(null);

  const fetchData = useCallback(async () => {
    setTimeout(async () => {
      const result = await fetch(`https://fakerapi.it/api/v1/persons?_quantity=${state.currentQuantity + 50}`);
      const data = await result.json();
      setState((state) => {
        return {
          ...state,
          students: [...data.data]
        }
      });
    }, 1000);
  }, [state.currentQuantity]);

  useEffect(() => {
    fetchData();
  }, [fetchData])


  const handleScroll = () => {
    // scroll Top Get the number of pixels the content of a <div> element is scrolled vertically:
    console.log('scrolltop', tblCont.current.scrollTop)
    console.log('clientHeight', tblCont.current.clientHeight)
    console.log('offsetHeight', tblCont.current.offsetHeight)
    console.log('scrollHeight', tblCont.current.scrollHeight)
    console.log('to compare', Math.ceil(tblCont.current.offsetHeight + tblCont.current.scrollTop))

    if (
      Math.ceil(tblCont.current.offsetHeight + tblCont.current.scrollTop) - 2 !== tblCont.current.scrollHeight || state.isFetching
    )
      return;
    setState({
      ...state,
      isFetching: true
    });
    console.log('handling scroll')
  };

  // get more data and set fetching to false
  const fetchMoreStudents = useCallback(() => {
    fetchData();
    setState((state) => {
      return {
        ...state,
        currentQuantity: state.currentQuantity + 50,
        isFetching: false
      }
    });
  }, [fetchData]);


  // only when isFetching is changed useEffect is called
  useEffect(() => {
    if (!state.isFetching) return;
    fetchMoreStudents();
  }, [state.isFetching, fetchMoreStudents]);


  // generate table rows
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
    <div className="App">
      <div className="sidebar">
        TR : {state.topRow} BR: {state.bottomRow} Page: {state.currentQuantity}
      </div>
      <div className="tableContainer">
        <div className="innerContainer">
          <div className="centeredContent" onScroll={() => handleScroll()} ref={tblCont}>
            <table style={{ scrollBehavior: "smooth" }} >
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
        </div>
      </div>
    </div>
  );
}

export default App;
