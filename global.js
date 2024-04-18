const express = require('express');
const router = express.Router();
router.num_per_page = 12;
router.song_nanoid_length = 6;
router.playlist_nanoid_length = 10;
router.db_name = 'vsing';
router.db_host = 'localhost';
router.recap_site_key = '';
router.recap_secret_key = '';
router.site_url = '';

module.exports = router;