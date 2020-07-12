const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('CO3GNO6BHL', '3a4325e1bed03a2fa814393542dcbe61');
const index = client.initIndex('Biapiv1');



router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search({
      query: req.query.query,
      page: req.query.page,
    }, (err, content) => {
      res.json({
        success: true,
        message: "Here is your search",
        status: 200,
        content: content,
        search_result: req.query.query
      });
    });
  }
});


module.exports = router;

