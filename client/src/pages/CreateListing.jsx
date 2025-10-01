import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../server";  // ✅ import base URL

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    phone: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Upload images to Firebase
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 11) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("Maximum 10 images can be uploaded");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (["number", "text", "textarea"].includes(e.target.type)) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  // ✅ Submit listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError("Please upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price should be less than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch(`${API_BASE_URL}/api/listing/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
        credentials: "include", // ✅ important if backend sets cookies
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* form fields remain unchanged (your JSX stays same)... */}

        {/* ✅ Submit button */}
        <button
          disabled={loading || uploading}
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </main>
  );
}


// import { useState } from "react";
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
// import { app } from "../firebase";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function CreateListing() {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const [files, setFiles] = useState([]);
//   const [formData, setFormData] = useState({
//     imageUrls: [],
//     name: '',
//     description: '',
//     address: '',
//     phone: '',
//     type: 'rent',
//     bedrooms: 1,
//     bathrooms: 1,
//     regularPrice: 0,
//     discountPrice: 0,
//     offer: false,
//     parking: false,
//     furnished: false,
//   });
//   const [imageUploadError, setImageUploadError] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState({});

//   const handleImageSubmit = (e) => {
//     if (files.length > 0 && files.length + formData.imageUrls.length < 11) {
//       setUploading(true);
//       setImageUploadError(false);
//       const promises = [];
//       files.forEach((file, i) => {
//         promises.push(storeImage(file, i));
//       });

//       Promise.all(promises)
//         .then((urls) => {
//           setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
//           setUploading(false);
//         })
//         .catch((err) => {
//           setImageUploadError('Image upload failed (2mb max per image)');
//           setUploading(false);
//         });
//     } else {
//       setImageUploadError('Maximum 10 images can be uploaded');
//       setUploading(false);
//     }
//   };

//   const storeImage = (file, index) => {
//     return new Promise((resolve, reject) => {
//       const storage = getStorage(app);
//       const fileName = new Date().getTime() + file.name;
//       const storageRef = ref(storage, fileName);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setUploadProgress((prev) => ({ ...prev, [index]: progress }));
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleDeleteImage = (index) => {
//     setFormData({
//       ...formData,
//       imageUrls: formData.imageUrls.filter((_, i) => i !== index),
//     });
//   };

//   const handleChange = (e) => {
//     const { id, type, checked, value } = e.target;
//     if (type === 'checkbox') {
//       setFormData({ ...formData, [id]: checked });
//     } else {
//       setFormData({ ...formData, [id]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Phone number validation (optional)
//     const phoneRegex = /^[+]?[0-9]{1,4}[ -]?[0-9]{1,4}[ -]?[0-9]{1,4}$/; // international phone number pattern
//     if (!phoneRegex.test(formData.phone)) {
//       setError('Please enter a valid phone number');
//       return;
//     }

//     if (!formData.imageUrls.length) {
//       setError('Please upload at least one image');
//       return;
//     }

//     if (+formData.regularPrice < +formData.discountPrice) {
//       setError('Discount price should be less than regular price');
//       return;
//     }

//     if (!formData.name || !formData.address) {
//       setError('Name and Address are required');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch('/api/listing/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           userRef: currentUser._id,
//         }),
//       });

//       const data = await res.json();
//       setLoading(false);
//       if (!data.success) {
//         setError(data.message || 'Failed to create listing');
//         return;
//       }

//       navigate(`/listing/${data._id}`);
//     } catch (err) {
//       setError(err.message || 'An error occurred');
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="p-3 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
//         {/* Listing form */}
//         <div className="flex flex-col gap-4 flex-1">
//           {/* Form fields */}
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-3 rounded-lg"
//             id="name"
//             maxLength="62"
//             required
//             onChange={handleChange}
//             value={formData.name}
//           />
//           <input
//             type="tel"
//             placeholder="Please Enter Phone Number"
//             className="border p-3 rounded-lg"
//             id="phone"
//             required
//             onChange={handleChange}
//             value={formData.phone}
//             pattern="^[+]?[0-9]{1,4}[ -]?[0-9]{1,4}[ -]?[0-9]{1,4}$"  // Phone number pattern
//             title="Please enter a valid phone number, e.g., +1-234-567-890"
//           />
//           <textarea
//             type="text"
//             placeholder="Description"
//             className="border p-3 rounded-lg"
//             id="description"
//             required
//             onChange={handleChange}
//             value={formData.description}
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             className="border p-3 rounded-lg"
//             id="address"
//             required
//             onChange={handleChange}
//             value={formData.address}
//           />
//           {/* Other form elements like type, bedrooms, bathrooms, etc. */}
//           {/* ... */}
//         </div>

//         {/* Images upload div */}
//         <div className="flex flex-col flex-1 gap-4">
//           <p className="font-semibold">
//             Images:
//             <span className="font-normal ml-2 text-gray-500"> The first image is going to be the cover (Max 10 images)</span>
//           </p>
//           <div className="flex gap-4">
//             <input
//               onChange={(e) => setFiles(e.target.files)}
//               type="file"
//               id="images"
//               accept="images/*"
//               multiple
//               className="p-3 border border-gray-300 rounded w-full"
//             />
//             <button
//               disabled={uploading}
//               type="button"
//               onClick={handleImageSubmit}
//               className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
//             >
//               {uploading ? 'Uploading...' : 'Upload Images'}
//             </button>
//           </div>
//           <p className="text-sm text-red-700">{imageUploadError && imageUploadError}</p>
//           {formData.imageUrls.length > 0 &&
//             formData.imageUrls.map((url, index) => (
//               <div key={url} className="flex justify-between p-3 border items-center">
//                 <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
//                 <button
//                   type="button"
//                   className="p-3 text-red-700 hover:text-red-900 rounded-lg uppercase"
//                   onClick={() => handleDeleteImage(index)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           <button
//             disabled={loading || uploading}
//             className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//           >
//             {loading ? 'Creating...' : 'Create Listing'}
//           </button>
//           {error && <p className="text-sm text-red-700">{error}</p>}
//         </div>
//       </form>
//     </main>
//   );
// }



