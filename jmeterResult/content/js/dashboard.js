/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.21666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Request to /online-grievance-redressal-submission-form-1"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /community-services"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /caste-discrimination-complaint-1"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /online-grievance-redressal-submission-form-0"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /caste-discrimination-complaint-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /nirf-1"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /students-committees"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /nirf-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /from-sa-i-c-desk"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /naac-plus-copy-1"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /naac-plus-copy-0"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /students-committees-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /students-committees-1"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-visit-photo"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-visit-videos"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-visit-2016-photos"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /caste-discrimination-complaint"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /online-grievance-redressal-submission-form"], "isController": false}, {"data": [1.0, 500, 1500, "Request to /naac-visit-2016-photos-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /nirf"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-visit-2016-photos-1"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /naac-visit-videos-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-visit-videos-1"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /from-sa-i-c-desk-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /from-sa-i-c-desk-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request to /naac-visit-photo-0"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /community-services-1"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-plus-copy"], "isController": false}, {"data": [0.0, 500, 1500, "Request to /naac-visit-photo-1"], "isController": false}, {"data": [0.5, 500, 1500, "Request to /community-services-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 0, 0.0, 2406.233333333334, 324, 4922, 2503.5, 4631.700000000002, 4900.55, 4922.0, 3.2088993475237997, 910.6651613808963, 0.5235352711519948], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Request to /online-grievance-redressal-submission-form-1", 1, 0, 0.0, 3122.0, 3122, 3122, 3122.0, 3122.0, 3122.0, 3122.0, 0.32030749519538754, 135.55106652386291, 0.046294442664958364], "isController": false}, {"data": ["Request to /community-services", 1, 0, 0.0, 3729.0, 3729, 3729, 3729.0, 3729.0, 3729.0, 3729.0, 0.2681684097613301, 112.98401255363368, 0.06468515352641459], "isController": false}, {"data": ["Request to /caste-discrimination-complaint-1", 1, 0, 0.0, 3488.0, 3488, 3488, 3488.0, 3488.0, 3488.0, 3488.0, 0.286697247706422, 119.92204298666857, 0.03807697821100917], "isController": false}, {"data": ["Request to /online-grievance-redressal-submission-form-0", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.31207282806804376, 0.17442853888213852], "isController": false}, {"data": ["Request to /caste-discrimination-complaint-0", 1, 0, 0.0, 1219.0, 1219, 1219, 1219.0, 1219.0, 1219.0, 1219.0, 0.8203445447087777, 0.2010805475799836, 0.10815089212469237], "isController": false}, {"data": ["Request to /nirf-1", 1, 0, 0.0, 2409.0, 2409, 2409, 2409.0, 2409.0, 2409.0, 2409.0, 0.41511000415110005, 176.49228803445413, 0.04459189497716895], "isController": false}, {"data": ["Request to /students-committees", 1, 0, 0.0, 4922.0, 4922, 4922, 4922.0, 4922.0, 4922.0, 4922.0, 0.2031694433157253, 86.19483473435596, 0.04940350721251524], "isController": false}, {"data": ["Request to /nirf-0", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3930707737030411, 0.1904209525939177], "isController": false}, {"data": ["Request to /from-sa-i-c-desk", 1, 0, 0.0, 4883.0, 4883, 4883, 4883.0, 4883.0, 4883.0, 4883.0, 0.2047921359819783, 86.64067299815687, 0.04859813383166087], "isController": false}, {"data": ["Request to /naac-plus-copy-1", 1, 0, 0.0, 1490.0, 1490, 1490, 1490.0, 1490.0, 1490.0, 1490.0, 0.6711409395973154, 287.3682623741611, 0.0786493288590604], "isController": false}, {"data": ["Request to /naac-plus-copy-0", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.41499491410488243, 0.21014636075949367], "isController": false}, {"data": ["Request to /students-committees-0", 1, 0, 0.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 0.23113905325443787, 0.11942184418145957], "isController": false}, {"data": ["Request to /students-committees-1", 1, 0, 0.0, 3907.0, 3907, 3907, 3907.0, 3907.0, 3907.0, 3907.0, 0.2559508574353724, 108.52741273675454, 0.031244001151778857], "isController": false}, {"data": ["Request to /naac-visit-photo", 1, 0, 0.0, 3192.0, 3192, 3192, 3192.0, 3192.0, 3192.0, 3192.0, 0.3132832080200501, 142.69407649984336, 0.07434357377819549], "isController": false}, {"data": ["Request to /naac-visit-videos", 1, 0, 0.0, 2454.0, 2454, 2454, 2454.0, 2454.0, 2454.0, 2454.0, 0.40749796251018744, 168.59909841075793, 0.09749707110839445], "isController": false}, {"data": ["Request to /naac-visit-2016-photos", 1, 0, 0.0, 3250.0, 3250, 3250, 3250.0, 3250.0, 3250.0, 3250.0, 0.3076923076923077, 130.23677884615384, 0.07662259615384616], "isController": false}, {"data": ["Request to /caste-discrimination-complaint", 1, 0, 0.0, 4708.0, 4708, 4708, 4708.0, 4708.0, 4708.0, 4708.0, 0.21240441801189466, 88.89830142841971, 0.056212497344944774], "isController": false}, {"data": ["Request to /online-grievance-redressal-submission-form", 1, 0, 0.0, 3945.0, 3945, 3945, 3945.0, 3945.0, 3945.0, 3945.0, 0.25348542458808615, 107.33770991761725, 0.07302558618504436], "isController": false}, {"data": ["Request to /naac-visit-2016-photos-0", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.4842952806122449, 0.253109056122449], "isController": false}, {"data": ["Request to /nirf", 1, 0, 0.0, 2969.0, 2969, 2969, 2969.0, 2969.0, 2969.0, 2969.0, 0.3368137420006736, 143.2770792985854, 0.0720334077130347], "isController": false}, {"data": ["Request to /naac-visit-2016-photos-1", 1, 0, 0.0, 2760.0, 2760, 2760, 2760.0, 2760.0, 2760.0, 2760.0, 0.36231884057971014, 153.27254585597828, 0.045289855072463775], "isController": false}, {"data": ["Request to /naac-visit-videos-0", 1, 0, 0.0, 763.0, 763, 763, 763.0, 763.0, 763.0, 763.0, 1.3106159895150722, 0.3046158256880734, 0.15614760812581913], "isController": false}, {"data": ["Request to /naac-visit-videos-1", 1, 0, 0.0, 1691.0, 1691, 1691, 1691.0, 1691.0, 1691.0, 1691.0, 0.5913660555884093, 244.53563904494382, 0.07103322738024836], "isController": false}, {"data": ["Request to /from-sa-i-c-desk-0", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.2195875830170778, 0.11211011622390891], "isController": false}, {"data": ["Request to /from-sa-i-c-desk-1", 1, 0, 0.0, 3829.0, 3829, 3829, 3829.0, 3829.0, 3829.0, 3829.0, 0.26116479498563594, 110.42960588600157, 0.03111533690258553], "isController": false}, {"data": ["Request to /naac-visit-photo-0", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.7143373842592592, 0.36470389660493824], "isController": false}, {"data": ["Request to /community-services-1", 1, 0, 0.0, 2553.0, 2553, 2553, 2553.0, 2553.0, 2553.0, 2553.0, 0.3916960438699569, 164.93693081668624, 0.047431942812377594], "isController": false}, {"data": ["Request to /naac-plus-copy", 1, 0, 0.0, 2043.0, 2043, 2043, 2043.0, 2043.0, 2043.0, 2043.0, 0.4894762604013706, 209.69564519089573, 0.11424299437102299], "isController": false}, {"data": ["Request to /naac-visit-photo-1", 1, 0, 0.0, 2868.0, 2868, 2868, 2868.0, 2868.0, 2868.0, 2868.0, 0.34867503486750345, 158.73362861750348, 0.04154136157601116], "isController": false}, {"data": ["Request to /community-services-0", 1, 0, 0.0, 1176.0, 1176, 1176, 1176.0, 1176.0, 1176.0, 1176.0, 0.8503401360544217, 0.19846805909863946, 0.1021404655612245], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
