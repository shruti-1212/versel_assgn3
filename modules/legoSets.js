/******************************************************************************** 
*  WEB700 – Assignment 2
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  Name: Shruti Hande Student ID: 111559233 Date: 25-09-2024 
********************************************************************************/

class legoData {
    constructor() {
        this.sets = [];
    }

    // Initialize method using promises
    initialize() {
        return new Promise((resolve, reject) => {
            try {
                const setData = require("../data/setData");
                const themeData = require("../data/themeData");

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
}

module.exports = legoData;