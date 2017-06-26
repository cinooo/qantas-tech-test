const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400);
    res.json({
      "error": "Error parsing JSON"
    })
  } else {
    next();
  }
});

// return 1. QF flight AND 2. arrive or depart in SYD
app.get('/flights', (req, res) => {
  let payload = req.body.flights;
  let flights = payload.reduce((acc, flight) => {
    if (flight.airline === 'QF' && (flight.arrival.airport === 'SYD' || flight.departure.airport === 'SYD')) {
      let formattedData = {
        "flight": `${flight.airline}${flight.flightNumber}`,
        "origin": flight.arrival.airport,
        "destination": flight.departure.airport,
        "departureTime": flight.departure.scheduled
      }
      acc.push(formattedData);
    }
    return acc;
  }, [])

  console.log(flights)
  res.json({ flights });

})

app.listen(process.env.PORT || 8081);
