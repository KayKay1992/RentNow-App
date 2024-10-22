import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


export default function Contact({listing}) {
    const [landlord, setLandlord] =useState(null)
    const [message, setMessage] = useState('')

    useEffect(()=> {
        const fetchLandlord = async () => {
            try{
                const res = await fetch (`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandlord(data)
            }catch(error){
                console.log(error)
                setLandlord(null)
            }
        }
        fetchLandlord()

    }, [listing.userRef])
    const onChange = (e) => {
        setMessage(e.target.value)
    }
  return (
    <>
    {landlord && (
        <div className="flex flex-col gap-2">
            <p>Contact<span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase}</span></p>
            <textarea name="messasge" className="w-full border p-3 rounded-lg " id="message" rows="2" value={message} onChange={onChange} placeholder="Enter your message here...."></textarea>

            <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
             Send Message
            </Link>
        </div>
    )}
    </>
  )
}
