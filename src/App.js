import React, { useState, useEffect, useRef, useMemo } from 'react';
import TableRow from './TableRow';
import './App.css';

function App() {

  const [state, setState] = useState({
    users: [],
    topVisibleRow: 1,
    bottomVisibleRow: null,
    currentQuantity: null,
    tableRowHeight: null,
    rowsPerTableView: null,
    isFetching: false
  });

  const tableContainer = useRef(null);
  const scrollStopTimer = useRef(-1);

  function fetchData(quantity) {
    return fetch(`https://fakerapi.it/api/v1/persons?_quantity=${quantity}`);
    //return fetch(`https://jsonplaceholder.typicode.com/users`)
  }
  // get initial user data
  useEffect(() => {
    const initialiseApp = async () => {
      setState((state) => {
        return {
          ...state,
          isFetching: true
        }
      })
      const response = await fetchData(100);
      const data = await response.json()
       
      setState((state) => {
        return {
          ...state,
          users: [...data.data],
          isFetching: false,
          currentQuantity: 100
        }
      })
      const tableRowHeight = document.querySelector('.tableRow')?.clientHeight; // 40
      const internalTableHeight = tableContainer.current?.clientHeight;// 280
      let rowsPerTableView = Math.floor(internalTableHeight / tableRowHeight)-1; // 7-1 = 6
      setState((state) => {
        return {
          ...state,
          tableRowHeight,
          bottomVisibleRow: rowsPerTableView,
          rowsPerTableView
        }
      })
  
    }
    initialiseApp();
  }, [])



  const handleScroll = useMemo(() => async () => {
    // TERM: scrollTop -> Get the number of pixels the content of a <div> element is scrolled vertically
    // TERM: clientHeight ->returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin
    // TERM: offsetHeight -> is a measurement which includes the element borders, the element vertical padding, the element horizontal scrollbar (if present, if rendered) and the element CSS height.
    // TERM: scrollHeight -> is a measurement of the height of an element's content INCLUDING content not visible on the screen due to overflow

    if (scrollStopTimer.current !== -1) {
      clearTimeout(scrollStopTimer.current);
    }
    scrollStopTimer.current = setTimeout(async function(){
    // TERM: topVisibleRow = pixels scrolled from top of table divided by the height of single row
    let topVisibleRow = Math.max(Math.floor(tableContainer.current.scrollTop / state.tableRowHeight), 1); // scroll / 40
    // TERM: bottomVisibleRow = topVisibleRow + total no. of rows visible at a particular moment in table's viewport
    let bottomVisibleRow = Math.min(topVisibleRow + state.rowsPerTableView, state.users.length);
    if (topVisibleRow !== state.topVisibleRow || bottomVisibleRow !== state.bottomVisibleRow) {
      if(topVisibleRow === 1){
        setState({
          ...state,
          topVisibleRow,
          bottomVisibleRow:bottomVisibleRow - 1
        })
      }else{
        setState({
          ...state,
          topVisibleRow,
          bottomVisibleRow
        })
      }
    }
    
    if (state.currentQuantity - 30 <= state.bottomVisibleRow && state.bottomVisibleRow <= state.currentQuantity) {
      setState({
        ...state,
        isFetching: true
      });
      try{
        const response = await fetchData(100);
        const data = await response.json();
        setState((state) => {
          return {
            ...state,
            users: [...state.users, ...data.data],
            currentQuantity: state.currentQuantity + 100,
            isFetching: false
          }
        })
      }catch(error){
        console.log('Error 💥',error.message)
      }
    };
  },400)
  }, [state]);

  // generate table rows
  const renderTableRows = useMemo(() => () => {
    return state.users.map((user, index) => {
      return <TableRow
        firstname={user.firstname}
        lastname={user.lastname}
        email={user.email}
        phone={user.phone}
        website={user.website}
        id={index + 1}
        key={index}
      />
    })
  }, [state.users])

  if (state.users.length === 0) {
    return <div>loading...</div>
  }
  return (
    <div className="App">

      <div className="sidebar">
        TR : {state.topVisibleRow} BR: {state.bottomVisibleRow} Quantity: {state.currentQuantity}
      </div>

      <div className="innerContainer">
        <div className="centeredContent" onScroll={() => handleScroll()} ref={tableContainer}>
          <table id="studentTable" >
            <thead>
              <tr className="tableHeading">
                <th key='SerialNum'>S.No.</th>
                <th key='firstname'>First Name</th>
                <th key='lastname'>Last Name</th>
                <th key='email'>Email</th>
                <th key='phone'>Phone No.</th>
                <th key='website'>Website</th>
              </tr>
            </thead>

            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
