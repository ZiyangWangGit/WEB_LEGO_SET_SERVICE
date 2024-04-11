require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});

const Theme = sequelize.define(
    'Theme', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
    },
    name: Sequelize.STRING,
}, 
{
    createdAt: false, 
    updatedAt: false, 
});

const Set = sequelize.define(
    'Set', 
    {
        set_num: {
            type: Sequelize.STRING,
            primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING
}, 
{
    createdAt: false, 
    updatedAt: false, 
});

Set.belongsTo(Theme, { foreignKey: 'theme_id' });


function initialize() {
    return sequelize.sync()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((err) => {
            console.log(err);
        });
}

let getAllSets = () => {
    return Set.findAll({ include: [Theme] });
};

let getSetByNum = (setNum) => {
    return Set.findOne({ 
        where: { set_num: setNum }, 
        include: [Theme] 
    })
    .then(foundSet  => {
        if (!foundSet ) {
            throw new Error('Unable to find requested set');
        }
        return foundSet;
    });
};

let getSetsByTheme = (theme) => {
    return Set.findAll({ 
        include: [Theme],
        where: {
            '$Theme.name$': {
                [Sequelize.Op.iLike]: `%${theme}%`
            }
        }
    })
    .then(foundSets => {
        if (foundSets.length === 0) {
            throw new Error('Unable to find requested sets');
        }
        return foundSets;
    });
};


let addSet = (setData) => {
    return new Promise((resolve, reject) => {
        Set.create(setData)
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err.errors[0].message);
            });
    });
}


let getAllThemes = () => {
    return new Promise((resolve, reject) => {
        Theme.findAll()
            .then(themes => {
                resolve(themes);
            })
            .catch(err => {
                reject(err.message);
            });
    });
};

let editSet = (set_num, setData) => {
    return new Promise((resolve, reject) => {
        Set.update(setData, { 
            where: {set_num: set_num} 
        })
            .then(() => {
                resolve(); 
            })
            .catch((err) => {
                reject(err.errors[0].message); 
            });
    });
};

let deleteSet = (set_num) => {
    return new Promise((resolve, reject) => {
        Set.destroy({
            where: {set_num: set_num}
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err.errors[0].message);
        });
    });
};


module.exports = { Theme, Set, initialize, getAllSets, getSetByNum, getSetsByTheme,addSet,getAllThemes,editSet,deleteSet };