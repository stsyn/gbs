'use strict',
content.works.w_sys_relaxing = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:0,
	id:'w_sys_relaxing',
	name:'Отдых',
	type:['relax']
};

content.works.w_sys_dead = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:0,
	id:'w_sys_dead',
	name:'Мертв',
	type:[]
};

content.works.w_sys_companyHandler = {
	id:'w_sys_companyHandler',
	iconUrl:'res/icons/tasks.png',
	iconOffset:3,
	name:'Ожидание',
	description:'Специалист ожидает введения в курс дела остальными специалистами.',
	target:1,
	maxWorkers:0,
	minWorkers:1,
	onlyOne:false,
	updateInterval:1,
	type:[],
	data:{},
	
	calcCost:function(spec, ministry, location) {return {};},
	requiments:function(spec) {return 100;},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {
		if (world.tasks[t.data.taskId] == undefined) return;
		for (let i=0; i<t.workers.length; i++) {
			world.specs[t.workers[i]].tasks.unshift(t.data.taskId);
			world.tasks[t.data.taskId].workers.push(t.workers[i]);
		}
		//utils.removeTask(t);
	},
	update:function(t) {utils.completeTask(t)},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
}

content.works.w_studying = {
	id:'w_studying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Быстрые курсы',
	description:'Двухнедельные курсы начальной подготовки. Дают лишь самые основы, поэтому бесполезны для опытных специалистов.',
	target:14,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	type:['study'],
	updateInterval:utils.time2ms({date:1}),
	
	calcCost:function(spec, ministry, location) {
		return {money:1000};
	},
	requiments:function(spec) {
		return parseInt(-40+60*(3-utils.getLevel(spec)));
	},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		world.specs[t.workers[0]].stats.experience+=150;
	},
	update:function(t) {
		world.specs[t.workers[0]].stats.experience+=5;
		if (world.specs[t.workers[0]].attributes.secrecy>50) world.specs[t.workers[0]].attributes.secrecy--;
		t.value++;
	},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};

content.works.w_movement = {
	id:'w_movement',
	iconUrl:'res/icons/tasks.png',
	iconOffset:3,
	name:'Перемещение',
	description:'Передислокация специалиста из одного города в другой',
	target:1,
	maxWorkers:0,
	minWorkers:1,
	onlyOne:false,
	//unstoppable:true,
	type:['travel'],
	updateInterval:utils.time2ms({hours:1}),
	data: {
		days:' дней',
	},
	
	calcCost:function(ids, ministry, location) {
		let sp = this.massRequiments(ids, ministry, location);
		return {text: parseInt(content.roadmap[world.specs[ids[0]].location][location]*world.data.travelSpeed*100/sp/60/12)+this.data.days};
	},
	requiments:function(spec, ministry, location) {
		if (spec.location == location) return 0;
		if (spec.stats.specie == 2 || spec.stats.specie == 3) return 100;
		if (spec.stats.specie == 0) return 75;
		return 50;
	},
	massRequiments:function(ids, ministry, location) {
		let s = world.specs[ids[0]].location;
		let i = 100;
		for (let j=0; j<ids.length; j++) {
			if (s != world.specs[ids[j]].location) return 0;
			if (i>this.requiments(world.specs[ids[j]], ministry, location)) i=this.requiments(world.specs[ids[j]], ministry, location)
		}
		return i;
	},
	whenStart:function(t) {
		t.data.speed = this.massRequiments(t.workers, t.ministry, t.location);
	},
	whenStartPerSpec:function(t, spec) {
		t.target = content.roadmap[spec.location][t.location]*world.data.travelSpeed;
	},
	whenComplete:function(t) {
		for (let i=0; i<t.workers.length; i++)
			world.specs[t.workers[i]].location = t.location;
	},
	update:function(t) {
		t.value+=60*t.data.speed/100;
	},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};

