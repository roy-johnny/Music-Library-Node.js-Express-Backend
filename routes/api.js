const express = require('express');
const router = express.Router();
const db = require('../db');
const global = require('../global');
const path = require("path");

router.get('/', async (req, res, next) => {
  let songs, page=0, sort={}, total;
  if(req.query.page)
    page=Math.abs(parseInt(req.query.page)-1);
  if(req.query.sort) {
    sort[req.query.sort] = -1;
  }
  else
    sort = {date: -1};
  let rule_arr = [];
  songs = await db.song.aggregate(rule_arr.concat([
    {$sort: sort},
    {$project: {_id: 1, ext: 1, title: 1, vup: 1, thumbnail: 1, date: {$dateToString: {format: "%Y-%m-%d", date: {$add: ["$date", 8*60*60*1000]}}}}},
    {
      $facet: {
        paginatedResults: [{ $skip: page*global.num_per_page }, { $limit: global.num_per_page }],
        totalCount: [
          {
            $count: 'count'
          }
        ]
      }
    }
  ])).toArray();
  songs = songs[0];
  if(songs.paginatedResults.length===0)
    total=0;
  else
    total = songs.totalCount[0].count;
  songs = songs.paginatedResults;
  res.status(200).json( {
    page: page+1,
    songs: songs,
    total: Math.ceil(total/global.num_per_page),
  });
});



module.exports = router;
