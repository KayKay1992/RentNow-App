import { useEffect, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from "../firebase"
import {useSelector} from "react-redux"
import {useNavigate, useParams} from "react-router-dom"


export default function CreateListing() {
    const {currentUser} = useSelector((state) => state.user)
    const navigate = useNavigate()
    const params = useParams();
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [], name: '', description: '', address: '',
        type: 'rent', bedrooms: 1, bathrooms: 1 , regularPrice: 0, discountPrice: 0, offer: false, parking: false, furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async() => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();  
            if(data.success === false){
                console.log(data.message);
                return;

            };
            setFormData(data);

        }
        fetchListing();
    },[]);

    const handleImageSubmit = (e) => {
     if(files.length > 0 && files.length + formData.imageUrls.length < 11){
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        for (let i = 0; i < files.length; i++) {
            promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls) => {
            setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
            setImageUploadError(false);
            setUploading(false);
            
        }).catch((err) => {
            setImageUploadError('Image upload failed (2mb max per image)');
            setUploading(false);
        });
     }else{
        setImageUploadError('Maximum 10 images can be uploaded');
        setUploading(false);
     }
    }
    const storeImage = async (file) =>{
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = 
                    (snapshot.bytesTransferred + snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        
        })
    }

    const handleDeleteImage = (index) => {
       setFormData( {
         ...formData, 
          imageUrls: formData.imageUrls.filter((_, i) => i!== index)
       })
    }
    const handleChange = (e) => {
        //Track input changes 
        if(e.target.id === 'sell' || e.target.id === 'rent') {
            setFormData({...formData, type: e.target.id });
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({...formData, [e.target.id]: e.target.checked})
        }

        if(e.target.type=== 'number' || e.target.type=== 'text' || e.target.type=== 'textarea') {
            setFormData({...formData, [e.target.id]: e.target.value })
        }
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform form validation and submit the form data to the server here
        // You can use the formData object to access the form data
        // Make sure to handle any errors or successful submission in your backend code
        try {
            if(formData.imageUrls.length < 1) 
              return  setError('Please upload at least one image');
            if(+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price should be greater than regular price');

            
            setLoading(true);
            setError(false);
            // Submit the form data to the server using fetch API
            // You can use the formData object to access the form data
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                })
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)

        }catch (error) {
            setError(error.message);
            setLoading(false);

        }

    }


  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            {/* Listing form */}
            <div className='flex flex-col gap-4 flex-1'>
                {/* Form fields */}
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' required  onChange={handleChange} value={formData.name}/>
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description} />
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address'  required onChange={handleChange} value={formData.address}/>
                <div className="flex gap-6 flex-wrap">
                 <div className="flex gap-2">
                    <input type='checkbox' id='sell' className='w-5' onChange={handleChange} checked={formData.type === 'sell'}/>
                    <span>Sell</span>
                 </div>
                 <div className="flex gap-2">
                    <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'}/>
                    <span>Rent</span>
                 </div>
                 <div className="flex gap-2">
                    <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking}/>
                    <span>Parking Spot</span>
                 </div>
                 <div className="flex gap-2">
                    <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}/>
                    <span>Furnished</span>
                 </div>
                 <div className="flex gap-2">
                    <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer}/>
                    <span>Offer</span>
                 </div>
                </div>
                <div className="flex flex-wrap gap-6 ">
                    <div className="flex items-center gap-3">
                        <input type="number" id="bedrooms" min="1" max="10" required className='p-3 border border-gray-300 rounded-lg '  onChange={handleChange} value={formData.bedrooms}/>
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="number" id="bathrooms" min="1" max="10" required className='p-3 border border-gray-300 rounded-lg ' onChange={handleChange} value={formData.bathrooms}/>
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="number" id="regularPrice"  required className='p-3 border border-gray-300 rounded-lg' min="1" onChange={handleChange} value={formData.regularPrice}/>
                        <div className="flex flex-col items-start">
                        <p>Regular Price</p>
                        <span className='text-xs'>(# / Year)</span>
                        </div>  
                    </div>
                    {formData.offer &&  (
                        <div className="flex items-center     gap-3">
                          <input type="number" id="discountPrice"  required className='p-3 border border-gray-300 rounded-lg' min="1"  onChange={handleChange} value={formData.discountPrice}/>
                          <div className="flex flex-col items-start">
                          <p>Discount Price</p>
                          <span className='text-xs'>(# / Year)</span>
                            </div>  
                      </div>
                    )}
                  
                </div>
            </div>
            {/* Images upload div */}
            <div className="flex flex-col flex-1 gap-4">
                <p className='font-semibold'>Images:
                    <span className='font-normal ml-2 text-gray-500'> The first image is going to be the cover (Max 10 images)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} type='file' id='images' accept='images/*' multiple className='p-3 border border-gray-300 rounded w-full'/>
                    <button disabled={uploading} type="button" onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        { uploading? 'Uploading...' : 'Upload Images'}
                    </button>
                </div>
                <p className="text-sm text-red-700">{imageUploadError && imageUploadError}</p>
                {
                    //display the impage while uploading
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                            <button type="button" className='p-3 text-red-700 hover:text-red-900 rounded-lg uppercase' onClick={()=> handleDeleteImage(index)}>Delete</button>
                        </div>

                    ))
                }
                <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Updating...' : 'Update Listing'} 
                </button>
                {error && <p className="text-sm text-red-700">{error}</p>}
            
            </div>
            
      
        </form>
    </main>
  )
}
