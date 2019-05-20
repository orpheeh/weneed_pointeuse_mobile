const mongoose = require("mongoose");

const Member = mongoose.Schema(
    {
        nom: { type: String, require: true },
        prenom: { type:String, require: true },
        status: { type: String, enum: ['STAGIAIRE', 'BENEVOL', 'STAFF', 'PRESIDENT', 'SG'], require: true},
        mobile: { type: String, require: true },
        email:  String
    }
);

module.export = mongoose.model('Member', Member);

const Pointage = mongoose.Schema(
    {
        idmember: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', require: true },
        idcode: { type: mongoose.Schema.Types.ObjectId, ref: 'Code', require: true },
        arrivee: { type: Date, default: Date.now },
        depart: { type: Date }
    }
);

module.export = mongoose.model('Pointage', Pointage);

const now = new Date();
const Code = mongoose.Schema(
    {
        text: {type: String, require},
        date: {type: String, default: now.toISOString().split('T')[0], unique: true }
    }
);

module.export = mongoose.model('Code', Code);

const MemberCode = mongoose.Schema(
    {
        idmember: { type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
        code: { require: true, type: String }
    }
);

module.export = mongoose.model('MemberCode', MemberCode);