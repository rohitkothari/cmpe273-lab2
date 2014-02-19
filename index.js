var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `r                                                                                        equest.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
        switch (request.method) {
                case 'GET': get(request, response); break;
                case 'POST': post(request, response); break;
                case 'DELETE': del(request, response); break;
                case 'PUT': put(request, response); break;
        }
};

function get(request, response) {
        var cookies = request.cookies;
        console.log(cookies);
        if ('session_id' in cookies) {
                var sid = cookies['session_id'];
                if ( login.isLoggedIn(sid) ) {
                        response.setHeader('Set-Cookie', 'session_id=' + sid);
                        response.end(login.hello(sid));
                } else {
                        response.end("Invalid session_id! Please login again\n")                                                                                        ;
                }
        } else {
                response.end("Please login via HTTP POST\n");
        }
};

function post(request, response) {
        var name = request.body['name'];
        var email = request.body['email'];

        // TODO: read 'name and email from the request.body'
        //var newSessionId = login.login(name, email);
        var newSessionId = login.login(name, email);
        response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
        // TODO: set new session id to the 'session_id' cookie in the response
        // replace "Logged In" response with response.end(login.hello(newSession                                                                                        Id));
        response.end(login.hello(newSessionId));
        //response.end("Logged n\In");
};

function del(request, response) {
        console.log("DELETE:: Logout from the server");

        var cookies = request.cookies;
        //if ('session_id' in cookies){
                login.logout(cookies['session_id']);
                console.log("Removed");


                // TODO: remove session id via login.logout(xxx)

        // No need to set session id in the response cookies since you just logg                                                                                        ed out!

        response.end('Logged out from the server\n');
};


function put(request, response) {
        console.log("PUT:: Re-generate new seesion_id for the same user");
        var cookies = request.cookies;
        //if ('session_id' in cookies){
                //login.refresh(cookies['session_id']);
                var sessionID = cookies['session_id'];
                var sessionID2 = login.refresh(sessionID);
                response.setHeader('Content-Type', 'text/html');
                response.setHeader('Set-Cookie', 'session_id=' + sessionID2);
                response.end("Refreshed session id\n");


        // TODO: refresh session id; similar to the post() function
//        delete this.sessionMap[sessionId];

};

app.listen(8000);

console.log("Node.JS server running at 8000...");
