var at = ["NA", "Riot or Brawl", "Assassination", "Suicide Attack", "Kidnap/Hostage", "Execution", "Other Personal Attack", "Other Property Attack", "Border Incident", "Siege/Blockade", "Other Type of Attack", "Attempt Assassination", "Attempt Suicide Attack", "Attempt Kidnap/Hostage", "Attempt Oth Personal Attack", "Attempt Oth Property Attack", "Conspiracy Assassination", "Conspiracy Suicide Attack", "Conspiracy Kidnap/Hostage", "Conspiracy Oth Personal Attack", "Conspiracy Oth Property Attack", "Other Attempt", "Other Conspiracy", "Threat"];

var ep = ["NA", "Verbal or Written Expression", "Symbolic Act", "Forming an Association", "Mass Demonstration or Strike"];

var init_type = ["NA", "Non Gov Initiator", "Gov Initiator", "Suspected Gov Initiator", "Quasi Gov Initiator", "Non-human Stimulus"];

var ngov = ["NA", "Social Group Member", "Political Group Member", "Union Member", "Member of Buss Assoc", "Nondescript Individual", "Worker", "Farmer/peasant", "Woman", "Child", "Youth", "Elderly", "Disabled", "GLBT", "Refugee", "Student", "Educator", "Intellectual", "Dissident", "Voter", "Pol Candidate", "Societal Leader", "Local Leader", "Former Gov Off", "Civic Group Member", "Religious Person", "Humanitarian Worker", "Healthcare Worker", "Security Official", "Soldier", "Peacekeeper", "Paramilitary Member", "Guerrilla Group Member", "Criminal", "Prisoner", "Journalist", "Business Person", "Gov Official", "Other", "Unspecified", "Landlord", "Immigrant"];

var gov = ["NA", "Fire/rescue Official", "Police Officer", "Soldier", "Secret Police Offcial", "Intelligence Agent", "Cabinet Member", "Bureaucrat", "Election Official", "General Officer", "Chief Executive", "Royalty", "Clerical Leader", "Dictator", "Junta Member", "Colonial Governor", "Judge", "Judicial Court", "Legislator", "Legislature", "Government (Corporate)", "Public Media Org", "Gov Contractor", "International Org", "Oth Gov Entity"];

var tar = ["No Target", "Human", "Property", "Geo Pol Entity", "Unspecified Target"];

var vic = ["NA", "No Known Effects","General Effects","Constrained","Arrested","Dispersed","Surrendered/Captured","Exiled","Attacked","Kidnapped","Injured","Raped","Killed","Some Other Effect"];

var weapon = ["NA","No Weapon Used","Fake weapon Used","Body Parts","Animal","Vehicles","Computer","Blunt Instrument","Tear gas, Mace, etc.","Knives/sharp Instrument","IED","Letter Bomb","Fire","Non-lethal Projectiles","Small Arms","Light Weapon","Incendiary Device","Land Mine","Explosives, Grenade","Car Bomb","Tanks/armored Vehicles","Field Artillery","Missile/rocket","Aircraft Munitions","Naval Power","Biochemical Weapons","Unspecified","Other weapon"];

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

d3.csv("/data/ssp_simplified.csv").then(function (data) {

    var ddd = [["initiator_type", "dsf"]];

    console.log(data[4].atk)

    data.forEach(function (d) {
        
if(d.victim_effect == ""){
    d.expp = "unknown";
} else {
    d.expp = vic[d.victim_effect];
}
        
        if(d.weapon == ""){
    d.expp = "unknown";
} else {
    d.exppp = weapon[d.weapon];
}

        ddd.push([d.expp, d.exppp]);

    });


    console.log(ddd);

    exportToCsv('export.csv', ddd);

});
