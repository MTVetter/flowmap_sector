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
    on
){
    // document.addEventListener("click", function(){
    //     document.getElementById("welcomePanel").style.display = "none";
    // });

    //Reference to the option selection
    var sectorSelect = document.getElementById("sectorSelection");
    var workSectorSelection = document.getElementById("workSectorSelection");
    var legendBtn = document.getElementById("legendBtn");
    var legendDiv = document.getElementById("legendDiv");
    var workLayerBtn = document.getElementById("workLayerBtn");
    var homeLayerBtn = document.getElementById("homeLayerBtn");
    var workShowBtn = document.getElementById("workShowButton");
    var homeShowBtn = document.getElementById("homeShowButton");
    var alertBtn = document.getElementById("alert");

    //Create the map
    var map = new Map("map",{
        basemap: "dark-gray-vector",
        center: [-95.381214, 29.742862],
        zoom: 8
    });

    //Create a home button to return the user to the default map zoom
    var home = new HomeButton({
        map: map
    }, "HomeButton");
    home.startup();

    //Add the county boundaries
    //Create a renderer for the sectors so that you can see the flow map lines
    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        new Color([255,255,255]), 2),new Color([255,255,255,0])
      );
    var renderer = new SimpleRenderer(sfs);
    var sectors = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Socioeconomic_Modeling/Sector_25/MapServer/0",{
        opacity: 0.2,
        outFields: ["*"]
    });
    sectors.setRenderer(renderer);

    map.addLayer(sectors);

    map.on("load", function(){
        var s1 = new CanvasFlowmapLayer({
            id: "sector1Layer",
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 10000000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 10000000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 10000000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 10000000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 10000000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 10000000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(255,0,0,0.6)",
                        lineWidth: 8,
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
                    classMaxValue: 100000,
                    symbol: {
                        strokeStyle: "rgba(87, 216, 255, 0.65)",
                        lineWidth: 8,
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
            destinationCircleProperties: {
                type: "simple",
                symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 5,
                    fillStyle: 'rgba(0, 107, 137, 0.8)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgba(0, 107, 137, 0.8)',
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
        workS8, workS7, workS6, workS5, workS4, workS3, workS2, workS1]);

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
        createWorkGraphicsFromCsv("data/sector25_work.csv", workS25);
        createWorkGraphicsFromCsv("data/sector24_work.csv", workS24);
        createWorkGraphicsFromCsv("data/sector23_work.csv", workS23);
        createWorkGraphicsFromCsv("data/sector22_work.csv", workS22);
        createWorkGraphicsFromCsv("data/sector21_work.csv", workS21);
        createWorkGraphicsFromCsv("data/sector20_work.csv", workS20);
        createWorkGraphicsFromCsv("data/sector19_work.csv", workS19);
        createWorkGraphicsFromCsv("data/sector18_work.csv", workS18);
        createWorkGraphicsFromCsv("data/sector17_work.csv", workS17);
        createWorkGraphicsFromCsv("data/sector16_work.csv", workS16);
        createWorkGraphicsFromCsv("data/sector15_work.csv", workS15);
        createWorkGraphicsFromCsv("data/sector14_work.csv", workS14);
        createWorkGraphicsFromCsv("data/sector13_work.csv", workS13);
        createWorkGraphicsFromCsv("data/sector12_work.csv", workS12);
        createWorkGraphicsFromCsv("data/sector11_work.csv", workS11);
        createWorkGraphicsFromCsv("data/sector10_work.csv", workS10);
        createWorkGraphicsFromCsv("data/sector9_work.csv", workS9);
        createWorkGraphicsFromCsv("data/sector8_work.csv", workS8);
        createWorkGraphicsFromCsv("data/sector7_work.csv", workS7);
        createWorkGraphicsFromCsv("data/sector6_work.csv", workS6);
        createWorkGraphicsFromCsv("data/sector5_work.csv", workS5);
        createWorkGraphicsFromCsv("data/sector4_work.csv", workS4);
        createWorkGraphicsFromCsv("data/sector3_work.csv", workS3);
        createWorkGraphicsFromCsv("data/sector2_work.csv", workS2);
        createWorkGraphicsFromCsv("data/sector1_work.csv", workS1);

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
                            attributes: datum,
                            infoTemplate: infoTemplate
                        });
                    });
    
                    //Add all graphics to the canvas flowmap layer
                    canvasLayer.addGraphics(csvGraphics);
                }
            });
        }

        function createWorkGraphicsFromCsv(csvFilePath, canvasLayer){
            var infoTemplate = new InfoTemplate();
            infoTemplate.setTitle("<b>${d_sector}</b>")
            infoTemplate.setContent("<b>${h_Workers} workers</b> work in <b>${h_sector}</b>, but live in <b>${d_sector}</b>.");

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
                            attributes: datum,
                            infoTemplate: infoTemplate
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

        //Interaction function that creates a new selection of the data
        function handleLayerInteraction(evt){
            var canvasLayer = evt.graphic.getLayer();
            if (evt.isOriginGraphic){
                canvasLayer.selectGraphicsForPathDisplay(evt.sharedOriginGraphics, "SELECTION_NEW");
            } else {
                canvasLayer.selectGraphicsForPathDisplay(evt.sharedDestinationGraphics, "SELECTION_NEW");
            }
        }

        //Create function for when the user clicks a button
        function toggleActiveLayer(evt){

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

            map.getLayer(evt.target.value).show();
        }

        function toggleActiveWorkLayer(evt){

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

            map.getLayer(evt.target.value).show();
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
        }

        //Selection listeners
        sectorSelect.addEventListener("change", function(evt){
            if (homeShowBtn.className === "icon-ui-radio-unchecked icon-ui-white" || homeShowBtn.className === "icon-ui-white icon-ui-radio-unchecked"){
                alertBtn.style.display = "block";
                setTimeout(function(){
                    alertBtn.style.display = "none";
                }, 2000);
            } else if (homeShowBtn.className === "icon-ui-grant icon-ui-white" || homeShowBtn.className === "icon-ui-white icon-ui-grant"){
                toggleActiveLayer(evt);
            }
        });

        workSectorSelection.addEventListener("change", function(evt){
            if (workShowBtn.className === "icon-ui-radio-unchecked icon-ui-white" || workShowBtn.className === "icon-ui-white icon-ui-radio-unchecked"){
                alertBtn.style.display = "block";
                setTimeout(function() {
                    alertBtn.style.display = "none";
                }, 2000);
            } else if (workShowBtn.className === "icon-ui-grant icon-ui-white" || workShowBtn.className === "icon-ui-white icon-ui-grant") {
                toggleActiveWorkLayer(evt);
            }
        })

        workLayerBtn.addEventListener("click", function(evt){
            if (evt.target.children.length === 1){
                var iconNode = evt.target.children["0"];
                evt.target.children["0"].classList.toggle("icon-ui-grant");
                evt.target.children["0"].classList.toggle("icon-ui-radio-unchecked");

                if (iconNode.classList[1] === "icon-ui-radio-unchecked"){
                    turnOffWorkActiveLayer();
                } else{
                    displayActiveLayer(workSectorSelection.value);
                }
            } else {
                var iconNode = evt.target.classList["1"];
                evt.target.classList.toggle("icon-ui-grant");
                evt.target.classList.toggle("icon-ui-radio-unchecked");

                if (iconNode === "icon-ui-radio-unchecked"){
                    displayActiveLayer(workSectorSelection.value);
                } else {
                    turnOffWorkActiveLayer();
                }
            }
        });

        homeLayerBtn.addEventListener("click", function(evt){
            if (evt.target.children.length === 1){
                var iconNode = evt.target.children["0"];
                evt.target.children["0"].classList.toggle("icon-ui-grant");
                evt.target.children["0"].classList.toggle("icon-ui-radio-unchecked");

                if (iconNode.classList[1] === "icon-ui-radio-unchecked"){
                    turnOffActiveLayer();
                } else{
                    displayActiveLayer(sectorSelect.value);
                }
            } else {
                var iconNode = evt.target.classList["1"];
                evt.target.classList.toggle("icon-ui-grant");
                evt.target.classList.toggle("icon-ui-radio-unchecked");

                if (iconNode === "icon-ui-radio-unchecked"){
                    displayActiveLayer(sectorSelect.value);
                } else {
                    turnOffActiveLayer();
                }
            }
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

    });
});