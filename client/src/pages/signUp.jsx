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
  e.preventDefault();
  
  try {
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/signup', { // Note: lowercase 'signup'
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });

    // Check if response is OK
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      } catch {
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }
    }

    const data = await res.json();
    console.log('Signup success:', data);
    
    if (data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    }
    
    setLoading(false);
    setError(null);
    navigate('/signin'); // Note: lowercase 'signin'
    
  } catch(error) {
    setLoading(false);
    setError(error.message || 'Something went wrong during signup');
    console.error('Signup error:', error);
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