content.works.w_hire = {
	id:'w_hire',
	iconUrl:'res/icons/tasks.png',
	iconOffset:4,
	name:'Найм',
	description:'Нанять специалиста на постоянной основе.',
	target:1,
	maxWorkers:0,
	minWorkers:1,
	onlyOne:false,
	updateInterval:1,
	data:{
		string:'Нанять специалиста?'
	},
	
	calcCost:function(spec, ministry, location) {
		let x = (98-world.ministries[spec[0].ministry].stats.loyalty-(100-utils.getSpecSecrecy(spec[0]))*3);
		if (x<0) return {text:this.data.string};
		x = Math.pow(x, 2);
		return {money:parseInt(spec[0].attributes.payout*x/10), text:this.data.string};
	},
	requiments:function(spec) {
		if (spec.ministry == game.player.ministry.id) return 0;
		if (world.ministries[spec.ministry].owner == spec.id) return 0;
		if (utils.getSpecSecrecy(spec)>=93) return 0;
		return 100;
	},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {
		utils.spec2ministry(t.workers[0], t.ministry);
		game.UI.bottomRenderCounter = 0;
	},
	update:function(t) {utils.completeTask(t)},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};

content.works.w_intStudying = {
	id:'w_intStudying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Специализированные курсы',
	description:'Месячный курс научных лекций и семинарских занятий при Министерстве Тайных Наук.',
	target:30,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	type:['study'],
	updateInterval:utils.time2ms({date:1}),
	
	data:{
		failString:'В связи с неуспеваемостью в дальнейшем обучении было отказано.'
	},
	
	calcCost:function(spec, ministry, location) {
		return {money:parseInt(1000*(50-world.ministries.MAS.stats.part)*(1.33-utils.getIntellect(spec[0])))};
	},
	requiments:function(spec) {
		if (utils.getLevel(spec) < 2) return -1;
		let c = (utils.getIntellect(spec)<.25?
		utils.getIntellect(spec)*4:
		1-(utils.getIntellect(spec)-0.1)*4/3);
		if (utils.getLevel(spec) <= 4) return parseInt(33.333*(utils.getLevel(spec)-1)*c);
		return parseInt(33.333*(8-utils.getLevel(spec))*c);
	},
	whenStart:function(task) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		world.specs[t.workers[0]].stats.experience+=500*utils.getIntellect(world.specs[t.workers[0]]);
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	update:function(t) {return 0;},
	updatePerSpec:function(t, spec) {
		if (spec.attributes.secrecy>25) spec.attributes.secrecy--;
		if (Math.random()*Math.random()*Math.random()*0.4 > utils.getIntellect(spec)) {
			utils.failTask(t);
			return;
		}
		t.effectiency = this.requiments(spec);
		spec.stats.experience+=10;
		for (let i=0; i<parseInt(t.effectiency/10)+1; i++) {
			if (Math.random() > utils.getIntellect(spec)) {
				spec.stats.intellect++;
			}
		}
		t.value++;
	},
	whenFailed:function(t) {
		utils.addNotify('specs', world.specs[t.workers[0]].id, 1, this.data.failString);
	}
};

