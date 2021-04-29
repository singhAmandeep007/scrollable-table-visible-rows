import React, { useState, useEffect, useRef } from 'react';
import TableRow from './TableRow';
import './App.css';

function App() {

  const [state, setState] = useState({
    students: [],
    topVisibleRow: 0,
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
      fetchData(50).then(response => response.json()).then(data => {
        setState((state) => {
          return {
            ...state,
            students: [...data.data],
            isFetching: false,
            currentQuantity: 50
          }
        })
      }
      ).then(() => {
        const tableRowHeight = document.querySelector('.tableHeading')?.offsetHeight;
        const internalTableHeight = tableContainer.current?.offsetHeight - tableHeader.current?.offsetHeight;
        let rowsPerTableView = Math.floor(internalTableHeight / tableRowHeight);
        setState((state) => {
          return {
            ...state,
            tableRowHeight,
            bottomVisibleRow: rowsPerTableView,
            rowsPerTableView
          }
        })
      })
    }
    initialiseApp();
  }, [])

  const handleScroll = async () => {
    // TERM: scrollTop -> Get the number of pixels the content of a <div> element is scrolled vertically
    // TERM: clientHeight ->returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin
    // TERM: offsetHeight -> is a measurement which includes the element borders, the element vertical padding, the element horizontal scrollbar (if present, if rendered) and the element CSS height.
    // TERM: scrollHeight -> is a measurement of the height of an element's content INCLUDING content not visible on the screen due to overflow

    let table = tableContainer.current;
    console.dir(table)
    // console.log('scrollTop', tableContainer.current.scrollTop, 'offsetHeight', tableContainer.current.offsetHeight)
    // TERM: topVisibleRow = pixels scrolled from top of table divided by the height of single row
    let topVisibleRow = Math.max(Math.floor((table.scrollTop - tableHeader.current.offsetHeight) / state.tableRowHeight), 0);
    // TERM:bottomVisibleRow = topVisibleRow + total no. of rows visible at a particular moment in table's viewport
    let bottomVisibleRow = Math.min(Math.floor(topVisibleRow + state.rowsPerTableView), state.students.length);
    if (topVisibleRow !== state.topVisibleRow || bottomVisibleRow !== state.bottomVisibleRow) {
      setState({
        ...state,
        topVisibleRow,
        bottomVisibleRow
      })
    }
    if (Math.ceil(table.offsetHeight + table.scrollTop) - 2 === table.scrollHeight && !state.isFetching) {
      setState({
        ...state,
        isFetching: true
      });

      fetchData(state.currentQuantity + 50).then(response => response.json()).then(data => {
        setState((state) => {
          return {
            ...state,
            students: [...data.data],
            currentQuantity: state.currentQuantity + 50,
            isFetching: false
          }
        })
      })
    }
  };

  // generate table rows
  function renderTableRows() {
    return state.students.map((student, index) => {
      return <TableRow
        firstname={student.firstname}
        lastname={student.lastname}
        email={student.email}
        gender={student.gender}
        id={index}
        key={index}
      />
    })
  }

  if (state.students.length === 0) {
    return <div>loading...</div>
  }
  return (
    <div className="App">
      <div className="sidebar">
        TR : {state.topVisibleRow} BR: {state.bottomVisibleRow} Quantity: {state.currentQuantity}
      </div>
      <div className="tableContainer">
        <div className="innerContainer">
          <div className="centeredContent" onScroll={() => handleScroll()} ref={tableContainer}>
            <table style={{ scrollBehavior: "smooth" }} >
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
