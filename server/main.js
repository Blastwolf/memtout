import '../imports/api/datas.js';
import '../imports/startup/accounts_config.js';
import {http} from 'meteor/http';

setInterval(function(){
    http.get('https://memtout.herokuapp.com');
    console.log('keep awake');
},1800000);