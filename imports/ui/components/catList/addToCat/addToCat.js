import {Meteor} from "meteor/meteor";
import './addToCat.html';

Template.addToCat.onRendered(function(){
});

Template.addToCat.onRendered(function(){
    //Creation des champs correspondants a celles de la catégorie
    // let catId = this.data._id;
    // let formFields = this.data.catFields;
    // let thisForm = this.$('#addToCatForm fieldset');
    // for (let field in formFields){
    //     let noSpaceLabelId = field.replace(/\s/g,'')+catId;
    //     $('<div class="form-group">').html(`
    //     <label for="${noSpaceLabelId}">${field}</label>
    //     <input type="${formFields[field]}" class="form-control" name="${noSpaceLabelId}" id="${noSpaceLabelId}" required>
    //     `).appendTo(thisForm);
    // }
});


Template.addToCat.events({
    'submit .addToCatForm'(e,i){
        console.log('penis');
        let catName = this.catName ;
        let catNameId = this._id;
        console.log(e.target);

        let datasToInsert = e.target['addToCatInput'+catNameId].value;
        let eventTargetModal = '#addToCat'+catNameId;

        Meteor.call('insertToCat',catName,datasToInsert,catNameId,function(error,r){
            if (error) console.log(e);
            if (r) {
                console.log('success !',r);
                $(eventTargetModal).modal('hide');
                e.target['addToCatInput'+catNameId].value = '';
            }
        });
        e.preventDefault();
    },
    'shown.bs.modal .addToCat'(e,i){
        $('.addToCat input').focus();
    }
});

Template.addToCat.onRendered(function(){
    //----------------Focus input Modal----------------//
    let index = this.data.index;
    let catNameId = this._id;
    let eventTargetModal = '#addToCat'+catNameId;
    let eventTargetInput = '#addToCatInput'+catNameId;
    $(eventTargetModal).on('shown.bs.modal',function(){
        $(eventTargetInput).focus();
    });
});
