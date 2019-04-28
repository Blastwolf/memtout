import {Meteor} from "meteor/meteor";
import './addCat.html';

Template.addCat.events({
    'submit #addCatForm'(e, i) {
        e.preventDefault();
        let form = $('#addCatForm');

        let catFields = form.find('.custom-select');
        let labelForFields = form.find('.labelForField');

        let catFieldsArr = [];
        catFields.each(function(i,e){
            catFieldsArr.push(e.value);
        });

        let labelForFieldsArr = [];
        labelForFields.each(function(i,e){
            labelForFieldsArr.push(e.value);
        });
            // create an object from the two array label=>inputType
        let catFormFields = _.object(labelForFieldsArr,catFieldsArr);
        console.log(catFormFields);



        console.log(labelForFields);
        let cat = e.target.cat.value;
        let catNameId = new Meteor.Collection.ObjectID()._str+Date.now();//generate unique Id;
        if (cat)
            Meteor.call('datasUpsertCat', cat,catFormFields,catNameId, function (e, r) {
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