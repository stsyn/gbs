"use strict";
function consts_proto() {
	this.baseSpeed = 48;
	this.fps = 30;
	this.gameSpeed = [0, this.baseSpeed/3, this.baseSpeed, this.baseSpeed*4] //per second
	this.specUpdateInterval = 12*60;
	this.sleepOverWork = 4;
	this.workOverflow = 6;
	this.maxNotifies = 50;
	
	this.nextLevel = [200,600,1600,3200,6200,10600,18000,28400,45000]; //+200 +400 +600+400 +800+800 +1000+1200+800 +1200+1600+1600 +1400+2000+2400+1600 +1600+2400+3200+3200 +1800+2800+4000+4800+3200
	this.maxLevel = this.nextLevel.length;
	this.ministries = ['OIA','MAS','MI','MoP','MoA','MWT','MoM','Z','EQ'];
	this.species = ['earthpony', 'unicorn', 'pegasus', 'alicorn', 'zebra'];
	this.speciesNameGenerFunction = ['generateName', 'generateName', 'generateName', 'generateName', 'generateZebraName']
	this.gender = ['r', 'm', 'f', 'u']
};
var consts = new consts_proto();
var utils = {
	saveWorld(silent) {
		try {
			localStorage._gbs_world = JSON.stringify(world);
			return 0;
		}
		catch (ex) {
			if (!silent) utils.callPopup({text:'Cannot save world.<br>'+ex, id:'save_error', buttons:[{
				text:'OK',
				callback: function() {utils.closePopup('save_error')}
			},{
				text:'Save to URL',
				callback: utils.saveWorld2Url
			}]});
			console.log('Cannot save world. \n'+ex);
			return 1;
		}
	},
	
	saveWorld2Url() {
		utils.callPopup({
			text:'Ввиду отсутствия доступа к локальному хранилищу, данные сохранены в ссылке. Скопируйте из нее адрес (обычно ПКМ -> Скопировать адрес) и сохраните в любом удобном для вас месте. Запустите игру, вставив тот адрес.',
			id:'manualSaving',
			buttons:[{
				text:'Скопируйте адрес здесь',
				callback:function() {},
				href:'game.html#'+encodeURI(JSON.stringify(world))
			},{
				text:'Выйти',
				callback:function() {history.back()} 
			}
			]
		});
	},
	
	saveAndQuit() {
		if (world.config.urlHack) {
			utils.saveWorld2Url();
		}
		else {
			if (!utils.saveWorld(false)) history.back();
		}
	},
	
	getTime(time) {
		let t = '';
		let d = new Date(parseInt(time * 120000));
		t += ((parseInt(time/60) % 12)<10?'0'+(parseInt(time/60) % 12):(parseInt(time/60) % 12)) + ':';
		t += ((parseInt(time) % 60)<10?'0'+(parseInt(time) % 60):(parseInt(time) % 60)) + ' ';
		t += (d.getUTCDate()<10?('0'+d.getUTCDate()):d.getUTCDate()) + '/';
		t += (d.getUTCMonth()+1<10?('0'+(d.getUTCMonth()+1)):d.getUTCMonth()+1) + '/';
		t += (d.getUTCFullYear()%100);
		return t;
	},
	
	time2ms(time) {
		if (time == undefined) return 0;
		if (time.year == null) time.year = 0;
		if (time.month == null) time.month = 0;
		if (time.date == null) time.date = 0;
		if (time.hours == null) time.hours = 0;
		if (time.minutes == null) time.minutes = 0;
		if (time.ms != null) return time.ms;
		let t = new Date(time.year+1970, time.month, time.date+1);
		time.hours-=t.getTimezoneOffset()/120;
		t = t.getTime();
		t = parseInt(t/120000);
		t+=time.minutes;
		t+=time.hours*60;
		return t;
	},
	
	changeSpeed(tid) {
		for (let i=0; i<document.querySelectorAll('#top .ico1').length; i++) {
			if (i != tid) document.querySelectorAll('#top .ico1')[i].classList.remove('sel'); 
			else {
				document.querySelectorAll('#top .ico1')[i].classList.add('sel'); 
				world.currentSpeed = document.querySelectorAll('#top .ico1').length-i-1;
			}
		}
	},
		
	addNotify(target, id, level, text) {
		let i, local = false;
		i = world.lastMessageId % consts.maxNotifies;
		if (world.lastMessageId >= consts.maxNotifies) {
			let u = world.messages[i];
			for (let j=0; j<u.containerId.length; j++) {
				let k;
				for (k=0; k<world[u.containerType][u.containerId[j]].messages.length; k++) 
					if (world[u.containerType][u.containerId[j]].messages[k] == u.id) break;
				world[u.containerType][u.containerId[j]].messages.splice(k, 1);
			}
		}
		world.messages[i] = new message(target, id, level, text, world.lastMessageId);
		world.lastMessageId++;
		if (target == 'specs') for (i=0; i<id.length; i++) if (id[i] == game.UI.currentSpec.id) {
			local = true;
			break;
		}
		for (i=0; i<id.length; i++) {
			if (world[target][id[i]].notifyLevel == -1) world[target][id[i]].notifyLevel = level;
			else if (world[target][id[i]].notifyLevel>level) world[target][id[i]].notifyLevel = level;
		}
		if (local) setTimeout(function() {game.UI.tryReadMessages(game.UI.currentSpec)}, 3000);
	},
	
	getMessage(id) {
		for (let i=0; i<world.messages.length; i++) if (id == world.messages[i].id) return world.messages[i];
	},
	
	getMessageFullText(id) {
		let m = utils.getMessage(id), s='';
		for (let i=0; i<m.containerId.length; i++) {
			if (i==0) s+=world.specs[m.containerId[i]].stats.name;
			else s+=', '+world.specs[m.containerId[i]].stats.name;
		}
		return s+' ['+utils.getTime(m.date)+'] '+m.text;
	},
	
	statsSum(spec) {return spec.stats.charisma+spec.stats.intellect+spec.stats.endurance},
	
	levelAmplifier(spec) {return 1024*Math.pow(utils.getLevel(spec),1.25)},
	
	levelPercent(spec) {
		let u = (spec.stats.level>=consts.maxLevel?100:spec.stats.experience*100/consts.nextLevel[spec.stats.level]);
		return (u>100?100:u);
	},
	
	getCharisma(spec) {return spec.stats.charisma/utils.statsSum(spec)},
	
	getIntellect(spec) {return spec.stats.intellect/utils.statsSum(spec)},
	
	getEndurance(spec) {return spec.stats.endurance/utils.statsSum(spec)},
	
	getClass(spec) {
		if (utils.getCharisma(spec) > 0.55) return 0;
		if (utils.getIntellect(spec) > 0.55) return 1;
		if (utils.getEndurance(spec) > 0.55) return 2;
		if ((utils.getIntellect(spec)+utils.getEndurance(spec) > 0.75) || (utils.getCharisma(spec)+utils.getEndurance(spec) > 0.75) || (utils.getCharisma(spec)+utils.getIntellect(spec) > 0.75)) {
			let mx = (utils.getIntellect(spec)+utils.getEndurance(spec)), id=0;
			if (utils.getCharisma(spec)+utils.getEndurance(spec) > mx) {
				id = 1;
				mx = utils.getCharisma(spec)+utils.getEndurance(spec);
			}
			if (utils.getCharisma(spec)+utils.getIntellect(spec) > mx) return 5;
			if (id == 1) return 4;
			return 3;
		}
		return 6;
	},
	
	getClassName(spec) {
		return strings.classes[utils.getClass(spec)];
	},
	
	getLevel(spec) {return spec.stats.level+1},
	
	getActualCharisma(spec) {return parseInt(Math.pow(utils.getCharisma(spec),1.5)*utils.levelAmplifier(spec))},
	
	getActualIntellect(spec) {return parseInt(Math.pow(utils.getIntellect(spec),1.5)*utils.levelAmplifier(spec))},
	
	getActualEndurance(spec) {return parseInt(Math.pow(utils.getEndurance(spec),1.5)*utils.levelAmplifier(spec))},
	
	getSatisfaction(spec) {
		let i, s=spec.shadow.workSatisfactionMult+spec.shadow.workTypeSatisfactionMult+spec.shadow.payoutSatisfactionMult;
		i = parseInt(
			spec.attributes.workSatisfaction*spec.shadow.workSatisfactionMult*(spec.attributes.workSatisfaction<0?spec.shadow.workPenaltyMult:spec.shadow.relaxSatisfactionMult)/s + 
			spec.attributes.worktypeSatisfaction*spec.shadow.workTypeSatisfactionMult/s +
			spec.attributes.payoutSatisfaction*spec.shadow.payoutSatisfactionMult/s
			) + spec.shadow.satisfactionBonus;
		i = parseInt((i+70)/2);
		if (i>100) i=100;
		if (i<0) i=0;
		return i;
	},
	
	getLoyalty(spec) {
		let i, s=spec.shadow.satisfactionLoyaltyMult*2+spec.shadow.payoutLoyaltyMult;
		i = parseInt(
			utils.getSatisfaction(spec)*2*spec.shadow.satisfactionLoyaltyMult/s + 
			spec.attributes.payoutSatisfaction*spec.shadow.payoutLoyaltyMult/s
			) + spec.shadow.loyaltyBonus;
		i = parseInt((i+70)/2);
		if (i>100) i=100;
		if (i<0) i=0;
		return i;
	},
	
	generateName() {
		var s1, s2, t1, t2;
		s1 = strings.nameGeneration.first.concat(strings.nameGeneration.both);
		s2 = strings.nameGeneration.second.concat(strings.nameGeneration.both);
		t1 = s1[parseInt(Math.random()*s1.length)];
		t2 = s2[parseInt(Math.random()*s2.length)];
		if ((t1 == t2) || (Math.random() < 0.002)) return {n:strings.nameGeneration.mono[parseInt(Math.random()*strings.nameGeneration.mono.length)], g:parseInt(Math.random()*2+1)};
		return {n:t1+' '+t2, g:parseInt(Math.random()*2+1)};
	},
	
	generateZebraName() {
		var s1, s2, s3, sg, t1, t2, n;
		s1 = strings.zebraNamesGenerator.begin.concat(strings.zebraNamesGenerator.uni);
		s2 = strings.zebraNamesGenerator.middle.concat(strings.zebraNamesGenerator.uni);
		s3 = strings.zebraNamesGenerator.end.concat(strings.zebraNamesGenerator.uni);
		sg = strings.zebraNamesGenerator.g_end.concat(strings.zebraNamesGenerator.g_uni);
		t1 = s1[parseInt(Math.random()*s1.length)];
		t2 = '';
		if (Math.random() > 0.4) t2 = s2[parseInt(Math.random()*s2.length)];
		n = parseInt(Math.random()*s3.length);
		return {n:t1.slice(0,1).toUpperCase()+t1.slice(1)+t2+s3[n], g:sg[n]};
	},
	
	generateStats(spec) {
		let sum = 300;
		let f = parseInt(Math.random()*3);
		let step = parseInt(Math.random()*2);
		let s = (f+step+1)%3;
		let t = (f+(1-step)+1)%3;
		let stats = ['charisma','intellect','endurance'];
		spec.stats[stats[f]] = parseInt((Math.random()+Math.random())/2*sum);
		sum -= spec.stats[stats[f]];
		spec.stats[stats[s]]= parseInt((Math.random()+Math.random())/2*sum);
		sum -= spec.stats[stats[s]];
		spec.stats[stats[t]] = sum;
	},
	
	addPerk(spec, perkName) {
		let perk = content.perks.c[perkName];
		if (perk == undefined) {
			console.log('Error: undefined perk '+perkName);
			return;
		}
		//может он уже есть
		for (let i=0; i<spec.perks.length; i++) if (perk.id == spec.perks[i]) return;
		//может его нужно исключить?
		for (let p in perk.excludeLists) {
			if (spec.shadow.excludePerkLists[p] != undefined && spec.shadow.excludePerkLists[p] != perk.excludeLists[p]) {
				console.log('Info: perk '+perk.id+' excluded. Caused by '+p);
				return;
			}
			else spec.shadow.excludePerkLists[p] = perk.excludeLists[p];
		}
		//применяем
		perk.whenGet(spec);
		spec.perks.push(perk.id);
		spec.isPerkExplored.push(false);
		//moar?
		for (let i=0; i<perk.repList.length; i++) {
			let v = parseInt(content.perks.perkReplPool[perk.repList[i]].chanceCalc(world, spec));
			if (Math.random()*100 < v)
				utils.addPerk(spec, content.perks.perkReplPool[perk.repList[i]].list[parseInt(Math.random()*content.perks.perkReplPool[perk.repList[i]].list.length)]);
		}
	},
	
	preparePerks() {
		for (let p in content.perks.c) {
			content.perks.c[p].excludeLists = {};
			content.perks.c[p].repList = [];
		}
		for (let x=0; x<content.perks.perkExclusions.length; x++) {
			for (let y=0; y<content.perks.perkExclusions[x].lists.length; y++) {
				for (let b=0; b<content.perks.perkExclusions[x].lists[y].length; b++) {
					if (content.perks.c[content.perks.perkExclusions[x].lists[y][b]] == undefined) {
						console.log('Warning: Perk '+content.perks.perkExclusions[x].lists[y][b]+' not found. Caused by '+content.perks.perkExclusions[x].id);
						continue;
					}
					content.perks.c[content.perks.perkExclusions[x].lists[y][b]].excludeLists[content.perks.perkExclusions[x].id] = y;
				}
			}
		}
		for (let x=0; x<content.perks.perkReplPool.length; x++) {
			for (let y=0; y<content.perks.perkReplPool[x].initators.length; y++) {
				content.perks.c[content.perks.perkReplPool[x].initators[y]].repList.push(y);
			}
		}
	},
	
	levelUp(spec) {
		spec.stats.experience -= consts.nextLevel[spec.stats.level];
		spec.stats.level++;
		utils.addNotify('specs', [spec.id], 2, strings.UI.messages.levelUpped);
	},
	
	getCurrentWork(spec) {
		if (spec.tasks.length == 0) return content.works.w_sys_relaxing;
		if (!world.tasks[spec.tasks[0]].hasStarted) return content.works.w_sys_relaxing; 
		else return world.tasks[spec.tasks[0]];
	},
	
	getCurrentWorkIconAndOffset(spec) {
		
	},
	
	closePopup(popup) {
		game.UI.popups.pop();
		if (game.UI.popups.length == 0) utils.changeSpeed(game.UI.tspeed);
		let e = document.getElementById("popup_"+popup);
		e.parentNode.removeChild(e);
	},
	
	callPopup(popup) {
		if (game.UI.popups.length == 0) {
			game.UI.tspeed = document.querySelectorAll('#top .ico1').length-world.currentSpeed-1;
			utils.changeSpeed(3);
		}
		popup.num = game.UI.popups.length;
		game.UI.popups.push(popup.id);
		let b;
		if (popup.buttons!=undefined && popup.buttons.length > 0) {
			b = popup.buttons.map(function (b) {
				let x = b.callback;
				let hasUrl = (b.href != undefined);
				return Inferno.createElement((hasUrl?'a':'div'), {className:'b fs', onClick:x, href:b.href, target:'_blank'}, b.text)
			});
		}
		let z = document.createElement('div');
		z.id = 'popup_'+popup.id;
		z.className = 'pu d';
		document.getElementById('windows').appendChild(z);
		let z1 = document.createElement('div');
		z1.className = 'back';
		z1.style = 'z-index:9998';
		z.appendChild(z1);
		z1 = document.createElement('div');
		z1.className = 'w m';
		z1.style = 'z-index:9999';
		z.appendChild(z1);
		Inferno.render(
			Inferno.createElement('div', {className:'cc big', style:'text-align:center'}, 
				Inferno.createElement('div', {className:'pad bl', style:'white-space:pre-wrap'},popup.text),
				b
			)
		, z1);
	},
	
	generatePerks(spec) {
		spec.perks = [];
		let i = parseInt(Math.random()*content.perks.perkVarPool.length);
		let perkList = [];
		for (let x=0; x<content.perks.perkVarPool.length; x++) {
			let n = (i+x) % content.perks.perkVarPool.length;
			let v = content.perks.perkVarPool[n].chanceCalc(world, spec);
			if (Math.random()*100 < v)
				//adding perk
				perkList.push(content.perks.perkVarPool[n].list[parseInt(Math.random()*content.perks.perkVarPool[n].list.length)]);
		}
		for (let x=0; x<content.extendedPerksGenerators.length; x++) {
			let u = content.extendedPerksGenerators[x](world, spec);
			if (u!=null && u!='') perkList.push(u);
		}
		for (let a=0; a<perkList.length; a++) {
			utils.addPerk(spec, perkList[a]);
		}
	},
	
	calcPayoutV(spec) {
		let center = spec.attributes.payout;
		if (spec.attributes.currentPayout < center) {
			return 50-50*(Math.pow(1-spec.attributes.currentPayout/center, 1/2.71));
		}
		else {
			let x = 50+50*(Math.pow((spec.attributes.currentPayout-center)/center, 1/2.71));
			if (x>100) x=100;
			return x;
		}
	},
	
	calcPayout(spec) {
		let const1 = 1.2;
		let const2 = 1.12;
		let v = Math.max(this.getCharisma(spec),this.getIntellect(spec),this.getEndurance(spec));
		spec.attributes.payout = parseInt(
		100 * Math.pow(const1,1/(const2-v)) * (1+this.getLevel(spec)/6+Math.pow(spec.attributes.involvement, 1.5)/150));
	},
	
	generateMaxHealth(spec) {
		return parseInt(10+Math.sqrt(utils.getActualEndurance(spec))*spec.shadow.maxHealthMult/3);
	},
	
	spec2ministry(id, ministry) {
		world.specs[id].owner = ministry;
		world.specs[id].ministry = ministry;
		world.ministries[ministry].specs.push(id);
	},
	
	OIAspecTick(spec) {
		//перерасчет работы
		if (spec.tasks.length != 0) spec.attributes.workbalance += m;
		else spec.attributes.workbalance -= consts.sleepOverWork*m;
		spec.attributes.payout = utils.calcPayout(spec);
		if (spec.attributes.workbalance > consts.workOverflow*4) {
			spec.attributes.health-=workHealthMult;
			spec.attributes.workbalance = consts.workOverflow*4;
			spec.attributes.workSatisfaction--;
		}
		if (spec.attributes.workbalance > consts.workOverflow) spec.attributes.workSatisfaction--;
		if (spec.attributes.workbalance < -consts.workOverflow) spec.attributes.workSatisfaction++;
		if (spec.attributes.workSatisfaction<-100) spec.attributes.workSatisfaction = -100;
		if (spec.attributes.workSatisfaction>100) spec.attributes.workSatisfaction = 100;
		
		let d = (utils.calcPayoutV(spec)-50)*2;
		if (spec.attributes.currentPayout < spec.attributes.payout*9/10) {
			spec.attributes.payoutSatisfaction+=(parseInt(d/15)+1);
			if (spec.attributes.payoutSatisfaction < d) spec.attributes.payoutSatisfaction = d;
		}
		else if (spec.attributes.currentPayout > spec.attributes.payout*11/10) {
			spec.attributes.payoutSatisfaction+=(parseInt(d/15)+1);
			if (spec.attributes.payoutSatisfaction > d) spec.attributes.payoutSatisfaction = d;
		}
		else if (spec.attributes.payoutSatisfaction < 0) spec.attributes.payoutSatisfaction++;
		else if (spec.attributes.payoutSatisfaction > 0) spec.attributes.payoutSatisfaction--;
		
	},
	
	specTick(spec) {
		let m = 1/spec.counters.updateMult;
		
		if (spec.stats.experience >= consts.nextLevel[spec.stats.level]) utils.levelUp(spec);
		
		utils.calcPayout(spec);
		//обновление видимости перков
		for (let i=0; i<spec.isPerkExplored.length; i++) {
			if (!spec.isPerkExplored[i]) {
				if (Math.random()*100<(content.perks.c[spec.perks[i]].secrecy-spec.attributes.secrecy)*2) utils.makePerkVisible(spec, i);
			}
		}
		
		//добавление перков
		for (let i=0; i<content.idlePerksGenerators.length; i++) content.idlePerksGenerators[i](world, spec);
		
		spec.counters.main = consts.specUpdateInterval;
	},
	
	destroyWork(work, res) {
		let pat = content.works[work.id];
		if (res == 0) utils.addNotify('specs', work.workers, 2, strings.UI.messages.workCompleted.replace('%work%', pat.name));
		else if (res == 3) utils.addNotify('specs', work.workers, 0, strings.UI.messages.workFailed.replace('%work%', pat.name));
			
		for (let i=0; i<work.workers.length; i++) {
			let s = world.specs[work.workers[i]].tasks;
			for (let j=0; j<s.length; j++) {
				if (s[j] == work.internalId) {
					s.splice(j, 1);
					for (let j=0; j<spec.perks.length; j++) {
						content.perks.c[spec.perks[j]].onIdle(spec, (res+1)/2);
					}
					break;
				}
			}
		}
		delete world.tasks[work.internalId];
	},
	
	failTask(work) {
		let pat = content.works[work.id]; 
		pat.whenFailed(work);
		destroyWork(work, 3);
	},
	
	stopTask(work, spec, reason) {
		let pat = content.works[work.id]; 
		let i;
		if (work.workers.length == pat.minWorkers) {
			if (reason == 1) utils.addNotify('specs', work.workers, 1, strings.UI.messages.workCanceled.replace('%work%', pat.name));
			else if (reason == 2) utils.addNotify('specs', work.workers, 0, strings.UI.messages.workImpossible.replace('%work%', pat.name));
		}
		for (i=0; i<work.workers.length; i++) {
			if (work.workers[i] == spec.id) break;
		}
		
		if (work.hasStartedPerSpec[i]) {
			pat.whenStoppedPerSpec(work, i);
			for (let j=0; j<spec.perks.length; j++) {
				content.perks.c[spec.perks[j]].onIdle(spec,0);
			}
		}
		work.workers.splice(i,1);
		work.hasStartedPerSpec.splice(i,1);
		
		for (i=0; i<spec.tasks.length; i++) {
			if (spec.tasks[i] == work.internalId) break;
		}
		spec.tasks.splice(i,1);
		
		if (work.workers.length < pat.minWorkers) {
			if (work.hasStarted) pat.whenStopped(work);
			utils.destroyWork(work, reason);
			return 1;
		}
		if (reason == 1) utils.addNotify('specs', spec.id, 1, strings.UI.messages.workCanceledForSpec.replace('%work%', pat.name));
		else if (reason == 2) utils.addNotify('specs', spec.id, 0, strings.UI.messages.workImpossibleForSpec.replace('%work%', pat.name));
		return 0;
	},
	
	workPercent(work, nums, spec) {
		let s = parseInt(100*work.value/work.target);
		let n;
		for (n=0; n<work.workers.length; n++) if (work.workers[n] == spec.id) break;
		if ((work.separated && !work.hasStartedPerSpec[n]) || (!work.separated && !work.hasStarted)) return (nums?0:'В очереди');
		if (s<0) return (nums?0:'Выполняется...');
		return (nums?s:s+'%');
	},
	
	startWork(pat, work) {
		//reses
		pat.whenStart(work);
		work.hasStarted = true;
	},
	
	workTick(work) {
		let pat = content.works[work.id];
		work.timeElapsed += (consts.gameSpeed[world.currentSpeed])/consts.fps;
		
		//проверка на старт работы и количество работников
		let working = 0;
		work.workers.forEach(function (worker, i, a) {
			if (pat.requiments(world.specs[worker])<=0) {
				if (utils.stopTask(work, world.specs[worker], 2)) return;
			}
			else if (world.specs[worker].tasks[0] == work.internalId) {
				working++;
			}
		});
		if (working>=pat.minWorkers && !work.hasStarted) utils.startWork(pat, work);
		
		//обновление работы
		if (working>=pat.minWorkers) {
			work.workers.forEach(function (worker, i, a) {
				if (world.specs[worker].tasks[0] == work.internalId) {
					if (pat.minWorkers==1 && !work.hasStartedPerSpec[i]) {
						work.hasStartedPerSpec[i] = true;
						let spec = world.specs[worker];
						pat.whenStartPerSpec(work, spec);
						for (let j=0; j<spec.perks.length; j++) {
							content.perks.c[spec.perks[j]].onTask(spec);
						}
					}
					pat.updatePerSpec(work, world.specs[worker]);
				}
			});
			pat.update(work);
		}
		
		//выполнение
		if (work.value < work.target) work.timeBeforeUpdate += pat.updateInterval;
		else {
			pat.whenComplete(work);
			utils.destroyWork(work, 0);
		}
	},
	
	makePerkVisible(spec, perkId) {
		//TODO add notification
		spec.isPerkExplored[perkId] = true;
	},
	
	startTask(task, spec, ministry, location) {
		let i;
		for (i=0; world.tasks[i]!=undefined; i++) 0;
		world.tasks[i] = new work(task.id, spec, location, ministry, i);
		let workO = world.tasks[i];
		for (let s=0; s<spec.length; s++) {
			world.specs[spec[s]].tasks.push(i);
			workO.hasStartedPerSpec[s] = false;
		}
		//task.whenStart(i);
		
		let working = 0;
		workO.workers.forEach(function (worker, i, a) {
			if (task.requiments(world.specs[worker])<0) {
				if (utils.stopTask(workO, world.specs[worker], 2)) return;
			}
			else if (world.specs[worker].tasks[0] == workO.internalId) {
				working++;
			}
		});
		if (working>=task.minWorkers && !workO.hasStarted) utils.startWork(task, workO);
	},
	
	rgb2hsv(color) {
		// modified https://stackoverflow.com/a/8023734
		color = parseInt(color.substring(1), 16);
		var rr, gg, bb,
			r = (color / 65536) % 256,
			g = (color / 256) % 256,
			b = color % 256,
			h, s,
			v = Math.max(r, g, b),
			diff = v - Math.min(r, g, b),
			diffc = function(c){
				return (v - c) / 6 / diff + 1 / 2;
			};

		if (diff == 0) {
			h = s = 0;
		} else {
			s = diff / v;
			rr = diffc(r);
			gg = diffc(g);
			bb = diffc(b);

			if (r === v) {
				h = bb - gg;
			}else if (g === v) {
				h = (1 / 3) + rr - bb;
			}else if (b === v) {
				h = (2 / 3) + gg - rr;
			}
			if (h < 0) {
				h += 1;
			}else if (h > 1) {
				h -= 1;
			}
		}
		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			v: Math.round(v * 100)
		};
}
};
function m_init() {
	return 0;
}