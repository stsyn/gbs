'use strict',
content.works.w_sys_relaxing = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:0,
	taskId:'w_sys_relaxing',
	name:'Отдых'
};

content.works.w_studying = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Быстрые курсы',
	description:'',
	target:15,
	maxWorkers:1,
	updateInterval:utils.time2ms({date:1}),
	
	calcCost:function(spec, ministry, location) {
		return {money:1000};
	},
	requiments:function(spec) {
		return parseInt(33.333*(3-utils.getLevel(spec)));
	},
	whenStart:function() {return 0},
	whenComplete:function() {
		world.specs[this.workers[0]].stats.experience+=150;
	},
	update:function() {
		world.specs[this.workers[0]].stats.experience+=5;
		this.value++;
	},
	whenStopped:function() {return 0;},
	whenFailed:function() {return 0}
};

content.works.w_intStudying = {
	iconUrl:'res/icons/tasks.png',
	iconOffset:2,
	name:'Специализированные курсы',
	description:'',
	target:30,
	maxWorkers:1,
	updateInterval:utils.time2ms({date:3}),
	
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
	whenStart:function() {return 0},
	whenComplete:function() {
		world.specs[this.workers[0]].stats.experience+=1000*utils.getIntellect(world.specs[this.workers[0]]);
	},
	whenStopped:function() {return 0;},
	update:function() {
		let spec = world.specs[this.workers[0]];
		spec.stats.experience+=10;
		for (let i=0; i<parseInt(this.effectiency/10)+1; i++) {
			if (Math.random() > utils.getIntellect(spec)) {
				let prop = utils.getCharisma(spec)/utils.getEndurance(spec);
				spec.stats.intellect++;
				spec.stats.endurance-= 1/prop;
				spec.stats.charisma-= prop;
			}
		}
		this.value++;
	},
	whenFailed:function() {return 0}
};

function m_init() {
	content.worklists.perSpec.push(content.works.w_studying);
	content.worklists.perSpec.push(content.works.w_intStudying);
	
	return 0;
}