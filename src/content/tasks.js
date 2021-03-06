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
	
	calcCost:function(ids, ministry, location, targetSpec) {
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

content.works.w_fire = {
	id:'w_fire',
	iconUrl:'res/icons/tasks.png',
	iconOffset:4,
	name:'Уволить',
	description:'Уволить данного специалиста. Он вернется в расположение исходного министерства.',
	target:1,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:true,
	type:['study'],
	updateInterval:utils.time2ms({date:1}),
	data:{
		string:'Уволить специалиста?',
	},
	
	noneCalcCost:function(ministry, location, targetSpec) {
		return {money:world.specs[ids[0]].attributes.payout*5, mainText:this.data.string};
	},
	calcCost:function(ids, ministry, location, targetSpec) {
		return {money:world.specs[ids[0]].attributes.payout*5, mainText:this.data.string};
	},
	requiments:function(spec, ministry, location, targetSpec) {
		if (spec.internalId == 'GB' || spec.ministry != game.player.ministry.id) return 0;
		return 100;
	},
	noneRequiments:function(ministry, location, targetSpec) {return 100;},
	massRequiments:function(ids, ministry, location, targetSpec) {return 100;},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		utils.fireSpec(t.workers[0], 1);
	},
	update:function(t) {
		utils.completeTask(t);
	},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};

content.works.w_fireFree = {
	id:'w_fireFree',
	iconUrl:'res/icons/tasks.png',
	iconOffset:4,
	name:'Уволить (без выплат)',
	description:'Уволить данного специалиста без каких-либо выплат. Он вернется в расположение исходного министерства. Негативно влияет на отношения с министерстврм.',
	target:1,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:true,
	type:[],
	updateInterval:360,
	data:{
		string:'Уволить специалиста?',
	},
	
	noneCalcCost:function(ministry, location, targetSpec) { 
		return {mainText:this.data.string};
	},
	calcCost:function(ids, ministry, location, targetSpec) {
		return {mainText:this.data.string};
	},
	requiments:function(spec, ministry, location, targetSpec) {
		if (spec.internalId == 'GB' || spec.ministry != game.player.ministry.id) return 0;
		return 100;
	},
	noneRequiments:function(ministry, location, targetSpec) {return 100;},
	massRequiments:function(ids, ministry, location, targetSpec) {return 100;},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(task) {return 0},
	whenComplete:function(t) {
		utils.fireSpec(t.workers[0], world.specs[t.workers[0]].attributes.involvement);
	},
	update:function(t) {
		utils.completeTask(t);
	},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};

