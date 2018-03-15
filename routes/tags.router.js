'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/tags', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

router.get('/tags:id', (req, res, next) => {
  const {id} = req.params;
  knex.select('id', 'name')
    .from('tags')
    .where('id', id)
    .then(([results]) => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/tags', (req, res, next) => {
  const { name } = req.body;
  
  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };
  
  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/tags/:id', (req, res, next) => {
  const id = req.params.id;

  knex.del()
    .from('tags')
    .where('id', id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});


module.exports = router;