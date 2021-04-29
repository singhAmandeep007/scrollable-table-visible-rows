import React, { useState, useEffect, useRef } from 'react';
import TableRow from './TableRow';
import './App.css';

function App() {

  const [state, setState] = useState({
    students: [],
    topVisibleRow: 1,
    bottomVisibleRow: null,
    currentQuantity: 0,
    tableRowHeight: null,
    rowsPerTableView: null,
    isFetching: false
  });

  const tableContainer = useRef(null);
  const tableHeader = useRef(null);

  function fetchData(quantity) {
    return fetch(`https://fakerapi.it/api/v1/persons?_quantity=${quantity}`);
  }

  // get initial student data
  useEffect(() => {
    const initialiseApp = async () => {
      // console.log(internalTableHeight, tableRowHeight)
      setState((state) => {
        return {
          ...state,
          isFetching: true
        }
      })
      fetchData(100).then(response => response.json()).then(data => {
        setState((state) => {
          return {
            ...state,
            students: [...data.data],
            isFetching: false,
            currentQuantity: 100
          }
        })
      }
      ).then(() => {
        const tableRowHeight = document.querySelector('.tableRow')?.offsetHeight; // 23
        const internalTableHeight = tableContainer.current?.offsetHeight - 2; // 485-2 (border)
        let rowsPerTableView = Math.floor(internalTableHeight / tableRowHeight) - 1; // 21
        setState((state) => {
          return {
            ...state,
            tableRowHeight,// 23
            bottomVisibleRow: rowsPerTableView - 1,// excluding heading -> 20 (initial)
            rowsPerTableView // 21
          }
        })
      })
    }
    initialiseApp();
  }, [])

  let scrollStopTimer = -1;
  const handleScroll = async () => {
    // TERM: scrollTop -> Get the number of pixels the content of a <div> element is scrolled vertically
    // TERM: clientHeight ->returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin
    // TERM: offsetHeight -> is a measurement which includes the element borders, the element vertical padding, the element horizontal scrollbar (if present, if rendered) and the element CSS height.
    // TERM: scrollHeight -> is a measurement of the height of an element's content INCLUDING content not visible on the screen due to overflow
    //console.log(Math.ceil(tblCont.offsetHeight + tblCont.scrollTop) - 2, tblCont.scrollHeight)
    // console.log('compare', tblCont.scrollHeight * 0.65, tblCont.scrollTop, tblCont.scrollHeight)
    // console.log('bool', tblCont.scrollHeight * 0.65 <= tblCont.scrollTop && tblCont.scrollTop <= tblCont.scrollHeight)
    //if (Math.ceil(tblCont.offsetHeight + tblCont.scrollTop) - 2 === tblCont.scrollHeight && !state.isFetching) {

    if (scrollStopTimer !== -1) {
      clearTimeout(scrollStopTimer);
    }

    scrollStopTimer = setTimeout(function () {
      let tblCont = tableContainer.current;
      if (tblCont.scrollHeight * 0.75 <= tblCont.scrollTop && tblCont.scrollTop <= tblCont.scrollHeight && !state.isFetching) {
        setState({
          ...state,
          isFetching: true
        });
        fetchData(state.currentQuantity + 100).then(response => response.json()).then(data => {
          setState((state) => {
            return {
              ...state,
              students: [...data.data],
              currentQuantity: state.currentQuantity + 100,
              isFetching: false
            }
          })
        })
      };
      // console.log('scrollTop', tableContainer.current.scrollTop, 'offsetHeight', tableContainer.current.offsetHeight)
      // TERM: topVisibleRow = pixels scrolled from top of table divided by the height of single row
      //console.log('scrollTop', tblCont.scrollTop);
      let topVisibleRow = Math.max(Math.floor(tblCont.scrollTop / state.tableRowHeight), 1); // scroll / 23
      // TERM:bottomVisibleRow = topVisibleRow + total no. of rows visible at a particular moment in table's viewport
      let bottomVisibleRow = Math.min(topVisibleRow + state.rowsPerTableView, state.students.length - 1);
      if (topVisibleRow !== state.topVisibleRow || bottomVisibleRow !== state.bottomVisibleRow) {
        setState({
          ...state,
          topVisibleRow,
          bottomVisibleRow
        })
      }
    }, 500)
  };

  // generate table rows
  function renderTableRows() {
    return state.students.map((student, index) => {
      return <TableRow
        firstname={student.firstname}
        lastname={student.lastname}
        email={student.email}
        gender={student.gender}
        id={index + 1}
        key={index}
      />
    })
  }

  if (state.students.length === 0) {
    return <div>loading...</div>
  }
  return (
    <div className="App">

      <div className="tableContainer">
        <div className="sidebar">
          TR : {state.topVisibleRow} BR: {state.bottomVisibleRow} Quantity: {state.currentQuantity}
        </div>
        <div className="innerContainer">

          <div className="centeredContent" onScroll={() => handleScroll()} ref={tableContainer}>
            <table id="studentTable" >
              <thead>
                <tr className="tableHeading" ref={tableHeader}>
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
