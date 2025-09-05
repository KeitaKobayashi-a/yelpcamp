const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("🙆MongoDB connection ok 🙆MongoDB　connection ok 🙆");
  })
  .catch(() => {
    console.log("❌MongoDB　connection error❌MongoDB　connection error❌");
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 2000) + 1000;
    const camp = await new Campground({
      title: `${sample(descriptors)}・${sample(places)}`,
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
      author: "68b63c37f3447a0be6c277b3",
       geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomCityIndex].longitude,
                    cities[randomCityIndex].latitude
                ]
            },
      description:
        "親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/diusdsiuf/image/upload/v1756859967/YelpCamp/ncfbdazixouhkunmh8ms.jpg",
          filename: "YelpCamp/ncfbdazixouhkunmh8ms",
        },
        {
          url: "https://res.cloudinary.com/diusdsiuf/image/upload/v1756859972/YelpCamp/fhpvukhvweu3qhn5ccyu.jpg",
          filename: "YelpCamp/fhpvukhvweu3qhn5ccyu",
        },
       
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
