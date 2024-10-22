import { useEffect, useState } from "react"
import {useParams} from "react-router-dom"
import {Swiper, SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import "swiper/css/bundle"
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from "react-icons/fa"

export default function Listing() {
    // Fetch listing data from API using the listingId parameter from the URL.
    // Use the useEffect hook to fetch the listing data when the component mounts.
    // Use the listingId parameter to construct the API URL.
    // Display the fetched listing data in the component.
    // Handle any errors that may occur during the fetch request.
    // Show appropriate error messages to the user.
    SwiperCore.use([Navigation])
    const [listing, setListing] =useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState(false)
    const params = useParams(); 
   useEffect(() => {
    const fetchListing = async () => {
        try{
            setLoading(true);
            setError(false);
            const res =await fetch (`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if(data.success === false){
            setError(true)
            setLoading(false);
            return;
        }
        setListing(data);
        setLoading(false);
        setError(false);

        }catch(error){
            setError(true);
            setLoading(false);
            console.log(error);
        }
       
    };
    fetchListing();
   }, [params.listingId]);
  return (
    <main>
        {loading && <p className="text-center my-7 text-2xl">Loading ...</p>}
        {error && <p className="text-center my-7 text-2xl">Something went wrong</p>}
        {listing && !loading && !error && (
            <>
            <Swiper navigation>
                {listing.imageUrls.map((url) => (<SwiperSlide key = {url}>
                 <div className="h-[550px] " style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                   
                 </div>
                </SwiperSlide>))}
            </Swiper>
             <div className="fixed top-[13%] right-[5%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100">
                <FaShare className="text-slate-600" onClick={()=> {
                    navigator.clipboard.writeText(window.location.href);
                   setCopied(true);
                   setTimeout(()=> setCopied(false), 2000);
 
                }}/>
                
             </div>
             {copied && (
                  <p className="fixed top-[23%] right-[0.3%] z-10 rounded-md bg-slate-100 p-2">Link Copied !</p>
             )}
             <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6">
                <p className="text-2xl font-semibold">{listing.name} - #{' '} { listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === "rent" && ' / Year'}
                </p>
                <p className="flex items-center gap-4 mt-6 text-slate-600 my-2 text-sm">
                <FaMapMarkerAlt className="text-green-700"/>
                 {listing.address}
                 </p>
                 <div className="flex gap-4">
                    <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                        {listing.type ==="rent" ? "For Rent" : "For Sale"}
                    </p>
                    {
                        listing.offer && (
                            <p  className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">#{+listing.regularPrice - +listing.discountPrice} Discount</p>
                        )
                    }
                 </div>
                 <div className="flex flex-col gap-6 text-sm">
                <p className="font-semibold text-lg">Description</p>
                <p>{listing.description}</p>
             </div>
             <ul className="flex flex-wrap whitespace-nowrap text-green-900 font-semibold text-sm gap-4 sm:gap-6 items-center">
                <l1 className="flex items-center gap-1 "><FaBed className="text-lg "/>
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                </l1>
                <l1 className="flex items-center gap-1 "><FaBath className="text-lg "/>
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                </l1>
                <l1 className="flex items-center gap-1 "><FaParking className="text-lg "/>
                {listing.parking  ? 'Parking' : 'No Parking'} 
                </l1>
                <l1 className="flex items-center gap-1 "><FaChair className="text-lg "/>
                {listing.furnished ? 'Furnished' : 'Not Furnished'} 
                </l1>

             </ul>
             </div>
            </>
        )}
    </main>
  )
}
