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
    document.addEventListener("click", function(){
        document.getElementById("welcomePanel").style.display = "none";
    });

    //Reference to the option selection
    var sectorSelect = document.getElementById("sectorSelection");
    var legendBtn = document.getElementById("legendBtn");
    var legendDiv = document.getElementById("legendDiv");
    var layerBtn = document.getElementById("layerBtn");
    var homeLayerBtn = document.getElementById("homeLayerBtn");

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
                type: 'uniqueValue',
                field: 'd_sector',
                uniqueValueInfos: [{
                  value: 'Sector 1',
                  symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 0,
                    fillStyle: 'rgba(87, 216, 255, 0)',
                    lineWidth: 0.5,
                    strokeStyle: 'rgb(61, 225, 255)',
                    shadowBlur: 0
                  }
                }, {
                  value: 'Sector 2',
                  symbol: {
                    globalCompositeOperation: 'destination-over',
                    radius: 4,
                    fillStyle: 'rgba(17, 142, 170, 0.7)',
                    lineWidth: 0.25,
                    strokeStyle: 'rgb(17, 142, 170)',
                    shadowBlur: 0
                  }
                }, {
                    value: 'Sector 3',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 4',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 5',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 6',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 7',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 8',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 9',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 10',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 11',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 12',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 13',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 14',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 15',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 16',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 17',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 18',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 19',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 20',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 21',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 22',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 23',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 24',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }, {
                    value: 'Sector 25',
                    symbol: {
                        globalCompositeOperation: 'destination-over',
                        radius: 4,
                        fillStyle: 'rgba(17, 142, 170, 0.7)',
                        lineWidth: 0.25,
                        strokeStyle: 'rgb(17, 142, 170)',
                        shadowBlur: 0
                    }
                  }]
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
            wrapAroundCanvas: true,
            animationStarted: true,
            animationDuration: 2000,
            animationEasingFamily: "Linear",
            animationEasingType: "None"
        });

        var s25Work = new CanvasFlowmapLayer({
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
            wrapAroundCanvas: true,
            animationStarted: true,
            animationDuration: 2000,
            animationEasingFamily: "Linear",
            animationEasingType: "None"
        });

        map.addLayers([s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s25Work]);

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
        createWorkGraphicsFromCsv("data/sector25_work.csv", s25Work);

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

        //Selection listeners
        sectorSelect.addEventListener("change", function(evt){
            toggleActiveLayer(evt);
        });

        layerBtn.addEventListener("click", function(evt){
            var iconNode = evt.target.children["0"];
            iconNode.classList.toggle("icon-ui-radio-unchecked");
            iconNode.classList.toggle("icon-ui-grant");
        });

        homeLayerBtn.addEventListener("click", function(evt){
            var iconNode = evt.target.children["0"];
            iconNode.classList.toggle("icon-ui-grant");
            iconNode.classList.toggle("icon-ui-radio-unchecked");

            if (iconNode.classList[1] === "icon-ui-radio-unchecked"){
                turnOffActiveLayer();
            } else{
                displayActiveLayer(sectorSelect.value);
            }
        });

        legendBtn.addEventListener("click", function(evt){
            var iconNode = evt.target.children["0"];
            iconNode.classList.toggle('icon-ui-maps');
            iconNode.classList.toggle('icon-ui-close');

            if (legendDiv.style.display == "block"){
                legendDiv.style.display = "none"
            } else {
                legendDiv.style.display = "block";
            }
        });

    });
});