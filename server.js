const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve apartments.json data
app.get('/apartments', (req, res) => {
    fs.readFile(path.join(__dirname, 'apartments.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the apartments data');
        } else {
            res.type('json').send(JSON.parse(data));
        }
    });
});

app.delete('/apartments/:unit_number', (req, res) => {
    const unitNumber = req.params.unit_number;
  
    fs.readFile(path.join(__dirname, 'apartments.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading the apartments data');
      }
  
      let apartments;
      try {
        apartments = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send('Error parsing the apartments data');
      }
  
      if (!Array.isArray(apartments)) {
        return res.status(500).send('Apartment data is not an array');
      }
  
      // Find the index of the apartment with the given unit number
      const index = apartments.findIndex(apartment => apartment.unit_number === unitNumber);
  
      if (index !== -1) {
        apartments.splice(index, 1);
  
        fs.writeFile(path.join(__dirname, 'apartments.json'), JSON.stringify(apartments, null, 2), 'utf8', (writeErr) => {
          if (writeErr) {
            return res.status(500).send('Error writing the apartments data');
          }
  
          res.status(204).send();
        });
      } else {
        res.status(404).send({ message: "Apartment not found" });
      }
    });
  });
  



// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
