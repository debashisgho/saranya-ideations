var express = require('express');
var router = express.Router();
var path = require('path');


//load the API routes

router.use(require('../api/user.js'));
router.use(require('../api/inventory.js'));
router.use(require('../api/product.js'));
router.use(require('../api/address.js'));
router.use(require('../api/orderHeader.js'));
router.use(require('../api/orderItem.js'));

//any request other than API should be routed to index page.


router.get('*',function(request,response){	

response.sendFile(path.resolve(__dirname + '/../../dist/'+'index.html'));

});



module.exports = router;