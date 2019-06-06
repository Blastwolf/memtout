import {Meteor} from "meteor/meteor";
import {Datas} from "../../../api/datas";
import './catList.html';

Template.catList.onCreated(function onCreatedCatList() {
   Meteor.subscribe('datas');

});
Template.catList.onRendered(function () {

    //----------------Class 'active' on first elem of cat list--------------//
    //------------------+Drag and drop--------------------------------------//
    let catList = document.getElementById('list-tab');

    let observerCat = new MutationObserver(function(){
            $('#list-tab').sortable();
            let catListElem = $('div#list-tab').find('a');

            let firstCatElem = catListElem.first();

            if(!catListElem.hasClass('active')){
                firstCatElem.tab('show')
            }
    });
    observerCat.observe(catList,{childList:true});


    //----------------------DRAG AND DROP REACTIVITY ON DATALIST-----------------------------//
    let dataList = document.getElementById('nav-tabContent');
    let observerData = new MutationObserver(function(mutations){
        $('.sortable').sortable();
    });
    observerData.observe(dataList,{childList:true});



});

Template.catList.helpers({

    getCatListFromDb() {
        return Datas.findOne({userId: Meteor.userId()});
    },
    catOrderById(doc){
        if(doc){
            let posOrder = doc.catPosOrder;
            let list = doc.cat;
            let temp = [];
            for(let i=0;i<posOrder.length;i++){
                let e=0;
                while(posOrder[i] !== list[e]._id){
                    e++
                }
                temp.push(list[e]);
            }

            return temp;
        }
    },
    dataOrderById(catList){
        let posOrder = catList.posOrder;
        if(posOrder){
            let list = catList.list;
            let temp = [];
            for(let i=0;i<posOrder.length;i++){
                let e=0;
                while(posOrder[i] !== list[e]._id){
                    e++
                }
                temp.push(list[e]);
            }
            return temp;
        }
    },

});
Template.catList.events({
    'click .table-info .delete'(ev, i) {
        ev.stopPropagation();
        let elem = $(ev.currentTarget);
        let elemId = elem.attr('data-catid');
        let elemDatasId = this._id;
        if(confirm('Voulez vous vraiment supprimer cette ligne ?')){
            Meteor.call('removeDataFromCat', elemDatasId, elemId, function (e, r) {
                if (e) console.log(e);
            });
        }

    },
    //----------------Event qui affiche le formulaire d'ajout d'entrée----------------//
    //--------------------------------------------------------------------------------//
    'click button.addToCatButton'(e, i) {
        let catData = this;

        let catFieldsHtml = "";
        catData.catFields.forEach(function (e) {
            let labelWithoutSpace = e.label.replace(/\s/g, '');
            catFieldsHtml +=
                `<div class="form-group">
                    <label for="input-${labelWithoutSpace}">${e.label} :</label>
                    <input type="${e.type}" class="form-control" name="input-${labelWithoutSpace}" id="input-${labelWithoutSpace}" required>
                </div>`;
        });
        //On selectionne le container modal qui correspond au bouton click
        //on doit utiliser un container sinon il n'y a pas de dataContext dans l'event submit
        //car le form n'était pas present lors de la creation du context
        $(`#modal-${catData._id}`).append(`
            <div class="modal js-modal fade addToCat" id="addToCat-${catData._id}" tabindex="-1" role="dialog"
                                     aria-labelledby="addToCat-${catData._id}-Label"
                                     aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addToCat-${catData._id}-Label">${catData.catName}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
        
                        <div class="modal-body">
                            <form id="catForm-${catData._id}" class="catForm" role="form">
                                ${catFieldsHtml}
                                <button type="submit" class="btn btn-primary" >Valider</button>
                                <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close">Annuler</button>
                            </form>                   
                        </div>
                    </div>
                </div>
            </div>`);
    },
    //---------------------Event qui submit une nouvelle entrée dans la catégorie------------------//
    //--------------------------------------------------------------------------------------------//
    'submit form.catForm'(ev, i) {
        ev.preventDefault();
        let inputValue = $('form.catForm').find('input');
        let catData = this;
        let catNameId = catData._id;
        let datas = [];
        inputValue.each(function (i, e) {
            let type = $(e).attr('type');
            let value = $(e).val();
            let _id = new Meteor.Collection.ObjectID()._str;
            datas.push({_id, type, value});
        });

        let id = new Meteor.Collection.ObjectID();

        let catListInsertObj = {
            _id: id._str,
            datas: datas
        };

        let eventTargetModal = '#addToCat-' + catNameId;

        Meteor.call('insertToCat',catListInsertObj, catNameId, function (error, r) {
            if (error) console.log(error);
            if (r) {
                $(eventTargetModal).modal('hide');
            }
        });
    },
    //--------------------------Event qui crée une modal pour modifier le contenu d'une cellule datas--------//
    //-------------------------------------------------------------------------------------------------------//
    'click .js-dataslist-cell'(e, i) {
        let datasId = this._id;
        let dataId = $(e.target).attr('data-id');
        let catNameId = $(e.target).parent().find('.delete').attr('data-catid');
        let elem = $(e.target);
        let currentValue = $(e.target).text().replace(/"/g,'&quot;');

        let modale = $(`<div class="modal js-modal fade change-value" id="change-value" tabindex="-1" role="dialog">`).html(`
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addToCat">Changer la valeur</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
        
                        <div class="modal-body">
                            <form id="change-cell-value" class="change-value" role="form">
                                <div class="form-group">
                                    <span class="help-block"></span>
                                    <input type="${elem.attr('data-type')}" class="form-control" name="new-value" id="new-value" value="${currentValue}" required>
                                </div> 
                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary" >Valider</button>
                                    <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close">Annuler</button>
                                </div>
                            </form>                   
                        </div>
                    </div>
                </div>
            </div>`);
        //On insert la modal dans la modal correspondent au dataContext via l'id de la catégorie
        $(`#modal-${catNameId}`).append(modale);
        modale.modal('show');
            $('#change-cell-value').on('submit',function(e){
                e.preventDefault();
                let newValue = $('#new-value').val();
                Meteor.call('updateDataFromCat',dataId,datasId,catNameId,newValue,function(err,res){
                    if(err)console.log(err);
                    if(res){
                        modale.modal('hide');
                        console.log('ampja')
                    }
                });
                // modale.modal('hide');
                // console.log(elem.text());
                // console.log('new value from input',newValue);
                // console.log(instaRes);
                // elem.text(instaRes);
            });

    },
    'click .js-field-cell'(e,i){
        let catId = $(e.target).attr('data-catid');
        let elem = $(e.target);

        let modal = $(`<div class="modal js-modal fade change-value" id="change-value" tabindex="-1" role="dialog">`).html(`
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addToCat">Changer la valeur</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
        
                        <div class="modal-body">
                            <div>
                                <p class="text-primary">Nom de champ actuel : <span class="text-info">${elem.text()}</span></p>
                                <p class="text-primary">Type du champ actuel : <span class="text-info">${elem.attr('data-type')}</span></p>
                            </div>
                        
                            <form id="change-field-value" class="change-value" role="form">
                                <div class="form-group">
                                    <label for="labelForField">Changez la valeur du champ :</label>
                                    <input type="text" id="new-value" class="form-control labelForField mb-3" name="labelForField" value="${elem.text().replace(/"/g,'&quot;')}" required>
                            
                                           <select class="custom-select" name="changeFieldValue" id="changeFieldValue" required>
                                                <option selected value="">Choisissez le(s) champ(s) à ajouter</option>
                                                <option value="text">Ajouter un champ texte</option>
                                                <option value="number">Ajouter un champ nombre</option>
                                                <option value="date">Ajouter un champ date</option>
                                           </select>   
                                </div>
                                 
                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary" >Valider</button>
                                    <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close">Annuler</button>
                                </div>
                            </form>                   
                        </div>
                    </div>
                </div>
            </div>`);
            $(`#modal-${catId}`).append(modal);
            modal.modal('show');
                $('#change-field-value').on('submit',function(ev){
                    ev.preventDefault();
                    let label = $('#new-value').val();
                    let type = $('#changeFieldValue').val();
                    console.log(type);
                    let newField = {
                        _id:elem.attr('data-id'),
                        label:label,
                        type:type,
                    };
                    Meteor.call('updateCatField',catId,elem.attr('data-id'),newField,function(err,res){
                        console.log('html clean');
                    });
                    modal.modal('hide');
                })
    },
    //-----------------------------------------Delete a cat---------------------//
    //----------------------------------------------------------------------------//
    'click .removeCat'(e,i){
        let catId= this._id;
        let catName =this.catName;
        if(confirm(`Voulez vous vraiment supprimer la catégorie "${catName}" ?`)){
            Meteor.call('removeCatFromList',catId,function(err,res){
                if(err)console.log(err);
            })
        }
    },
    'shown.bs.modal .modal'(e, i) {
        $('.modal').find('input:first').focus();
    },
    'hide.bs.modal .modal'(e, i) {
        $('.js-modal').remove();
    },
    'sortstop .sortable'(e,i,ui){

        let rows =$(e.target).find('tr.data-list');
        let catNameId= rows.attr('data-catid');
        let sortArr = [];
        rows.each(function(i,e){
            sortArr.push($(e).attr('data-id'));
        });

        Meteor.call('dataUpdatePosition',sortArr,catNameId,function(err,res){
            if(err)console.log(err);
        })
    },
    'sortstop #list-tab'(e,i,ui){
       let rows = $(e.target).find('a');
       let sortArr=[];
       rows.each(function(i,e){
           sortArr.push($(e).attr('data-catid'));
       });

        Meteor.call('catUpdatePosition',sortArr,function(err,res){
            if(err)console.log(err);
        })
    }
});

Template.catList.onDestroyed(function () {
    Session.clear();
});