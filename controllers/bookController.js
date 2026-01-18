const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const dbPath = path.join(__dirname, '../storage/db.json');

const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

exports.createBook = (req, res) => {
  const { title, description, username } = req.body;
  if (!title || !description || !username)
    return res.status(400).json({ message: 'All fields required' });
  const db = readDB();
  const book = {
    id: nanoid(),
    title,
    description,
    username,
    chapters: []
  };

  db.books.push(book);
  writeDB(db);
  res.json(book);
};

exports.getBooks = (req, res) => {
  const db = readDB();
  res.json(db.books);
};
