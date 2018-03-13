'use strict';

const knex = require('../knex');

knex.select('id', 'title', 'content')
  .from('notes')
  .where('id', 1011)
  .del()
  .then(res => console.log(res));