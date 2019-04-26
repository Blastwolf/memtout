Template.registerHelper('arrayify',function(arrayOfObj){
    var result = [];
    arrayOfObj.forEach(function(e){
        for (var key in e) result.push({name:key,value:e[key]});
    });
    return result;
});
Template.registerHelper('log',function(data){
    console.log('this is registerLog','this ',this,'data ',data);
});
Template.registerHelper('shareContextWithIndex',function(data,index){
    return Object.assign({index},data);
});