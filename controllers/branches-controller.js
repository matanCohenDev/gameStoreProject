// controllers/branches-controller.js
const Branch = require('../models/branchesDB');

// Get all branches
const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.status(200).send(branches);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = { getBranches };
