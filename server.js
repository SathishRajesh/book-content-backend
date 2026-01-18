const express = require('express');
const cors = require('cors');

const bookRoutes = require('./routes/books');
const chapterRoutes = require('./routes/chapters');
const pageRoutes = require('./routes/pages');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/books', bookRoutes);
app.use('/chapters', chapterRoutes);
app.use('/pages', pageRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
