const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test',
        issue_text: 'test',
        created_by: 'test',
        assigned_to: 'test',
        status_text: 'test'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'test');
        assert.equal(res.body.issue_text, 'test');
        assert.equal(res.body.created_by, 'test');
        assert.equal(res.body.assigned_to, 'test');
        assert.equal(res.body.status_text, 'test')
        done();
      });
  });
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test',
        issue_text: 'test',
        created_by: 'test',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'test');
        assert.equal(res.body.issue_text, 'test');
        assert.equal(res.body.created_by, 'test');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '')
        done();
      });
  });
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test',
        issue_text: '',
        created_by: '',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body.length, 2);
        done();
      });
  });
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest?assigned_to=test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body.length, 1);
        done();
      });
  });
  test('View issues on a project with two filter: GET request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest?assigned_to=test&status_text=test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body.length, 1);
        done();
      });
  });
  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: 1,
        issue_title: 'updated'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, 1);
        done();
      });
  });
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: 2,
        issue_title: 'updated',
        issue_text: 'updated',
        created_by: 'updated'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, 2);
        done();
      });
  });
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        issue_title: 'updated'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: 2,
        issue_title: '',
        issue_text: '',
        created_by: ''
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, 2);
        done();
      });
  });
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: 555,
        issue_title: 'updated'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, 555);
        done();
      });
  });
  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: 1
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, 1);
        done();
      });
  });
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: 555
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, 555);
        done();
      });
  });
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: ''
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
});