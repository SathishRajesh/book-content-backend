const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const dbPath = path.join(__dirname, '../storage/db.json');
const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

exports.createPage = async (req, res) => {
  const { chapterId } = req.params;
  const { title, content, username } = req.body;

  const db = await readDB();

  for (const book of db.books) {
    const chapter = book.chapters.find(c => c.id === chapterId);
    if (!chapter) continue;
    chapter.pages ||= [];
    chapter.versions ||= [];
    const pageId = nanoid();
    chapter.pages.push({ id: pageId, title,username });
    chapter.versions.push({
      pageId,
      version: 1,
      username,
      content,
      timestamp: new Date().toISOString()
    });

    writeDB(db);
    return res.json(chapter);
  }

  res.status(404).json({ message: 'Chapter not found' });
};


exports.updatePage = (req, res) => {
  const { pageId } = req.params;
  const { content } = req.body;

  const db = readDB();
  db.books.forEach(book =>
    book.chapters.forEach(ch =>
      ch.pages.forEach(p => {
        if (p.id === pageId) {
          p.versions.push({
            version: p.versions.length + 1,
            content,
            timestamp: new Date().toISOString()
          });
        }
      })
    )
  );

  writeDB(db);
  res.json({ message: 'Version added' });
};

exports.restorePage = async (req, res) => {
  const { chapterId, pageIndex } = req.params;
  const db = await readDB();

  for (const book of db.books) {
    const chapter = book.chapters.find(c => c.id === chapterId);
    if (!chapter) continue;

    const index = Number(pageIndex);
    const removedPages = chapter.pages.slice(index + 1);

    if (!removedPages.length) {
      return res.json(chapter);
    }
    chapter.pages = chapter.pages.slice(0, index + 1);
    removedPages.forEach(page => {
      const pageVersions = chapter.versions.filter(
        v => v.pageId === page.id
      );

      const lastVersion = pageVersions.at(-1);

      chapter.versions.push({
        pageId: page.id,
        version: pageVersions.length + 1,
        username:page.username,
        content: lastVersion.content,
        timestamp: new Date().toISOString()
      });
    });

    writeDB(db);
    return res.json(chapter);
  }

  res.status(404).json({ message: 'Chapter not found' });
};
