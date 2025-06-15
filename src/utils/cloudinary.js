import {v2 as cloudinary} from 'cloudinary'; 
import fs from 'fs';
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Click 'View API Keys' above to copy your cloud name
        api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null
            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            // file has been uploaded successfull
            //console.log("file is uploaded on cloudinary ", response.url);
             fs.unlinkSync(localFilePath)
            return response;
    
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
             fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
            return null;
        }
    }
    
    
    
    export {uploadOnCloudinary}