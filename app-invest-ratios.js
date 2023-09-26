const express = require('express');
const app = express();
const financialRoutes = require('./src/routes/financial.route');
const cacheService = require('./src/services/node.cache.service');

// Init Cache
cacheService.startCache();

app.use(express.json());

// Serve static files for frontend1
app.use('/frontend1', express.static(__dirname + '/frontend1'));

// Serve static files for frontend2
app.use('/frontend2', express.static(__dirname + '/frontend2'));

// ... other middleware ...

// segregate code to routers according to features
app.use('/financial', financialRoutes);

// ... start the server ...
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


