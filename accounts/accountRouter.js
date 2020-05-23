const express = require('express');

// database access using knex
const knex = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const accounts = await knex('accounts')
        res.status(200).json(accounts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Problem with the database.', error: err});
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const result = await knex('accounts').where({id});
        if (result.length === 0) {
            return res.status(404).json({message: 'No account found with that id.'})
        } else {
        res.status(200).json(result);
        }
    } catch {
        res.status(500).json({ errorMessage: 'Problem with the database.'})
    }
});


router.post('/', async (req, res) => {
    const accountData = req.body;
    try {
        const newAccount = await knex('accounts').insert(accountData);
        res.status(200).json(newAccount);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Problem with the database.', error:err});
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const updatedAccount = req.body;
    try {
        const count = await knex('accounts').update(updatedAccount).where({id});
        if (count) {
            res.json({ updated: count});
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ errorMessage: "Problem with the database.", error: err })
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try{
        const count = await knex('accounts').del().where({ id });
        if (count) {
            res.status(200).json({ deleted: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ errorMessage: "Problem with the database.", error: err })
    }
});

module.exports = router;