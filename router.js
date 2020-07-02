const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    res.send('server is running' + time);
})

module.exports = router;
