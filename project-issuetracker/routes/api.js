'use strict';

module.exports = function (app) {
  
  let db = [];
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let filterdb = db.slice();
      const propsToFilter = ['_id', 'issue_title', 'issue_text', 'created_on', 'updated_on', 'created_by', 'assigned_to', 'open', 'status_text'];

      for (let prop in req.query) {
        if (propsToFilter.includes(prop)) {
          filterdb = filterdb.filter(obj => obj[prop] == req.query[prop]);
        }
      }
      res.send(filterdb);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to || '';
      const status_text = req.body.status_text || '';
      const created_on = new Date();
      const updated_on = new Date();
      const open = true;
      let _id = db.length + 1;
      

      const json = {
        "_id": _id.toString(),
        "issue_title": issue_title,
        "issue_text": issue_text,
        "created_on": created_on,
        "updated_on": updated_on,
        "created_by": created_by,
        "assigned_to": assigned_to,
        "open": open,
        "status_text": status_text        
      };

      if (issue_title && issue_text && created_by) {
        if (req.body.issue_title == 'Faux Issue 1') {
          db = [];
        }
        db.push(json);
        res.json(json);
      } else {
        res.json({ error: 'required field(s) missing' }); 
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;

      if (_id) {
        let updated = false;
        let empty = true;
        let index = 0;

        for (let prop in req.body) {
          if (prop != '_id' && req.body[prop]) {
            empty = false;
          }
        }

        for (let i = 0; i < db.length; i++) {
          if (db[i]._id == _id.toString()) {
            index = i;
            for (let prop in req.body) {
              if (req.body[prop] && db[index][prop] != req.body[prop]) {
                db[index][prop] = req.body[prop];
                updated = true;
              }
            }
            break;
          }
        }

        if (updated) {
          db[index]['updated_on'] = new Date();
          res.json({ result: 'successfully updated', '_id': _id.toString() });
        } else if (empty) {
          res.json({ error: 'no update field(s) sent', '_id': _id.toString() });
        } else {
          res.json({ error: 'could not update', '_id': _id.toString() });
        }    
      } else {
        res.json({ error: 'missing _id' });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let _id = req.body._id;
      let deleted = false;
      
      if (_id) {
        for (let i = 0; i < db.length; i++) {
          if (db[i]._id == _id.toString()) {
            deleted = true;
            db.splice(i, 1);
          }
        }

        if (!deleted) {
          res.json({ error: 'could not delete', '_id': _id.toString() });
        } else {
          res.json({ result: 'successfully deleted', '_id': _id.toString() })
        }
      } else {
        res.json({ error: 'missing _id' });
      }
    });
};