/*!
* The Hitachi Vantara proprietary code is licensed under the terms and conditions
* of the software license agreement entered into between the entity licensing
* such code and Hitachi Vantara.
*
* This software costs money - it is not free
*
* Copyright 2002 - 2017 Hitachi Vantara.  All rights reserved.
*/

var dashboardSettings = { 
    dashboardMarginTop : 0,
    dashboardMarginLeft: 0,
    dashboardMarginBottom: 0,
    dashboardMarginRight: 0,
    titleContainerId : 'dashboard-title',
    filterPanelHeight : 0
    };

var elementSettings = {};

var boxTitledSettings = {};

boxTitledSettings['offsetRight'] = 10;
boxTitledSettings['offsetLeft'] = 10;
boxTitledSettings['offsetTop'] = 25;
boxTitledSettings['offsetBottom'] = 7;
boxTitledSettings['padding-bottom'] = 5;
boxTitledSettings['padding-top'] = 5;
boxTitledSettings['padding-left'] = 5;
boxTitledSettings['padding-right'] = 5;


elementSettings[ 'box-titled-panel' ] = boxTitledSettings;
elementSettings[ "vbox-scrollarea" ] = {"padding-top" : 5};

elementSettings[ "box-povpanel" ] = {"offsetTop": 0, "offsetLeft": 5, "offsetRight": 15};
