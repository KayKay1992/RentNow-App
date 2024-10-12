import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js'

export default function SignUp() {
  // Handle form submission and input change events here
  const [formData , setFormData] = useState({})
  const {loading, error} = useSelector((state) =>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch() // Import the useDispatch hook from react-redux to dispatch actions


  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {

    try{
      e.preventDefault();
      // Perform form validation and submit the form data to the server here
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        }
      );
      const data = await  res.json();
      console.log(data);
      if(data.success === false) {
       dispatch(signInFailure(data.message))
        return;
      }
     dispatch(signInSuccess(data))
      navigate('/')
    }catch(error) {
    dispatch(signInFailure(error.message));
    }
   
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center font-semibold my-7 '> Sign In</h1>
      {/* Sign Up form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '> 
        <input type='email' placeholder='Email' id='email' className='border p-3 rounded-lg'onChange={handleChange} />
        <input type='password' placeholder='Password' id='password' className='border p-3 rounded-lg'onChange={handleChange}/>
        <button disabled={loading} type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      {/* Already have an account? */}
      <div  className='flex text-sm text-center gap-2 mt-5'>
      <p>Dont have an account? </p>
      <Link to='/signup'>
      <span className='text-blue-700 '>
        Sign Up
      </span>
      </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
