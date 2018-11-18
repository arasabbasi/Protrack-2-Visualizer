"use strict";
var JumpManager = function () {	
	this.jumps = new Array();
}

JumpManager.prototype.addJump = function (jump) {
	this.jumps.push(jump);
};

JumpManager.prototype.getDataTable = function () {
	var cols = [{id: 'time', label: 'Time', type: 'number'}];
	var rows = [];
	
	for (var i = 0; i < this.jumps.length; i += 1) {
		cols.push({id: 'altitude_of_' + this.jumps[i].jumpNumber, label: 'Jump ' + this.jumps[i].jumpNumber, type: 'number'});
		var rawData = this.jumps[i].getData();
		var toEnd = Math.max (rawData.length, rows.length);
		for (var j = 0; j < toEnd; j += 1) {
			if (typeof rows[j] === "undefined") {
				rows[j] = [0.25 * j];
				for (var z = 0; z < i; z += 1) {
					rows[j][z+1] = 0;
				}
			}
			if (typeof rawData[j] !== "undefined") {
				rows[j][i+1] = rawData[j][1];
			} else {
				rows[j][i+1] = 0;
			}
		}
	}
	var dataTable = new google.visualization.DataTable({
		cols: cols
	});
	dataTable.addRows(rows);
	
	return dataTable;
}
