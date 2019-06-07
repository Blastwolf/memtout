import '../imports/api/datas.js';
import '../imports/startup/accounts_config.js';
import {HTTP} from 'meteor/http';

setInterval(function(){
    HTTP.get('https://memtout.herokuapp.com');
    console.log('keep awake');
},1800000);