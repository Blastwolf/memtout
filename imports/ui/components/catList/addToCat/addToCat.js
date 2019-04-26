import {Meteor} from "meteor/meteor";
import './addToCat.html';

Template.addToCat.events({
    'submit #addToCatForm'(e,i){
        e.preventDefault();
        let catName = this.catName ;
        let catNameId = this._id;
        let datasToInsert = e.target['addToCatInput'+catNameId].value;
        let eventTargetModal = '#addToCat'+catNameId;

        Meteor.call('insertToCat',catName,datasToInsert,catNameId,function(error,r){
            if (error) console.log(e);
            if (r) {
                console.log('success !',r);
                $(eventTargetModal).modal('hide');
                e.target['addToCatInput'+catNameId].value = '';
            }
        })
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
