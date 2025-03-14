# PART 1
//creating 50 campgrounds

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}


//to disconnect from mongoose after saving

     seedDb()
     .then(()=>{
         mongoose.disconnect();
     })

# PART 2
  npm i ejs-mate

  //requiring ejs mate
  const ejsMate = require('ejs-mate'); 
  
  //register ejs-mate as the template engine for .ejs files
  app.engine('ejs', ejsMate);







additional tips:
tip 1:
     in form submission
        <form action="/campgrounds" method="POST">
            <label for="title">Camp Title</label>
            <input type="text" id="title" name="campground[title]">
            <button>Create</button>
        </form>
    
    name="campground[title]" will make req.body like this:
    
    {
      "campground": {
        "title": "User Input Here"
      }
    }
                                   -standard form submission


   instead of:
   {
       name = "title"
   }

Gpt QnA's:
[YelpCamp QnA pt.1](https://chatgpt.com/share/67aee059-5148-800a-bc5b-9fa4344e929a)


the steps:
npm i express ejs mongoose
Basic CRUD functionalities
   do the CRUD routes , render ejs files
npm i method-override

bootstrap
  navbar
  cards

client side form validation  
  form > validation  (bootstrap)
  client side validation
  postman validation
  
  npm i joi -> Data validation

  
