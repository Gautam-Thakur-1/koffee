
import User from "../model/User";
export const generateAccessToken = async(id: string) => {
    try {
     const user = await User.findById(id);
     const accessToken = user.getSignedJwtToken();
     await user.save({validateBeforeSave: false});
     return accessToken;  
    } catch (error) {
       console.log("error.......",error);
       Response.json({error: "error while generating token"});
    }
   
   }