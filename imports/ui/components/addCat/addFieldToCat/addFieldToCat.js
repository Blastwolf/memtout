import './addFieldToCat.html';


Template.addFieldToCat.onCreated(function () {
    //count the number of inputFields the user add
    this.fieldCounter = 0;
});

Template.addFieldToCat.events({
    'click .addField'(e, i) {
        i.fieldCounter++;
        console.log(i.fieldCounter);
        let newSelect = $('<div class="form-group">').html(`
            <p class="text-center"><i class="fas fa-plus"></i></p>

            <input type="text" class="form-control labelForField mb-3" name="labelForField${i.fieldCounter}" placeholder="Label à associer à ce champ">
       
            <select class="custom-select" name="addFieldToForm" id="addFieldToForm">
                <option selected="">Choisissez le(s) champ(s) à ajouter</option>
                <option value="text">Ajouter un champ texte</option>
                <option value="number">Ajouter un champ nombre</option>
                <option value="date">Ajouter un champ date</option>
            </select>`);

        newSelect.appendTo('#inputFields');

        console.log(this, 'hello');
    }
});