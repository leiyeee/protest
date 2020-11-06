function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

d3.csv("/data/ssp.csv").then(function (data) {

    var ddd = [["initiator", "dsf"]];
    data.forEach(function (d) {
        let initArray = [];
        if (d.INI_IGRP1 !== "." && d.INI_IGRP1 !== "") {
            initArray.push(d.INI_IGRP1);
        }
        if (d.TAR_IGRP1 !== "." && d.TAR_IGRP1 !== "") {
            initArray.push(d.TAR_IGRP1);
        }
        if (d.VIC_IGRP1 !== "." && d.VIC_IGRP1 !== "") {
            initArray.push(d.VIC_IGRP1);
        }
        if (d.INI_SGRP1 !== "." && d.INI_SGRP1 !== "") {
            initArray.push(d.INI_SGRP1);
        }
        if (d.TAR_SGRP1 !== "." && d.TAR_SGRP1 !== "") {
            initArray.push(d.TAR_SGRP1);
        }
        if (d.VIC_SGRP1 !== "." && d.VIC_SGRP1 !== "") {
            initArray.push(d.VIC_SGRP1);
        }
        if (d.INI_PGRP1 !== "." && d.INI_PGRP1 !== "") {
            initArray.push(d.INI_PGRP1);
        }
        if (d.TAR_PGRP1 !== "." && d.TAR_PGRP1 !== "") {
            initArray.push(d.TAR_PGRP1);
        }
        if (d.VIC_PGRP1 !== "." && d.VIC_PGRP1 !== "") {
            initArray.push(d.VIC_PGRP1);
        }

        if (initArray.length !== 0) {
            d.initiator = initArray.join(", ");
        } else {
            d.initiator = "unknown";
        };

        ddd.push([d.initiator, "placeholder"]);
    });

    exportToCsv('export.csv', ddd);

});
