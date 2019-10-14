/*!
 * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
 *
 * Copyright 2002 - 2017 Hitachi Vantara. All rights reserved.
 *
 * NOTICE: All information including source code contained herein is, and
 * remains the sole property of Hitachi Vantara and its licensors. The intellectual
 * and technical concepts contained herein are proprietary and confidential
 * to, and are trade secrets of Hitachi Vantara and may be covered by U.S. and foreign
 * patents, or patents in process, and are protected by trade secret and
 * copyright laws. The receipt or possession of this source code and/or related
 * information does not convey or imply any rights to reproduce, disclose or
 * distribute its contents, or to manufacture, use, or sell anything that it
 * may describe, in whole or in part. Any reproduction, modification, distribution,
 * or public display of this information without the express written authorization
 * from Hitachi Vantara is strictly prohibited and in violation of applicable laws and
 * international treaties. Access to the source code contained herein is strictly
 * prohibited to anyone except those individuals and entities who have executed
 * confidentiality and non-disclosure agreements or other agreements with Hitachi Vantara,
 * explicitly covering such access.
 */

doh.register("PIR Controller API Tests", [

    {  name: "Create controller",
        runTest: function(){
        
            var controller = new pentaho.pir.controller();
            doh.assertTrue( controller != null);    
        }
    },
    {  name: "Create model",
        runTest: function(){
        
            var model = new pentaho.pir.model();
            doh.assertTrue( model != null);    
        }
    },
    {   name: "Init controller",
        timeout: 5000, //5 second timeout.
        runTest: function(){
        
            try {
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();

                // check the template list
                doh.assertTrue(controller.templates != null);
                doh.assertEqual(24, controller.templates.length);
                // examine the first two templates
                doh.assertEqual('1_jade_1_left_aligned.prpt', controller.templates[0].id);
                doh.assertTrue(controller.templates[0].isDefault);
                doh.assertEqual('1_jade_1_left_aligned', controller.templates[0].name);
                doh.assertEqual('1_jade_1_left_aligned.png', controller.templates[0].imagePath);
                doh.assertEqual('1_jade_2_indented.prpt', controller.templates[1].id);
                doh.assertFalse(controller.templates[1].isDefault);
                doh.assertEqual('1_jade_2_indented', controller.templates[1].name);
                doh.assertEqual('1_jade_2_indented.png', controller.templates[1].imagePath);
                
            } catch (e) {
            alert(e.message);
                doh.error(e.message);
                doh.assertTrue(false);
            }
        }
    },
    {  name: "isLoginContent",
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller.isLoginContent('lkjf lsjf ld fjslfj lsdfj alfj jff j_spring_security_check slkjlgj lgjflgkjflgj lfgj s') );
                doh.assertFalse( controller.isLoginContent('lkjf lsjf ld fjslfj lsdfj alfj jff slkjlgj lgjflgkjflgj lfgj s') );
                
        }
    },
    {  name: "PageFormats",
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();

                var list = controller.getPageFormatList();

                doh.assertTrue( list.length > 0);

                var foundLetter = false;
                for(var idx=0; idx<list.length; idx++ ) {
                    if(list[idx] == 'LETTER') {
                        foundLetter = true;
                        break;
                    }
                }

                doh.assertTrue( foundLetter );
                
        }
    },
    {  name: "Templates",
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();

                var list = controller.getTemplateList();

                doh.assertTrue( list.length > 0);

                var found = false;
                for(var idx=0; idx<list.length; idx++ ) {
                    if(list[idx].id == '4_cobalt_1_left_aligned.prpt') {
                        found = true;
                        break;
                    }
                }

                doh.assertTrue( found );
                
        }
    },
    {  name: "Data sources",
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadModels();

                doh.assertTrue( ordersModelExists(controller) );
                
                controller.datasourceInfos = [];
                doh.assertFalse( ordersModelExists(controller) );
                
                controller.refreshDatasources();
                doh.assertTrue( ordersModelExists(controller) );
                
        }
    },
    {  name: "Model details",
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.initDatasources();
                controller.loadModels();
                
                doh.assertTrue( ordersModelExists(controller) );

                doh.assertTrue( controller.datasource == null);

                controller.setModel('steel-wheels:BV_ORDERS');
                doh.assertTrue( controller.datasource != null);
                
                var elements = controller.datasource.getAllElements();
                doh.assertEqual( 38, elements.length);
                
        }
    },
    {  name: "getReportResponseType",
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.init();

                // test good content
                doh.assertEqual("VALID", controller.getReportResponseType('<table>...'));
                // test bad session
                doh.assertEqual("LOGIN", controller.getReportResponseType('lkjf lsjf ld fjslfj lsdfj alfj jff j_spring_security_check slkjlgj lgjflgkjflgj lfgj s'));
                // test other error
                doh.assertEqual("UNEXPECTED", controller.getReportResponseType('some error message'));
                // test message content
                doh.assertEqual("MESSAGE", controller.getReportResponseType('{"class": "com.pentaho.iadhoc.service.StatusMessage", ....'));
        }
    },
    {  name: "submit 1",
        timeout: 10000, //10 second timeout.
        runTest: function(){
        
                var deferred = new doh.Deferred();

                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.initDatasources();
                controller.loadModels();
                controller.loadTemplateList();

                controller.setModel('steel-wheels:BV_ORDERS');

                // start with a blank report
                controller.refresh();

                setTimeout(function() {
                    doh.assertTrue(view.lastReportContent.indexOf('<table') == 0);

                    data = parseTable(view.lastReportContent);

                    doh.assertEqual("&nbsp;", data['rpt-page-header-0'].value);
                    doh.assertNotEqual(1, data['rpt-page-header-1'].value.length);
                    doh.assertEqual("normal", data['rpt-page-header-0'].style.fontWeight);

                    deferred.callback(true);
                }, 2000);
                return deferred;
        }
    },
    {  name: "test labels",
        timeout: 10000, //10 second timeout.
        runTest: function(){
        
                var deferred = new doh.Deferred();

                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();
                controller.initDatasources();
                controller.loadModels();

                controller.setModel('steel-wheels:BV_ORDERS');

                // Create required labels for this test. These are no longer defined by default a new report.
                model.report.pageHeaders.push(model.createLabel());
                model.report.pageFooters.push(model.createLabel());
                model.report.reportFooters.push(model.createLabel());

                doh.assertTrue( controller.isFormattingModified() == false);

                controller.toggleBold({idx:0, type:'pageHeaders'});

                doh.assertTrue( controller.isFormattingModified() == true);

                controller.toggleItalic({idx:0, type:'pageHeaders'});
                controller.setColor({idx:0, type:'pageHeaders'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'pageHeaders'}, '#998877');
                controller.setFontName({idx:0, type:'pageHeaders'}, 'Courier');
                controller.setFontSize({idx:0, type:'pageHeaders'}, 12);
                controller.setLabel({idx:0, type:'pageHeaders'}, 'test label');

                controller.toggleBold({idx:0, type:'pageFooters'});
                controller.toggleItalic({idx:0, type:'pageFooters'});
                controller.setColor({idx:0, type:'pageFooters'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'pageFooters'}, '#998877');
                controller.setFontName({idx:0, type:'pageFooters'}, 'Courier');
                controller.setFontSize({idx:0, type:'pageFooters'}, 12);
                controller.setLabel({idx:0, type:'pageFooters'}, 'test label');

                controller.toggleBold({idx:0, type:'reportTitles'});
                controller.toggleItalic({idx:0, type:'reportTitles'});
                controller.setColor({idx:0, type:'reportTitles'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'reportTitles'}, '#998877');
                controller.setFontName({idx:0, type:'reportTitles'}, 'Courier');
                controller.setFontSize({idx:0, type:'reportTitles'}, 12);
                controller.setLabel({idx:0, type:'reportTitles'}, 'test label');

                doh.assertEqual("test label", controller.getLabel({idx:0, type:'reportTitles'}));

                controller.toggleBold({idx:0, type:'reportFooters'});
                controller.toggleItalic({idx:0, type:'reportFooters'});
                controller.setColor({idx:0, type:'reportFooters'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'reportFooters'}, '#998877');
                controller.setFontName({idx:0, type:'reportFooters'}, 'Courier');
                controller.setFontSize({idx:0, type:'reportFooters'}, 12);
                controller.setLabel({idx:0, type:'reportFooters'}, 'test label');

                controller.refresh();

                setTimeout(deferred.getTestCallback(function() {

                    if(view.lastReportContent == null) {
                        deferred.callback(false);
                        return;
                    }
                    doh.assertTrue(view.lastReportContent != null);
                    doh.assertTrue(view.lastReportContent.indexOf('<table') == 0);
                    data = parseTable(view.lastReportContent);
                    
                    doh.assertEqual("test label", data['rpt-page-header-0'].value);

                    doh.assertEqual("bold", data['rpt-page-header-0'].style.fontWeight);
                    doh.assertEqual("italic", data['rpt-page-header-0'].style.fontStyle);
                    doh.assertEqual("12pt", data['rpt-page-header-0'].style.fontSize);
                    doh.assertEqual("Courier", stripQuotes(data['rpt-page-header-0'].style.fontFamily));
                    doh.assertEqual("#112233", eval('view.'+data['rpt-page-header-0'].style.color));
                    doh.assertEqual("#998877", eval('view.'+data['rpt-page-header-0'].style.backgroundColor));

                    doh.assertEqual("test label", data['rpt-page-footer-0'].value);
                    doh.assertEqual("bold", data['rpt-page-footer-0'].style.fontWeight);
                    doh.assertEqual("italic", data['rpt-page-footer-0'].style.fontStyle);
                    doh.assertEqual("12pt", data['rpt-page-footer-0'].style.fontSize);
                    doh.assertEqual("Courier", stripQuotes(data['rpt-page-footer-0'].style.fontFamily));
                    doh.assertEqual("#112233", eval('view.'+data['rpt-page-footer-0'].style.color));
                    doh.assertEqual("#998877", eval('view.'+data['rpt-page-footer-0'].style.backgroundColor));

                    doh.assertEqual("test label", data['rpt-report-header-label-0'].value);
                    doh.assertEqual("bold", data['rpt-report-header-label-0'].style.fontWeight);
                    doh.assertEqual("italic", data['rpt-report-header-label-0'].style.fontStyle);
                    doh.assertEqual("12pt", data['rpt-report-header-label-0'].style.fontSize);
                    doh.assertEqual("Courier", stripQuotes(data['rpt-report-header-label-0'].style.fontFamily));
                    doh.assertEqual("#112233", eval('view.'+data['rpt-report-header-label-0'].style.color));
                    doh.assertEqual("#998877", eval('view.'+data['rpt-report-header-label-0'].style.backgroundColor));

                    deferred.callback(true);
                }), 2000);
                return deferred;

            }
        },
        
    {  name: "test undo/redo",
        timeout: 10000, //10 second timeout.
        runTest: function(){
        
                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();
                controller.initDatasources();
                controller.loadModels();
                
                controller.setModel('steel-wheels:BV_ORDERS');

                doh.assertEqual( false, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( 0, model.report.pageHeaders.length);

                // test bogus undo
                controller.undo();
                doh.assertEqual( false, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( 0, model.report.pageHeaders.length);

                controller.addToUndo(dojo.toJson( model.report )); // need to insert blank report

                // Create required labels for this test. These are no longer defined by default a new report.
                model.report.pageHeaders.push(model.createLabel());
                model.report.pageFooters.push(model.createLabel());
                model.report.reportFooters.push(model.createLabel());

                controller.setFontName({idx:0, type:'pageHeaders'}, 'font1');
                controller.addToUndo(dojo.toJson( model.report ));

                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( "font1", model.report.pageHeaders[0].format.fontName ); 

                // now undo
                controller.undo();
                doh.assertEqual( false, controller.canUndo());
                doh.assertEqual( true, controller.canRedo());
                doh.assertEqual( 0, model.report.pageHeaders.length);
                
                // now redo
                controller.redo();
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( "font1", model.report.pageHeaders[0].format.fontName ); 

                // test bogus redo
                controller.redo();
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( "font1", model.report.pageHeaders[0].format.fontName ); 

                controller.setFontName({idx:0, type:'pageHeaders'}, 'font2');
                controller.addToUndo(dojo.toJson( model.report ));
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( "font2", model.report.pageHeaders[0].format.fontName ); 

                // now undo
                controller.undo();
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( true, controller.canRedo());
                doh.assertEqual( "font1", model.report.pageHeaders[0].format.fontName ); 
                
                controller.setFontName({idx:0, type:'pageHeaders'}, 'font3');
                controller.addToUndo(dojo.toJson( model.report ));
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( "font3", model.report.pageHeaders[0].format.fontName ); 

                // now undo
                controller.undo();
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( true, controller.canRedo());
                doh.assertEqual( "font1", model.report.pageHeaders[0].format.fontName );

                // now redo
                controller.redo();
                doh.assertEqual( true, controller.canUndo());
                doh.assertEqual( false, controller.canRedo());
                doh.assertEqual( "font3", model.report.pageHeaders[0].format.fontName ); 
        }
    },    
    {  name: "test field 1",
        timeout: 10000, //10 second timeout.
        runTest: function(){
        
                var deferred = new doh.Deferred();

                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();
                controller.initDatasources();
                controller.loadModels();

                controller.setModel('steel-wheels:BV_ORDERS');

                controller.addDetailField("BC_PRODUCTS_PRODUCTLINE", false);

                controller.addSorting("BC_PRODUCTS_PRODUCTLINE", "asc", false, -1);

                controller.toggleBold({idx:0, type:'fields'});
                controller.toggleItalic({idx:0, type:'fields'});
                controller.setColor({idx:0, type:'fields'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'fields'}, '#998877');
                controller.setFontName({idx:0, type:'fields'}, "Courier");
                controller.setFontSize({idx:0, type:'fields'}, 12);
                controller.alignColumn({idx:0, type:'fields'}, 'RIGHT');

                controller.toggleBold({idx:0, type:'cell'});
                controller.toggleItalic({idx:0, type:'cell'});
                controller.setColor({idx:0, type:'cell'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'cell'}, '#998877');
                controller.setFontName({idx:0, type:'cell'}, 'Courier');
                controller.setFontSize({idx:0, type:'cell'}, 12);
                controller.alignColumn({idx:0, type:'cell'}, 'RIGHT');

                controller.refresh();

                setTimeout(function() {
                
                    if(view.lastReportContent == null) {
                        deferred.callback(false);
                        return;
                    }
                    doh.assertTrue(view.lastReportContent.indexOf('<table') == 0);
                    data = parseTable(view.lastReportContent);
                    
                    doh.assertEqual("Product Line", data['rpt-column-header-0'].value);
                    doh.assertEqual("bold", data['rpt-column-header-0'].style.fontWeight);
                    doh.assertEqual("italic", data['rpt-column-header-0'].style.fontStyle);
                    doh.assertEqual("12pt", data['rpt-column-header-0'].style.fontSize);
                    doh.assertEqual("Courier", stripQuotes(data['rpt-column-header-0'].style.fontFamily));
                    doh.assertEqual("#112233", eval('view.'+data['rpt-column-header-0'].style.color));
                    doh.assertEqual("#998877", eval('view.'+data['rpt-column-header-0'].style.backgroundColor));
                    doh.assertEqual("right", data['rpt-column-header-0'].style.textAlign);
                    
                    doh.assertEqual("Vintage Cars", data['rpt-column-value-0'].value);
                    doh.assertEqual("bold", data['rpt-column-value-0'].style.fontWeight);
                    doh.assertEqual("italic", data['rpt-column-value-0'].style.fontStyle);
                    doh.assertEqual("12pt", data['rpt-column-value-0'].style.fontSize);
                    doh.assertEqual("Courier", stripQuotes(data['rpt-column-value-0'].style.fontFamily));
                    doh.assertEqual("#112233", eval('view.'+data['rpt-column-value-0'].style.color));
                    doh.assertEqual("#998877", eval('view.'+data['rpt-column-value-0'].style.backgroundColor));
                    doh.assertEqual("right", data['rpt-column-value-0'].style.textAlign);

                    deferred.callback(true);
                }, 2000);
                return deferred;
            }
        },    
    {  name: "test field 2",
        timeout: 10000, //10 second timeout.
        runTest: function(){
        
                var deferred = new doh.Deferred();

                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();
                controller.initDatasources();
                controller.loadModels();

                controller.setModel('steel-wheels:BV_ORDERS');

                controller.addDetailField("BC_PRODUCTS_PRODUCTLINE", false);

                controller.toggleBold({idx:0, type:'fields'});
                controller.toggleItalic({idx:0, type:'fields'});
                controller.setColor({idx:0, type:'fields'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'fields'}, '#998877');
                controller.setFontName({idx:0, type:'fields'}, 'Courier');
                controller.setFontSize({idx:0, type:'fields'}, 12);
                controller.setLabel({idx:0, type:'columnHeaders'}, 'test label');

                controller.refresh();

                setTimeout(function() {
                    if(view.lastReportContent == null) {
                        deferred.callback(false);
                        return;
                    }
                    doh.assertTrue(view.lastReportContent.indexOf('<table') == 0);
                    data = parseTable(view.lastReportContent);
                    doh.assertEqual("test label", data['rpt-column-header-0'].value);

                    deferred.callback(true);
                }, 2000);
                return deferred;
            }
        },
    {  name: "Remove Formatting",
        timeout: 10000, //10 second timeout.
        runTest: function(){
        
                var deferred = new doh.Deferred();

                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.promptFormatterLoaded();
                controller.init();
                controller.loadTemplateList();
                controller.initDatasources();
                controller.loadModels();

                controller.setModel('steel-wheels:BV_ORDERS');

                controller.addDetailField("BC_PRODUCTS_PRODUCTLINE", false);
                controller.addSorting("BC_PRODUCTS_PRODUCTLINE", "asc", false, -1);

                controller.toggleBold({idx:0, type:'fields'});
                controller.toggleItalic({idx:0, type:'fields'});
                controller.setColor({idx:0, type:'fields'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'fields'}, '#998877');
                controller.setFontName({idx:0, type:'fields'}, 'Courier');
                controller.setFontSize({idx:0, type:'fields'}, 12);

                controller.toggleBold({idx:0, type:'cell'});
                controller.toggleItalic({idx:0, type:'cell'});
                controller.setColor({idx:0, type:'cell'}, '#112233');
                controller.setBackgroundColor({idx:0, type:'cell'}, '#998877');
                controller.setFontName({idx:0, type:'cell'}, 'Courier');
                controller.setFontSize({idx:0, type:'cell'}, 12);
                
                controller.removeAllFormatting();

                controller.refresh();

                setTimeout(function() {
                    doh.assertTrue(view.lastReportContent.indexOf('<table') == 0);
                    data = parseTable(view.lastReportContent);
                    
                    doh.assertEqual("Product Line", data['rpt-column-header-0'].value);
                    doh.assertEqual("normal", data['rpt-column-header-0'].style.fontWeight);
                    doh.assertEqual("normal", data['rpt-column-header-0'].style.fontStyle);
                    doh.assertEqual("9pt", data['rpt-column-header-0'].style.fontSize);
                    doh.assertEqual("Arial", stripQuotes(data['rpt-column-header-0'].style.fontFamily));
                    doh.assertEqual('white', data['rpt-column-header-0'].style.color);
                    doh.assertEqual("#3c3c3c", eval('view.'+data['rpt-column-header-0'].style.backgroundColor));
                    
                    doh.assertEqual("Vintage Cars", data['rpt-column-value-0'].value);
                    doh.assertEqual("normal", data['rpt-column-value-0'].style.fontWeight);
                    doh.assertEqual("normal", data['rpt-column-value-0'].style.fontStyle);
                    doh.assertEqual("10pt", data['rpt-column-value-0'].style.fontSize);
                    doh.assertEqual("Arial", stripQuotes(data['rpt-column-value-0'].style.fontFamily));
                    doh.assertEqual("rgb(60, 60, 60)", data['rpt-column-value-0'].style.color);
                    doh.assertEqual("", data['rpt-column-value-0'].style.backgroundColor);

                    doh.assertEqual(40, model.report.marginTop);
                    doh.assertEqual(18, model.report.marginRight);
                    doh.assertEqual(18, model.report.marginBottom);
                    doh.assertEqual(18, model.report.marginLeft);

                    deferred.callback(true);
                }, 2000);
                return deferred;
            }
        },
        {
          name: "Remove filter - by index",
          timeout: 10000,
          runTest: function() {
            controller = new pentaho.pir.controller();
            model = new pentaho.pir.model();
            view = new pentaho.pir.view();
            view.init();
            model.init();
            controller.init();
            controller.initDatasources();
            controller.loadModels();
            controller.setModel('steel-wheels:BV_ORDERS');
            // Create a filter by hand so we don't get the edit dialog
            model.report.filters.push(model.createFilter("BC_PRODUCTS_PRODUCTLINE"));
            model.report.filters.push(model.createFilter("BC_PRODUCTS_PRODUCTCODE"));
            doh.assertEqual(2, model.report.filters.length);
            controller.removeFilter(0);
            doh.assertEqual(1, model.report.filters.length);
            doh.assertEqual("BC_PRODUCTS_PRODUCTCODE", model.report.filters[0].column);
            
            model.report.filters.push(model.createFilter("BC_PRODUCTS_PRODUCTLINE"));
            doh.assertEqual(2, model.report.filters.length);
            
            controller.removeFilter(1);
            doh.assertEqual(1, model.report.filters.length);
            doh.assertEqual("BC_PRODUCTS_PRODUCTCODE", model.report.filters[0].column);
            controller.removeFilter(0);
            doh.assertEqual(0, model.report.filters.length);
          }
        },
        {
          name: "Sequence Number Counter",
          runTest: function() {
            var counter = new pentaho.pir.SequenceNumberCounter();
            doh.assertEqual(0, counter.get());

            var sn = 12323232;
            var result = counter.set(sn);
            doh.assertEqual(sn , result);
            doh.assertEqual(sn, counter.get());

            counter.set(-1);
            doh.assertEqual(0, counter.get());

            // Test setting to a value > MAX resets it to 0
            sn = Math.pow(2, 53);
            sn = counter.set(sn);
            doh.assertEqual(0, sn);
            doh.assertEqual(0, counter.get());

            // Test increment()
            sn = counter.increment();
            doh.assertEqual(1, sn);
            doh.assertEqual(1, counter.get());

            sn = Math.pow(2, 53) - 1;
            counter.set(sn);
            doh.assertEqual(sn, counter.get());
            // Test incrementing will wrap value when it hits MAX
            counter.increment();
            doh.assertEqual(0, counter.get());
          }
        },
        {
          name: "Bulk Move Test (Column Reorder simulation)",
          runTest: function() {
            var controller = new pentaho.pir.controller();

            var assertArrayEquals = function(a, b) {
              doh.assertEqual(a.length, b.length);
              dojo.forEach(a, function(item, index) {
                doh.assertEqual(item, b[index]);
              });
            };

            var data = ['a', 'b', 'c', 'd', 'e'];
            // Move one to the end
            var result = controller.bulkMove(data, [0], 5);
            assertArrayEquals(['b', 'c', 'd', 'e', 'a'], result);

            // Move one to the beginning
            result = controller.bulkMove(data, [3], 0);
            assertArrayEquals(['d', 'a', 'b', 'c', 'e'], result);

            // Move every other to the 3rd index
            result = controller.bulkMove(data, [0, 2, 4], 2);
            assertArrayEquals(['b', 'a', 'c', 'e', 'd'], result);

            // Move ever other to the 2nd index
            result = controller.bulkMove(data, [0, 2, 4], 1);
            assertArrayEquals(['a', 'c', 'e', 'b', 'd'], result);

            // Move every other in reverse to the first index
            result = controller.bulkMove(data, [4, 2, 0], 0);
            assertArrayEquals(['e', 'c', 'a', 'b', 'd'], result);

            // Move every other in random order to the end
            result = controller.bulkMove(data, [2, 0, 4], 5);
            assertArrayEquals(['b', 'd', 'c', 'a', 'e'], result);

            // Move all to the beginning
            result = controller.bulkMove(data, [0, 1, 2, 3, 4], 0);
            assertArrayEquals(['a', 'b', 'c', 'd', 'e'], result);
            
            // Move all to the end
            result = controller.bulkMove(data, [0, 1, 2, 3, 4], 5);
            assertArrayEquals(['a', 'b', 'c', 'd', 'e'], result);
            
            // Reverse at beginning
            result = controller.bulkMove(data, [4, 3, 2, 1, 0], 0);
            assertArrayEquals(['e', 'd', 'c', 'b', 'a'], result);
            
            // Reverse at end
            result = controller.bulkMove(data, [4, 3, 2, 1, 0], 5);
            assertArrayEquals(['e', 'd', 'c', 'b', 'a'], result);
          }
        },
        {
            name: "Multiple Data Sources",
            runTest: function() {
                var deferred = new doh.Deferred();

                controller = new pentaho.pir.controller();
                doh.assertTrue( controller != null);    
                model = new pentaho.pir.model();
                doh.assertTrue( model != null); 
                // create a test view
                view = new pentaho.pir.view();
                doh.assertTrue( view != null);    
                doh.assertEqual(view.reportContent, null);
                // init the view and the controller
                view.init();
                model.init();
                controller.init();

                controller.setModel('steel-wheels:BV_ORDERS');
                var queryString = 
                    "<mql>" +
                        "<domain_type>relational</domain_type>" +
                        "<domain_id>steel-wheels</domain_id>" +
                        "<model_id>BV_INVENTORY</model_id>" +
                        "<options>" +
                            "<disable_distinct>false</disable_distinct>" +
                        "</options>" +
                        "<parameters>" +
                        "</parameters>" +
                        "<selections>" +
                            "<selection>" +
                                "<table>CAT_PRODUCTS</table>" +
                                "<column>BC_PRODUCTS_PRODUCTCODE</column>" +
                                "<aggregation>NONE</aggregation>" +
                            "</selection>" +
                        "</selections>" +
                        "<constraints>" +
                        "</constraints>" +
                        "<orders>" +
                        "</orders>" +
                    "</mql>";
                var extraDs = model.createPmdDataSource("second", "steel-wheels", "BV_INVENTORY", "steel-wheels", queryString);

                model.report.dataSources.push(extraDs);

                controller.addDetailField("BC_PRODUCTS_PRODUCTLINE", false);

                controller.addSorting("BC_PRODUCTS_PRODUCTLINE", "asc", false, -1);

                controller.refresh();

                setTimeout(function() {
                
                    doh.assertEqual(2, model.report.dataSources.length);
                    var ds = controller.getDefaultDataSource(model.report);
                    doh.assertTrue(ds);
                    doh.assertEqual("default", ds.name);

                    var secondDs = controller.getDataSourceByName(model.report, 'second');
                    doh.assertTrue(secondDs);
                    doh.assertEqual(extraDs.name, secondDs.name);
                    doh.assertEqual(extraDs.domainId, secondDs.domainId);
                    doh.assertEqual(extraDs.modelId, secondDs.modelId);
                    doh.assertEqual(extraDs.xmi, secondDs.xmi);
                    doh.assertEqual(extraDs.query, secondDs.query);

                    deferred.callback(true);
                }, 1000);
                return deferred;
            }
        },
        {  name: "Parameter Round Trip",
            timeout: 10000, //10 second timeout.
            runTest: function(){
                    var deferred = new doh.Deferred();

                    controller = new pentaho.pir.controller();
                    doh.assertTrue( controller != null);    
                    model = new pentaho.pir.model();
                    doh.assertTrue( model != null); 
                    // create a test view
                    view = new pentaho.pir.view();
                    doh.assertTrue( view != null);    
                    doh.assertEqual(view.reportContent, null);
                    // init the view and the controller
                    view.init();
                    model.init();
                    controller.promptFormatterLoaded();
                    controller.init();
                    controller.loadTemplateList();
                    controller.initDatasources();
                    controller.loadModels();
                    controller.setModel('steel-wheels:BV_HUMAN_RESOURCES');
                    
                    // Data sources required by parameters
                    model.report.dataSources = [
						{
							"class" : "com.pentaho.iadhoc.model.ThinPmdDataSource",
							"domainId" : "steel-wheels",
							"modelId" : "BV_HUMAN_RESOURCES",
							"name" : "default",
							"query" : "<mql>\n<domain_type>relational</domain_type>\n<domain_id>steel-wheels</domain_id>\n<model_id>BV_HUMAN_RESOURCES</model_id>\n<options>\n<disable_distinct>false</disable_distinct>\n</options>\n<parameters>\n</parameters>\n<selections>\n<selection>\n<table>BC_EMPLOYEES_</table>\n<column>BC_EMPLOYEES_FIRSTNAME</column>\n<aggregation>NONE</aggregation></selection>\n</selections>\n<constraints>\n<constraint>\n<operator>AND</operator>\n<condition><![CDATA[IN([BC_EMPLOYEES_.BC_EMPLOYEES_FIRSTNAME];\"Andy\";\"Anthony\";\"Barry\";\"Diane\";\"Foon Yue\";\"George\";\"Gerard\";\"Jeff\";\"Julie\")]]></condition>\n</constraint>\n</constraints>\n<orders>\n</orders>\n</mql>\n",
							"queryless" : false,
							"xmi" : "steel-wheels"
						},
						{
							"class" : "com.pentaho.iadhoc.model.ThinPmdDataSource",
							"domainId" : "steel-wheels",
							"modelId" : "BV_HUMAN_RESOURCES",
							"name" : "param-query",
							"query" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<mql><domain_id>steel-wheels</domain_id><model_id>BV_HUMAN_RESOURCES</model_id><options><disable_distinct>false</disable_distinct><limit>-1</limit></options><selections><selection><view>BC_EMPLOYEES_</view><column>BC_EMPLOYEES_LASTNAME</column><aggregation>NONE</aggregation></selection></selections><constraints/><orders/></mql>",
							"queryless" : false,
							"xmi" : "steel-wheels"
						},
						{
							"class" : "com.pentaho.iadhoc.model.ThinStaticDataSource",
							"columnNames" : [ "ID", "Value" ],
							"name" : "Test",
							"values" : [ [ "a", "a" ],
									[ "b", "b" ], [ "c", "c" ] ],
							"query" : undefined
						}
					];

                    var parameters = [
						{
							"class" : "com.pentaho.iadhoc.model.ThinListParameter",
							"columnId": "BC_EMPLOYEES_FIRSTNAME",
							"dataFormat" : null,
							"defaultValue" : null,
							"hidden" : false,
							"keyColumn" : "BC_EMPLOYEES_FIRSTNAME",
							"label" : "PMD-Based",
							"layout" : null,
							"mandatory" : false,
							"multiSelect" : true,
							"name" : "pmd-based",
							"query" : "default",
							"strict" : true,
							"textColumn" : "BC_EMPLOYEES_FIRSTNAME",
							"timezone" : null,
							"type" : "list",
							"valueType" : "[Ljava.lang.String;",
							"visibleItems" : -1
						},
						{
							"class" : "com.pentaho.iadhoc.model.ThinListParameter",
							"columnId": "BC_EMPLOYEES_FIRSTNAME",
							"dataFormat" : null,
							"defaultValue" : [ "b" ],
							"hidden" : false,
							"keyColumn" : "ID",
							"label" : "Table-Based",
							"layout" : null,
							"mandatory" : false,
							"multiSelect" : false,
							"name" : "table-based",
							"query" : "Test",
							"strict" : true,
							"textColumn" : "Value",
							"timezone" : null,
							"type" : "dropdown",
							"valueType" : "java.lang.String",
							"visibleItems" : -1
						},
						{
							"class" : "com.pentaho.iadhoc.model.ThinListParameter",
							"columnId": "BC_EMPLOYEES_LASTNAME",
							"dataFormat" : null,
							"defaultValue" : null,
							"hidden" : false,
							"keyColumn" : "BC_EMPLOYEES_LASTNAME",
							"label" : "Second PMD-Based",
							"layout" : null,
							"mandatory" : false,
							"multiSelect" : false,
							"name" : "pmd2",
							"query" : "param-query",
							"strict" : false,
							"textColumn" : "BC_EMPLOYEES_LASTNAME",
							"timezone" : null,
							"type" : "dropdown",
							"valueType" : "java.lang.String",
							"visibleItems" : -1
						},
						{
							"class" : "com.pentaho.iadhoc.model.ThinParameter",
							"columnId": "BC_EMPLOYEES_FIRSTNAME",
							"dataFormat" : "##0.0#",
							"defaultValue" : [ "50.1" ],
							"hidden" : false,
							"label" : "Simple Number",
							"mandatory" : false,
							"name" : "plain",
							"timezone" : null,
							"type" : null,
							"valueType" : "java.math.BigDecimal"
						},
						{
							"class" : "com.pentaho.iadhoc.model.ThinParameter",
							"columnId": "BC_EMPLOYEES_FIRSTNAME",
							"dataFormat" : "MM-dd-yyyy",
							"defaultValue" : [ "2011-10-14T00:00:00.000-0400" ],
							"hidden" : false,
							"label" : "Date Parameter",
							"mandatory" : false,
							"name" : "date-param",
							"timezone" : "server",
							"type" : "datepicker",
							"valueType" : "java.util.Date"
						}
					];
                    
                    model.report.parameters = parameters;

                    // start with a blank report
                    controller.refresh();

                    setTimeout(function() {
                        doh.assertTrue(view.lastReportContent.indexOf('<table') == 0);

                        doh.assertTrue(model.report.parameters.length == 5);
                        
                        dojo.forEach(parameters, function(p, idx) {
                        	doh.assertTrue(p['name'] == model.report.parameters[idx]['name']);
                        	doh.assertTrue(p['columnId'] == model.report.parameters[idx]['columnId']);
                        	doh.assertTrue(p['class'] == model.report.parameters[idx]['class']);
                        	doh.assertTrue(p['dataFormat'] == model.report.parameters[idx]['dataFormat']);
                        	doh.assertTrue(p['hidden'] == model.report.parameters[idx]['hidden']);
                        	doh.assertTrue(p['label'] == model.report.parameters[idx]['label']);
                        	doh.assertTrue(p['mandatory'] == model.report.parameters[idx]['mandatory']);
                        	doh.assertTrue(p['timezone'] == model.report.parameters[idx]['timezone']);
                        	doh.assertTrue(p['type'] == model.report.parameters[idx]['type']);
                        	doh.assertTrue(p['valueType'] == model.report.parameters[idx]['valueType']);
                        });
                        
                        deferred.callback(true);
                    }, 1000);
                    return deferred;
            }
        }
    ]
);

