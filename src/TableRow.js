import React, { useRef, useEffect } from 'react';

function TableRow({
   firstname,
   lastname,
   email,
   gender,
   id,
   handleIntersection
}) {

   //const tableRowRef = useRef(null);

   // useEffect(() => {
   //    const tableRow = tableRowRef.current;

   //    const callbackFunction = (entries) => {
   //       const [entry] = entries;
   //       //setIsVisible(entry.isIntersecting)
   //       if (!entry.isIntersecting) return;
   //       //console.log(entry.target);
   //       //console.log(entry, entry.isIntersecting);
   //       console.log(entry.target.dataset.id)
   //       handleIntersection(entry.target.dataset.id)

   //    }
   //    const observer = new IntersectionObserver(callbackFunction, {
   //       root: topBar.current,
   //       rootMargin: '0px',
   //       threshold: 0
   //    });
   //    if (tableRow) observer.observe(tableRow)

   //    return () => {
   //       if (tableRow) observer.unobserve(tableRow)
   //    }
   // }, [topBar, handleIntersection])

   // const topBar = document.querySelector('.stickyTop');
   // const bottomBar = document.querySelector('.stickyBottom');

   return (
      <tr key={email} data-id={id} className="tableRow">
         <td>{id}</td>
         <td>{firstname}</td>
         <td>{lastname}</td>
         <td>{email}</td>
         <td>{gender}</td>
      </tr>
   )
}

export default TableRow;
