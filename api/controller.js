const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pointageweneed', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB pointage Error !"));

require('./model');
const Member = mongoose.model('Member');
const Pointage = mongoose.model('Pointage');
const Code = mongoose.model('Code');
const MemberCode = mongoose.model('MemberCode');

exports.list_all_member = (req, res) => list_all(req, res, Member);
exports.list_all_pointage = (req, res) => list_all(req, res, Pointage);
exports.list_all_code = (req, res) => list_all(req, res, Code);
exports.list_all_member_code = (req, res) => list_all(req, res, MemberCode);
function list_all(req, res, Model) {
    Model.find({}, function(err, elements){
        if(err)
            res.send(err);
        res.json(elements);
    });
}


exports.create_member = (req, res) => create(req, res, Member);
exports.create_pointage = (req, res) => create(req, res, Pointage);
exports.create_code = (req, res) => create(req, res, Code);
exports.create_member_code = (req, res) => create(req, res, MemberCode);
function create(req, res, Model) {
    const new_element = new Model(req.body);
    new_element.save(function(err, element){
        if(err)
            res.send(err);
        res.json(element);
    });
}


exports.delete_member = (req, res) => deleteElement(req, res, Member);
exports.delete_code = (req, res) => deleteElement(req, res, Code);
exports.delete_member_code = (req, res) => deleteElement(req, res, MemberCode);
exports.delete_pointage = (req, res) => deleteElement(req, res, Pointage);
function deleteElement(req, res, Model) {
    Model.findOneAndRemove({ _id: req.params.id}, function(err, element){
        if(err)
            res.send(err);
        res.json(element);
    })
}

exports.update_member = (req, res) => update(req, res, Member);
exports.update_pointage = (req, res) => update(req, res, Pointage);
exports.update_code = (req, res) => update(req, res, Code);
exports.update_member_code = (req, res) => update(req, res, MemberCode);
function update(req, res, Model){
    Model.findOneAndUpdate({_id: req.params.id}, req.body, function(err, element){
        if(err)
            res.send(err);
        res.json(element);
    });
}

exports.get_member = (req, res) => get(req, res, Member);
exports.get_pointage = (req, res) => get(req, res, Pointage);
exports.get_code = (req, res) => get(req, res, Code);
exports.get_member_code = (req, res) => get(req, res, MemberCode);
function get(req, res, Model){
    Model.findById(req.params.id, function(err, element){
        if(err)
            res.send(err);
        res.json(element);
    });
}