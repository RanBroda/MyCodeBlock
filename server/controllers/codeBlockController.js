const { ObjectId } = require('mongodb');
const { initConnectDB } = require('../utils/database');
const path = require('path');


exports.getAllCodeBlocks = async (req, res) => {
  try {
    const db = await initConnectDB();
    const codeBlocks = await db.collection('CodeBlocks').find().toArray();
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).send('Error fetching code blocks');
  }
};

exports.getCodeBlockById = async (req, res) => {
  try {
    const db = await initConnectDB();
    const codeBlock = await db.collection('CodeBlocks').findOne({_id: new ObjectId(req.params.id)});
    if (!codeBlock) {
      return res.status(404).send('Code block not found');
    }
    res.json(codeBlock);
  } catch (error) {
    res.status(500).send('Error fetching code block');
  }
};

exports.getDefult =  (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
};
