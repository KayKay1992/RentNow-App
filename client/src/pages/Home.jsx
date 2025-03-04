
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle'

import { Navigation } from'swiper/modules'
import SwiperCore from 'swiper'
import ListingItem from '../components/ListingItem';



export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setrentListings] = useState([]);

  SwiperCore.use([Navigation]);



  useEffect(() => {
    // Fetch offer listings
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings()
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setrentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);

  return (
    <div>
   { /*top*/}
      <div className="flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl '>Find your next <span className='text-slate-500'>perfect</span> <br/>place with ease </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
        Introducing our innovative real estate app, designed to simplify <br/> your property search and streamline your buying or renting experience. With a user-friendly interface, <br/> advanced filters, and comprehensive listings, you can easily discover homes <br/> that match your needs and preferences. Whether you’re a first-time buyer, <br/>seasoned investor, or looking for a rental, our app provides valuable <br/>insights, market trends, and direct access to agents. Unlock your dream home with just a few taps!
        </div>

        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
        Lets get started....
        </Link>
       
      </div>


   {/*Swiper*/}
   <Swiper navigation>
    {
      offerListings && offerListings.length > 0  && offerListings.map((listing) => (
        <SwiperSlide  key={listing._id}>
          <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className='h-[500px]'>
             
          </div>
        </SwiperSlide>

      )

      )
      
      
    }
    
   </Swiper>



   {/*Listing results for offer.*/}

   <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
    {offerListings && offerListings.length > 0 && (
      <div className="">
        <div className="my-4">
          <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
          <Link className='text-lg text-blue-800 hover:underline' to={'/search?offer=true'}>
          Show more offers...
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {offerListings.map((listing)=> (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

   </div>
   <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
    {rentListings && rentListings.length > 0 && (
      <div className="">
        <div className="my-4">
          <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Rent</h2>
          <Link className='text-lg text-blue-800 hover:underline' to={'/search?type=rent'}>
          Show more places for rent...
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {rentListings.map((listing)=> (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

   </div>
   <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
    {saleListings && saleListings.length > 0 && (
      <div className="">
        <div className="my-4">
          <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
          <Link className='text-lg text-blue-800 hover:underline' to={'/search?type=sale'}>
          Show more places for sale...
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {saleListings.map((listing)=> (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}

   </div>
   
    </div>
  )
}
