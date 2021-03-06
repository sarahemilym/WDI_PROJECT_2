const express    = require('express');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const rp         = require('request-promise');
const cors       = require('cors');
const expressJWT = require('express-jwt');
const config     = require('./config/config');
const webRoutes  = require('./config/webRoutes');
const apiRoutes  = require('./config/apiRoutes');

const app = express();

mongoose.connect(config.db);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use('/api', expressJWT({ secret: config.secret })
.unless({
  path: [
    { url: '/api/login', methods: ['POST'] },
    { url: '/api/register', methods: ['POST'] },
    { url: '/api/resorts', methods: ['GET'] },
    { url: '/api/resortForecast', methods: ['GET'] },
    { url: '/api/resortWeather', methods: ['GET'] }
  ]
}));
app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next){
  if (err.name !== 'UnauthorizedError') return next();
  return res.status(401).json({ message: 'Unauthorized request.' + err });
}


app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.get('/api/resorts', (req, res) => {
  return rp('https://skimap.org/SkiAreas/index.json')
  .then(htmlString => {
    const json = JSON.parse(htmlString);
    return res.status(200).json(json);
  })
  .catch(err => {
    return res.status(500).json(err);
  });
});

app.get('/api/skimaps', (req, res) => {
  return rp('https://skimap.org/SkiMaps/view/345.xml')
  .then(htmlString => {
    const json = JSON.parse(htmlString);
    return res.status(200).json(json);
  })
  .catch(err => {
    return res.status(500).json(err);
  });
});

app.listen(config.port, () => console.log(`Express started on port: ${config.port}`));
