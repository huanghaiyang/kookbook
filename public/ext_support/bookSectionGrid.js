function showBookSectionGrid(bookid) {
    Ext.require([
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.panel.*',
        'Ext.layout.container.Border'
    ]);

    Ext.onReady(function() {
        Ext.define('bookSection', {
            extend: 'Ext.data.Model',
            fields: [{
                    name: 'name',
                    mapping: 'name'
                },
                'secName',
                'order',
                'instruction',
                'content'
            ]
        });

        // create the Data Store
        var storeBookSections = Ext.create('Ext.data.Store', {
            model: 'bookSection',
            proxy: {
                // load using HTTP
                type: 'ajax',
                url: '/support/book/listAllBookSections?bookid=' + bookid,
                reader: {
                    type: 'json',
                    root: "items",
                    totalProperty: 'totalCount'
                }
            }
        });

        // create the grid
        var gridBookSection = Ext.create('Ext.grid.Panel', {
            store: storeBookSections,
            selType: 'checkboxmodel',
            selModel: {
                mode: 'order',
                checkOnly: false
            },
            columns: [{
                text: "章节名称",
                width: 120,
                dataIndex: 'name',
                sortable: true
            }, {
                text: "章节副标题",
                flex: 1,
                dataIndex: 'secName',
                sortable: true
            }, {
                text: "章节序列号",
                width: 115,
                dataIndex: 'order',
                sortable: true
            }, {
                text: '操作',
                width: 115,
                sortable: true,
                xtype: 'actioncolumn',
                items: [{
                    icon: '/ext_support/images/delete.gif', // Use a URL in the
                    // icon config
                    tooltip: '删除书籍信息',
                    iconCls: 'delete',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = storeBookSections.getAt(rowIndex);

                        function showResult(btn) {
                            if (btn == 'yes') {
                                Ext.Ajax.request({
                                    url: '/support/book/deleteOneBookSection',
                                    params: {
                                        sectionid: rec.get("order"),
                                        bookid: bookid
                                    },
                                    method: 'POST',
                                    callback: function(options, success, response) {
                                        if (success) {
                                            var responseJson = Ext.JSON
                                                .decode(response.responseText);
                                            if (responseJson.error)
                                                Ext.MessageBox.alert("提示信息", responseJson.error.message);
                                            if (responseJson.success == "true") {
                                                Ext.Msg.alert("提示信息", "章节信息删除成功!");
                                                storeBookSections.load({
                                                    params: {
                                                        start: 0,
                                                        limit: 10
                                                    }
                                                });
                                            }
                                        } else {
                                            Ext.Msg.confirm('失败',
                                                '请求超时或网络故障,错误编号：[' + response.status + ']是否要重新发送？', function(btn) {
                                                    if (btn == 'yes') {
                                                        Ext.Ajax
                                                            .request(options);
                                                    }
                                                });
                                        }
                                    }
                                });
                            }
                        }
                        Ext.MessageBox.confirm('提示信息', '真的要删除此章节信息么?', showResult);
                    }
                }]
            }],
            viewConfig: {
                forceFit: true
            },
            height: 210,
            split: true,
            region: 'north',
            id: 'gridBookSection'
        });

        // define a template to use for the detail view
        var bookTplMarkup = [
            '章节名称: <font color="red">{name}</font><br/>',
            '副标题: {secName}<br/>',
            '序列: {order}<br/>',
            '简介或小节: {instruction}<br/>',
            'n内容: {content}<br/>'
        ];
        var bookTpl = Ext.create('Ext.Template', bookTplMarkup);

        Ext.create('Ext.Panel', {
            renderTo: 'bookDiv',
            frame: true,
            title: 'Book List',
            width: 540,
            height: 400,
            floating: true,
            draggable: true,
            x: 400,
            y: 0,
            maskDisabled: true,
            closable: true,
            layout: 'border',
            items: [
                gridBookSection, {
                    id: 'bookSectionDetailPanel',
                    region: 'center',
                    bodyPadding: 7,
                    bodyStyle: "background: #ffffff;",
                    html: '查看章节详情',
                    bodyStyle: 'overflow-x:hidden; overflow-y:scroll'
                }
            ]
        });

        // update panel body on selection change
        Ext.getCmp('gridBookSection').getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                var bookSectionDetailPanel = Ext.getCmp('bookSectionDetailPanel');
                bookTpl.overwrite(bookSectionDetailPanel.body, selectedRecord[0].data);
            }
        });

        storeBookSections.load();
    });
}