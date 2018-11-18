"use strict";
var Jump = function () {
	var rxJumpInfo = /JIB\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\nJIE/g;
	var rxProfileInfo = /PIB\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\d\.]*)\r\n([\r\n\d,]*)\r\nPIE/g;

	var _data = '';
	var _matchesJumpInfo = [];
	var _matchesProfileInfo = [];
	Object.defineProperty(this, 'fileData', {
		get: function () {
			return _data;
		},
		set: function (value) {
			_data = value.toString();
			_matchesJumpInfo = rxJumpInfo.exec(_data);
			_matchesProfileInfo = rxProfileInfo.exec(_data);
		}
	});
	
	Object.defineProperty(this, 'jumpNumber', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesJumpInfo[5], 10);
		}
	});

	Object.defineProperty(this, 'jumpDate', {
		enumerable: true,
		get: function () {
			return _matchesJumpInfo[6];
		}
	});
	
	Object.defineProperty(this, 'jumpTime', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesJumpInfo[7], 10);
		}
	});
	
	Object.defineProperty(this, 'exitAltitude', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesJumpInfo[8], 10);
		}
	});
	
	Object.defineProperty(this, 'freefallTime', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesJumpInfo[9], 10);
		}
	});
	
	Object.defineProperty(this, 'temperatureInC', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesJumpInfo[21], 10) / 10;
		}
	});
	
	Object.defineProperty(this, 'temperatureInK', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesJumpInfo[21], 10) / 10 + 273.15;
		}
	});

	
	Object.defineProperty(this, 'pressureAtGroundLevel', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesProfileInfo[1], 10);
		}
	});

	
	Object.defineProperty(this, 'profilePointsAmount', {
		enumerable: true,
		get: function () {
			return parseInt(_matchesProfileInfo[4], 10);
		}
	});
	
	Object.defineProperty(this, 'profilePoints', {
		enumerable: true,
		get: function () {
			var data = _matchesProfileInfo[5].split(',');
			for(var i=0; i<data.length; i++) { data[i] = parseInt(data[i], 10); } 
			return data; 
		}
	});

	return this;
}

Jump.prototype.getData = function () {
	
	var temperatureGradiant = 0.0065;
	var factor = 1/5.255;
	var altitude = 0;
	var time = 0;
	var data = [];
	for (var i = 0; i < this.profilePoints.length; i += 1) {
		time = i * 0.25;
		altitude = Math.max(0, Math.round((this.temperatureInK / temperatureGradiant)*(1-Math.pow((this.profilePoints[i] / this.pressureAtGroundLevel), factor)) * 100) / 100);
		data.push([time, altitude]);
	}
	return data;
}

Jump.prototype.getDataTable = function () {
	var dataTable = new google.visualization.DataTable({
		cols: [ {id: 'time', label: 'Time', type: 'number'},
				{id: 'altitude_of_' + this.jumpNumber, label: 'Jump ' + this.jumpNumber, type: 'number'}]
	});
	dataTable.addRows(this.getData());
	
	return dataTable;
}
