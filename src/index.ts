import path from "path";
import express  from "express";
import jwt from "express-jwt";
import jwks from "jwks-rsa";


const app = express(); 
app.use(express.urlencoded({ extended: false})); 


const awsUserPoolUri: string = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USERPOOL_ID}`;

console.log(awsUserPoolUri);

const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:  path.resolve(awsUserPoolUri, "/.well-known/jwks.json"),
});

const authentificationHandlerRequired = jwt({
    secret ,
    issuer: awsUserPoolUri,

    algorithms: ["RS256"],
});
const authentificationHandlerOptional = jwt({
    secret ,
    issuer: awsUserPoolUri,
    credentialsRequired: false,
    algorithms: ["RS256"],
});



app.get("/", authentificationHandlerOptional, function ( req, res ) {
    res.json( { message: "hello world" } );
});

app.get("/about", authentificationHandlerRequired,function ( req, res ) {
    res.json( { message: "about is protected" } );

});

app.listen(3000, function() {
    console.log("Beispielanwendung läuft auf http://localhost:3000 !");
});