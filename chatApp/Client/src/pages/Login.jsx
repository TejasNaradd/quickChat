import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const [currState,setCurrState] =useState('Sign up')
  const [fullName,setFullName] =useState('')
  const [email,setEmail] =useState('')
  const [password,setPassword] =useState('')
  const [bio,setBio] =useState('')
  const [isdatasubmitted,setIsdatasubmitted] =useState(false);

  const {login}=useContext(AuthContext)


  const onSubmitHandler=(event)=>{
    event.preventDefault();
    if(currState==='Sign up' && !isdatasubmitted){
      setIsdatasubmitted(true);
      return;
    }

    login(currState==='Sign up' ? 'signup' : 'login' ,{fullName,email,password,bio})
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} className='w-[min(30vw,250px)]' alt="" />
    <form onSubmit={onSubmitHandler}
     className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
    <h2 className='font-medium text-2xl flex justify-between items-center'>
      {currState}
      {isdatasubmitted && <img onClick={()=>setIsdatasubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />
      }
      </h2>
      {currState==='Sign up' && !isdatasubmitted && (
      <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
       type="text" placeholder='Full Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-2 ' required/>
      )}
  {!isdatasubmitted && (
    <>
    <input onChange={(e)=>setEmail(e.target.value)} value={email}
     type="email" placeholder='Email' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>

    <input onChange={(e)=>setPassword(e.target.value)} value={password}
     type="password" placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
    </>
  )}
  {
    currState==='Sign up' && isdatasubmitted && (
      <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
      placeholder='Give A Short Bio...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required></textarea>
    )
  }

  <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
    {currState==="Sign up" ? "Create Account" : "Login Now"}
  </button>
     
     <div className='text-sm text-gray-500 flex gap-2 items-center'>
    <input type="checkbox" required/>
    <p>Agree to the terms of use and Privacy Policy.</p>
     </div>

     <div className='flex flex-col gap-2'>
      {currState ==='Sign up' ? (
        <p className='text-sm text-gray-600'>Already have an account? <span className='text-violet-500 font-medium cursor-pointer' onClick={()=>setCurrState('Login')}>Login Here</span></p>
      ) : (
        <p className='text-sm text-gray-600'>
          Create an account <span className='text-violet-500 font-medium cursor-pointer' onClick={()=>setCurrState('Sign up')}>Click Here</span>
        </p>
      )} 
     </div>
    </form> 
    </div>
  )
}

export default Login 