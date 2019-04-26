import {Meteor} from "meteor/meteor";
import './loginModal.html';



Tracker.autorun(function(){
    if(Meteor.userId()){
        //do your stuff
        $('#loginModal').modal('hide');
    }
});
Template.loginModal.events({
    'shown.bs.modal #loginModal'(e,i){
        $('#at-field-email').focus();
    }
});
