import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Match} from "meteor/check";

export const Datas = new Mongo.Collection('datas');

if (Meteor.isServer) {
    Meteor.publish('datas', function datasPublication() {
        return Datas.find({userId: this.userId});
    });
}

if(Meteor.isServer){
    Meteor.methods({

    })
}


Meteor.methods({
    'datasUpsertCat'(cat,catFields,catNameId) {
        check(cat, String);
        check(catNameId,String);
        check(catFields,Match.Where((x)=>{
            let error = 0;
            x.forEach(function(e){
                if(e.type !== "text" && e.type !== "number" && e.type !== "date")error = 1;
            });
            return error === 0;
        }));

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }

        return Datas.upsert({userId: Meteor.userId()},
            {
                $push: {
                    cat: {_id: catNameId, catName: cat,catFields: catFields, list: []},
                    catPosOrder:catNameId,
                },
                $setOnInsert: {
                    userId: this.userId,
                    createAt: new Date()
                }
            });
    },
    'insertToCat'(dataToInsert, catNameId) {
        check(dataToInsert,{
            _id:String,
            datas:Match.Maybe([{_id:String,type:String,value:Match.OneOf(String,Number)}]),
        });
        check(catNameId, String);

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }

        return Datas.update({userId: this.userId, "cat._id": catNameId}, {$push: {"cat.$.list": dataToInsert,"cat.$.posOrder":dataToInsert._id}});
    },
    'removeDataFromCat'(datasId,catNameId){
        check(datasId, String);
        check(catNameId, String);

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }

        return Datas.update({userId: this.userId,"cat._id": catNameId}, {$pull: {"cat.$.list":{_id:datasId},"cat.$.posOrder":datasId}});
    },
    'removeCatFromList'(catId){
        check(catId,String);

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }
      return Datas.update({userId:this.userId},{$pull:{"cat":{_id:catId},"catPosOrder":catId}});
    },
    'updateDataFromCat'(dataId,datasId,catNameId,newValue){
            check(dataId,String);
            check(datasId,String);
            check(catNameId,String);
            check(newValue,Match.OneOf(String,Number));
            if (!this.userId) {
                throw new Meteor.Error('Vous devez être connecté.');
            }
            if(/^ *$/.test(newValue))throw new Meteor.Error('Le champ est vide !');

        if(Meteor.isServer){
            return Datas.rawCollection().update({userId: this.userId,"cat._id": catNameId},{$set:{"cat.$.list.$[e].datas.$[i].value":newValue}},
                {arrayFilters:[{"e._id":datasId},{"i._id":dataId}]}).then((res)=>{
                if(res.result.nModified ===1){
                    return newValue;
                }
            }).catch(function(res){
                throw new Meteor.Error(res.errmsg);
            });
        }

    },
    'updateCatField'(catNameId,fieldId,newFieldData){
        check(catNameId,String);
        check(fieldId,String);
        check(newFieldData,Match.Where((x)=>{
            let error = 0;
            if(typeof(x.label) !== 'string') error=1;
            if(x.type !== "text" || x.type !== "number" || x.type !=="date") error=1;

            return error;
        }));

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }

        if(Meteor.isServer){
            return Datas.rawCollection().update({userId: this.userId, "cat._id": catNameId}, {$set: {"cat.$.catFields.$[e]": newFieldData}},{
                arrayFilters:[{"e._id":fieldId}]}).then((res)=>{
                if(res.result.nModified ===1){
                    return 'Datas modified with sucess !'
                }
            }).catch(function(res){
                throw new Meteor.Error(res.errmsg);
            });
        }
    },
    'dataUpdatePosition'(posArr,catNameId){
        check(posArr,[String]);
        check(catNameId,String);

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }

        return Datas.update({userId:this.userId,"cat._id":catNameId},{$set:{"cat.$.posOrder":posArr}})
    },
    catUpdatePosition(posArr){
        check(posArr,[String]);

        if (!this.userId) {
            throw new Meteor.Error('Vous devez être connecté.');
        }

        return Datas.update({userId:this.userId},{$set:{"catPosOrder":posArr}});
    }
});