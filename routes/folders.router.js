'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');


router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});



router.get('/folders/:id', (req, res, next) =>{
  const {id} = req.params;
  knex.select('id', 'name')
    .from('folders')
    .where('id', id)
    .then(([results]) =>{
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});



router.put('/folders/:id', (req, res, next) => {
  const {id} = req.params;
  const updateObj = {};

  if ('name' in req.body) {
    updateObj.name = req.body.name;
  }
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex.select('id', 'name')
    .from('folders')
    .where('id', id)
    .returning(['id', 'name'])
    .update(updateObj)
    .then(([item]) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});


router.post('/folders', (req, res, next) => {
  const newObj = {};

  if ('name' in req.body) {
    newObj.name = req.body.name;
  }
  if (!newObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex.select('id', 'name')
    .from('folders')
    .returning(['id', 'name'])
    .insert(newObj)
    .then(([item]) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});


router.delete('/folders/:id', (req, res, next) => {
  const id = req.params.id;

  knex.del()
    .from('folders')
    .where('id', id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});


module.exports = router;