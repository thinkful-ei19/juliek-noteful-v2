'use strict';

const knex = require('../knex');

knex.select('id', 'title', 'content')
  .from('notes')
  .where('title','like', '%government%')
  .then(res => console.log(res));