const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry:{
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  
}, opts);


//it's working
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
   return `<a href="/campgrounds/${this._id}">${this.title}</a>
   <p>${this.description.substring(0,80)}</p>
   `
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);