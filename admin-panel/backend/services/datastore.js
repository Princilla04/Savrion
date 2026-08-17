const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

const readCollection = (collection) => {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading collection ${collection}:`, err);
    return [];
  }
};

const writeCollection = (collection, data) => {
  const file = getFilePath(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

const datastore = {
  async find(collection, query = {}) {
    let items = readCollection(collection);
    return items.filter(item => {
      return Object.keys(query).every(key => {
        if (query[key] === undefined) return true;
        return String(item[key]) === String(query[key]);
      });
    });
  },

  async findOne(collection, query = {}) {
    const items = await this.find(collection, query);
    return items[0] || null;
  },

  async findById(collection, id) {
    const items = readCollection(collection);
    return items.find(item => String(item._id || item.id) === String(id)) || null;
  },

  async create(collection, doc) {
    const items = readCollection(collection);
    const newItem = {
      _id: doc._id || 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newItem);
    writeCollection(collection, items);
    return newItem;
  },

  async findByIdAndUpdate(collection, id, update, options = { new: true }) {
    let items = readCollection(collection);
    const index = items.findIndex(item => String(item._id || item.id) === String(id));
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...update,
      updatedAt: new Date().toISOString()
    };
    writeCollection(collection, items);
    return items[index];
  },

  async findByIdAndDelete(collection, id) {
    let items = readCollection(collection);
    const itemToDelete = items.find(item => String(item._id || item.id) === String(id));
    if (!itemToDelete) return null;

    items = items.filter(item => String(item._id || item.id) !== String(id));
    writeCollection(collection, items);
    return itemToDelete;
  },

  async count(collection, query = {}) {
    const items = await this.find(collection, query);
    return items.length;
  }
};

module.exports = datastore;
