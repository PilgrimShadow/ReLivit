let {matchedData} = require('express-validator/filter');


function resInfo(success, message, payload = {}) {

    return {
        success: success,
        message: message,
        payload: payload,
        timestamp: new Date().getTime()
    };
}

const resFail = (message) => resInfo(false, message);
const resSucc = (message) => resInfo(true, message);

// Get all users
module.exports.get = (req, res) => {

};


/**
 * Add a user to the system
 *
 * @param req
 * @param res
 */
module.exports.add = (req, res) => {

    let insertDoc = matchedData(req);

    const successMsg = 'Added the user';
    const failMsg = 'There was an error adding the user';

    req.app.locals.db.collection('users').insertOne(insertDoc, (err, writeResult) => {

        if (err === null || err === undefined) {

            if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
                res.json(resSucc(successMsg));
            } else {
                res.json(writeResult);
            }
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });
};


/**
 * Remove a user
 *
 * @param req
 * @param res
 */
module.exports.remove = (req, res) => {

    const successMsg = 'Removed the user';
    const failMsg = 'There was an error removing the user';

    const sel = matchedData(req);

    req.app.locals.db.collection('users').deleteOne(sel, (err, writeResult) => {

        if (err === null || err === undefined) {

            if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
                res.json(resSucc(successMsg));
            } else {
                console.log(writeResult);
                res.json(resFail(failMsg));
            }
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });

};

// Update a user's email
module.exports.updateEmail = (req, res) => {

    const successMsg = 'Updated the user email';
    const failMsg = 'There was an error updating the email';

    // TODO: Get the username from the session
    let sel = {
        username: "bobbyjones"
    };

    let upd = {
        $set: matchedData(req)
    };

    // Insert a document into the database
    req.app.locals.db.collection('users').updateOne(sel, upd, (err, writeResult) => {

        if (err === null || err === undefined) {

            if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
                res.json(resSucc(successMsg));
            } else {
                res.json(writeResult);
            }
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });
};

module.exports.updateAbout = (req, res) => {

    const successMsg = 'Updated the about message';
    const failMsg = 'There was an error updating the about message';

    // TODO: Get the username from the session
    let sel = {
        username: "bobbyjones"
    };

    let upd = {
        $set: matchedData(req)
    };

    // Insert a document into the database
    req.app.locals.db.collection('users').updateOne(sel, upd, (err, writeResult) => {

        if (err === null || err === undefined) {

            if (writeResult.result.n === 1 && writeResult.result.ok === 1) {
                res.json(resSucc(successMsg));
            } else {
                res.json(writeResult);
            }
        } else {
            console.log(err.message);
            res.json(resFail(failMsg));
        }
    });

};
