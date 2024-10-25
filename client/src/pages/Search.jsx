import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort:'created_at',
        order: 'desc',
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [showMore, setShowMore] = useState(false)

    useEffect(()=>{
        const urlparams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlparams.get('searchTerm');
        const typeFromUrl = urlparams.get('type');
        const parkingFromUrl = urlparams.get('parking');
        const furnishedFromUrl = urlparams.get('furnished');
        const offerFromUrl = urlparams.get('offer');
        const sortFromUrl = urlparams.get('sort');
        const orderFromUrl = urlparams.get('order');

        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl){
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true'  ? true : false,
                offer: offerFromUrl === 'true'  ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }
        const fetchListings = async () => {
         setLoading(true);
         setShowMore(false)
         const searchQuery = urlparams.toString();
         const res = await fetch(`/api/listing/get?${searchQuery}`);
         const data = await res.json();
         setListings(data);
         if(data.length > 8){
             setShowMore(true);
         } else{
             setShowMore(false);
         }
         setListings(data);
         setLoading(false);
        

        }
        fetchListings()

    },[location.search]);
    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({...sidebarData, type: e.target.id });
        }
        if(e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm: e.target.value });
        }
        if(e.target.id === 'parking'|| e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? 'true' : false});
        }
        if(e.target.id === 'sort_order'){

            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebarData, sort, order});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform search query and filter the listings based on the sidebarData state
        // You can use the searchTerm, type, parking, furnished, offer, sort, and order properties for your search query
        // Make sure to handle any errors or successful search in your backend code

        const urlparams = new URLSearchParams();
        urlparams.set('searchTerm', sidebarData.searchTerm);
        urlparams.set('type', sidebarData.type);
        urlparams.set('parking', sidebarData.parking);
        urlparams.set('furnished', sidebarData.furnished);
        urlparams.set('sort', sidebarData.sort);
        urlparams.set('order', sidebarData.order);
        urlparams.set('offer', sidebarData.offer);
        // Construct the search query parameters string from the sidebarData state
        const searchQuery = urlparams.toString()
        // Navigate to the search results page with the query parameters
        navigate(`/search?${searchQuery}`) 
        

        
    };
    const onShowMoreClick = async() => {
        const numberOfListings = listings.length
        const startIndex = numberOfListings 
        const urlparams = new URLSearchParams(location.search)
        urlparams.set('startIndex', startIndex)
        const searchQuery = urlparams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false)
        }
        setListings([...listings, ...data])
    }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md: min-h-screen">
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
               <div className="flex items-center gap-4 my-7">
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input type="text" placeholder="Enter search term" id='searchTerm' className='border rounded-lg p-3 w-full' value={sidebarData.searchTerm} onChange={handleChange}/>
               </div>
               <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Type:</label>
                <div className="flex gap-2">
                    <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sidebarData.type === 'all'}/>
                    <span>Rent & Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebarData.type === 'rent'}/>
                    <span>Rent </span>
                </div>
                <div className="flex gap-2">
                    <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={sidebarData.type === 'sale'}/>
                    <span>Sale</span>
                </div>
                <div className="flex gap-2">
                    <input type='checkbox' id='offer' className='w-5'
                    onChange={handleChange} checked={sidebarData.offer}/>
                    <span>Offer</span>
                </div>
               </div>
               <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Amenities:</label>
                <div className="flex gap-2">
                    <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sidebarData.parking}/>
                    <span>Parking</span>
                </div>
                <div className="flex gap-2">
                    <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={sidebarData.furnished}/>
                    <span>Furnished</span>
                </div>
               </div>
               <div className="flex items-center gap-2">
                <label className='font-semibold'>Sort:</label>
                <select onChange={handleChange}
                defaultValue={'created_at_desc'}
                 id='sort_order' className='border rounded-lg p-3'>
                  <option value='regularPrice_desc'>Price high to low</option>
                  <option value='regularPrice_asc'>Low high to high</option>
                  <option value='createdAt_desc'>Latest</option>
                  <option value='createdAt_asc'>Oldest</option>
                </select>
               </div>
               <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                Listing Result
            </h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700 '>No listing found!</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                )}
                {
                    !loading && listings && listings.map((listing) => (
                       <ListingItem  key={listing._id} listing={listing} />
                    ))
                }
                {showMore && (
                        <button onClick={onShowMoreClick} className='text-green-700 p-7 text-center w-full  uppercase hover:underline'>Show More</button> 
                )}
            </div>
        </div>
    </div>
  )
}
