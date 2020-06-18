Ext.ns('Openwis.Admin.System.Maintenance');

Openwis.Admin.System.Maintenance = Ext.extend(Ext.Container, {
	dateFormat: 'Y-m-d H:i',

    initComponent: function() {
		Ext.apply(this, {
			style: {
				margin: '10px 30px 10px 30px'
			}
		});
		Openwis.Admin.System.Maintenance.superclass.initComponent.apply(this, arguments);

		this.getMaintenanceInfo();
	},

	getMaintenanceInfo: function() {
        var getHandler = new Openwis.Handler.Get({
            url: configOptions.locService+ '/xml.system.maintenance.form',
            params: {},
            listeners: {
                success: function(config) {
                    this.config = config;
                    this.initialize();
                },
                failure: function(config) {
                    this.close();
                },
                scope: this
            }
        });
        getHandler.proceed();
	},

	initialize: function() {
        //Create Header.
        this.add(this.getHeader());
        this.add(this.getMaintenanceForm());

        this.doLayout();
        this.fireEvent("panelInitialized");
    },

    getHeader: function() {
        if(!this.header) {
            this.header = new Ext.Container({
                html: Openwis.i18n('SystemConfiguration.Maintenance.Title'),
                cls: 'administrationTitle1'
            });
        }
        return this.header;
    },

    getMaintenanceForm: function() {
            if (!this.maintenanceFormPanel) {
    		this.maintenanceFormPanel = new Ext.form.FormPanel({
    			// itemCls: 'formItems',
    			labelWidth: 75,
    			border: false,
    			// column layout with 2 columns
    			layout: 'column',
    			// defaults for the columns
    			defaults: {
    				columnWidth: 0.5,
    				layout: 'form',
    				border: false,
    				bodyStyle: 'padding:0 18px 0 0'
    			},
    			items: [{
    				// left column
    				// defaults for fields
    				defaults: {
    					anchor: '100%'
    				},
    				items: [
    					this.getFromDateField(),
    					this.getEnableCheckBox()
    				]
    			},{
    				// right column
    				// defaults for fields
    				defaults: {
    					anchor: '100%'
    				},
    				items: [
    					this.getToDateField(),
    				]
    			}]
    		});
    		this.maintenanceFormPanel.addButton(new Ext.Button(this.getSaveMaintenanceButton()));
            }
            return this.maintenanceFormPanel;
        },

        getFromDateField: function() {
        		if (!this.fromDateField) {
        			this.fromDateField = new Ext.form.DateField({
        				fieldLabel: Openwis.i18n('Alarms.RecentEvents.Filter.DateFrom'),
        				name: 'searchFromDate',
        				width: 150,
        				allowBlank: true,
        				format: this.dateFormat,
        				value: this.config.startDate,
        			});
        		}
        		return this.fromDateField;
        	},

        getToDateField: function() {
            if (!this.toDateField) {
                this.toDateField = new Ext.form.DateField({
                    fieldLabel: Openwis.i18n('Alarms.RecentEvents.Filter.DateTo'),
                    name: 'searchToDate',
                    width: 150,
                    allowBlank: true,
                    format: this.dateFormat,
                    value: this.config.endDate,
                });
            }
            return this.toDateField;
        },

        getSaveMaintenanceButton: function() {
                if (!this.saveAction) {
                    this.saveAction = new Ext.Action({
                        disabled: false,
                        text: Openwis.i18n('Common.Btn.Save'),
                        scope: this,
                        handler: function() {
                            if(this.getMaintenanceForm().getForm().isValid()) {
                                var saveHandler = new Openwis.Handler.Save({
                                    url: configOptions.locService+ '/xml.system.maintenance',
                                    params: this.getMaintenanceConfiguration(),
                                    listeners: {
                                        success: function() {
                                            //console.log(/"config update");
                                        },
                                        scope: this
                                    }
                                });
                                saveHandler.proceed();
                            }
                        }
                    });
                }
                return this.saveAction;
            },

        getEnableCheckBox: function() {
            if(!this.enableCheckBox) {
                this.enableCheckBox = new Ext.form.Checkbox({
                    fieldLabel: Openwis.i18n('Maintenance.Enable'),
                    allowBlank: false,
                    checked: this.config.enabled,
                    width: 125,
                });
            }
            return this.enableCheckBox;
        },

        getMaintenanceConfiguration : function() {
            var config = {};
            config.startDate = this.getFromDateField().getValue();
            config.endDate = this.getToDateField().getValue();
            config.enabled = this.getEnableCheckBox().getValue();
            return config;
        }

})