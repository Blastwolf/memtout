import {Meteor} from "meteor/meteor";
import './addToCat.html';

Template.addToCat.onRendered(function () {
    //  Creation des champs correspondants a celles de la catégorie
    // let catId = this.data._id;
    // let formFields = this.data.catFields;
    // let thisForm = this.$('#addToCatForm fieldset');
    // for (let field in formFields) {
    //     let noSpaceLabelId = field.replace(/\s/g, '') + catId;
    //     $('<div class="form-group">').html(`
    //     <label for="${noSpaceLabelId}">${field}</label>
    //     <input type="${formFields[field]}" class="form-control" name="${noSpaceLabelId}" id="${noSpaceLabelId}" required>
    //     `).appendTo(thisForm);
    // }

    //----------------Focus input Modal----------------//
    // let index = this.data.index;
    //     // let catNameId = this._id;
    //     // let eventTargetModal = '#addToCat' + catNameId;
    //     // let eventTargetInput = '#addToCatInput' + catNameId;
    //     // $(eventTargetModal).on('shown.bs.modal', function () {
    //     //     $(eventTargetInput).focus();
    //     // });

    // $('form.')
    // console.log('<haet fezf fuck');
    // let inputValue = $('form.catForm').find('input');
    // let catData = i.data;
    //
    // let catListInsertArr = [];
    // inputValue.each(function (i, e) {
    //     console.log(e.value, 'type= ', catData.catFields[i].type);
    //     catListInsertArr.push({type: catData.catFields[i].type, value: e.value});
    // });
    // console.log(catListInsertArr);
    // let id = new Meteor.Collection.ObjectID();
    //
    // let catListInsertObj ={
    //     _id: id._str,
    //     datas:catListInsertArr,
    // };
    // console.log(catListInsertObj);
    //
    // let catName = i.data.catName;
    // let catNameId = i.data._id;
    // console.log(ev.currentTarget);
    //
    // // let datasToInsert = event.target['addToCatInput' + catNameId].value;
    // let eventTargetModal = '#addToCat' + catNameId;
    //
    // Meteor.call('insertToCat', catName, catListInsertObj, catNameId, function (error, r) {
    //     if (error) console.log(error);
    //     if (r) {
    //         console.log('success !', r);
    //         $(eventTargetModal).modal('hide');
    //         //event.target['addToCatInput' + catNameId].value = '';
    //     }
    // });

});

Template.addToCat.events({
    'click button.addToCatButton'(e, i) {
        console.log(i);
        let modalEl = $('<div>');
        let catData = i.data;
        let sshit = `#list-${catData._id}-list`;
        let catFieldsHtml = "";
        catData.catFields.forEach(function (e) {
            let labelWithoutSpace = e.label.replace(/\s/g, '');
            catFieldsHtml +=
                `<div class="form-group">
                    <label for="input${labelWithoutSpace}jhgjghjghjg">${e.label} :</label>
                    <input type="${e.type}" class="form-control" name="input${labelWithoutSpace}" value="ca meklze paaaas" id="input${labelWithoutSpace}" required>
                </div>`;
        });

        modalEl.html(`
    <div class="modal fade addToCat" id="addToCa${catData._id}" tabindex="-1" role="dialog"
         aria-labelledby="addToCa${catData._id}Label"
         aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addToCat${catData._id}Label">${catData.catName}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <form id="catForm${catData._id}" class="catForm" role="form">
                        ${catFieldsHtml}
                        <button type="submit" class="btn btn-primary" >Valider</button>
                        <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close">Annuler</button>
                    </form>                   
                </div>
            </div>
        </div>
    </div>
    `).insertAfter(sshit);
        modalEl.children().modal('show');
    },
    'submit form.catForm'(ev, i) {
        ev.preventDefault();
        let inputValue = $('form.catForm').find('input');
        let catData = i.data;

        let catListInsertArr = [];
        inputValue.each(function (i, e) {
            catListInsertArr.push({type: catData.catFields[i].type, value: e.value});
        });
        let id = new Meteor.Collection.ObjectID();

        let catListInsertObj = {
            _id: id._str,
            datas: catListInsertArr,
        };

        let catName = i.data.catName;
        let catNameId = i.data._id;

        // let datasToInsert = event.target['addToCatInput' + catNameId].value;
        let eventTargetModal = '#addToCat' + catNameId;

        Meteor.call('insertToCat', catName, catListInsertObj, catNameId, function (error, r) {
            if (error) console.log(error);
            if (r) {
                console.log('success !', r);
                $(eventTargetModal).modal('hide');
                //event.target['addToCatInput' + catNameId].value = '';
            }
        });
    },
    // 'shown.bs.modal .addToCat'(e, i) {
    //     $('.addToCat input:first').focus();
    // },
    'hide.bs.modal .addToCat'(e, i) {
        console.log('html clean');
        $('.addToCat').html('');
    },

});


