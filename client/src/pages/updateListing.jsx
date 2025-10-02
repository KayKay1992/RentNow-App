import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

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

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch listing to update
  useEffect(() => {
    if (!params.listingId) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/listing/get/${params.listingId}`,
          {
            method: "GET",
            credentials: "include", // ✅ send cookies with request
          }
        );

        if (!res.ok) throw new Error("Failed to fetch listing");

        const data = await res.json();
        if (data.success === false) throw new Error(data.message);

        setFormData(data.listing || data);
      } catch (err) {
        console.error("Fetch listing error:", err.message);
        setError(err.message);
      }
    };

    fetchListing();
  }, [params.listingId, API_BASE]);

  // Store image in Firebase
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
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  // Upload selected images
  const handleImageSubmit = () => {
    if (files.length === 0) return setImageUploadError("No files selected");
    if (files.length + formData.imageUrls.length > 10)
      return setImageUploadError("Maximum 10 images can be uploaded");

    setUploading(true);
    setImageUploadError(false);

    const promises = Array.from(files).map(storeImage);

    Promise.all(promises)
      .then((urls) => {
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
        setUploading(false);
      })
      .catch(() => {
        setImageUploadError("Image upload failed (2MB max per image)");
        setUploading(false);
      });
  };

  // Delete image from list
  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (id === "rent" || id === "sell")
      setFormData((prev) => ({ ...prev, type: id }));
    else if (id === "offer" || id === "parking" || id === "furnished")
      setFormData((prev) => ({ ...prev, [id]: checked }));
    else setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("Please upload at least one image");
      if (+formData.discountPrice > +formData.regularPrice)
        return setError("Discount price should be less than regular price");

      setLoading(true);
      setError(false);

      const endpoint = `${API_BASE}/api/listing/update/${params.listingId}`;

      const res = await fetch(endpoint, {
        method: "POST", // ✅ backend expects POST for update
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ include cookies for auth
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || "Failed to update listing");
        } catch {
          throw new Error(text);
        }
      }

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
      console.error("Update listing error:", err);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT FORM */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="number"
            id="phone"
            placeholder="Phone Number"
            className="border p-3 rounded-lg"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex gap-6 flex-wrap">
            {["rent", "sell"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={type}
                  className="w-5"
                  checked={formData.type === type}
                  onChange={handleChange}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
            {["parking", "furnished", "offer"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={option}
                  className="w-5"
                  checked={formData[option]}
                  onChange={handleChange}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg"
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="p-3 border rounded-lg"
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <span>
                Regular Price {formData.type === "rent" && "(₦ / Year)"}
              </span>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="discountPrice"
                  min="1"
                  required
                  className="p-3 border rounded-lg"
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
                <span>
                  Discount Price {formData.type === "rent" && "(₦ / Year)"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT IMAGE UPLOAD */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="ml-2 text-gray-500 font-normal">
              First image is cover (Max 10)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="border p-3 rounded w-full"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
          {imageUploadError && <p className="text-red-700">{imageUploadError}</p>}

          {formData.imageUrls.map((url, i) => (
            <div key={i} className="flex items-center justify-between p-3 border">
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(i)}
                className="p-2 text-red-700 hover:text-red-900 rounded"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Saving..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}

