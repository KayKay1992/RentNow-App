// import { Link } from 'react-router-dom'
// import { MdLocationOn } from 'react-icons/md'

// export default function ListingItem({listing}) {
//   return (
//     <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[280px]  '>
//         <Link to={`/listing/${listing._id}`}>
//           <img src={listing.imageUrls[0]} alt="Image" className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'/>

//           <div className="p-3 flex flex-col gap-2 w-full">
//             <p className='truncate text-lg text-slate-700 font-semibold'>{listing.name}</p>
//             <div className="flex  items-center gap-2">
//                 <MdLocationOn className='h-4 w-4 text-green-700'/>
//                 <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
//             </div>
//             <p className='text-sm text-gray-600 line-clamp-2'>
//                 {listing.description}
//             </p>

//             <p className='text-slate-500  mt-2 font-semibold'>
//                 #{listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US') }
//                 {listing.type === "rent" && ' / Year'}
//             </p>
//             <div className="text-slate-700 flex gap-4 ">
//                 <div className="font-bold text-xs">
//                     {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
//                 </div>
//                 <div className="font-bold text-xs">
//                     {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
//                 </div>
//             </div>
//           </div>
//         </Link>
//     </div>
//   )
// }
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa"; // Added phone icon

export default function ListingItem({ listing }) {
  const price = listing.offer ? listing.discountPrice : listing.regularPrice;

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[280px]">
      <Link to={`/listing/${listing._id}`}>
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[280px]">
          <img
            src={listing.imageUrls[0]}
            alt="Image"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />

          <div className="p-3 flex flex-col gap-2 w-full">
            <p className="truncate text-lg text-slate-700 font-semibold">
              {listing.name}
            </p>
            <div className="flex items-center gap-2">
              <MdLocationOn className="h-4 w-4 text-green-700" />
              <p className="text-sm text-gray-600 truncate w-full">
                {listing.address}
              </p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>

            <p className="text-slate-500 mt-2 font-semibold">
              #{price.toLocaleString("en-US")}
              {listing.type === "rent" && " / Year"}
              {listing.type === "sale" && " (For Sale)"}
            </p>

            <div className="text-slate-700 flex gap-4">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </div>
            </div>

            {/* Phone number section */}
            {listing.phone && (
              <div className="flex items-center gap-2 mt-3">
                <FaPhoneAlt className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-gray-700">{listing.phone}</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
