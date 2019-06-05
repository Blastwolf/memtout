import {Meteor} from "meteor/meteor";
import './addCat.html';


Template.addCat.events({
    'submit #addCatForm'(e, i) {
        e.preventDefault();
        e.stopPropagation();

        i.$('button#submit').attr('disabled',true);

        let form = $('#addCatForm');

        let catFormFields = [];

        let catFields = form.find('.custom-select');
        let labelForFields = form.find('.labelForField');

        //Creating an array of object each containing an id and input label and input type for the cat
        labelForFields.each(function (i, e) {
            let temp = {
                _id: i.toString(),
                label: labelForFields[i].value,
                type: catFields[i].value
            };
            catFormFields.push(temp);
        });

        let cat = e.target.cat.value;
        let catNameId = new Meteor.Collection.ObjectID()._str;//generate unique Id;
        if (cat){
            Meteor.call('datasUpsertCat', cat, catFormFields, catNameId, function (e, r) {
                if (e) {
                    console.log(e);
                }
                if (r) {
                    $('#addCat').modal('hide');
                    form.trigger('reset');
                    $('#inputFields').find('.form-group').not('.form-group:first').remove();
                    i.$('button#submit').attr('disabled',false);
                    Session.set('fieldCounter',0);
                }
                i.$('button#submit').attr('disabled',false);

            });
        }
    },
    //----------------Focus Modal Input Event--------------//
    'shown.bs.modal #addCat'(e, i) {
        $('#addCat #cat').focus();
    }

});