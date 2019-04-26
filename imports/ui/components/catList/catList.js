import {Meteor} from "meteor/meteor";
import {Datas} from "../../../api/datas";

import './catList.html';

Template.catList.onCreated(function onCreatedCatList() {
    Meteor.subscribe('datas');

});
Template.registerHelper('DatasToList', function (datas) {

    var list = datas[0].cat;
    return list;

});
Template.catList.onRendered(function () {
    //----------------Class 'active' on first elem of cat list--------------//
    let addActive = setInterval(function () {
        let firstElem = $('div#list-tab').children('a:first');
        let firstElemPanel = $('div#nav-tabContent').children('div.tab-pane:first');

        if (firstElem.hasClass('active')) {
            clearInterval(addActive);
        } else {
            firstElem.addClass('active');
            firstElemPanel.addClass('active');
        }

    }, 100);

});

Template.catList.helpers({

    getCatListFromDb() {
        return Datas.find({userId: Meteor.userId()}).fetch()[0];
    },
});
Template.catList.events({
    'click .table-info .close'(ev, i) {
        let elem = ev.currentTarget;
        let elemId = elem.dataset.bwid;
        let elemValue = this.toString();

        Meteor.call('removeDataFromCat', elemValue, elemId, function (e, r) {
            if (e) console.log(e);
            if (r) console.log(r);
        });
    },

});

Template.catList.onDestroyed(function () {
    Session.clear();
});