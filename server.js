const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);


server.use(jsonServer.rewriter({
    '/api/charging_stations': '/charging_stations'
  }));

hashCode = function(str){
  var hash = 0;
  if (str.length == 0) return hash;
  for (i = str.length; i >= str.length - 4 && i >= 0; i--) {
      char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
server.get('/get/charging_station', (req, res) => {
    var db = require('./db.json');
    let placeId = hashCode(req.query['placeId']) % db.charging_stations.length;
    if (placeId != null && placeId >= 0) {
        let result = db.charging_stations.find(charging_station => {
            return charging_station.id == placeId;
          })
        if (result) {
            let {id, ...charging_station} = result;
            res.status(200).jsonp(charging_station);
          } else {
            res.status(400).jsonp({
              error: "Bad userId"
            });
          }
    }});

server.use(router);
server.listen(port);