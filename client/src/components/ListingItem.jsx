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
import { FaPhoneAlt } from "react-icons/fa";

export default function ListingItem({ listing }) {
  const price = listing.offer ? listing.discountPrice : listing.regularPrice;

  return (
    <div className="group bg-white shadow-md hover:shadow-xl transition rounded-2xl overflow-hidden w-full sm:w-[300px] border border-gray-100">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <div className="relative w-full h-[220px] overflow-hidden">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
          />
          {listing.offer && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow">
              {Math.round(
                ((listing.regularPrice - listing.discountPrice) /
                  listing.regularPrice) *
                  100
              )}
              % OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h2 className="truncate text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition">
            {listing.name}
          </h2>

          <div className="flex items-center gap-2 text-gray-600">
            <MdLocationOn className="h-5 w-5 text-green-600" />
            <p className="truncate text-sm">{listing.address}</p>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2">
            {listing.description}
          </p>

          {/* Price */}
          <p className="text-blue-700 font-bold mt-2">
            #{price.toLocaleString("en-US")}
            {listing.type === "rent" && (
              <span className="text-sm text-gray-500"> / year</span>
            )}
            {listing.type === "sale" && (
              <span className="text-sm text-gray-500"> (For Sale)</span>
            )}
          </p>

          {/* Bedrooms & Bathrooms */}
          <div className="flex gap-6 text-gray-700 text-sm mt-2">
            <span className="font-medium">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </span>
            <span className="font-medium">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </span>
          </div>

          {/* Phone number */}
          {listing.phone && (
            <div className="flex items-center gap-2 mt-3 text-gray-700">
              <FaPhoneAlt className="h-4 w-4 text-blue-600" />
              <a
                href={`tel:${listing.phone}`}
                className="text-sm hover:underline"
              >
                {listing.phone}
              </a>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
