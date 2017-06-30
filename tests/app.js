const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../src/app');

const request = require('./data/request');
chai.use(chaiHttp);

describe('/flights GET', () => {
  it('should return invalid JSON when sent invalid json', (done) => {
    chai.request(server)
      .get('/flights')
      .send('{"invalid"}')
      .type('json')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').that.equals('Error parsing JSON');
        done();
      });
  });

  it('should filter request JSON and return all QF flights departing/arriving from SYD', (done) => {
    chai.request(server)
      .get('/flights')
      .send(request)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.flights.should.be.an('array');
        res.body.flights.forEach((flight) => {
          flight.should.be.an('object');
          flight.flight.should.contain('QF');
          if (flight.origin !== 'SYD') {
            flight.destination.should.equal('SYD')
          } else {
            flight.destination.should.not.equal('SYD');
          }
        });
        done();
      });
  })
});
