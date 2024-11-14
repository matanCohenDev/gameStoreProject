// routes/branch-routes.js
const express = require('express');
const router = express.Router();
const { getBranches } = require('../controllers/branches-controller');

router.get('/branches', getBranches);

module.exports = router;
