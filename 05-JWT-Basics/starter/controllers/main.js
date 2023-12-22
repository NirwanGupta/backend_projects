//  check username, password in post request(login)
//  if exist create new JWT
//  send back the frontend

//  setup authentication so only the request with JWT can access the dashBoard

const jwt = require(`jsonwebtoken`);
const {BadRequestError} = require(`../errors`);

const login = async (req, res) => {
    const {username, password} = req.body;
    console.log(username, password);

    //  what if the username or the password field was empty?
    //  check through mongo
    //  check through joi package
    //  check in the controllers itself

    if(!username || !password) {
        throw new BadRequestError(`Please provide email and password`);
    }

    //  A JWT web token has 3 parts: header, payload, and signature

    //  The header has the information ofthe algo used and type: jwt. It is encoded in base64URL

    //  Payload has the information that the user sends us(like his email, password when he login), we make a token and send to the user, if the user sends back the same token -> that means the data was not latered and the connection is safe, thus the secret information can be sent!! This is also encoded in Base64URL

    //  signature has the secret data that is needed to be transferred. In order to make the signature, you should have the header and the payload along with the algo you are using, for example:

    /*
        AlgoUsed(like HMACSHA256)(
            base64UrlEncode(header) + "." +
            base64UrlEncode(payload),
            secret)
    */

    //  the overall token is a long string that has encoded header, payload and signature

    //  package used for signing and decoding our tokens we use -> `jsonwebtoken` package

    const id = new Date().getDate();        //  just to generate an ID
    
    // const token = jwt.sign({payload}, {enviornment variable in .env file}, {lifeTime})
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'});

    //  in frontend it is very important to do      Authorization: `Bearer`${token}
        
    res.status(200).json({msg: `User created`, token});
}

//      this one is when i dont use a middleware for the authentication
/*
const dashBoard = async (req, res) => {
    //  now once we have successfully generated a token, now we want to extract the username from it and use it to send the secret data

    console.log(req.headers);       //  the request header has a field named authorization that must start with `Bearer `, if not then you must throw an error

    const authHeader = req.headers.authorization;

    //  if the user didnot provide the correct authorization or the authorization doesnot starts with 'Bearer ' then you must throw a custom eroor
    if(!authHeader || !authHeader.startsWith(`Bearer `)) {
        throw new CustomAPIError(`No token`, 401);      //  statuscode 401 -> for authentication error
    }

    const token = authHeader.split(` `)[1];     //  authHeader is`Bearer ${token}`, so authHeader.split(` `)[1] is the token

    //  now we have to verify that our token was valid or not

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const luckyNumber = Math.floor(Math.random()*100);
        res.json({msg: `Hello ${decoded.username} `, secret: `Here is your authorized data, your lucky number is ${luckyNumber}`});
        
    } catch (error) {
        throw new CustomAPIError(`Not authorized to access this route`, 401);
    }

}
*/

//  if i use a middleware for the authentication
//  the middleware puts the id and username in the req.user
const dashBoard = async (req, res) => {
    console.log(req.user);
    const luckyNumber = Math.floor(Math.random()*100);
    res.status(200).json({msg: `Hello ${req.user.username} `, secret: `Here is your authorized data, your lucky number is ${luckyNumber}`});
}

module.exports = {
    login,
    dashBoard,
}