'use strict';
class work {
	constructor(taskId, specs, location, object, targetSpec, gottenId, startInterval) {
		this.value = 0;											//доля выполнения
		this.target = content.works[taskId].target;				//цель в количестве
		this.timeBeforeUpdate = startInterval;					//время до обновления
		this.timeElapsed = 0;									//прошло времени
		this.workers = specs;								
		this.location = location;
		this.ministry = object;
		this.targetSpec = targetSpec;
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
		this.workSeparate = false;
		this.unstopable = true;		
		this.onlyOne = false;
		this.type = [];
		
		this.calcCost = function(ids, ministry, location, targetSpec) {return {};};	//стоимость в любых применимых попугаях
		this.noneCalcCost = function(ministry, location, targetSpec) {return {};};	//для массовых заданий, минимальная стоимость
		
		this.noneRequiments = function(ministry, location, targetSpec) {return 0;}; //для массовых заданий, когда никто не выбран
		this.massRequiments = function(ids, ministry, location, targetSpec) {return 0;};		//для массовых заданий, проверка готовности
		this.requiments = function(spec, ministry, location, targetSpec) {return 0;};			//проверяет пригодность специалиста. 1~100 выдаст в процентах эффективность, отрицательное и 0 - негоден
		
		this.whenStart = function(task) {};
		this.whenStartPerSpec = function(task, spec) {};
		this.whenComplete = function(task) {};
		this.update = function(task) {};
		this.updatePerSpec = function(task, spec) {};
		this.whenFailed = function(task) {};
		this.whenStopPerSpec = function(task, spec) {};
		this.whenStop = function(task) {};
	}
}