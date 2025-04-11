import  mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import {Schema} from 'mongoose';        
const vedioSchema = new Schema(
    {
        videoFile: {    
            type: String, // cloudinary url
            required: true,
        },
        thumbnail: {
            type: String, // cloudinary url
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        description: {
            type: String,
            required: true,
            trim: true, 
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        ispublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

},
    {
        timestamps: true
    }
)
videoSchema.plugin(mongooseAggregatePaginate);

export const Vedio = mongoose.model("Vedio", vedioSchema);