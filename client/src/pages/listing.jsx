// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore from "swiper";
// import { Navigation } from "swiper/modules";
// import "swiper/css/bundle";

// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import Contact from "../components/Contact";

// export default function Listing() {
//   // Fetch listing data from API using the listingId parameter from the URL.
//   // Use the useEffect hook to fetch the listing data when the component mounts.
//   // Use the listingId parameter to construct the API URL.
//   // Display the fetched listing data in the component.
//   // Handle any errors that may occur during the fetch request.
//   // Show appropriate error messages to the user.
//   SwiperCore.use([Navigation]);
//   const { currentUser } = useSelector((state) => state.user);
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false);
//   const params = useParams();

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         setError(false);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//         console.log(error);
//       }
//     };
//     fetchListing();
//   }, [params.listingId]);
//   return (
//     <main>
//       {loading && <p className="text-center my-7 text-2xl">Loading ...</p>}
//       {error && (
//         <p className="text-center my-7 text-2xl">Something went wrong</p>
//       )}
//       {listing && !loading && !error && (
//         <>
//           <Swiper
//             navigation={true}
//             modules={[Navigation]}
//             spaceBetween={10}
//             loop={true}
//             className="mySwiper"
//           >
//             {listing.imageUrls.map((url) => (
//               <SwiperSlide key={url}>
//                 <div
//                   className="h-[550px] "
//                   style={{
//                     background: `url(${url}) center no-repeat`,
//                     backgroundSize: "cover",
//                   }}
//                 ></div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           <div className="fixed top-[13%] right-[5%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100">
//             <FaShare
//               className="text-slate-600"
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setCopied(true);
//                 setTimeout(() => setCopied(false), 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className="fixed top-[23%] right-[0.3%] z-10 rounded-md bg-slate-100 p-2">
//               Link Copied !
//             </p>
//           )}
//           <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6">
//             <p className="text-2xl font-semibold">
//               {listing.name} - #{" "}
//               {listing.offer
//                 ? listing.discountPrice.toLocaleString("en-US")
//                 : listing.regularPrice.toLocaleString("en-US")}
//               {listing.type === "rent" && " / Year"}
            
//             </p>
//             <p className="flex items-center gap-4 mt-6 text-slate-600 my-2 text-sm">
//               <FaMapMarkerAlt className="text-green-700" />
//               {listing.address}
//             </p>
//             <div className="flex gap-4">
//               <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
//                 {listing?.type === "rent" ? "For Rent" : "For Sale"}
//               </p>
//               {listing.offer && (
//                 <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
//                   #{+listing.regularPrice - +listing.discountPrice} Discount
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-col gap-6 text-sm">
//               <p className="font-semibold text-lg">Description</p>
//               <p>{listing.description}</p>
//             </div>
//             <ul className="flex flex-wrap whitespace-nowrap text-green-900 font-semibold text-sm gap-4 sm:gap-6 items-center">
//               <li className="flex items-center gap-1 ">
//                 <FaBed className="text-lg " />
//                 {listing.bedrooms > 1
//                   ? `${listing.bedrooms} beds`
//                   : `${listing.bedrooms} bed`}
//               </li>
//               <li className="flex items-center gap-1 ">
//                 <FaBath className="text-lg " />
//                 {listing.bathrooms > 1
//                   ? `${listing.bathrooms} baths`
//                   : `${listing.bathrooms} bath`}
//               </li>
//               <li className="flex items-center gap-1 ">
//                 <FaParking className="text-lg " />
//                 {listing.parking ? "Parking" : "No Parking"}
//               </li>
//               <li className="flex items-center gap-1 ">
//                 <FaChair className="text-lg " />
//                 {listing.furnished ? "Furnished" : "Not Furnished"}
//               </li>
//             </ul>
//             {currentUser && listing.userRef !== currentUser._id && !contact && (
//               <button
//                 onClick={() => setContact(true)}
//                 className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
//               >
//                 Contact Landlord
//               </button>
//             )}
//             {contact && <Contact listing={listing} />}
//           </div>
//         </>
//       )}
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  // Initialize Swiper
  SwiperCore.use([Navigation]);
  
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  
  const params = useParams();

  // Fetch the listing data based on the URL param
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        
        if (data.success === false) {
          setError(true);
        } else {
          setListing(data);
        }
      } catch (error) {
        setError(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // If loading, display loading message
  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  
  // If there's an error fetching the listing, display an error message
  if (error) return <p className="text-center my-7 text-2xl">Something went wrong.</p>;

  // Destructure the listing data for easier access
  const {
    name,
    offer,
    discountPrice,
    regularPrice,
    type,
    address,
    description,
    imageUrls,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    userRef,
  } = listing;

  return (
    <main>
      {/* Swiper for listing images */}
      <Swiper navigation={true} modules={[Navigation]} spaceBetween={10} loop={true} className="mySwiper">
        {imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="h-[550px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Share button */}
      <div className="fixed top-[13%] right-[5%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <FaShare className="text-slate-600" />
        </button>
      </div>

      {copied && <p className="fixed top-[23%] right-[0.3%] z-10 rounded-md bg-slate-100 p-2">Link Copied!</p>}

      {/* Listing Details */}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6">
        <p className="text-2xl font-semibold">
          {name} - #{offer ? discountPrice.toLocaleString("en-US") : regularPrice.toLocaleString("en-US")}
        </p>
        <p className="flex items-center gap-4 mt-6 text-slate-600 my-2 text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          {address}
        </p>

        <div className="flex gap-4">
          {/* Sale or Rent Tag */}
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
            {type === "sale" ? "For Sale" : "For Rent"}
          </p>

          {/* Discount tag */}
          {offer && (
            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              #{+regularPrice - +discountPrice} Discount
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-6 text-sm">
          <p className="font-semibold text-lg">Description</p>
          <p>{description}</p>
        </div>

        {/* Features List */}
        <ul className="flex flex-wrap whitespace-nowrap text-green-900 font-semibold text-sm gap-4 sm:gap-6 items-center">
          <li className="flex items-center gap-1">
            <FaBed className="text-lg" />
            {bedrooms > 1 ? `${bedrooms} beds` : `${bedrooms} bed`}
          </li>
          <li className="flex items-center gap-1">
            <FaBath className="text-lg" />
            {bathrooms > 1 ? `${bathrooms} baths` : `${bathrooms} bath`}
          </li>
          <li className="flex items-center gap-1">
            <FaParking className="text-lg" />
            {parking ? "Parking" : "No Parking"}
          </li>
          <li className="flex items-center gap-1">
            <FaChair className="text-lg" />
            {furnished ? "Furnished" : "Not Furnished"}
          </li>
        </ul>

        {/* Contact Button (if the user is not the listing owner) */}
        {currentUser && userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
          >
            Contact Property Owner
          </button>
        )}

        {/* Display Contact Component */}
        {contact && <Contact listing={listing} />}
      </div>
    </main>
  );
}
