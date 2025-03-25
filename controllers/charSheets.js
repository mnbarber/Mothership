const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const CharSheet = require('../models/charSheet.js')
const { verify } = require('jsonwebtoken');
const router = express.Router();

//create new charSheet
router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const char = await CharSheet.create(req.body);
        char._doc.author = req.user;
        res.status(201).json(char);
    } catch(err) {
        res.status(500).json({ err: err.message });
    }
});

//get all sheets
router.get('/', verifyToken, async (req, res) => {
    try {
        const charSheets = await CharSheet.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(charSheets);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

router.get('/:charSheetId', verifyToken, async (req, res) => {
    try {
        const charSheet = await CharSheet.findById(req.params.charSheetId).populate([
            'author'
        ]);
        res.status(200).json(charSheet);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;