require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose.connect(DB_CONNECTION_STRING)
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error(err.message);
  });

  const themeSchema = new Schema({
    id: {
      type: String,
      unique: true
    },
    name: String
  });

const setSchema = new Schema({
  set_num: String,
  name: String,
  year: Number,
  num_parts: Number,
  theme_id: Number,
  img_url: String,
});

const Theme = mongoose.model('Theme', themeSchema);
const Set = mongoose.model('Set', setSchema);

const GetAllSets = async () => {
  try {
    const sets = await Set.find().populate('theme_id').exec();
    if (!sets) {
      console.log('No sets found');
    } else {
      console.log(sets);
    }
    return sets;
  } catch (err) {
    console.error(err.message);
  }
};

const GetSetByNum = async (setNum) => {
  try {
    const foundSet = await Set.findOne({ set_num: setNum }).populate('theme_id').exec();
    if (!foundSet) {
      throw new Error('Unable to find requested set');
    }
    return foundSet;
  } catch (err) {
    throw new Error(err.message);
  }
};

const GetSetsByTheme = async (theme) => {
  try {
    const foundSets = await Set.find({}).populate('theme_id').exec();
    foundSets.populate('theme_id').execPopulate()
    .then((sets) => {
      console.log('Populated sets:', sets);
    })
    .catch((err) => {
      console.error(err);
    });
    if (foundSets.length === 0) {
      throw new Error('Unable to find requested sets');
    }
    return foundSets;
  } catch (err) {
    throw new Error(err.message);
  }
};

const AddSet = (setData) => {
  Set.create(setData)
    .then(() => {
      console.log('Set added:', setData.set_num);
    })
    .catch((err) => {
      console.error( err.message);
    });
};

const GetAllThemes = async () => {
  try {
    const themes = await Theme.find();
    return themes;
  } catch (err) {
    throw new Error(err.message);
  }
};

const EditSet = (set_num, setData) => {
  Set.updateOne({ set_num: set_num }, setData)
    .exec()
    .then(() => {
      console.log('Set edited:', set_num);
    })
    .catch((err) => {
      console.error(err.message);
    });
};

const DeleteSet = (set_num) => {
  Set.deleteOne({ set_num: set_num })
    .exec()
    .then(() => {
      console.log('Set removed:', set_num);
    })
    .catch((err) => {
      console.error( err.message);
    });
};

module.exports = {
  Theme,
  Set,
  GetAllSets,
  GetSetByNum,
  GetSetsByTheme,
  AddSet,
  GetAllThemes,
  EditSet,
  DeleteSet,
};
