'use strict';
class work {
	constructor(taskId, specs, location, object, gottenId, startInterval) {
		this.value = 0;											//доля выполнения
		this.target = content.works[taskId].target;				//цель в количестве
		this.timeBeforeUpdate = startInterval;					//время до обновления
		this.timeElapsed = 0;									//прошло времени
		this.workers = specs;								
		this.location = location;
		this.object = object;
		this.id = taskId;
		this.internalId = gottenId;
		this.status = '';
		this.hasStarted = false;
		this.hasStartedPerSpec = [];
		this.data = {};
	}
}

class workPattern {
	constructor() {
		this.iconUrl = '';
		this.iconOffset = 0;
		this.name = '';
		this.description = '';
		
		this.target = 0;										//цель в количестве			
		this.maxWorkers = 0;
		this.minWorkers = 0;			
		this.updateInterval = 0;
		this.stopable = true;		
		this.workSeparate = false;
		this.onlyOne = false;
		
		this.calcCost = function(spec, object, location) {return {};};	//стоимость в любых применимых попугаях
		this.requiments = function(spec) {return 0;};			//проверяет пригодность специалиста. 1~100 выдаст в процентах эффективность, отрицательное и 0 - негоден
		this.whenStart = function(task) {return 0;};
		this.whenStartdPerSpec = function(task, worker) {return 0;};
		this.whenComplete = function(task) {return 0;};
		this.update = function(task) {return 0;};
		this.updatePerSpec = function(task, worker) {return 0};
		this.whenFailed = function(task) {return 0;};
		this.whenStopPerSpec = function(task, worker) {return 0;};
		this.whenStop = function(task) {return 0;};
	}
}