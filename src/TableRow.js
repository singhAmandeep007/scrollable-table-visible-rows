import React from 'react';

function TableRow({
   firstname,
   lastname,
   email,
   phone,
   website,
   id
}) {

   return (
      <tr key={id} data-id={id} className="tableRow">
         <td>{id}</td>
         <td>{firstname}</td>
         <td>{lastname}</td>
         <td>{email}</td>
         <td>{phone}</td>
         <td>{website}</td>
      </tr>
   )
}

export default TableRow;
