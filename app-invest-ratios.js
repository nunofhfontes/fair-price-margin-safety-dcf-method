const express = require('express');
const app = express();
const financialRoutes = require('./src/routes/financialRoutes');

app.use(express.json());

// Serve static files for frontend1
app.use('/frontend1', express.static(__dirname + '/frontend1'));

// Serve static files for frontend2
app.use('/frontend2', express.static(__dirname + '/frontend2'));

// ... other middleware ...

app.use('/financial', financialRoutes);


// ... start the server ...
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
