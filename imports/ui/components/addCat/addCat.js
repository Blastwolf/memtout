import {Meteor} from "meteor/meteor";
import './addCat.html';

Template.addCat.events({
    'submit #addCatForm'(e, i) {
        e.preventDefault();
        let cat = e.target.cat.value;
        let catNameId =new Meteor.Collection.ObjectID()._str+Date.now();//generate unique Id;
        if (cat)
            Meteor.call('datasUpsertCat', cat,catNameId, function (e, r) {
                if(e) console.log(e);
                if (r) {
                    $('#addCat input#cat').val('');
                    $('#addCat').modal('hide');
                }
            });
    },
    //----------------Focus Modal Input Event--------------//
    'shown.bs.modal #addCat'(e,i){
        $('#addCat #cat').focus();
    }

});