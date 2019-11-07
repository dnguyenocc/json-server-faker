const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);


server.use(jsonServer.rewriter({
    '/api/charging_stations': '/charging_stations'
  }));
  
hashCode = function(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};
server.get('/get/charging_station', (req, res) => {
    var db = require('./db.json');
    let placeId = hashCode(req.query['placeId']) % db.charging_stations.length;
    if (placeId != null && placeId >= 0) {
        let result = db.charging_stations.find(charging_station => {
            return charging_station.id == placeId;
          })
        if (result) {
            let {id, ...user} = result;
            res.status(200).jsonp(user);
          } else {
            res.status(400).jsonp({
              error: "Bad userId"
            });
          }
    }});

server.use(router);
server.listen(port);