doh.register('Parameter <-> Filter Tests', [
    {
        name: 'getParameterFilterType',
        runTest: function() {
            model = new pentaho.pir.model();
            controller = new pentaho.pir.controller();

            var mockParam = {
                type: 'dropdown'
            }

            var type = controller.getParameterFilterType(mockParam);
            doh.assertEqual('select', type);

            mockParam.type = 'togglebutton';
            type = controller.getParameterFilterType(mockParam);
            doh.assertEqual('multiButtonComponent', type);

            mockParam.type = 'textbox';
            type = controller.getParameterFilterType(mockParam);
            doh.assertEqual('textInputComponent', type);

            // Test default type
            mockParam.type = 'unknown';
            type = controller.getParameterFilterType(mockParam);
            doh.assertEqual('textInputComponent', type);            
        }
    },
    {
        name: 'createGwtFilterFromParam - Simple',
        runTest: function() {
            model = new pentaho.pir.model();
            controller = new pentaho.pir.controller();

            var mockParam = {
                'class': 'com.pentaho.iadhoc.model.ThinParameter',
                columnId: 'TEST_COLUMN',
                type: 'text',
                name: 'My parameter',
                label: 'My parameter label',
                valueType: 'java.lang.String'
            }

            var filter = controller.createGwtFilterFromParam(mockParam);
            doh.assertTrue(filter != undefined);
            doh.assertEqual(mockParam.name, filter.name);
            doh.assertEqual(mockParam.columnId, filter.columnId);
            doh.assertEqual(mockParam.label, filter.title);
            doh.assertEqual('textInputComponent', filter.type);
        }
    },
    {
        name: 'createGwtFilterFromParam - List - Metadata',
        runTest: function() {
            view = new pentaho.pir.view();
            view.init();
            model = new pentaho.pir.model();
            model.init();
            controller = new pentaho.pir.controller();
            controller.init();
            // Data source for parameter
            model.report.dataSources = [
                {
                    "class" : "com.pentaho.iadhoc.model.ThinPmdDataSource",
                    "domainId" : "steel-wheels",
                    "modelId" : "BV_HUMAN_RESOURCES",
                    "name" : "param-query",
                    "query" : "<mql>\n<domain_type>relational</domain_type>\n<domain_id>steel-wheels</domain_id>\n<model_id>BV_HUMAN_RESOURCES</model_id>\n<options>\n<disable_distinct>false</disable_distinct>\n</options>\n<parameters>\n</parameters>\n<selections>\n<selection>\n<table>BC_EMPLOYEES_</table>\n<column>BC_EMPLOYEES_FIRSTNAME</column>\n<aggregation>NONE</aggregation></selection>\n</selections>\n<constraints>\n<constraint>\n<operator>AND</operator>\n<condition><![CDATA[IN([BC_EMPLOYEES_.BC_EMPLOYEES_FIRSTNAME];\"Andy\";\"Anthony\";\"Barry\";\"Diane\";\"Foon Yue\";\"George\";\"Gerard\";\"Jeff\";\"Julie\")]]></condition>\n</constraint>\n</constraints>\n<orders>\n</orders>\n</mql>\n",
                    "queryless" : false,
                    "xmi" : "steel-wheels"
                }
            ];
            var mockParam = {
                'class': 'com.pentaho.iadhoc.model.ThinListParameter',
                columnId: 'TEST_COLUMN',
                type: 'text',
                name: 'My parameter',
                label: 'My parameter label',
                valueType: 'java.lang.String',
                query: 'param-query',
                attributes: {
                    'validx': '0',
                    'lblidx': '1',
                    'jsMql': '{some mql js model goes here}'
                }
            }

            var filter = controller.createGwtFilterFromParam(mockParam);
            doh.assertTrue(filter != undefined);
            doh.assertEqual(mockParam.name, filter.name);
            doh.assertEqual(mockParam.columnId, filter.columnId);
            doh.assertEqual(mockParam.label, filter.title);
            doh.assertEqual('textInputComponent', filter.type);
            doh.assertEqual(mockParam.attributes['validx'], filter.dataSourceProperties['validx']);
            doh.assertEqual(mockParam.attributes['lblidx'], filter.dataSourceProperties['lblidx']);
            doh.assertEqual(mockParam.attributes['jsMql'], filter.dataSourceProperties['jsMql']);
        },
    },
    {
        name: "Unique name generation",
        runTest: function() {
            model = new pentaho.pir.model();
            model.init();
            model.report.parameters = [
                model.createParameter('col1', 'java.lang.String', 'param'),
                model.createParameter('col1', 'java.lang.String', 'param2'),
                model.createParameter('col1', 'java.lang.String', 'param3')
            ];

            var param = model.createParameter('col1', 'java.lang.String', 'param');
            doh.assertEqual('param4', param.name);

            // Test illegal name (one of model.ILLEGAL_PARAMETER_NAMES)
            param = model.createParameter('', '', 'command');
            doh.assertEqual('command2', param.name);
        }
    },
    {
        name: "Create parameter with existing filters",
        runTest: function() {
            model = new pentaho.pir.model();
            model.init();

            controller = new pentaho.pir.controller();
            doh.assertTrue( controller != null);    
            model = new pentaho.pir.model();
            doh.assertTrue( model != null); 
            // create a test view
            view = new pentaho.pir.view();
            doh.assertTrue( view != null);    
            doh.assertEqual(view.reportContent, null);
            // init the view and the controller
            view.init();
            model.init();
            controller.init();
                
            controller.setModel('steel-wheels:BV_ORDERS');

            var filter = model.createFilter('BC_CUSTOMER_W_TER_CITY');
            model.report.filters = [ filter ];

            doh.assertTrue(!filter.parameterName);

            controller.createParameter('BC_CUSTOMER_W_TER_CITY');

            // A new filter should not have been created
            doh.assertEqual(1, model.report.filters.length);

            doh.assertEqual(1, model.report.parameters.length);
            var param = model.report.parameters[0];

            doh.assertEqual(param.name, filter.parameterName);
        }
    },
    {
        name: "Create parameter: filter on column already has parameter",
        runTest: function() {
            model = new pentaho.pir.model();
            model.init();

            controller = new pentaho.pir.controller();
            doh.assertTrue( controller != null);    
            model = new pentaho.pir.model();
            doh.assertTrue( model != null); 
            // create a test view
            view = new pentaho.pir.view();
            doh.assertTrue( view != null);    
            doh.assertEqual(view.reportContent, null);
            // init the view and the controller
            view.init();
            model.init();
            controller.init();
                
            controller.setModel('steel-wheels:BV_ORDERS');

            var filter = model.createFilter('BC_CUSTOMER_W_TER_CITY');
            filter.parameterName = "testing";
            model.report.filters = [ filter ];

            controller.createParameter('BC_CUSTOMER_W_TER_CITY');

            // A new filter should not have been created
            doh.assertEqual(1, model.report.filters.length);


            doh.assertEqual(1, model.report.parameters.length);
            var param = model.report.parameters[0];

            doh.assertEqual("testing", filter.parameterName);
            doh.assertEqual(filter.parameterName, param.name);
            doh.assertEqual(filter.parameterName, param.label);
        }
    },
    {
        name: "Create parameter: filter on column is already linked to a parameter",
        runTest: function() {
            model = new pentaho.pir.model();
            model.init();

            controller = new pentaho.pir.controller();
            doh.assertTrue( controller != null);    
            model = new pentaho.pir.model();
            doh.assertTrue( model != null); 
            // create a test view
            view = new pentaho.pir.view();
            doh.assertTrue( view != null);    
            doh.assertEqual(view.reportContent, null);
            // init the view and the controller
            view.init();
            model.init();
            controller.init();
                
            controller.setModel('steel-wheels:BV_ORDERS');

            var filter = model.createFilter('BC_CUSTOMER_W_TER_CITY');
            filter.parameterName = "testing";
            model.report.filters = [ filter ];

            controller.createParameter('BC_CUSTOMER_W_TER_CITY');

            doh.assertEqual(1, model.report.parameters.length);
            var param = model.report.parameters[0];

            doh.assertEqual("testing", filter.parameterName);
            doh.assertEqual(filter.parameterName, param.name);
            doh.assertEqual(filter.parameterName, param.label);

            controller.createParameter('BC_CUSTOMER_W_TER_CITY');

            // A new filter should have been created
            doh.assertEqual(2, model.report.filters.length);
            var filter2 = model.report.filters[1];
            doh.assertEqual("City", filter2.parameterName);

            doh.assertEqual(2, model.report.parameters.length);
            var param = model.report.parameters[0];

            doh.assertEqual("testing", filter.parameterName);
            doh.assertEqual(filter.parameterName, param.name);
            doh.assertEqual(filter.parameterName, param.label);

            param = model.report.parameters[1];
            doh.assertEqual("City", param.name);
            doh.assertEqual("City", param.label);
        }
    }
]);


