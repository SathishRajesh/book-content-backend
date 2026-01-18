const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const dbPath = path.join(__dirname, '../storage/db.json');
const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

exports.createChapter = (req, res) => {
  const { bookId } = req.params;
  const { title } = req.body;

  const db = readDB();
  const book = db.books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  book.chapters.push({
    id: nanoid(),
    title,
    pages: []
  });

  writeDB(db);
  res.json(book);
};
