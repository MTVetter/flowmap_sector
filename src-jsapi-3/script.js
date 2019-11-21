$(document).ready(function(){
    $("#sectorSelection").hide();
    $('#workSectorSelection').hide();
    $('#countyWorkSelection').hide();
    $('#ctValueType').hide();
    $('#ctWorkValueType').hide();

    require([
        "Canvas-Flowmap-Layer/CanvasFlowmapLayer",
        "esri/graphic",
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/renderers/SimpleRenderer",
        "esri/InfoTemplate",
        "esri/dijit/HomeButton",
        "dojo/on",
        "https://s3-us-west-1.amazonaws.com/patterns.esri.com/files/calcite-web/1.2.5/js/calcite-web.min.js",
        "dojo/number",
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.js",
        "esri/symbols/TextSymbol",
        'esri/layers/LabelClass',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        "dojo/domReady!"
    ], function(
        CanvasFlowmapLayer,
        Graphic,
        Map,
        FeatureLayer,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Color,
        SimpleRenderer,
        InfoTemplate,
        HomeButton,
        on,
        calcite,
        number,
        Chart,
        TextSymbol,
        LabelClass,
        Query,
        QueryTask
    ){
        calcite.init();
        // document.addEventListener("click", function(){
        //     document.getElementById("welcomePanel").style.display = "none";
        // });
    
        //Reference to the option selection
        var sectorSelect = document.getElementById("sectorSelection");
        var workSectorSelection = document.getElementById("workSectorSelection");
        var countySelect = document.getElementById("countySelection");
        var workCountySelection = document.getElementById("countyWorkSelection");
        var legendBtn = document.getElementById("legendBtn");
        var legendDiv = document.getElementById("legendDiv");
        var boundarySelection = document.getElementById("boundarySelection");
        var flowSelection = document.getElementById("flowSelection");
        var workShowBtn = document.getElementById("workShowButton");
        var homeShowBtn = document.getElementById("homeShowButton");
        var ctSelect = document.getElementById("ctValueType");
    
        //Create the map
        var map = new Map("map",{
            basemap: "dark-gray-vector",
            center: [-95.381214, 29.742862],
            zoom: 8,
            showLabels: true
        });
    
        //Create a home button to return the user to the default map zoom
        var home = new HomeButton({
            map: map
        }, "HomeButton");
        home.startup();
    
        //Add the sector boundaries
        //Create a renderer for the sectors so that you can see the flow map lines
        var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,255]), 2),new Color([255,255,255,0])
          );
        var renderer = new SimpleRenderer(sfs);
    
        var sectors = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Socioeconomic_Modeling/Sector_25/MapServer/0",{
            opacity: 0.2,
            outFields: ["*"],
            visible: false
        });
    
        ///////////////////////////////////////
        //////   Label the sectors      ///////
        ///////////////////////////////////////
        var textColor = new Color([255,255,255,0.5]);
        var sectorLabel = new TextSymbol().setColor(textColor);
        sectorLabel.font.setSize("10pt");
        sectorLabel.font.setFamily("arial");
        sectorLabel.xoffset = 5;
        sectorLabel.yoffset = 5;
    
        var json = {
            'labelExpressionInfo': {'value': '{Sec_ID}'}
        };
    
        var labelClass = new LabelClass(json);
        labelClass.symbol = sectorLabel;
    
        sectors.setRenderer(renderer);
        sectors.setLabelingInfo([labelClass]);

        //Add the county boundaries
        var counties = new FeatureLayer('https://gis.h-gac.com/arcgis/rest/services/Socioeconomic_Modeling/Boundaries/MapServer/5',{
            opacity: 0.2
        });

        counties.setRenderer(renderer);

        //Add the census tracts boundaries
        var censusTracts = new FeatureLayer('https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Tracts/MapServer/0',{
            opacity: 0.2,
            visible: false
        });

        censusTracts.setRenderer(renderer);
    
        map.addLayers([sectors, counties, censusTracts]);

        //Query the census tracts layer
        var ctValues = [];
        var ctWorkValues = [];
        var ctValueSelect = document.getElementById("ctValueType");
        var ctWorkValueSelect = document.getElementById("ctWorkValueType");
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = ["*"];
        query.where = "1=1";

        censusTracts.queryFeatures(query, ctFieldValues);

        function ctFieldValues(results) {
            var features = results.features;
            var values = features.map(function(feature){
                return feature.attributes.Tract;
            });
            values.forEach(function(item, i){
                if (
                    (ctValues.length < 1 || ctValues.indexOf(item) === -1) &&
                    item !== ""
                ) {
                    ctValues.push(item);
                }
            });
            ctValues.sort();
            ctValues.forEach(function(value){
                var ctOption = document.createElement("option");
                var ctOption2 = document.createElement("option");
                ctOption.text = value;
                ctOption.id = value;
                ctOption2.text = value;
                ctOption2.id = value+"WorkLayer"
                ctValueSelect.add(ctOption);
                ctWorkValueSelect.add(ctOption2);
            });
        }
    
        map.on("load", function(){
            var s1 = new CanvasFlowmapLayer({
                id: "sector1Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s2 = new CanvasFlowmapLayer({
                id: "sector2Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s3 = new CanvasFlowmapLayer({
                id: "sector3Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s4 = new CanvasFlowmapLayer({
                id: "sector4Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s5 = new CanvasFlowmapLayer({
                id: "sector5Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s6 = new CanvasFlowmapLayer({
                id: "sector6Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s7 = new CanvasFlowmapLayer({
                id: "sector7Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s8 = new CanvasFlowmapLayer({
                id: "sector8Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s9 = new CanvasFlowmapLayer({
                id: "sector9Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s10 = new CanvasFlowmapLayer({
                id: "sector10Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s11 = new CanvasFlowmapLayer({
                id: "sector11Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s12 = new CanvasFlowmapLayer({
                id: "sector12Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s13 = new CanvasFlowmapLayer({
                id: "sector13Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s14 = new CanvasFlowmapLayer({
                id: "sector14Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s15 = new CanvasFlowmapLayer({
                id: "sector15Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s16 = new CanvasFlowmapLayer({
                id: "sector16Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s17 = new CanvasFlowmapLayer({
                id: "sector17Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s18 = new CanvasFlowmapLayer({
                id: "sector18Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s19 = new CanvasFlowmapLayer({
                id: "sector19Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s20 = new CanvasFlowmapLayer({
                id: "sector20Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s21 = new CanvasFlowmapLayer({
                id: "sector21Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s22 = new CanvasFlowmapLayer({
                id: "sector22Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s23 = new CanvasFlowmapLayer({
                id: "sector23Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s24 = new CanvasFlowmapLayer({
                id: "sector24Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var s25 = new CanvasFlowmapLayer({
                id: "sector25Layer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS25 = new CanvasFlowmapLayer({
                id: "sector25WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS24 = new CanvasFlowmapLayer({
                id: "sector24WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS23 = new CanvasFlowmapLayer({
                id: "sector23WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS22 = new CanvasFlowmapLayer({
                id: "sector22WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS21 = new CanvasFlowmapLayer({
                id: "sector21WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS20 = new CanvasFlowmapLayer({
                id: "sector20WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS19 = new CanvasFlowmapLayer({
                id: "sector19WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS18 = new CanvasFlowmapLayer({
                id: "sector18WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS17 = new CanvasFlowmapLayer({
                id: "sector17WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS16 = new CanvasFlowmapLayer({
                id: "sector16WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS15 = new CanvasFlowmapLayer({
                id: "sector15WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS14 = new CanvasFlowmapLayer({
                id: "sector14WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS13 = new CanvasFlowmapLayer({
                id: "sector13WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS12 = new CanvasFlowmapLayer({
                id: "sector12WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS11 = new CanvasFlowmapLayer({
                id: "sector11WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS10 = new CanvasFlowmapLayer({
                id: "sector10WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS9 = new CanvasFlowmapLayer({
                id: "sector9WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS8 = new CanvasFlowmapLayer({
                id: "sector8WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS7 = new CanvasFlowmapLayer({
                id: "sector7WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS6 = new CanvasFlowmapLayer({
                id: "sector6WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS5 = new CanvasFlowmapLayer({
                id: "sector5WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS4 = new CanvasFlowmapLayer({
                id: "sector4WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS3 = new CanvasFlowmapLayer({
                id: "sector3WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS2 = new CanvasFlowmapLayer({
                id: "sector2WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workS1 = new CanvasFlowmapLayer({
                id: "sector1WorkLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var austinLayer = new CanvasFlowmapLayer({
                id: "austinCountyLayer",
                visible: true,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var brazoriaLayer = new CanvasFlowmapLayer({
                id: "brazoriaCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var chambersLayer = new CanvasFlowmapLayer({
                id: "chambersCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var coloradoLayer = new CanvasFlowmapLayer({
                id: "coloradoCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var fortBendLayer = new CanvasFlowmapLayer({
                id: "fortBendCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var galvestonLayer = new CanvasFlowmapLayer({
                id: "galvestonCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var harrisLayer = new CanvasFlowmapLayer({
                id: "harrisCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var libertyLayer = new CanvasFlowmapLayer({
                id: "libertyCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var matagordaLayer = new CanvasFlowmapLayer({
                id: "matagordaCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var montgomeryLayer = new CanvasFlowmapLayer({
                id: "montgomeryCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var walkerLayer = new CanvasFlowmapLayer({
                id: "walkerCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var wallerLayer = new CanvasFlowmapLayer({
                id: "wallerCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var whartonLayer = new CanvasFlowmapLayer({
                id: "whartonCountyLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0.9)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0.9)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var workAustin = new CanvasFlowmapLayer({
                id: "austinCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workBrazoria = new CanvasFlowmapLayer({
                id: "brazoriaCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workChambers = new CanvasFlowmapLayer({
                id: "chambersCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workColorado = new CanvasFlowmapLayer({
                id: "coloradoCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workFortBend = new CanvasFlowmapLayer({
                id: "fortBendCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workGalveston = new CanvasFlowmapLayer({
                id: "galvestonCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workHarris = new CanvasFlowmapLayer({
                id: "harrisCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workLiberty = new CanvasFlowmapLayer({
                id: "libertyCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workMatagorda = new CanvasFlowmapLayer({
                id: "matagordaCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workMontgomery = new CanvasFlowmapLayer({
                id: "montgomeryCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workWaller = new CanvasFlowmapLayer({
                id: "wallerCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workWalker = new CanvasFlowmapLayer({
                id: "walkerCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            var workWharton = new CanvasFlowmapLayer({
                id: "whartonCountyWLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var censusTractsLayer = new CanvasFlowmapLayer({
                id: "censusTractsLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(255, 0, 0, 0.6)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(255,0,0,0.6)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });

            var workCensusTractsLayer = new CanvasFlowmapLayer({
                id: "workCensusTractsLayer",
                visible: false,
                originAndDestinationFieldIds: {
                    originUniqueIdField: "h_id",
                    originGeometry: {
                        x: "h_lon",
                        y: "h_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    },
                    destinationUniqueIdField: "d_id",
                    destinationGeometry: {
                        x: "d_lon",
                        y: "d_lat",
                        spatialReference: {
                            wkid: 4326
                        }
                    }
                },
                pathProperties: {
                    type: "classBreaks",
                    field: "h_Workers",
                    defaultSymbol: {
                        strokeStyle: "rgba(237, 248, 177, 1)",
                        lineWidth: 0.5,
                        lineCap: "round"
                    },
                    classBreakInfos: [{
                        classMinValue: 0,
                        classMaxValue: 500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 2,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 501,
                        classMaxValue: 1000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 4,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 1001,
                        classMaxValue: 2500,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 6,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 2501,
                        classMaxValue: 5000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 8,
                            lineCap: "round"
                        }
                    },{
                        classMinValue: 5001,
                        classMaxValue: 100000,
                        symbol: {
                            strokeStyle: "rgba(87, 216, 255, 0.65)",
                            lineWidth: 12,
                            lineCap: "round"
                        }
                    }]
                },
                animatePathProperties: {
                    type: "simple",
                    symbol: {
                        strokeStyle: "rgba(0, 63, 81, 0.65)",
                        lineWidth: 4,
                        lineDashOffsetSize: 4,
                        lineCap: "round",
                        shadowColor: "rgba(0, 63, 81, 0.65)",
                        shadowBlur: 2
                    }
                },
                originCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(17, 142, 170, 0)',
                        shadowBlur: 0
                    }
                },
                destinationCircleProperties: {
                    type: "simple",
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 5,
                        fillStyle: 'rgba(204, 0, 0, 0)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgba(204, 0, 0, 0)',
                        shadowBlur: 0
                    }
                },
                wrapAroundCanvas: true,
                animationStarted: true,
                animationDuration: 2000,
                animationEasingFamily: "Linear",
                animationEasingType: "None"
            });
    
            map.addLayers([s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25,
            workS25, workS24, workS23, workS22, workS21, workS20, workS19, workS18, workS17, workS16, workS15, workS14, workS13, workS12, workS11, workS10, workS9,
            workS8, workS7, workS6, workS5, workS4, workS3, workS2, workS1, austinLayer, brazoriaLayer, chambersLayer, coloradoLayer, fortBendLayer, galvestonLayer,
            harrisLayer, libertyLayer, montgomeryLayer, matagordaLayer, walkerLayer, wallerLayer, whartonLayer, workAustin, workBrazoria, workChambers, workColorado,
            workFortBend, workGalveston, workHarris, workLiberty, workMatagorda, workMontgomery, workWaller, workWalker, workWaller, workWharton, censusTractsLayer,
            workCensusTractsLayer]);
    
            //Call function to populate the layers with graphics
            createGraphicsFromCsv("data/sector1_home.csv", s1);
            createGraphicsFromCsv("data/sector2_home.csv", s2);
            createGraphicsFromCsv("data/sector3_home.csv", s3);
            createGraphicsFromCsv("data/sector4_home.csv", s4);
            createGraphicsFromCsv("data/sector5_home.csv", s5);
            createGraphicsFromCsv("data/sector6_home.csv", s6);
            createGraphicsFromCsv("data/sector7_home.csv", s7);
            createGraphicsFromCsv("data/sector8_home.csv", s8);
            createGraphicsFromCsv("data/sector9_home.csv", s9);
            createGraphicsFromCsv("data/sector10_home.csv", s10);
            createGraphicsFromCsv("data/sector11_home.csv", s11);
            createGraphicsFromCsv("data/sector12_home.csv", s12);
            createGraphicsFromCsv("data/sector13_home.csv", s13);
            createGraphicsFromCsv("data/sector14_home.csv", s14);
            createGraphicsFromCsv("data/sector15_home.csv", s15);
            createGraphicsFromCsv("data/sector16_home.csv", s16);
            createGraphicsFromCsv("data/sector17_home.csv", s17);
            createGraphicsFromCsv("data/sector18_home.csv", s18);
            createGraphicsFromCsv("data/sector19_home.csv", s19);
            createGraphicsFromCsv("data/sector20_home.csv", s20);
            createGraphicsFromCsv("data/sector21_home.csv", s21);
            createGraphicsFromCsv("data/sector22_home.csv", s22);
            createGraphicsFromCsv("data/sector23_home.csv", s23);
            createGraphicsFromCsv("data/sector24_home.csv", s24);
            createGraphicsFromCsv("data/sector25_home.csv", s25);
            createGraphicsFromCsv("data/sector25_work.csv", workS25);
            createGraphicsFromCsv("data/sector24_work.csv", workS24);
            createGraphicsFromCsv("data/sector23_work.csv", workS23);
            createGraphicsFromCsv("data/sector22_work.csv", workS22);
            createGraphicsFromCsv("data/sector21_work.csv", workS21);
            createGraphicsFromCsv("data/sector20_work.csv", workS20);
            createGraphicsFromCsv("data/sector19_work.csv", workS19);
            createGraphicsFromCsv("data/sector18_work.csv", workS18);
            createGraphicsFromCsv("data/sector17_work.csv", workS17);
            createGraphicsFromCsv("data/sector16_work.csv", workS16);
            createGraphicsFromCsv("data/sector15_work.csv", workS15);
            createGraphicsFromCsv("data/sector14_work.csv", workS14);
            createGraphicsFromCsv("data/sector13_work.csv", workS13);
            createGraphicsFromCsv("data/sector12_work.csv", workS12);
            createGraphicsFromCsv("data/sector11_work.csv", workS11);
            createGraphicsFromCsv("data/sector10_work.csv", workS10);
            createGraphicsFromCsv("data/sector9_work.csv", workS9);
            createGraphicsFromCsv("data/sector8_work.csv", workS8);
            createGraphicsFromCsv("data/sector7_work.csv", workS7);
            createGraphicsFromCsv("data/sector6_work.csv", workS6);
            createGraphicsFromCsv("data/sector5_work.csv", workS5);
            createGraphicsFromCsv("data/sector4_work.csv", workS4);
            createGraphicsFromCsv("data/sector3_work.csv", workS3);
            createGraphicsFromCsv("data/sector2_work.csv", workS2);
            createGraphicsFromCsv("data/sector1_work.csv", workS1);
            createGraphicsFromCsv("data/austinCounty.csv", austinLayer);
            createGraphicsFromCsv("data/brazoriaCounty.csv", brazoriaLayer);
            createGraphicsFromCsv("data/chambersCounty.csv", chambersLayer);
            createGraphicsFromCsv("data/coloradoCounty.csv", coloradoLayer);
            createGraphicsFromCsv("data/fortBendCounty.csv", fortBendLayer);
            createGraphicsFromCsv("data/galvestonCounty.csv", galvestonLayer);
            createGraphicsFromCsv("data/harrisCounty.csv", harrisLayer);
            createGraphicsFromCsv("data/matagordaCounty.csv", matagordaLayer);
            createGraphicsFromCsv("data/montgomeryCounty.csv", montgomeryLayer);
            createGraphicsFromCsv("data/wallerCounty.csv", wallerLayer);
            createGraphicsFromCsv("data/walkerCounty.csv", walkerLayer);
            createGraphicsFromCsv("data/whartonCounty.csv", whartonLayer);
            createGraphicsFromCsv("data/libertyCounty.csv", libertyLayer);
            createGraphicsFromCsv("data/austinCounty_work.csv", workAustin);
            createGraphicsFromCsv("data/brazoriaCounty_work.csv", workBrazoria);
            createGraphicsFromCsv("data/chambersCounty_work.csv", workChambers);
            createGraphicsFromCsv("data/coloradoCounty_work.csv", workColorado);
            createGraphicsFromCsv("data/fortBendCounty_work.csv", workFortBend);
            createGraphicsFromCsv("data/galvestonCounty_work.csv", workGalveston);
            createGraphicsFromCsv("data/harrisCounty_work.csv", workHarris);
            createGraphicsFromCsv("data/matagordaCounty_work.csv", workMatagorda);
            createGraphicsFromCsv("data/montgomeryCounty_work.csv", workMontgomery);
            createGraphicsFromCsv("data/wallerCounty_work.csv", workWaller);
            createGraphicsFromCsv("data/walkerCounty_work.csv", workWalker);
            createGraphicsFromCsv("data/whartonCounty_work.csv", workWharton);
            createGraphicsFromCsv("data/libertyCounty_work.csv", workLiberty);
            createGraphicsFromCsv("data/ctTest.csv", censusTractsLayer);
            createGraphicsFromCsv("data/ctTest_Work2.csv", workCensusTractsLayer);
    
            //Use Papa Parse to load and read the CSV data
            function createGraphicsFromCsv(csvFilePath, canvasLayer){
                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle("<b>${d_sector}</b>")
                infoTemplate.setContent("<b>${h_Workers} workers</b> live in <b>${h_sector}</b>, but travel to <b>${d_sector}</b> for work.");
    
                Papa.parse(csvFilePath,{
                    download: true,
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: function(results){
                        var csvGraphics = results.data.map(function(datum){
                            return new Graphic({
                                geometry: {
                                    x: datum.h_lon,
                                    y: datum.h_lat,
                                    spatialReference: {
                                        wkid: 4326
                                    }
                                },
                                attributes: datum
                                // infoTemplate: infoTemplate
                            });
                        });
        
                        //Add all graphics to the canvas flowmap layer
                        canvasLayer.addGraphics(csvGraphics);
                    }
                });
            }
    
            //Add a listener to handle when a user mouses over a point
            var clickListners = [];
            clickListners.push(on.pausable(s1, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s2, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s3, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s4, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s5, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s6, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s7, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s8, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s9, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s10, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s11, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s12, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s13, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s14, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s15, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s16, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s17, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s18, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s19, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s20, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s21, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s22, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s23, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s24, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(s25, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS1, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS2, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS3, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS4, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS5, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS6, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS7, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS8, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS9, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS10, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS11, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS12, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS13, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS14, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS15, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS16, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS17, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS18, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS19, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS20, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS21, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS22, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS23, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS24, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workS25, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(austinLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(brazoriaLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(chambersLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(coloradoLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(fortBendLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(galvestonLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(harrisLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(libertyLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(matagordaLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(montgomeryLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(walkerLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(wallerLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(whartonLayer, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workAustin, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workBrazoria, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workChambers, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workColorado, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workFortBend, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workGalveston, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workHarris, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workLiberty, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workMatagorda, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workMontgomery, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workWalker, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workWaller, "mouse-over", handleLayerInteraction));
            clickListners.push(on.pausable(workWharton, "mouse-over", handleLayerInteraction));
    
            //Interaction function that creates a new selection of the data
            function handleLayerInteraction(evt){
                var canvasLayer = evt.graphic.getLayer();
                if (evt.isOriginGraphic){
                    canvasLayer.selectGraphicsForPathDisplay(evt.sharedOriginGraphics, "SELECTION_NEW");
                } else {
                    canvasLayer.selectGraphicsForPathDisplay(evt.sharedDestinationGraphics, "SELECTION_NEW");
                }
            }
    
            //Add listener to the boundary dropdown
            boundarySelection.addEventListener("change", function(){
                var bSelection = $('#boundarySelection').val();
                var fSelection = $('#flowSelection').val();
                var secSelect = $('#sectorSelection').val();
                var workSecSelect = $('#workSectorSelection').val();
                var countSelect = $('#countySelection').val();
                var workCountSelect = $('#countyWorkSelection').val();
                var ctSelect = $('#ctValueType').val();
                if (fSelection === 'homeToWork'){
                    if (bSelection === 'county'){
                        sectors.hide();
                        counties.show();
                        censusTracts.hide();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').show();
                        $('#countyWorkSelection').hide();
                        $('#ctWorkValueType').hide();
                        $('#ctValueType').hide();
                        flowToggle(countSelect);
                    } else if (bSelection === 'sector'){
                        sectors.show();
                        counties.hide();
                        censusTracts.hide();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').show();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctValueType').hide();
                        $('#ctWorkValueType').hide();
                        flowToggle(secSelect);
                    } else if (bSelection === 'censusTract'){
                        sectors.hide();
                        counties.hide();
                        censusTracts.show();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctValueType').show();
                        $('#ctWorkValueType').hide();
                        censusToggle(ctSelect);
                    }
                } else{
                    if (bSelection === 'county'){
                        sectors.hide();
                        counties.show();
                        censusTracts.hide();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').show();
                        $('#ctWorkValueType').hide();
                        $('#ctValueType').hide();
                        flowToggle(workCountSelect);
                    } else if (bSelection === 'sector'){
                        sectors.show();
                        counties.hide();
                        censusTracts.hide();
                        $('#workSectorSelection').show();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctWorkValueType').hide();
                        $('#ctValueType').hide();
                        flowToggle(workSecSelect);
                    } else if (bSelection === 'censusTract'){
                        sectors.hide();
                        counties.hide();
                        censusTracts.show();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctValueType').hide();
                        $('#ctWorkValueType').show();
                        workCensusToggle(ctSelect);
                    }
                }
            });

            //Add listener to the flow direction
            flowSelection.addEventListener('change', function(evt){
                var bSelection = $('#boundarySelection').val();
                var fSelection = $('#flowSelection').val();
                var secSelect = $('#sectorSelection').val();
                var workSecSelect = $('#workSectorSelection').val();
                var countSelect = $('#countySelection').val();
                var workCountSelect = $('#countyWorkSelection').val();
                var ctSelect = $('#ctValueType').val();
                var ctWorkSelect = $('#ctWorkValueType').val();
                if (fSelection === 'homeToWork'){
                    if (bSelection === 'county'){
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').show();
                        $('#countyWorkSelection').hide();
                        $('#ctWorkValueType').hide();
                        $('#ctValueType').hide();
                        flowToggle(countSelect);
                        sectors.visible = false;
                        counties.visible = true;
                    } else if (bSelection === 'sector'){
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').show();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctWorkValueType').hide();
                        $('#ctValueType').hide();
                        flowToggle(secSelect);
                        sectors.visible = true;
                        counties.visible = false;
                    } else if (bSelection === 'censusTract'){
                        sectors.hide();
                        counties.hide();
                        censusTracts.show();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctValueType').show();
                        $('#ctWorkValueType').hide();
                        censusToggle(ctSelect);
                    }
                } else{
                    if (bSelection === 'county'){
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').show();
                        $('#ctValueType').hide();
                        $('#ctWorkValueType').hide();
                        flowToggle(workCountSelect);
                        sectors.visible = false;
                        counties.visible = true;
                    } else if (bSelection === 'sector'){
                        $('#workSectorSelection').show();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctValueType').hide();
                        $('#ctWorkValueType').hide();
                        flowToggle(workSecSelect);
                        sectors.visible = true;
                        counties.visible = false;
                    } else if (bSelection === 'censusTract'){
                        sectors.hide();
                        counties.hide();
                        censusTracts.show();
                        $('#workSectorSelection').hide();
                        $('#sectorSelection').hide();
                        $('#countySelection').hide();
                        $('#countyWorkSelection').hide();
                        $('#ctValueType').hide();
                        $('#ctWorkValueType').show();
                        workCensusToggle(ctWorkSelect);
                    }
                }
            });
    
            //Create function for when the user clicks a button
            function flowToggle(evt){
                if (evt.includes("WorkLayer"||'WLayer')){
                    turnOffActiveLayer();
                    turnOffWorkActiveLayer();
        
                    map.getLayer(evt).show();
                } else {
                    turnOffWorkActiveLayer();
                    turnOffActiveLayer();
        
                    map.getLayer(evt).show();
                }
                
            }

            function censusToggle(evt){
                turnOffActiveLayer();
                turnOffWorkActiveLayer();
                censusTractsLayer.show();
                censusTractsLayer.selectGraphicsForPathDisplayById('h_id', parseInt(evt), true, 'SELECTION_NEW');
            }

            function workCensusToggle(evt){
                turnOffActiveLayer();
                turnOffWorkActiveLayer();
                workCensusTractsLayer.show();
                workCensusTractsLayer.selectGraphicsForPathDisplayById('h_id', parseInt(evt), true, 'SELECTION_NEW');
            }
    
            function displayActiveLayer(val){
                map.getLayer(val).show();
            }
    
            function turnOffActiveLayer(){
                s1.hide();
                s2.hide();
                s3.hide();
                s4.hide();
                s5.hide();
                s6.hide();
                s7.hide();
                s8.hide();
                s9.hide();
                s10.hide();
                s11.hide();
                s12.hide();
                s13.hide();
                s14.hide();
                s15.hide();
                s16.hide();
                s17.hide();
                s18.hide();
                s19.hide();
                s20.hide();
                s21.hide();
                s22.hide();
                s23.hide();
                s24.hide();
                s25.hide();
                austinLayer.hide();
                brazoriaLayer.hide();
                chambersLayer.hide();
                coloradoLayer.hide();
                fortBendLayer.hide();
                galvestonLayer.hide();
                harrisLayer.hide();
                libertyLayer.hide();
                matagordaLayer.hide();
                montgomeryLayer.hide();
                wallerLayer.hide();
                walkerLayer.hide();
                whartonLayer.hide();
                censusTractsLayer.hide();
            }
    
            function turnOffWorkActiveLayer(){
                workS1.hide();
                workS2.hide();
                workS3.hide();
                workS4.hide();
                workS5.hide();
                workS6.hide();
                workS7.hide();
                workS8.hide();
                workS9.hide();
                workS10.hide();
                workS11.hide();
                workS12.hide();
                workS13.hide();
                workS14.hide();
                workS15.hide();
                workS16.hide();
                workS17.hide();
                workS18.hide();
                workS19.hide();
                workS20.hide();
                workS21.hide();
                workS22.hide();
                workS23.hide();
                workS24.hide();
                workS25.hide();
                workAustin.hide();
                workBrazoria.hide();
                workChambers.hide();
                workColorado.hide();
                workFortBend.hide();
                workHarris.hide();
                workGalveston.hide();
                workLiberty.hide();
                workMatagorda.hide();
                workMontgomery.hide();
                workWalker.hide();
                workWaller.hide();
                workWharton.hide();
                workCensusTractsLayer.hide();
            }
    
            //Selection listeners
            sectorSelect.addEventListener("change", function(evt){
                var secSelect = $('#sectorSelection').val();
                flowToggle(secSelect);
            });
    
            workSectorSelection.addEventListener("change", function(evt){
                var workSecSelect = $('#workSectorSelection').val();
                flowToggle(workSecSelect);
            });

            countySelect.addEventListener('change', function(evt){
                var countSelect = $('#countySelection').val();
                flowToggle(countSelect);
            });

            workCountySelection.addEventListener('change', function(){
                var workCountSelect = $('#countyWorkSelection').val();
                flowToggle(workCountSelect);
            });

            //Since the census tract values are dynamically created we can't the same format as the other layers
            $('#ctValueType').on('change', function(){
                censusToggle($('#ctValueType').val());
            });

            $('#ctWorkValueType').on('change', function(){
                workCensusToggle($('#ctWorkValueType').val());
            });
    
            legendBtn.addEventListener("click", function(evt){
                if (evt.target.children.length === 1){
                    var iconNode = evt.target.children["0"];
                    iconNode.classList.toggle('icon-ui-maps');
                    iconNode.classList.toggle('icon-ui-close');
    
                    if (legendDiv.style.display == "block"){
                        legendDiv.style.display = "none";
                    } else {
                        legendDiv.style.display = "block";
                    }
                } else {
                    var iconNode = evt.target.classList["1"];
                    evt.target.classList.toggle("icon-ui-maps");
                    evt.target.classList.toggle("icon-ui-close");
    
                    if (legendDiv.style.display === "block"){
                        legendDiv.style.display = "none";
                    } else {
                        legendDiv.style.display = "block";
                    }
                }
                
            });
    
            //Create a modal as a popup for the destination points to create a graph
            map.on("click", function(evt){
                var attr = evt.graphic.attributes;
    
                if (homeShowBtn.className === "icon-ui-grant icon-ui-white" || homeShowBtn.className === "icon-ui-white icon-ui-grant"){
                    setHomeGraph(attr);
            
                    calcite.bus.emit("modal:open", {id: "baz"});
                    
                }
    
                if (workShowBtn.className === "icon-ui-white icon-ui-grant"){
                    setWorkGraph(attr);
                    calcite.bus.emit("modal:open", {id: "caz"});
                }
                
            });
    
            //Function to create the home to work graph
            function setHomeGraph(attr){
                $("#sectorTitle").text(attr.d_sector);
                $("#modalContent").text(number.format(attr.h_Workers) + " workers live in " + attr.h_sector + ", but work in " + attr.d_sector + ".");
                $("#home").append("<canvas id='workersGraph'></canvas>");
                var canvas = $("#workersGraph");
    
                var data = {
                    datasets: [
                        {
                            data: [attr.Workers2009, attr.Workers2011, attr.Workers2013, attr.h_Workers2014, attr.h_Workers2015, attr.h_Workers],
                            backgroundColor: ["rgba(255, 0, 0, 0.6)"],
                            borderColor: "rgba(255, 0, 0, 0.6)",
                            fill: false,
                            label: "Total Workers",
                            pointBackgroundColor: "rgba(255, 0, 0, 0.6)"
                        }
                    ],
                    labels: ["2009", "2011", "2013","2014", "2015", "2017"]
                };
        
                myChart = new Chart(canvas,{
                    type: "line",
                    data: data,
                    options: {
                        tooltips: {
                            mode: "index",
                            intersect: false,
                            callbacks: {
                                label: function(tooltipItem, data){
                                    var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }
                            }
                        },
                        hover: {
                            mode: "nearest",
                            intersect: true
                        },
                        scales:{
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Year"
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Total Workers"
                                },
                                ticks: {
                                    callback: function(value){
                                        return parseFloat(value).toLocaleString();
                                    }
                                }
                            }]
                        }
                    }
                });
    
                return canvas;
            }
    
            //Create the work to home graph
            function setWorkGraph(attr){
                $("#workSectorTitle").text(attr.d_sector);
                $("#workModalContent").text(number.format(attr.h_Workers) + " workers work in " + attr.d_sector + ", but live in " + attr.h_sector + ".");
                $("#work").append("<canvas id='workGraph'></canvas>");
                var canvas = $("#workGraph");
    
                var data = {
                    datasets: [
                        {
                            data: [attr.Workers2009, attr.Workers2011, attr.Workers2013, attr.h_Workers2014, attr.h_Workers2015, attr.h_Workers],
                            backgroundColor: ["#0079c1"],
                            borderColor: "#0079c1",
                            fill: false,
                            label: "Total Workers",
                            pointBackgroundColor: "#0079c1"
                        }
                    ],
                    labels: ["2009", "2011", "2013", "2014", "2015", "2017"]
                };
        
                myChart = new Chart(canvas,{
                    type: "line",
                    data: data,
                    options: {
                        tooltips: {
                            mode: "index",
                            intersect: false,
                            callbacks: {
                                label: function(tooltipItem, data){
                                    var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }
                            }
                        },
                        hover: {
                            mode: "nearest",
                            intersect: true
                        },
                        scales:{
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Year"
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Total Workers"
                                },
                                ticks: {
                                    callback: function(value){
                                        return parseFloat(value).toLocaleString();
                                    }
                                }
                            }]
                        }
                    }
                });
    
                return canvas;
            }
    
            //Remove the graphs when the modal is closed
            $("#workClose").on("click", function(){
                $("#workersGraph").remove();
            });
    
            $("#workClose1").on("click", function(){
                $("#workersGraph").remove();
            });
    
            $("#wthClose").on("click", function(){
                $("#workGraph").remove();
            });
    
            $("#wthClose1").on("click", function(){
                $("#workGraph").remove();
            });
    
        });
    });
})