function parseTable(content) {
//alert(content.substr(0,500));
    // parse the report table and pull out the 
    var data = {};
    var div = document.createElement('DIV');
    div.innerHTML = content;
    var table = div.childNodes[0];
    for(var row=0; row<table.rows.length; row++ ) {
        for(var col=0; col<table.rows[row].cells.length; col++) {
            var cell = table.rows[row].cells[col];
            var id = cell.id;
            if(id) {
                data[id] = {};
                data[id].id = id;
                data[id].style = cell.style;
                data[id].e = cell;
                data[id].value = cell.innerHTML;
            }
        }
    }
    return data;

}

function ordersModelExists( controller ) {

    // check the datasource list
    if(controller.datasourceInfos == null) {
        return false;
    }
    // find the orders model
    for(var idx=0; idx<controller.datasourceInfos.length; idx++) {
        if(controller.datasourceInfos[idx].modelId == 'BV_ORDERS') {
            return 'steel-wheels' == controller.datasourceInfos[idx].domainId &&
                   'BV_ORDERS' == controller.datasourceInfos[idx].modelId &&
                   'Orders' == controller.datasourceInfos[idx].name;
        }
    }
    return false;
                
}

function stripQuotes(str){
  if(str){
    str = str.replace(/"/g, '');
  }
  return str;
}