content.works.w_endStudying = {
	id:'w_endStudying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Военная подготовка',
	description:'Месячные военные сборы при Министерстве Крутости. Оформляется обязательная страховка на случай серьезных травм.',
	target:30,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	type:['study'],
	updateInterval:utils.time2ms({date:1}),
	
	data:{
		failString:'Освобожден от занятий по состоянию здоровья.',
		deadString:'Погиб в результате несчастного случая на тренировках.'
	},
	
	calcCost:function(spec, ministry, location) {
		return {money:parseInt(1000*(50-world.ministries.MoA.stats.part)*(1.33-utils.getEndurance(spec[0])))};
	},
	requiments:function(spec) {
		if (spec.attributes.health/spec.attributes.maxHealth <= 0.20) return -1;
		if (utils.getLevel(spec) < 2) return -1;
		let c = (utils.getEndurance(spec)<.25?
		utils.getEndurance(spec)*4:
		1-(utils.getEndurance(spec)-0.1)*4/3);
		if (utils.getLevel(spec) <= 4) return parseInt(33.333*(utils.getLevel(spec)-1)*c);
		return parseInt(33.333*(8-utils.getLevel(spec))*c);
	},
	whenStart:function(task) {return 0},
	whenStartPerSpec:function(task) {
		task.data.cost = this.calcCost(world.specs[task.workers[0]]);
	},
	whenComplete:function(t) {
		world.specs[t.workers[0]].stats.experience+=500*utils.getEndurance(world.specs[t.workers[0]]);
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	update:function(t) {return 0;},
	updatePerSpec:function(t, spec) {
		if (spec.attributes.secrecy>25) spec.attributes.secrecy--;
		t.value++;
		if (Math.random()*Math.random()*Math.random()*0.4 > utils.getEndurance(spec)) {
			spec.attributes.health -= parseInt(Math.random()*Math.random()*10);
			if (spec.attributes.health/spec.attributes.maxHealth<=0.20) utils.failTask(t);
		}
		t.effectiency = this.requiments(spec);
		spec.stats.experience+=10;
		for (let i=0; i<parseInt(t.effectiency/10)+1; i++) {
			if (Math.random() > utils.getEndurance(spec)) {
				spec.stats.endurance++;
			}
		}
	},
	whenFailed:function(t) {
		if (world.specs[t.workers[0]].attributes.health > 0) {
			utils.addNotify('specs', world.specs[t.workers[0]].id, 1, this.data.failString);
			world.ministries[world.specs[t.workers[0]].ministry].resources.money.value += t.data.cost/2*t.value/t.target;
		}
	}
};

content.works.w_chrStudying = {
	id:'w_chrStudying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Ораторские курсы',
	description:'Месячные курсы актерского и ораторского мастерства при Министерстве Стиля.',
	target:30,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	type:['study'],
	updateInterval:utils.time2ms({date:1}),
	
	calcCost:function(spec, ministry, location) {
		return {money:parseInt(1000*(50-world.ministries.MI.stats.part)*(1.33-utils.getCharisma(spec[0])))};
	},
	requiments:function(spec) {
		if (utils.getLevel(spec) < 2) return -1;
		let c = (utils.getCharisma(spec)<.25?
		utils.getCharisma(spec)*4:
		1-(utils.getCharisma(spec)-0.1)*4/3);
		if (utils.getLevel(spec) <= 4) return parseInt(33.333*(utils.getLevel(spec)-1)*c);
		return parseInt(33.333*(8-utils.getLevel(spec))*c);
	},
	whenStart:function(task) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		world.specs[t.workers[0]].stats.experience+=500*utils.getCharisma(world.specs[t.workers[0]]);
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	update:function(t) {return 0;},
	updatePerSpec:function(t, spec) {
		if (spec.attributes.secrecy>25) spec.attributes.secrecy--;
		if (Math.random()*Math.random()*Math.random()*0.4 > utils.getCharisma(spec)) {
			world.ministries.MI.attributes.loyalty -= 2;
		}
		t.effectiency = this.requiments(spec);
		spec.stats.experience+=10;
		for (let i=0; i<parseInt(t.effectiency/10)+1; i++) {
			if (Math.random() > utils.getCharisma(spec)) {
				spec.stats.charisma++;
			}
		}
		t.value++;
	},
	whenFailed:function(taskId) {
		utils.addNotify('specs', world.specs[t.workers[0]].id, 1, this.data.failString.replace('%spec%', world.specs[t.workers[0]].stats.name));
	}
};

function m_init() {
	content.worklists.withSpec.push(content.works.w_studying);
	content.worklists.withSpec.push(content.works.w_intStudying);
	content.worklists.withSpec.push(content.works.w_endStudying);
	content.worklists.withSpec.push(content.works.w_chrStudying);
	content.worklists.perSpec.push(content.works.w_hire);
	content.worklists.perCity.push(content.works.w_movement);
	
	return 0;
}