import { useEffect, useState } from "react"
import {useParams} from "react-router-dom"
import {Swiper, SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import "swiper/css/bundle"

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
            </>
        )}
    </main>
  )
}
