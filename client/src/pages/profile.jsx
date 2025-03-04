
import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import {Link} from "react-router-dom"
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserSuccess , deleteUserStart, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure} from "../redux/user/userSlice"
import { useSelector } from "react-redux"
export default function Profile() {

  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch() // Import the useDispatch 
  useEffect(()=> {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  const handleFileUpload = (file) => {
     const storage = getStorage(app)
     const fileName = new Date().getTime() + file.name;
     const storageRef = ref(storage, fileName);
     const uploadTask = uploadBytesResumable(storageRef, file);
     uploadTask.on('state_changed', (snapshot) => {
       // Update progress bar
       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       setFilePercentage(Math.round(progress));
     },
      (error) => {
        setFileUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
          setFormData({...formData, avatar: downloadURL});
        })
      }
    )
  }
  // Update user data in the database
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Perform form validation and submit the form data to the server here
    try{
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        }
      );
      const data = await  res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
     
    }catch(error){
      dispatch(updateUserFailure(error.message))
    }
  }
   
  const handleDeleteUser = async () => {
    
    try{
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await  res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    }catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut  =async () => {
  try{
    dispatch(signOutStart())
    const res = await fetch ('/api/auth/signout')
    const data  = await res.json();
    if (data.success === false) {
      dispatch(signOutFailure(data.message));
      return;
    }
    dispatch(signOutSuccess(data));
  }
  catch(error){
    dispatch(signOutFailure(error.message))
  }
  }

  //function for ShowListingButton onclick event handler

  const handleShowListings = async () => {
    try{
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      };
      setUserListings(data)

    }catch(error){
      setShowListingsError(true);

    }

  };

  const handleListingDelete = async (listingId) => {
    try{
     const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>prev.filter((listing) => listing._id !== listingId));
    }catch(error){
      console.log(error.message);
    }

  }

  

  //Firebase Storage Rules
  // allow read;
  // allow write: if request.resource.size < 2* 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Profile form */}
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='Profile image' className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload, (image must be less than 2mb)</span>)
         : filePercentage > 0 && filePercentage < 100 ? (<span className="text-slate-700"> {`uploading ${filePercentage}%`} </span>) : filePercentage === 100 ? (<span className="text-green-700">Image Successfully Uploaded</span>) : (
          ''
        )}
        </p>
        <input type="text" placeholder="Username" id="username" className="border p-3 rounded-lg " defaultValue={currentUser.username}  onChange={handleChange}/>
        <input type="email" placeholder="Email" className="border p-3 rounded-lg " id="email" defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" placeholder="Password" className="border p-3 rounded-lg " id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80">
          {loading? 'Loading...' : 'Update'}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
         Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      {updateSuccess && <p className="text-green-700 mt-5">Profile updated successfully!</p>}
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listing</button>
      <p className="text-red-700 mt-5">{ showListingsError ? 'Error showing Listings' : ''}</p>
      {userListings && userListings.length > 0 && 
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold ">Your Listings</h1>
      { userListings.map((listing) => (
      <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-7">
        <Link to={`/listing/${listing._id}`}>
         <img src={listing.imageUrls[0]} alt="Listing Image" className="h-16 w-16 object-contain"/>
        </Link>
        <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
        <p className="">{listing.name}</p>
        
        </Link>
        <div className="flex flex-col items-center">
          <button onClick={()=>handleListingDelete (listing._id)} className="text-red-700 uppercase">Delete</button>
          <Link to={`/updatelisting/${listing._id}`}>
          <button  className="text-green-700 uppercase">Edit</button>
          </Link>
        </div>

      </div>

      )) }
      
      </div>}
      
    </div>
  );
}

