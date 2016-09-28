﻿define(function(require, exports, module) {

	var utils = require('utils');
	var bs = require('./twfzrspBS');
	var twfzrspSave = require('./twfzrspSave');
	var twfzrspView = require('./twfzrspView');

	var viewConfig = {
		initialize: function() {
			var view = utils.loadCompiledPage('twfzrsp');
            this.$rootElement.html(view.render({}), true);
            this.pushSubView([twfzrspSave]);
            this.initView();

			this.eventMap = {
				"[data-action=edit]": this.actionEdit,
				"[data-action=detail]": this.actionDetail,
			};
		},

		initView: function() {
            this._initAdvanceQuery();
            this._initTable();
        },


	 	   actionEdit: function(e){
	        	var sqbh = $(e.target).attr("data-x-sqbh");
	        	var twfzrspEditTpl = utils.loadCompiledPage('twfzrspSave');
	        	var data = WIS_EMAP_SERV.getData(bs.api.pageModel, 'asjcksqxx', {SQBH:sqbh});
	        	
	        	$.bhPaperPileDialog.show({
	        		content: twfzrspEditTpl.render({}),
	        		title: "审批",
	        		ready: function($header, $body, $footer){
	        			twfzrspSave.initialize(sqbh);
	        			
	        			$("#emapForm1").emapForm("setValue", data.rows[0]);
	        			
	            	}
	            });
	        },
	        
	        actionDetail: function(e){
	        	var sqbh = $(e.target).attr("data-x-sqbh");
	        	var twfzrspViewTpl = utils.loadCompiledPage('twfzrspView');

	       	
	        	$.bhPaperPileDialog.show({
	        		content: twfzrspViewTpl.render({}),
	        		title: "查看",
	        		ready: function($header, $body, $footer){
	        			twfzrspView.initialize(sqbh);
	            	}
	            });
	        },

        
		_initAdvanceQuery: function() {
            var searchData = WIS_EMAP_SERV.getModel(bs.api.pageModel, 'twfzrcksqxx', "search");
            searchData.controls[1].xtype='text';
            var $query = $('#emapAdvancedQuery').emapAdvancedQuery({
                data: searchData,
                contextPath : contextPath,
                schema: true
            });
            $query.on('search', this._searchCallback);
        },

        _searchCallback: function(e, data, opts) {
        	data=JSON.parse(data);
        	for(var x in data){
        		if(data[x].name=="SQSJ"){
        			if(data[x].builder=="moreEqual"){
        				data[x].value+=" 00:00:00";
        			}
        			if(data[x].builder=="lessEqual"){
        				data[x].value+=" 24:00:00";
        			}
        		}
        	}
        	data=JSON.stringify(data);
            $('#emapdatatable').emapdatatable('reload', {
                querySetting: data
            });
        },

        _initTable: function() {
            var tableOptions = {
                pagePath: bs.api.pageModel,
                action: 'twfzrcksqxx',
                params: {SQDW:pageMeta.params.SQDWDM},
                customColumns: [{
                    colIndex: '0',
                    type: 'checkbox'
                }, {
                    colIndex: '1',
                    type: 'tpl',
                    column: {
                        text: '操作',
                        align: 'center',
                        cellsAlign: 'center',
                        cellsRenderer: function(row, column, value, rowData) {
                        	if(rowData.DQZT==5)
	                            return '<a href="javascript:void(0)" data-action="detail" data-x-sqbh=' + rowData.SQBH+ '>' + '详情' + '</a>'+ 
	                            ' | <a href="javascript:void(0)" data-action="edit" data-x-sqbh=' + rowData.SQBH + '>' + '审核' + '</a>';
	                        	else
	                        		return  '<a href="javascript:void(0)" data-action="detail" data-x-sqbh=' + rowData.SQBH + '>' + '详情' + '</a>';
                        }
                    }
                }]
            };
            $('#emapdatatable').emapdatatable(tableOptions);
        }
	};

	return viewConfig;
});