import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {
  // Handle form submission and input change events here
  const [formData , setFormData] = useState({})
  const [error , setError] = useState(null)
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate()


  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {

    try{
      e.preventDefault();
      // Perform form validation and submit the form data to the server here
      setLoading(true);
      const res = await fetch('/api/auth/signUp',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        }
      );
      const data = await  res.json();
      console.log(data);
      if(data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false)
      setError(null)
      navigate('/signIn')
    }catch(error) {
      setLoading(false);
      setError(error.message);
    }
   
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center font-semibold my-7 '> Sign Up</h1>
      {/* Sign Up form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type='text' placeholder='Username' id='username' className='border p-3 rounded-lg'onChange={handleChange} />
        <input type='email' placeholder='Email' id='email' className='border p-3 rounded-lg'onChange={handleChange} />
        <input type='number' placeholder='Enter phone Number' id='phone' className='border p-3 rounded-lg'onChange={handleChange} />
        <input type='password' placeholder='Password' id='password' className='border p-3 rounded-lg'onChange={handleChange}/>
        <button disabled={loading} type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      {/* Already have an account? */}
      <div  className='flex text-sm text-center gap-2 mt-5'>
      <p>Already have an account? </p>
      <Link to='/signIn'>
      <span className='text-blue-700 '>
        Sign In
      </span>
      </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
