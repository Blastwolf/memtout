import {AccountsTemplates} from "meteor/useraccounts:core";
import {T9n} from "meteor/softwarerero:accounts-t9n";

T9n.setLanguage('fr');

const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "Nom d'utilisateur",
        placeholder: "Nom d'utilisateur",
        func: function (val) {
            if (typeof (val) !== "string" && typeof (val) !== "number") return true;
        },
        errStr: "You cannot do that mate (^_^)",
        required: true,
        minLength: 2,
    },
    pwd
]);
