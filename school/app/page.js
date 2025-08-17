'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase/firebase';
import { Icon } from '@iconify/react';


export default function Page() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [imageUrl, setImageUrl] = useState(undefined);

  const schema = yup.object().shape({
    name: yup.string().min(4).max(30).required('Name Field Is Empty'),
    email: yup.string().email().required('Email Field Is Empty'),
    contactnumber: yup.string().min(10).required('Number Field Is Empty'),
    state: yup.string().min(4).max(15).required('State Field Is Empty'),
    city: yup.string().min(4).max(15).required('City Field Is Empty'),
    address: yup.string().min(4).max(60).required('Address Field Is Empty'),
  });

  const { register, handleSubmit, formState: { errors }, reset} = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const onSubmit = async (e) => {
    try {
      const data = {...e, "image" : imageUrl};
      console.log(data);
      const response = await axios.post("http://localhost:3000/api/createSchool", data);
      const responseData = response.data;
      console.log(responseData);
      alert("School created successfully")
      reset()
      setImageUrl(null)
    } catch (error) {
      alert("School submission fail")
      console.log(error);

    }
  };
  
  return (
    <div>
   <div>
    <div className='mr-auto text-right'>
     <a href="/fetch" className='mr-auto bg-gray-800 text-white px-3 py-2 rounded-lg'>Show All Schools</a>
   </div>
   </div>
    <div className='border-4 pt-1 w-8/12 mx-auto md:w-5/12 md:mx-auto lg:w-5/12 lg:mx-auto mt-10 px-6'>
    <form onSubmit={handleSubmit(onSubmit)} >
      <p className='text-2xl text-center'>Add School</p>
      <input type="text" placeholder="name" name="name" {...register("name", { min: 2})} className='w-full py-2 mt-2 border rounded-lg pl-2'/>
      <p  className=' h-3 mb-2 text-red-700'>{errors.name?.message}</p>


      <input type="text" placeholder="address" name="address"  {...register("address", { min: 1})} className='w-full py-2 border rounded-lg pl-2'/>
      <p className='h-3 mb-2 text-red-700'>{errors.address?.message}</p>

      <input type="text" placeholder="city" name="city" {...register("city", { max: 1})} className='w-full py-2 border rounded-lg pl-2'/>
      <p className='h-3 mb-2 text-red-700'>{errors.city?.message}</p>


      <input type="text" placeholder="state" name="state" {...register("state", { min: 1})} className='w-full py-2 border rounded-lg pl-2'/>
      <p className='h-3 mb-2 text-red-700'>{errors.state?.message}</p>


      <input type="number" placeholder="contactnumber" name="contactnumber" {...register("contactnumber", { min: 10})} className='w-full py-2 border rounded-lg pl-2'/>
      <p className='h-3 mb-2 text-red-700'>{errors.contactnumber?.message}</p>


      <input type="email" placeholder="email" name="email"  {...register("email", { min: 2})} className='w-full border py-2 rounded-lg pl-2'/>
      <p className='h-3 mb-2 text-red-700'>{errors.email?.message}</p>


      <input
        onChange={(e) => setFile(e.target.files[0])}
        type='file'
        ref={fileRef}
        
        accept='image/*'
        className='mt-1 mb-4 w-6/12'
      />
      {imageUrl && (<img
        onClick={() => fileRef.current.click()}
        src={imageUrl || (file && URL.createObjectURL(file))}
        // src={imageUrl || <Icon icon="ic:baseline-upload" />}
        alt='profile'
        className='w-6/12'
      />)}
      
      <p className='text-sm self-center'>
        {fileUploadError ? (
          <span className='text-red-700'>
            Error Image upload (image must be less than 2 mb)
          </span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 && imageUrl ? (
          <span className='text-green-700'>
            Image successfully uploaded!
          </span>
        ) : (
          ''
        )}
      </p>

      <input type="submit" className='w-full border mb-2 rounded-md py-2 bg-red-900 text-white ' />
    </form>
  
    </div>
    </div>
  );
}