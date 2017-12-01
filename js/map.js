
// Set Global variable
var prevIdArea;

$(document).ready(function() {
    $("#mapcontainer").mapael({
        map: {
            // Set the name of the map to display
            name: "france_circonscriptions",
            afterInit : function($self, paper, areas, plots, options) {
            },
            zoom:{
                maxLevel: 50
            },
            defaultArea: {
                eventHandlers: {
                    click: function (e, id, mapElem, textElem) {

                        var mapContainer = $("#mapcontainer");

                        // update focus color
                        var options = {areas: {}};
                        options.areas[id] = {attrs: {fill: "#ff9000"}};
                        options.areas[prevIdArea] = {attrs: {fill: "#373737"}};
                        mapContainer.trigger('update', [{mapOptions: options}]);
                        prevIdArea = id;

                        // Calculate zoom position
                        var mbx = mapElem.getBBox();
                        var posX = mbx.x + mbx.width / 2;
                        var posY = mbx.y + mbx.height / 2;
                        var zoomLevel = 10;

                        /*
                        TODO: set zoom level dynamic with the region size
                        var sizeMetric = Math.round(mbx.height * mbx.width / 100);
                        if (sizeMetric < 50) {
                            zoomLevel = 15;
                        }
                        if (sizeMetric < 10) {
                            zoomLevel = 25
                        }
                        if (sizeMetric < 5) {
                            zoomLevel = 35;
                        }
                        if (sizeMetric < 3) {
                            zoomLevel = 40;
                        }
                        */
                        mapContainer.trigger('zoom', {level: zoomLevel, x: posX, y: posY});
                    }
                }
            }
        }
    });

    /*
    // Debug Test
    focusParlCirco(1, 2);
    setTimeout(function() { resetMap(); }, 5000);
    */

});

function resetMap(){
    var mapContainer = $("#mapcontainer");
    // reset focus color
    var options = {areas: {}};
    options.areas[prevIdArea] = {attrs: {fill: "#373737"}};
    mapContainer.trigger('update', [{mapOptions: options}]);
    mapContainer.trigger('zoom', {level: 0});

}

function focusParlCirco(deptNumber, CircNumber){
    var circo = formatCircoNumber(deptNumber, CircNumber)
    $("[data-id="+circo+"]").trigger("click");
}

function formatCircoNumber(dept, circ){
    /** this function format the dept and circo number in the following format:
     * ex 001-01 where 001 is the department number
     * and 01 is the circonscription number
     * see france_circonscriptions.js where all the keys are for
     * particular area like 'IDF' (ile-de-france)
     */
    var deptZeroString = "0000"; // need to have 1 more than the desired length
    var deptPart = deptZeroString.substring((dept + "").length, deptZeroString.length-1) + dept;
    var circZeroString = "000"; // need to have 1 more than the desired length
    var circPart = circZeroString.substring((circ + "").length, circZeroString.length-1) + circ;
    return deptPart + "-" + circPart;
}