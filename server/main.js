import '../imports/api/datas.js';
import '../imports/startup/accounts_config.js';
import {HTTP} from 'meteor/http';
import {Meteor} from 'meteor/meteor';

Meteor.setInterval(function () {
    HTTP.get('https://memtout.herokuapp.com');
    console.log('keep awake');
}, 1800000);
