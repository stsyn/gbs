'use strict';
class work {
	constructor(taskId, specs, location, ministry) {
		this.value = 0;											//доля выполнения
		this.target = content.tasks[taskId].target;				//цель в количестве
		this.timeBeforeUpdate = work[id].updateInterval;		//время до обновления
		this.timeElapsed = 0;									//прошло времени
		this.workers = specs;								
		this.location = location;
		this.ministry = ministry;
		this.workId = taskId;
		this.status = '';
		this.effectiency = 0;									//от 0 до 100
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
		this.updateInterval = 0;
		this.stopable = true;								
		
		this.calcCost = function(spec, ministry, location) {return {};};	//стоимость в любых применимых попугаях
		this.requiments = function(spec) {return 0;};			//проверяет пригодность специалиста. 1~100 выдаст в процентах эффективность, отрицательное и 0 - негоден
		this.whenStart = function() {return 0;};
		this.whenComplete = function() {return 0;};
		this.update = function() {return 0;};
		this.whenFailed = function() {return 0;};
		this.whenStopped = function() {return 0;};
	}
}