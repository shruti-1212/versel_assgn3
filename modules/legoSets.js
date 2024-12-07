/******************************************************************************** 
*  WEB700 – Assignment 6
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  Name: Shruti Hande Student ID: 111559233 Date: 06-12-2024 
********************************************************************************/
require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

class legoData {
    constructor() {
         // Initialize Sequelize instance
    this.sequelize = new Sequelize(
        process.env.DBDATABASE,
        process.env.DBUSER,
        process.env.DBPASSWORD,
        {
            host: process.env.DBHOST,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            logging: false,
        }
    );

    // Define the "Theme" model
    this.Theme = this.sequelize.define('Theme', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
    }, {
        timestamps: false, // Disable createdAt/updatedAt
    });

    // Define the "Set" model
    this.Set = this.sequelize.define('Set', {
        set_num: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        year: Sequelize.INTEGER,
        num_parts: Sequelize.INTEGER,
        theme_id: Sequelize.INTEGER,
        img_url: Sequelize.STRING,
    }, {
        timestamps: false, // Disable createdAt/updatedAt
    });

    // Establish association between "Set" and "Theme"
    this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' });

    }

    // Initialize method using promises
    initialize() {
        return new Promise((resolve, reject) => {
            this.sequelize.sync()
                .then(() => {
                    console.log("Database synchronized successfully.");
                    resolve();
                })
                .catch(err => {
                    console.error("Failed to synchronize the database:", err);
                    reject(err);
                });
        });
    }

    // Return all sets using promises
    getAllSets() {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
              include: [this.Theme], // Include related Theme data
            })
              .then((sets) => {
                resolve(sets.map((set) => set.toJSON())); // Resolve with JSON-formatted data
              })
              .catch((err) => {
                reject(`Error retrieving sets: ${err}`);
              });
          });
    }

    // Return all themes using promises
    getAllThemes() {
        return new Promise((resolve, reject) => {
            // Use Sequelize's findAll method to retrieve all themes
            this.Theme.findAll()
              .then((themes) => {
                resolve(themes); // Resolve the promise with all retrieved themes
              })
              .catch((err) => {
                reject("Unable to find themes: " + err.message); // Reject the promise if there's an error
              });
          });
    }

    // Find set by set number using promises
    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
              where: { set_num: setNum }, // Filter by set_num
              include: [this.Theme], // Include related Theme data
            })
              .then((sets) => {
                if (sets.length > 0) {
                  resolve(sets[0].toJSON()); // Resolve with the first matching set
                } else {
                  reject(`Unable to find requested set with set_num: ${setNum}`);
                }
              })
              .catch((err) => {
                reject(`Error retrieving set: ${err}`);
              });
          });
    }

    // Find sets by theme using promises
    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
              include: [this.Theme], // Include associated Theme data
              where: {
                '$Theme.name$': {
                  [Sequelize.Op.iLike]: `%${theme}%`, // Case-insensitive match for theme name
                },
              },
            })
              .then((sets) => {
                if (sets.length > 0) {
                  resolve(sets); // Resolve with the matching sets
                } else {
                  reject(`Unable to find requested sets for theme: ${theme}`);
                }
              })
              .catch((err) => {
                reject(`Error retrieving sets by theme: ${err}`);
              });
          });
    }
    // Add a new set using promises
    addSet(newSet) {
        return new Promise((resolve, reject) => {
            // Create a new set using Sequelize's "create" method
            this.Set.create(newSet)
              .then(() => {
                resolve(); // Resolve the promise without any data if the set is added successfully
              })
              .catch((err) => {
                // Reject the promise with a human-readable error message
                reject(err.errors[0].message);
              });
          });
    }
    // Delete set by set number
    deleteSetByNum(setNum) {

        return new Promise((resolve, reject) => {
            // Use Sequelize's destroy method to delete the set with the matching set_num
            this.Set.destroy({
              where: {
                set_num: setNum, // Condition to match the set_num in the database
              }
            })
              .then((rowsDeleted) => {
                if (rowsDeleted === 0) {
                  // If no rows were deleted, it means the set_num doesn't exist
                  reject("Unable to find the requested set to delete");
                } else {
                  // If rows were deleted, resolve the promise
                  resolve(`Set with set_num ${setNum} was successfully deleted`);
                }
              })
              .catch((err) => {
                // If an error occurs, reject the promise with the error message
                reject("Error deleting set: " + err.errors[0].message);
              });
          });
       }

}

module.exports = legoData;