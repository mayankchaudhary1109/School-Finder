'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/schools");
        const responseData = response.data;

        if (responseData.success === false) {
          setError(true);
        } else {
          setData(responseData.products); 
        }
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
      <div className='mr-auto text-right'>
     <a href="/" className='mr-auto bg-gray-800 text-white px-3 py-2 rounded-lg'>Create School</a>
   </div>
      </div>
      <div className='grid grid-cols-3 gap-5 px-28 mx-auto mt-8'>
        {data.map((user, index) => (
    <div class="max-w-sm rounded overflow-hidden shadow-lg" key={index}>
  <img class="w-full" src={user.image} alt="Sunset in the mountains"/>
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{user.name}</div>
    <p class="text-gray-700 text-base">
    {user.address}
    </p>
    <p class="text-gray-700 text-base">{user.city} , {user.state}</p>
  </div>
  <div class="px-6 pt-1 pb-2">
    <p class="text-gray-700 text-base font-extrabold">Contact Details</p>
    <span class="inline-block px-1 py-1 text-sm font-semibold text-gray-700 mr-2 mb-0">
      <Icon icon="ic:sharp-phone" />{user.contact_number}</span>
    <span class="inline-block px-1 py-1 text-sm font-semibold text-blue-700 mr-2 mb-0"><Icon icon="iconamoon:email-bold" />{user.email_id}</span>
  </div>
</div>
  ))}
  </div>  
</div>
  );
}
