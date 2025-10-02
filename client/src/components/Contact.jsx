// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"


// export default function Contact({listing}) {
//     const [landlord, setLandlord] =useState(null)
//     const [message, setMessage] = useState('')

//     const onChange = (e) => {
//         setMessage(e.target.value)
//     }

//     useEffect(()=> {
//         const fetchLandlord = async () => {
            
//               try {
//                 const res = await fetch(`/api/user/${listing.userRef}`);
//                 const data = await res.json();
//                 setLandlord(data)
//                 console.log(data)
//               }
//               catch (error) {
//                 console.error(error)
//               }
//         };
//         fetchLandlord()

//     }, [listing.userRef])
    
//   return (
//     <>
//     {landlord && (
//         <div className="flex flex-col gap-2">
//             <p>Contact<span className="font-semibold"> {landlord.username}</span> {''}for{''} <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
//             <textarea name="messasge" className="w-full border p-3 rounded-lg " id="message" rows="2" value={message} onChange={onChange} placeholder="Enter your message here...."></textarea>

//             <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
//              Send Message
//             </Link>
//         </div>
//     )}
//     </>
//   )
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // ✅ Backend base URL

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/${listing.userRef}`);

        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.warn("Response was not valid JSON, raw text:", await res.text());
          data = null;
        }

        if (data && data.success !== false) {
          console.log("Landlord fetched:", data);
          setLandlord(data);
        } else {
          console.error("Failed to fetch landlord:", data);
          setLandlord(null);
        }
      } catch (error) {
        console.error("Error fetching landlord:", error);
        setLandlord(null);
      } finally {
        setLoading(false);
      }
    };

    if (listing?.userRef) {
      fetchLandlord();
    }
  }, [listing.userRef]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert("Please enter a message before sending.");
      return;
    }

    if (!landlord?.email) {
      alert("Landlord's email is not available.");
      return;
    }

    const subject = `Regarding ${listing.name}`;
    const encodedMessage = encodeURIComponent(message);

    // ✅ Open default mail app
    window.location.href = `mailto:${landlord.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodedMessage}`;
  };

  if (loading) {
    return <p>Loading landlord details...</p>;
  }

  return (
    <>
      {landlord ? (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">{landlord.username}</span> for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          {/* ✅ Display landlord's phone number if available */}
          {listing.phone ? (
            <div className="flex gap-2 items-center">
              <label className="font-semibold">Phone:</label>
              <a
                href={`tel:${listing.phone}`}
                className="text-blue-500 hover:underline"
              >
                {listing.phone}
              </a>
            </div>
          ) : (
            <p>No phone number available for this landlord.</p>
          )}

          {/* ✅ Message textarea */}
          <textarea
            name="message"
            className="w-full border p-3 rounded-lg"
            id="message"
            rows="4"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
          />

          {/* ✅ Send Message Button */}
          <button
            onClick={handleSendMessage}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </button>
        </div>
      ) : (
        <p>Landlord not found.</p>
      )}
    </>
  );
}
