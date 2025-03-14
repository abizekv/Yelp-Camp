const Campground = require('../models/campground');
const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Connected to Database [SUCCESS]');
}


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 10;
        const camp = new Campground({
            author: '67c55a03effd8baa1a5e0d5d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim, ab possimus? Cupiditate ad veniam fugiat sapiente eos quos dolore sunt voluptate veritatis ipsum non fugit ut illum, itaque, ea  Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam animi, quos, ratione, tenetur voluptatibus eum molestias optio unde possimus nemo harum excepturi illum nulla totam natus. A voluptates maxime possimus.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dxoaqvrtb/image/upload/v1741262106/YelpCamp/lnmky0tjxmdp4pizvpmi.jpg',
                    filename: 'YelpCamp/lnmky0tjxmdp4pizvpmi',
                },
                {
                    url: 'https://res.cloudinary.com/dxoaqvrtb/image/upload/v1741262106/YelpCamp/srvpxwyl9yyqhbbru4le.jpg',
                    filename: 'YelpCamp/srvpxwyl9yyqhbbru4le',
                }
            ]
        });
        await camp.save();
    }
}

seedDb()
    .then(() => {
        console.log('Seeded to database [SUCCESS]')
        mongoose.disconnect();
    })

