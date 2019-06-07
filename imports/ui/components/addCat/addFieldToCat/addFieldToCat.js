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
        let newSelect = $('<div class="form-group">').html(`
  
             <p class="text-center "><i class="fas fa-plus-circle"></i></p>
                
            <input type="text" class="form-control labelForField mb-3" name="labelForField-${Session.get('fieldCounter')}" placeholder="Label à associer à ce champ" autocomplete="off" required>
       
            <select class="custom-select" name="addFieldToForm" id="addFieldToForm" required>
                <option selected value="">Choisissez le(s) champ(s) à ajouter</option>
                <option value="text">Ajouter un champ texte</option>
                <option value="number">Ajouter un champ nombre</option>
                <option value="date">Ajouter un champ date</option>
            </select>`);

        newSelect.appendTo('#inputFields');
    },
    'click .removeField'(e, i) {
        if (Session.get('fieldCounter') > 0) {
            i.$('#inputFields').find('.form-group').last().remove();
            Session.set('fieldCounter', Session.get('fieldCounter') - 1);
        }
    }
});
Template.addFieldToCat.onDestroyed(function () {
});