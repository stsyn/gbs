'use strict',
content.works.w_sys_relaxing = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:0,
	id:'w_sys_relaxing',
	name:'Отдых'
};

content.works.w_sys_dead = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:0,
	id:'w_sys_dead',
	name:'Мертв'
};

content.works.w_studying = {
	id:'w_studying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Быстрые курсы',
	description:'',
	target:14,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	updateInterval:utils.time2ms({date:1}),
	
	calcCost:function(spec, ministry, location) {
		return {money:1000};
	},
	requiments:function(spec) {
		return parseInt(33.333*(3-utils.getLevel(spec)));
	},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		world.specs[t.workers[0]].stats.experience+=150;
	},
	update:function(t) {
		world.specs[t.workers[0]].stats.experience+=5;
		t.value++;
	},
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
	description:'',
	target:30,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	updateInterval:utils.time2ms({date:2}),
	
	calcCost:function(spec, ministry, location) {
		return {money:parseInt(1000*(50-world.ministries.MAS.stats.part)*(1.33-utils.getIntellect(spec)))};
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
		if (Math.random()*Math.random()*Math.random()*0.4 < utils.getIntellect(spec)) {
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
	whenFailed:function(taskId) {return 0}
};

content.works.w_endStudying = {
	id:'w_endStudying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Военная подготовка',
	description:'',
	target:30,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	updateInterval:utils.time2ms({date:2}),
	
	calcCost:function(spec, ministry, location) {
		return {money:parseInt(1000*(50-world.ministries.MoA.stats.part)*(1.33-utils.getEndurance(spec)))};
	},
	requiments:function(spec) {
		if (utils.getLevel(spec) < 2) return -1;
		let c = (utils.getEndurance(spec)<.25?
		utils.getEndurance(spec)*4:
		1-(utils.getEndurance(spec)-0.1)*4/3);
		if (utils.getLevel(spec) <= 4) return parseInt(33.333*(utils.getLevel(spec)-1)*c);
		return parseInt(33.333*(8-utils.getLevel(spec))*c);
	},
	whenStart:function(task) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		world.specs[t.workers[0]].stats.experience+=500*utils.getEndurance(world.specs[t.workers[0]]);
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	update:function(t) {return 0;},
	updatePerSpec:function(t, spec) {
		if (Math.random()*Math.random()*Math.random()*0.4 < utils.getEndurance(spec)) {
			spec.attributes.health -= parseInt(Math.random()*Math.random()*10);
			if (spec.attributes.health<=0) return;
		}
		t.effectiency = this.requiments(spec);
		spec.stats.experience+=10;
		for (let i=0; i<parseInt(t.effectiency/10)+1; i++) {
			if (Math.random() > utils.getEndurance(spec)) {
				spec.stats.endurance++;
			}
		}
		t.value++;
	},
	whenFailed:function(taskId) {return 0}
};

content.works.w_chrStudying = {
	id:'w_chrStudying',
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Актерские курсы',
	description:'',
	target:30,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	updateInterval:utils.time2ms({date:2}),
	
	calcCost:function(spec, ministry, location) {
		return {money:parseInt(1000*(50-world.ministries.MI.stats.part)*(1.33-utils.getCharisma(spec)))};
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
		if (Math.random()*Math.random()*Math.random()*0.4 < utils.getCharisma(spec)) {
			/*spec.attributes.health -= parseInt(Math.random() * 10);
			if (spec.attributes.health<=0) return;*/
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
	whenFailed:function(taskId) {return 0}
};

function m_init() {
	content.worklists.withSpec.push(content.works.w_studying);
	content.worklists.withSpec.push(content.works.w_intStudying);
	content.worklists.withSpec.push(content.works.w_endStudying);
	content.worklists.withSpec.push(content.works.w_chrStudying);
	
	return 0;
}