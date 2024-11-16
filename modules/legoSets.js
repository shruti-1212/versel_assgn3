/******************************************************************************** 
*  WEB700 – Assignment 5
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  Name: Shruti Hande Student ID: 111559233 Date: 01-11-2024 
********************************************************************************/

class legoData {
    constructor() {
        this.sets = [];
        this.themes = [];// Added "themes" property and initialized it as an empty array
    }

    // Initialize method using promises
    initialize() {
        return new Promise((resolve, reject) => {
            try {
                const setData = require("../data/setData");
                const themeData = require("../data/themeData");

                // Populate the themes array with the contents of themeData
                this.themes = [...themeData];

                // Map theme id to theme name
                const themeMap = {};
                themeData.forEach(theme => {
                    themeMap[theme.id] = theme.name;
                });

                // Push each set with the corresponding theme name into the sets array
                setData.forEach(set => {
                    const setWithTheme = {
                        ...set,
                        theme: themeMap[set.theme_id]
                    };
                    this.sets.push(setWithTheme);
                });

                resolve(); // Resolve when initialization is complete
            } catch (error) {
                reject(`Initialization failed: ${error.message}`);
            }
        });
    }

    // Return all sets using promises
    getAllSets() {
        return new Promise((resolve, reject) => {
            if (this.sets.length > 0) {
                resolve(this.sets);
            } else {
                reject('No sets available.');
            }
        });
    }

    // Return all themes using promises
    getAllThemes() {
        return new Promise((resolve, reject) => {
            if (this.themes.length > 0) {
                resolve(this.themes);
            } else {
                reject('No themes available.');
            }
        });
    }

    // Find theme by id using promises
    getThemeById(id) {
        return new Promise((resolve, reject) => {
            const foundTheme = this.themes.find(theme => theme.id === id);
            if (foundTheme) {
                resolve(foundTheme);
            } else {
                reject(`Unable to find theme ${id}.`);
            }
        });
    }

    // Find set by set number using promises
    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const foundSet = this.sets.find(set => set.set_num === setNum);
            if (foundSet) {
                resolve(foundSet);
            } else {
                reject(`Set with number ${setNum} not found.`);
            }
        });
    }

    // Find sets by theme using promises
    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            const lowercaseTheme = theme.toLowerCase();
            const foundSets = this.sets.filter(set => 
                set.theme.toLowerCase().includes(lowercaseTheme)
            );
            if (foundSets.length > 0) {
                resolve(foundSets);
            } else {
                reject(`No sets found for theme "${theme}".`);
            }
        });
    }
    // Add a new set using promises
    addSet(newSet) {
        return new Promise((resolve, reject) => {
            const setExists = this.sets.some(set => set.set_num === newSet.set_num);
            if (setExists) {
                reject("Set already exists");
            } else {
                this.sets.push(newSet);
                resolve(); // No data to resolve, just successful completion
            }
        });
    }
    // Delete set by set number
    deleteSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      let foundSetIndex = this.sets.findIndex(s => s.set_num === setNum);
      
      if (foundSetIndex !== -1) {
        this.sets.splice(foundSetIndex, 1); 
        resolve(); 
      } else {
        reject(`Set with number ${setNum} not found.`);
      }
    });
  }

}

module.exports = legoData;