import React from 'react';

function TableRow({
   firstname,
   lastname,
   email,
   gender,
   id
}) {

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
