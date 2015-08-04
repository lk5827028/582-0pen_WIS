Ext.ns('Openwis.RegistrationUser');

Openwis.RegistrationUser.RegistrationUser = Ext.extend(Ext.form.FormPanel, {
	
	initComponent : function() {
		Ext.apply(this, {
			itemCls : 'formItems',
			width : 370,
			autoHeight: true,
			layout: 'table',
			cls:'reg_tb',
			region: 'center',
			border: false,
			layoutConfig: {
		        // The total column count must be specified here
		        columns: 4
		    },
			items : [
					            
	            // First Line
				this.createLabel(Openwis.i18n('RegistrationUser.LastName.Label')),
				this.getSurNameTextField(),
				this.createLabel(Openwis.i18n('RegistrationUser.FirstName.Label')),
	            this.getNameTextField(),
	            // Second Line
				this.createLabel(Openwis.i18n('RegistrationUser.ContactEmail.Label')),
	            this.getEmailTextField(),
	            // Third Line
	            // Fourth Line
	            this.createLabel(Openwis.i18n('RegistrationUser.Password')),
	            this.getPasswordTextField(),
	            this.createLabel(Openwis.i18n('RegistrationUser.Confirm.Password')),
	            this.getPassword2TextField(),
	            //Fifth Line
	            //Sixth Line
	            this.createLabelText(Openwis.i18n('RegistrationUser.Captcha'), 2),
	            //Seventh Line
	            this.createLabel(this.getCaptcha().a + ' + ' + this.getCaptcha().b + ' = ', 1),
	            this.getCaptcha()
			],
            buttons: [
                //-- Add buttons.
		        this.add(new Ext.Button(this.getRegisterAction()))
            ]
		});
		Openwis.RegistrationUser.RegistrationUser.superclass.initComponent
				.apply(this, arguments);
	},


	// -----------------------------------------------------------------
	// Components.
	
	createLabel : function(label, colspansize) {
		return new Ext.Container({
	        border: false,
	        colspan: colspansize,
	        html: label,
	        width: 130,
	        cls:'main_btxt2'
	    });
	},
	
	createLabelText : function(label, colspansize) {
		return new Ext.Container({
	        border: false,
	        colspan: colspansize,
	        html: label,
	        cls:'main_btxt2'
	    });
	},

	createDummy : function() {
		return new Openwis.Utils.Misc.createDummy();
	},

	/**
	 * The text field for the user name.
	 */
	getNameTextField : function() {
		if (!this.nameTextField) {
			this.nameTextField = new Ext.form.TextField({
						name : 'name',
						allowBlank : false,
						maxLength: 64,
						width : 180,
						cls:"pd_tb10"
					});
		}
		return this.nameTextField;
	},

	/**
	 * The text field for the user surname.
	 */
	getSurNameTextField : function() {
		if (!this.surnameTextField) {
			this.surnameTextField = new Ext.form.TextField({
						name : 'surname',
						allowBlank : false,
						maxLength: 64,
						width : 180,
						cls:"pd_tb10"
					});
		}
		return this.surnameTextField;
	},

	/**
	 * The text field for the user email.
	 */
	getEmailTextField : function() {
		if (!this.emailTextField) {
			this.emailTextField = new Ext.form.TextField({
						name : 'email',
						vtype : 'email',
						allowBlank : false,
						maxLength: 128,
						width : 514,
						colspan: 3,
						cls:"pd_tb10"
					});
		}
		return this.emailTextField;
	},
	    
    getPasswordTextField: function() {
        if(!this.passwordTextField) {
            this.passwordTextField = new Ext.form.TextField({
                inputType: 'password',
                name: 'password',
                allowBlank:false,
				maxLength: 32,
                width: 180,
                cls:"pd_tb10"
            });
        }
        return this.passwordTextField;
    },
    
    getPassword2TextField: function() {
        if(!this.password2TextField) {
            this.password2TextField = new Ext.form.TextField({
                inputType: 'password',
                name: 'password',
                allowBlank:false,
				maxLength: 32,
                width: 180,
                cls:"pd_tb10"
            });
        }
        return this.password2TextField;
    },
    
    getCaptcha: function() {
    	if (!this.captcha) {
    		this.captcha = new Openwis.Utils.Captcha({
    			width: 180,
    			colspan: 2,
    			cls:"pd_tb10" });
    	}
    	return this.captcha;
    },

	// ----------------------------------------------------------------- Utility
	// methods.

	getRegisteredUser : function() {
		user = {};
		user.user = {};
		// The user attributes.
		user.user.name = this.getNameTextField().getValue();
		user.user.username = this.getEmailTextField().getValue();
		user.user.surname = this.getSurNameTextField().getValue();
		user.user.emailContact = this.getEmailTextField().getValue();
		user.user.password = this.getPasswordTextField().getValue();
		user.user.profile = 'User';

		 // Address
       user.user.address = {};
       user.user.address.address = '';
       user.user.address.zip = '';
       user.user.address.state = '';
       user.user.address.city = '';
       user.user.address.country = '';
       
		return user;
	},
	
	/**
	 * The Save action.
	 */
	getRegisterAction: function() {
		if(!this.registerAction) {
			this.registerAction = new Ext.Action({
				text:Openwis.i18n('RegistrationUser.Submit'),
				cls:'mainbtn_blue',
				width:110,
				scope: this,
				handler: function() {
				    var registerInfoValid = this.getForm().isValid();
					if( registerInfoValid) {
						//Check password
						if (this.getPasswordTextField().getValue() != this.getPassword2TextField().getValue()) {
							// Password different
							Ext.Msg.show({
	    					    title: Openwis.i18n('RegistrationUser.Password.ErrorDlg.pswd.title'),
		    				    msg: Openwis.i18n('RegistrationUser.Password.ErrorDlg.pswd'),
			                    buttons: Ext.MessageBox.OK,
			                    icon: Ext.MessageBox.WARNING
			               });
						} else {
							// Fields correctly filled.
							this.registerUser = this.getRegisteredUser();
							var saveHandler = new Openwis.Handler.Save({
								url: configOptions.locService+ '/user.register.submit',
								params: this.registerUser,
								listeners: {
									success: function(config) {
										new Openwis.RegistrationUser.RegistrationUserSuccessful();
									},
									scope: this
								}
							});
							saveHandler.proceed();
						}
					} else {
						//Error Fields not correctly filled.
					    Ext.Msg.show({
    					    title: Openwis.i18n('RegistrationUser.Password.ErrorDlg.valid.title'),
	    				    msg: Openwis.i18n('RegistrationUser.Password.ErrorDlg.valid.msg'),
		                    buttons: Ext.MessageBox.OK,
		                    icon: Ext.MessageBox.WARNING
		               });
					}
				}
			});
		}
		return this.registerAction;
	}
});