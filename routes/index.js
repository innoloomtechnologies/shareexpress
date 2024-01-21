var express = require('express');
var router = express.Router();
const cors = require('cors');
/* GET home page. */



/////////////////////////////////////////

const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

router.use(cors());
router.use(express.json());
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
mongoose.connect('mongodb+srv://pratiknagalgave1:Pratikchecom@cluster0.40wkmjj.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const microWebsiteSchema = new mongoose.Schema({
  userId: String,
  content: String,
});

const microCardSchema = new mongoose.Schema({
  userId: String,url: String,name: String,company: String,designation: String,contact: String,email: String,profilepic: String,coverpic: String,location: String,facebook: String,instagram: String,github: String,twitter: String
});

const MicroWebsite = mongoose.model('MicroWebsite', microWebsiteSchema);
const MicroCard = mongoose.model('MicroCard', microCardSchema);

router.post('/api/microwebsites', async (req, res) => {
  const { userId, content } = req.body;

  try {
    const microWebsite = new MicroWebsite({ userId, content });
    await microWebsite.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving micro website:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/api/microcard', async (req, res) => {
  const { userId,url,name,company,designation,contact,email,profilepic,coverpic,location,facebook,instagram,github,twitter } = req.body;

  try {
    const microCard = new MicroCard({ userId, url,name,company,designation,contact,email,profilepic,coverpic,location,facebook,instagram,github,twitter });
    await microCard.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving micro website:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/api/microwebsites/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const microWebsites = await MicroWebsite.find({ userId });
    res.status(200).json({ success: true, microWebsites });
  } catch (error) {
    console.error('Error fetching micro websites:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/api/micrwebsites/card/:url', async (req, res) => {
  const url = req.params.url;
 
  try {
    const microCards = await MicroCard.find({ url });
    
    
    if(microCards.map(item => item.url).includes(url)){
      res.status(200).json({ exist:true,success: true, microCards });
    }else{
      res.status(200).json({ exist:false,success: true, microCards });
    }
   
    
  } catch (error) {
    console.error('Error fetching micro card:', error);
    res.status(500).json({ exist: false,success: false, error: 'Internal Server Error' });
  }
});


router.get('/api/microcards/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const microCards = await MicroCard.find({ userId });
    res.status(200).json({ success: true, microCards });
  } catch (error) {
    console.error('Error fetching micro websites:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

////////////////delete


router.get('/api/microcards/delete/:url', async (req, res) => {
  const url = req.params.url;

  try {
    const microCards = await MicroCard.deleteOne({ url });
    res.status(200).json({ success: true, microCards });
  } catch (error) {
    console.error('Error fetching micro websites:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


/////modify data
router.post('/api/microcard/:url', async (req, res) => {
  const { userId, name, company, designation, contact, email, profilepic, coverpic, location, facebook, instagram, github, twitter } = req.body;
  const urlParam = req.params.url;

  try {
    // Use findOneAndUpdate to find a document based on the URL parameter and update its fields
    const result = await MicroCard.findOneAndUpdate(
      { url: urlParam },
      {
        userId,
        name,
        company,
        designation,
        contact,
        email,
        profilepic,
        coverpic,
        location,
        facebook,
        instagram,
        github,
        twitter,
      },
      { new: true } // Set to true to return the updated document
    );

    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      // If no document is found with the provided URL, you can choose to handle it accordingly (e.g., return a 404 status)
      res.status(404).json({ success: false, error: 'Document not found' });
    }
  } catch (error) {
    console.error('Error updating micro website:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//////////////////////// sitemap
const sitemapPath = path.join(__dirname, './components/sitemap.xml');

// Middleware to serve the sitemap.xml file
router.get('/sitemap.xml', (req, res) => {
  res.sendFile(sitemapPath, (err) => {
    if (err) {
      // Handle the error, for example, log it and send a 500 status
      console.error(err);
      res.status(500).end();
    }
  });
});




///////////////////////////////////

module.exports = router;
