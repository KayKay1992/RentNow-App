import Listing from "../models/listing.model.js";


export const createListing = async (req, res, next) => {
    // Implement listing creation logic here
    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    }
    catch (error) {
        next(error);
       
    }
}