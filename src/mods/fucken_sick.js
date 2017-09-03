// w/ <3 — oldee
// fuk utube — stsyn
plapi.mods.push(function() {
	let whats_wrong_with_you_youtube = function () {
		player.loadPlaylist({list:'PLcHa462awHPlRxfq9Y17FwtBKXtsWNozR'});
		setTimeout(function() {
			if (player.getPlaylist() == null) whats_wrong_with_you_youtube();
			else {
				player.setShuffle(plapi.random);
				playerSetPlaying();
				player.nextVideo();
			}
		}, 2000)
	};
	whats_wrong_with_you_youtube();
});

content.perks.perkVarPool.push({
    id:'pv_you_are_fucking_drunk_bastard',
    chanceCalc: function(world,spec) {return 100;},
    list:['p_drnk']
});

content.works.w_rum_rum_rum = {
	id:'w_rum_rum_rum',
	iconUrl:'src/mods/drunk.png',
	iconOffset:0,
	name:'Бухать',
	description:'...',
	target:6,
	maxWorkers:1,
	minWorkers:1,
	onlyOne:false,
	unstoppable:true,
	updateInterval:360,
	
	calcCost:function(spec, ministry, location) {return {}},
	requiments:function(spec) {
		if (spec.internalId == 'GB') return 50;
		return 100;
	},
	whenStart:function(taskId) {return 0},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {return 0},
	update:function(t) {
		t.value++;
		world.specs[t.workers[0]].attributes.health++;
		if (Math.random()<0.6) world.specs[t.workers[0]].attributes.health-= parseInt(Math.random()*Math.random()*Math.random()*9)+1;
		if (world.specs[t.workers[0]].attributes.health>world.specs[t.workers[0]].attributes.maxHealth)
			world.specs[t.workers[0]].attributes.health = world.specs[t.workers[0]].attributes.maxHealth;
	},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(taskId) {return 0;},
	whenFailed:function(taskId) {return 0}
};


content.works.w_rum_rum_rum_rum_rum_rum = {
	id:'w_rum_rum_rum_rum_rum_rum',
	iconUrl:'src/mods/drunk.png',
	iconOffset:0,
	name:'Бухать толпой',
	description:'Пир на весь мир',
	target:-1,
	maxWorkers:-1,
	minWorkers:2,
	onlyOne:true,
	unstoppable:false,
	updateInterval:360,
	data:{
		has:'Пир уже происходит в ',
		h2:'. Вы не можете устроить второй такой же!'
	},
	
	calcCost:function(spec, ministry, location) {
		let t = utils.getTaskById(this.id);
		if (t!=undefined) {
			return {text:this.data.has+content.cities[t.location].name+this.data.h2}
		}
		return {}
	},
	massRequiments:function(spec) {
		let t = utils.getTaskById(this.id);
		if (t!=undefined) {
			return 0;
		}
		return 100;
	},
	requiments:function(spec) {
		let i;
		for (i=0; i<world.tasks.length; i++) {
			if (world.tasks[i] == undefined) continue;
			if (world.tasks[i].id == this.id) break;
		}
		if (i == world.tasks.length) return 100;
		let w = world.tasks[i];
		if (w.data.specs == undefined) return 100;
		for (i=0; i<w.workers.length; i++) {
			if (w.workers[i] == undefined) continue;
			if (w.workers[i] == spec.id) break;
		}
		if (i == w.workers.length) return 100;
		if (w.data.specs[i] == undefined) return 100;
		return 100-w.data.specs[i]*10;
	},
	whenStart:function(t) {
		t.data.specs=[];
	},
	whenStartPerSpec:function(t, spec) {return 0},
	whenComplete:function(t) {return 0},
	update:function(t) {
		t.workers.forEach (function (w, i, a) {
			if (t.data.specs[i] == undefined) t.data.specs[i] = 0;
			else t.data.specs[i]++;
		});
	},
	updatePerSpec:function(task, worker) {return 0},
	whenStopped:function(taskId) {return 0;},
	whenStoppedPerSpec:function(t, spec) {
		let i=0;
		for (i=0; i<t.workers.length; i++) {
			if (t.workers[i] == undefined) continue;
			if (t.workers[i] == spec.id) break;
		}
		console.log(i);
		t.data.specs.splice(i,1);
	},
	whenFailed:function(taskId) {return 0}
};

content.worklists.withSpec.push(content.works.w_rum_rum_rum);
content.worklists.perCity.push(content.works.w_rum_rum_rum_rum_rum_rum);

content.perks.c.p_drnk.onIdleTick = function(spec) {
	if (Math.random() < 0.05) {
		let t = utils.getTaskById('w_rum_rum_rum_rum_rum_rum');
		if (t!=undefined) {
			if (Math.random()/world.roadmap[spec.location][t.location] > 0.5) {
				utils.startTask(content.works.w_sys_companyHandler, [spec.id], t.ministry, t.targetSpec, t.location);
				for (let i=0; i<world.tasks.length; i++) {
					if (world.tasks[i] == undefined) continue;
					if (world.tasks[i].id != 'w_sys_companyHandler') continue;
					if (world.tasks[i].data.taskId == undefined) {
						world.tasks[i].data.taskId = t.internalId;
						break;
					};
				}
				return;
			}
		}
		utils.startTask(content.works.w_rum_rum_rum, [spec.id], spec.ministry, undefined, spec.location);
	}
}