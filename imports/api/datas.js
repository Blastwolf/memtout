import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

export const Datas = new Mongo.Collection('datas');

if (Meteor.isServer) {
    Meteor.publish('datas', function datasPublication() {
        return Datas.find({userId: this.userId});
    });
}


Meteor.methods({
    'datasUpsertCat'(cat,catNameId) {
        check(cat, String);
        check(catNameId,String);
        if (!cat || !this.userId || !catNameId) {
            throw new Meteor.Error('Il manque probablement un champ ' + cat,catNameId, Meteor.userId());
        }

        return Datas.upsert({userId: Meteor.userId()},
            {
                $push: {
                    cat: {_id: catNameId, catName: cat, list: []}
                },
                $setOnInsert: {
                    userId: this.userId,
                    createAt: new Date()
                }
            });
    },
    'insertToCat'(catName, dataToInsert, catNameId) {
        check(catName, String);
        check(dataToInsert, String);
        check(catNameId, String);
        if (!catName || !dataToInsert || !this.userId) {
            throw new Meteor.Error('Il manque probablement un champ ' + [catName, dataToInsert, catNameId, Meteor.userId()]);
        }

        //let temp = `cat.${index}.list`;
        return Datas.update({userId: this.userId, "cat._id": catNameId}, {$push: {"cat.$.list": dataToInsert}});
    },
    'removeDataFromCat'(dataValue,catNameId){
        check(dataValue, String);
        check(catNameId, String);
        if (!dataValue || !this.userId) {
            throw new Meteor.Error('Il manque probablement un champ ' + [dataToValue, catNameId, Meteor.userId()]);
        }
        return Datas.update({userId: this.userId,"cat._id": catNameId}, {$pull: {"cat.$.list":dataValue}});
    }
});