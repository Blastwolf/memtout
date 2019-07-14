import './addFieldToCat.html';


Template.addFieldToCat.onCreated(function () {
    //count the number of inputFields the user add
    Session.set('fieldCounter', 0);
});


Template.addFieldToCat.helpers({
    fieldCounter() {
        let counter = Session.get('fieldCounter');
        return counter > 0;
    }
});


Template.addFieldToCat.events({
    'click .addField'(e, i) {
        Session.set('fieldCounter', Session.get('fieldCounter') + 1);
        let newSelect = $('<div class="new-input-group">').html(`       
          
            <p class="text-center plus-sign"><i class="fas fa-plus-circle"></i></p>
            
            <div class="form-group shadow p-2 pt-3">
                <input type="text" class="form-control labelForField mb-3" name="labelForField-${Session.get('fieldCounter')}" placeholder="Nommez le champ" autocomplete="off" required>
           
               <div class="btn-group btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-outline-info active mr-3">
                       <input type="radio" name="field-type-${Session.get('fieldCounter')}" class="js-field-type" value="text" autocomplete="off" checked>Text
                  </label>
                  <label class="btn btn-outline-info mr-3">
                            <input type="radio" name="field-type-${Session.get('fieldCounter')}" class="js-field-type" value="number" autocomplete="off">Nombre
                  </label>
                  <label class="btn btn-outline-info mr-3">
                       <input type="radio" name="field-type-${Session.get('fieldCounter')}" class="js-field-type" value="date" autocomplete="off">Date
                  </label>
               </div>
            </div>`);


        newSelect.appendTo('#inputFields');
    },
    'click .removeField'(e, i) {
        if (Session.get('fieldCounter') > 0) {
            i.$('#inputFields').find('.new-input-group').last().remove();
            Session.set('fieldCounter', Session.get('fieldCounter') - 1);
        }
    }
});
Template.addFieldToCat.onDestroyed(function () {
});