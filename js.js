require([
    'esri/Map',
    'esri/views/SceneView',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/widgets/Legend',
    'esri/rest/support/Query',
    ], (Map, SceneView, FeatureLayer, GraphicsLayer, Legend, Query) =>{
    
    const mapa = new Map({
        basemap: 'topo-vector'
    });
    const view = new SceneView({
        map: mapa,
        container: 'mapa',
        zoom: 5,
        center: [-100, 35]
    });

    const warstwa1 = new GraphicsLayer();

    const trzesienia = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });
    

    mapa.add(trzesienia);
    mapa.add(warstwa1);

    const legend = new Legend({
        view: view
    });
    
    view.ui.add(legend, {position: "bottom-left"});

//zapytanie
    let query = trzesienia.createQuery();
    query.where =  "MAGNITUDE > 4";
    query.outfields = ['*'];
    query.returnGeometry= true; 
    trzesienia.queryFeatures(query)
    .then(response =>{
        console.log(response);
        getResults(response.features);
    })
    .catch(err => { 
        console.log(err);
    });

    const getResults = (features) => {
        let symbol = {
            type: "simple-marker",
            size: 15,
            color: "red",
            style: "square"
        };
        
        features.map(elem => {
            elem.symbol = symbol;
        });

        warstwa1.addMany(features)
    };


    const simple = {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers: [{
                type: "object",
                resource: {
                primitive: "cylinder"
                },
                width:5000
                },]},
        label: "Earthquake",
        visualVariables: [{
                type: "color",
                field: "MAGNITUDE",
                stops: [{
                    value: 0.5,
                    color: "green"
                    },{
                    value: 4,
                    color: "red"
                    },]},{
                type: "size",
                field: "DEPTH",
                stops: [{
                    value: -3.39,
                    size: 5000
                    },{
                    value: 30.97,
                    size: 13000
                    },]}]};
    trzesienia.renderer = simple;
});