content.works.w_healing = {
	id:'w_healing',
	iconUrl:'res/icons/tasks.png',
	iconOffset:1,
	name:'Лечение',
	description:'Лечение в медицинском центре Министерства Мира.',
	target:2,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:true,
	type:['relax'],
	updateInterval:utils.time2ms({date:1}),
	
	calcCost:function(ids, ministry, location, targetSpec) {
		let i=100*(world.specs[spec[0]].attributes.maxHealth-world.specs[spec[0]].attributes.health)-world.ministries.MoP.stats.loyalty*5;
		if (i<0) return {};
		return {money:i};
	},
	requiments:function(spec) {
		return parseInt(100-spec.attributes.health*100/spec.attributes.maxHealth);
	},
	whenStart:function(t) {return 0},
	whenStartPerSpec:function(t, spec) {
		t.target = spec.attributes.maxHealth;
		t.value = spec.attributes.health;
	},
	whenComplete:function(t) {return 0},
	update:function(t) {return 0},
	updatePerSpec:function(t, spec) {
		spec.attributes.health+=spec.attributes.maxHealth*0.1;
		if (spec.attributes.health>spec.attributes.maxHealth) spec.attributes.health = spec.attributes.maxHealth;
		t.value = spec.attributes.health;
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(t, spec) {
		if (spec.ministry == game.player.ministry) {
			let i = (50*(world.specs[spec[0]].attributes.maxHealth-world.specs[spec[0]].attributes.health)-500);
			if (i<0) i = 0;
			game.player.resources.money.value += i;
		}
	},
	whenFailed:function(taskId) {return 0}
};

content.works.w_movement = {
	id:'w_movement',
	iconUrl:'res/icons/tasks.png',
	iconOffset:3,
	name:'Перемещение',
	description:'Передислокация специалиста из одного города в другой',
	target:1,
	maxWorkers:-1,
	minWorkers:1,
	onlyOne:false,
	unstoppable:true,
	type:['travel'],
	updateInterval:utils.time2ms({hours:1}),
	data: {
		days:' дней',
	},
	
	
	noneCalcCost:function(ministry, location, targetSpec) {
		return {};
	},
	calcCost:function(ids, ministry, location, targetSpec) {
		let sp = this.massRequiments(ids, ministry, location);
		return {text: parseInt(world.roadmap[world.specs[ids[0]].location][location]*world.data.travelSpeed*100/sp/60/12)+this.data.days};
	},
	requiments:function(spec, ministry, location, targetSpec) {
		if (spec.location == location) return 0;
		if (spec.stats.specie == 2 || spec.stats.specie == 3) return 100;
		if (spec.stats.specie == 0) return 75;
		return 50;
	},
	noneRequiments:function(ministry, location, targetSpec) {
		return 100;
	},
	massRequiments:function(ids, ministry, location, targetSpec) {
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
		t.target = world.roadmap[spec.location][t.location]*world.data.travelSpeed;
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
	maxWorkers:-1,
	minWorkers:0,
	onlyOne:true,
	type:[],
	updateInterval:360,
	data:{
		string:'Нанять специалиста?',
	},
	
	noneCalcCost:function(ministry, location, targetSpec) {
		let m = world.ministries[targetSpec.ministry];
		let y = 10-m.specs.get(targetSpec.id);
		if (y<0) y = 0;
		let x = (98-m.stats.loyalty-(100-utils.getSpecSecrecy(targetSpec))*3);
		if (x<0) return {mainText:this.data.string};
		x = Math.pow(x, 2);
		return {money:parseInt(targetSpec.attributes.payout*x/10), mainText:this.data.string};
	},
	calcCost:function(spec, ministry, location, targetSpec) {
		let m = world.ministries[targetSpec.ministry];
		let y = 10-m.specs.get(targetSpec.id);
		if (y<0) y = 0;
		let x = (98-m.stats.loyalty-(100-utils.getSpecSecrecy(targetSpec))*3);
		if (x<0) return {mainText:this.data.string};
		x = Math.pow(x, 2);
		return {money:parseInt(targetSpec.attributes.payout*x/10), mainText:this.data.string};
	},
	noneRequiments:function(ministry, location, targetSpec) {
		let ts = world.specs[targetSpec];
		if (ts.ministry == game.player.ministry.id) return 0;
		if (world.ministries[ts.ministry].owner == targetSpec) return 0;
		if (utils.getSpecSecrecy(ts)>=93) return 0;
		return 100;
	},
	massRequiments:function(ids, ministry, location, targetSpec) {
		let ts = world.specs[targetSpec];
		if (ts.ministry == game.player.ministry.id) return 0;
		if (world.ministries[ts.ministry].owner == targetSpec) return 0;
		if (utils.getSpecSecrecy(ts)>=93) return 0;
		return 100;
	},
	requiments:function(spec) {
		return 100;
	},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {
		utils.spec2ministry(t.targetSpec, t.ministry);
		game.UI.bottomRenderCounter = 0;
	},
	update:function(t) {
		let s = world.specs[t.targetSpec];
		for (let i=0; i<s.tasks.length; i++) {
			utils.stopTask(world.tasks[s.tasks[i]],s,1);
		}
		utils.completeTask(t)
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
		return {money:parseInt(200*(50-world.ministries.MAS.stats.part)*(1.33-utils.getIntellect(world.specs[spec[0]])))};
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
		if (Math.random()*Math.random()*Math.random()*0.4 > utils.getIntellect(spec) && !luckCheck(spec, 0.5)) {
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
		return {money:parseInt(200*(50-world.ministries.MoA.stats.part)*(1.33-utils.getEndurance(world.specs[spec[0]])))};
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
		if (Math.random()*Math.random()*Math.random()*0.4 > utils.getEndurance(spec) && !luckCheck(spec, 0.5)) {
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
		else {
			utils.addNotify('specs', world.specs[t.workers[0]].id, 1, this.data.deadString);
			world.ministries[world.specs[t.workers[0]].ministry].resources.money.value += t.data.cost/2*t.value/t.target+1000;
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
		return {money:parseInt(200*(50-world.ministries.MI.stats.part)*(1.33-utils.getCharisma(world.specs[spec[0]])))};
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
	whenFailed:function(taskId) {return 0;}
};

content.works.w_watching = {
	id:'w_watching',
	iconUrl:'res/icons/tasks.png',
	iconOffset:3,
	name:'Наблюдение',
	description:'Незаметное наблюдение за целью. В случае, если специалист будет обнаружен, это может повлечь неприятные дипломатические последствия. ',
	target:100,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	updateInterval:utils.time2ms({hours:4}),
	type:['illegal'],
	data:{
		perkFound:'Обнаружен перк %perk% у %specname%'
	},
	
	noneCalcCost:function(ministry, location, targetSpec) {
		return {};
	},
	calcCost:function(ids, ministry, location, targetSpec) {
		return {};
	},
	noneRequiments:function(ministry, location, targetSpec) {
		let ts = world.specs[targetSpec];
		return (utils.getSpecSecrecy(ts)-30)/70*100;
	},
	massRequiments:function(ids, ministry, location, targetSpec) {
		let ts = world.specs[targetSpec];
		let chance = 100;
		//intellect checking
		let inta = utils.getActualIntellect(world.specs[ids[0]])/1000;
		if (inta>1) inta = 1;
		chance *= inta;
		
		//charisma checking
		let chara = utils.getActualCharisma(ts);
		if (utils.getSpecSecrecy(ts) > consts.visibility[2])
			chara = utils.getLevel(ts)*250;
		let i = utils.getActualCharisma(world.specs[ids[0]])/chara;
		
		//
		let x = ts.perks.get('p_prnc');
		if (x != ts.perks.length && ts.isPerkExplored[x]) chance *= 1.3;
		
		if (i>1) i = 1;
		return chance*i;
	},
	requiments:function(spec) {
		let chance = 100;
		//intellect checking
		let inta = utils.getActualIntellect(spec)/1000;
		if (inta>1) inta = 1;
		chance *= inta;
		
		//charisma checking
		return chance*utils.getCharisma(spec);
	},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {return 0},
	update:function(t) {return 0},
	updatePerSpec:function(t, spec) {
		let ts = world.specs[t.targetSpec];
		
		// проверка харизмы
		if (Math.random()*Math.random()*Math.random()*Math.random()*t.timeElapsed/1440 > (utils.getActualCharisma(spec)/utils.getActualCharisma(ts))) {
			utils.failTask(t);
		}
		
		//проверка интеллекта
		else if (Math.random()*Math.random()*Math.random()*Math.random() > (utils.getActualIntellect(spec)/1500)) {
			utils.failTask(t);
		}
		else {
			if (ts.ministry == game.player.ministry.id || (world.ministries[ts.ministry].stats.loyalty/100 > Math.random())) {
				let x = spec.perks.get('p_prnc');
				ts.attributes.secrecy/=(x!=spec.perks.length?1.12:1.07);
				if (ts.attributes.secrecy<0) ts.attributes.secrecy = 0;
				t.value = 70-ts.attributes.secrecy;
			}
		}
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(t) {
		let ts = world.specs[t.targetSpec];
		if (luckCheck(ts, 0.25)) return;
		if (t.ministry == game.player.ministry) {
			ts.attributes.worktypeSatisfatcion -= 50;
		}
		else {
			world.ministries[ts.ministry].stats.loyalty -= 15;
		}
		let u = utils.getActualEndurance(ts) - utils.getActualEndurance(world.specs[t.workers[0]]);
		if (u>0) {
			world.specs[t.workers[0]].attributes.health -= Math.random*(Math.sqrt(u/10));
		}
	}
};

content.works.w_dialogue = {
	id:'w_dialogue',
	iconUrl:'res/icons/tasks.png',
	iconOffset:4,
	name:'Общение',
	description:'Лично Ваша попытка поговорить с целью. ',
	target:1,
	maxWorkers:-1,
	minWorkers:0,
	onlyOne:true,
	updateInterval:20,
	type:[],
	data:{
		string:'Начать диалог? Возможно, Вам придется двигаться до цели.',
	},
	
	noneCalcCost:function(ministry, location, targetSpec) {
		return {};
	},
	calcCost:function(spec, ministry, location, targetSpec) {
		return {mainText:this.data.string};
	},
	noneRequiments:function(ministry, location, targetSpecId) {
		return ((world.specs[targetSpecId].dialState == undefined || world.specs[targetSpecId].dialState.dialogueId == undefined)?0:100);
	},
	massRequiments:function(ids, ministry, location, targetSpecId) {return 100;},
	requiments:function(spec) {return 100},
	whenStart:function(taskId) {
		let ts = world.specs[taskId.targetSpec];
		utils.startDialogue(ts, taskId);
	},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {return 0},
	update:function(t) {return 0},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};

content.works.w_helping = {
	id:'w_helping',
	iconUrl:'res/icons/tasks.png',
	iconOffset:7,
	name:'Курирование',
	description:'Текущая помощь министерству. Повышает характеристики министерства. Может влиять на характеристики города.',
	target:-1,
	maxWorkers:-1,
	minWorkers:1,
	onlyOne:true,
	updateInterval:utils.time2ms({date:1}),
	type:['help'],
	data:{
		ministryID:'',
		plur:'_',
		patternInit:function(min) {
			if (strings.useCases) this.name+=strings.cased.g.ministries[min];
			else this.name+=strings.ministries.name[min];
		},
		funcs:{
			MoA:function(t, u) {},
			MI: function(t, u) {},
			MoP:function(t, u) {},
			MAS:function(t, u) {},
			MWT:function(t, u) {},
			MoM:function(t, u) {}
		}
	},
	
	noneCalcCost:function(ministry, location, targetSpec) {return {};},
	calcCost:function(ids, ministry, location, targetSpec) {return {};},
	noneRequiments:function(ministry, location, targetSpec) {
		if (world.cities[location].ministriesPart[ministry]>0) return 100;
		return 0;
	},
	massRequiments:function(ids, ministry, location, targetSpec) {
		let u = 0;
		for (let i=0; i<ids.length; i++) {
			let s = world.specs[ids[i]];
			u+=utils.getActualIntellect(s)+utils.getActualCharisma(s)/2+utils.getActualEndurance(s)/2;
		}
		u/=(Math.pow(ids.length, 1.2)-ids.length)+1;
		let i = Math.pow(u, 0.5);
		if (i<19) return 0.1;
		return 100-1800/i;
	},
	requiments:function(spec) {
		let u = (Math.pow(utils.getActualIntellect(spec)+utils.getActualCharisma(spec)/2+utils.getActualEndurance(spec)/2, 0.5)*100/50);
		if (u>100) u = 100;
		return u;
	},
	whenStart:function(t) {},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {return 0},
	update:function(t) {
		let a = {
			u:0,
			as:0,
			ai:0,
			ac:0
		};
		for (let i=0; i<t.workers.length; i++) {
			let s = world.specs[t.workers[i]];
			a.u+=utils.getActualIntellect(s)+utils.getActualCharisma(s)/2+utils.getActualEndurance(s)/4;
			a.as+=utils.getActualEndurance(s);
			a.ai+=utils.getActualIntellect(s);
			a.ac+=utils.getActualCharisma(s);
		}
		a.u/=(Math.pow(t.workers.length, 1.2)-t.workers.length)+1;
		a.as/=(Math.pow(t.workers.length, 1.2)-t.workers.length)+1;
		a.ai/=(Math.pow(t.workers.length, 1.2)-t.workers.length)+1;
		a.ac/=(Math.pow(t.workers.length, 1.2)-t.workers.length)+1;
		let i = Math.pow(a.u, 0.333);
		let as = Math.pow(a.u, 0.1);
		
		console.log(a, i, as, this.data.ministryID, world.ministries[this.ministry].energy, world.ministries[this.ministry].stats.loyalty);
		
		world.ministries[this.ministry].stats.loyalty+=i*as/200;
		world.ministries[this.ministry].energy+=i*as;
		
		this.data.funcs[this.ministry](t, a);
	},
	updatePerSpec:function(t, spec) {
		if (Math.random() < utils.getIntellect(spec)) spec.stats.experience+=Math.random();
		if (Math.random() < utils.getEndurance(spec)) spec.attributes.workbalance++;
	},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(t) {}
};

function m_init() {
	let taskForEachMinistry = function(pattern, target) {
		for (let i=0; i<consts.actualMinistries.length; i++) {
			let s = pattern.id+pattern.data.plur+consts.actualMinistries[i];
			content.works[s] = {};
			for (let k in pattern) {
				if (k == 'data') {
					content.works[s].data = {};
					for (let u in pattern.data) {
						if (typeof pattern.data[u] == 'function') content.works[s].data[u] = pattern.data[u].bind(content.works[s]);
						else content.works[s].data[u] = pattern.data[u];
					}
				}
				else if (typeof pattern[k] == 'function') content.works[s][k] = pattern[k].bind(content.works[s]);
				else content.works[s][k] = pattern[k];
			}
			content.works[s].id = s;
			content.works[s].proto = pattern;
			content.works[s].data.ministryID = consts.actualMinistries[i];
			content.works[s].data.patternInit(consts.actualMinistries[i], s);
			content.worklists[target].push(content.works[s]);
		}
	};
	content.worklists.withSpec.push(content.works.w_studying);
	content.worklists.withSpec.push(content.works.w_healing);
	content.worklists.withSpec.push(content.works.w_intStudying);
	content.worklists.withSpec.push(content.works.w_endStudying);
	content.worklists.withSpec.push(content.works.w_chrStudying);
	content.worklists.withSpec.push(content.works.w_fire);
	content.worklists.withSpec.push(content.works.w_fireFree);
	
	content.worklists.perSpec.push(content.works.w_dialogue);
	content.worklists.perSpec.push(content.works.w_hire);
	content.worklists.perSpec.push(content.works.w_watching);
	
	content.worklists.perCity.push(content.works.w_movement);
	
	content.worklists.perMinistry.push(content.works.w_helping);
	//taskForEachMinistry(content.works.w_helping, 'perCity');
	
	return 0;
}