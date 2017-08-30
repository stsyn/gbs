"use strict";
function consts_proto() {
	this.baseSpeed = 60;	//default 48
	this.fps = 30;
	this.gameSpeed = [0, this.baseSpeed/3, this.baseSpeed, this.baseSpeed*4, this.baseSpeed*20] //per second
	this.specUpdateInterval = 12*60;
	this.sleepOverWork = 4;
	this.workOverflow = 8;
	this.maxNotifies = 50;
	this.workCheckInterval = 60;
	
	//не отображается; известно только имя, класс и внешность; известны характеристики; местоположение и здоровье; текущие задания
	this.visibility = [97,93,85,60,40];
	
	this.nextLevel = [200,600,1600,3200,6200,10600,18000,28400,45000]; //+200 +400 +600+400 +800+800 +1000+1200+800 +1200+1600+1600 +1400+2000+2400+1600 +1600+2400+3200+3200 +1800+2800+4000+4800+3200
	this.maxLevel = this.nextLevel.length;
	this.ministries = ['OIA','MAS','MI','MoP','MoA','MWT','MoM','Z','EQ'];
	this.actualMinistries = ['MAS','MI','MoP','MoA','MWT','MoM'];
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
		game.UI.writeNotifies();
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
		if (spec.attributes.payout !=0) i -= (spec.attributes.unpaid*10/spec.attributes.payout)
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
	
	generatePortrait(spec, cl) {
		//returns Inferno virtual element
		let p = spec.stats.portrait;
		let portrait = content.portraits[p.id];
		let mirror = p.mirrored && portrait.allowMirror;
		let svg = portrait.order.map(function(e) {
			let fillColor = ((portrait.parts[e].color!='field') ? p[portrait.parts[e].color] : p[portrait.parts[e].colorField]);
			let u = ((portrait.parts[e].value!='field')?portrait.parts[e].value:p[portrait.parts[e].field]);
			if (u>portrait.parts[e].content.length) u = portrait.parts[e].content.length-1;
			let content = portrait.parts[e].content[u];
			return Inferno.createElement('path',{fill:fillColor, d:content});
		});
		return Inferno.createElement('svg', {viewBox:'0 0 '+portrait.resolution+' '+portrait.resolution, className:cl, transform:'scale('+(mirror?'-1':'1')+',1)'},
			svg
		);
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
	
	deadSpec(spec) {
		if (spec.health>0) return;
		if (spec.ministry == 'OIA') {
			utils.callPopup({
				text:(strings.UI.messages.deadSpec.replace('%spec%',spec.stats.name))+'\n('+')',
				buttons:[{
					text: (game.player.resources.money.value>=3000?strings.UI.messages.deadSpecFullCompensation:strings.UI.messages.notEnoughMoney),
					callback: (game.player.resources.money.value<3000?function(){}:function() {
						game.player.resources.money.value -= 3000;
						utils.closePopup();
					})
				},{
					text: (game.player.resources.money.value>=1500?strings.UI.messages.deadSpecHalfCompensation:strings.UI.messages.notEnoughMoney),
					callback: (game.player.resources.money.value<1500?function(){}:function() {
						game.player.resources.money.value -= 1500;
						world.ministries.EQ.loyalty -= 5;
						utils.closePopup();
					})
				},{
					text: strings.UI.messages.cancel,
					callback: function() {
						world.ministries.EQ.loyalty -= 15;
						utils.closePopup();
					}
				}]
			});
		}
		utils.spec2ministry(spec.id, 'DDD');
	},
	
	levelUp(spec) {
		spec.stats.experience -= consts.nextLevel[spec.stats.level];
		spec.stats.level++;
		if (utils.ownedByPlayer(spec)) utils.addNotify('specs', [spec.id], 2, strings.UI.messages.levelUpped);
	},
	
	getCurrentWork(spec) {
		if (spec.tasks.length == 0) return content.works.w_sys_relaxing;
		if (!world.tasks[spec.tasks[0]].hasStarted) return content.works.w_sys_relaxing; 
		else return world.tasks[spec.tasks[0]];
	},
	
	getCurrentWorkIconAndOffset(spec) {
		
	},
	
	closePopup() {
		world.currentSpeed = game.UI.tspeed;
		let e = document.getElementById("popup");
		e.parentNode.removeChild(e);
	},
	
	callPopup(popup) {
		if (world.currentSpeed != 0) game.UI.tspeed = world.currentSpeed;
		world.currentSpeed = 0;
		
		let b;
		if (popup.buttons!=undefined && popup.buttons.length > 0) {
			b = popup.buttons.map(function (b) {
				let x = b.callback;
				let hasUrl = (b.href != undefined);
				return Inferno.createElement((hasUrl?'a':'div'), {className:'b fs', onClick:x, href:b.href, target:'_blank'}, b.text)
			});
		}
		let z = document.createElement('div');
		z.id = 'popup';
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
		let const1 = 1.15;
		let const2 = 1.12;
		let v = Math.max(utils.getCharisma(spec),utils.getIntellect(spec),utils.getEndurance(spec));
		let x = parseInt(
		100 * Math.pow(const1,1/(const2-v)) * (1+utils.getLevel(spec)/6+Math.pow(spec.attributes.involvement, 1.5)/150));
		if (x < spec.attributes.lastPayout*1.1) x = parseInt(x*1.005);
		
		if (spec.attributes.workbalance<0) x*=1-spec.attributes.workbalance/100;

		if (spec.attributes.unpaid > 0 && x>spec.attributes.payout) x = spec.attributes.payout;
		
		if (x/spec.attributes.payout < 0.99) x = parseInt(spec.attributes.payout*0.99);
		if (x/spec.attributes.payout > 1.03) x = parseInt(spec.attributes.payout*1.03);
		spec.attributes.payout = x;
	},
	
	generateMaxHealth(spec) {
		return parseInt(10+Math.pow(utils.getActualEndurance(spec), 0.6)*spec.shadow.maxHealthMult/3);
	},
	
	sortSpecList(ministry, specList, type) {
		if (specList == game.player.specs) {
			game.player.specs = [];
			for (let i=0; i<world.specs.length; i++) {
				if (world.specs[i].ministry == 'OIA' || world.specs[i].owner == 'OIA')
					game.player.specs.push(world.specs[i]);
			}
			specList = game.player.specs;
		}
		let sortType = {};
		sortType.priority = function (a, b) {
			let m = world.ministries[ministry];
			if (m.owner == a) return -1;
			if (m.owner == b) return 1;
			if (m.priorities(world.specs[a]) > m.priorities(world.specs[b])) return -1;
			return 1;
		};
		sortType.priorityOIA = function (a, b) {
			let m = world.ministries[ministry];
			if (m.owner == a.id) return -1;
			if (m.priorities(a) > m.priorities(b)) return -1;
			return 1;
		};
		sortType.workPriority = function (a, b) {
			if (a.internalId == 'GB') return 1;
			if (b.internalId == 'GB') return -1;
			if ((a.tasks.length == 0) == (b.tasks.length == 0)) {
				let task = game.UI.taskHandling;
				let work = content.works[task.id];
				if (work.requiments(a, task.ministry, task.location) > work.requiments(b, task.ministry, task.location)) return -1;
				else if (work.requiments(a, task.ministry, task.location) == work.requiments(b, task.ministry, task.location)) return 0;
				return 1;
			};
			if (a.tasks.length == 0) return -1;
			return 1;
		};
		sortType.name = function (a, b) {
			let m = world.ministries[ministry];
			if (m.owner == a) return -1;
			if (m.owner == b) return 1;
			if (world.specs[a].stats.name < world.specs[b].stats.name) return -1;
			return 1;
		};
		sortType.nameOIA = function (a, b) {
			let m = world.ministries[ministry];
			if (m.owner == a.id) return -1;
			if (m.owner == b.id) return 1;
			if (a.stats.name < b.stats.name) return -1;
			return 1;
		};
		specList.sort(sortType[type]);
	},
	
	spec2ministry(id, ministry) {
		let spec = world.specs[id];
		if (spec.ministry != undefined && spec.ministry != ministry) {
			spec.attributes.secrecy = utils.getSpecSecrecy(spec);
			for (let i=0; i<world.ministries[spec.ministry].specs.length; i++) {
				if (world.ministries[spec.ministry].specs[i] == id) {
					world.ministries[spec.ministry].specs.splice(i,1);
					break;
				}
			}
		}
		if (world.ministries[ministry].owner != spec.id) spec.owner = ministry;
		spec.ministry = ministry;
		for (let i=0; i<world.ministries[ministry].specs.length; i++) if (world.ministries[ministry].specs[i] == id) return;
		world.ministries[ministry].specs.push(id);
	},
	
	OIAspecTick(spec) {
		let task = utils.getCurrentWork(spec);
		let work = content.works[task.id];
		let w = (content.works[utils.getCurrentWork(spec).id].type.has('relax'));
		
		if (spec.internalId == 'GB') return;
		
		//перерасчет работы
		if (!w) {
			spec.attributes.workbalance--;
			if (spec.attributes.workbalance>3) spec.attributes.workbalance -= (consts.sleepOverWork - 1);
			else if (spec.attributes.workbalance>0) spec.attributes.workbalance = 0;
			//перерасчет секретности
			//если на работе, где сейчас находится спец, несколько специалистов из нашего министерства, то понижаем уровень секретности за каждого спеца с более низкой секретностью (но не ниже 40)
			if (spec.attributes.secrecy>40) {
				let c = task.workers.get(spec.id);
				if (task.hasStarted[c]) {
					for (let i=0; i<task.workers.length; i++) {
						if (c == i) continue;
						if (!utils.ownedByPlayer(world.specs[task.workers[i]])) continue;
						if (spec.attributes.secrecy>world.specs[task.workers[i]].attributes.secrecy) spec.attributes.secrecy-=0.5;
						if (spec.attributes.secrecy>40) break;
					}
				}
			}
		}
		else {
			spec.attributes.workbalance++;
			if (spec.attributes.workbalance<-3) spec.attributes.workbalance += (consts.sleepOverWork - 1);
			else if (spec.attributes.workbalance<0) spec.attributes.workbalance = 0;
		}
		
		//перерасчет секретности
		if (spec.attributes.secrecy>70) spec.attributes.secrecy--;
		if (spec.attributes.secrecy<60) spec.attributes.secrecy+=0.1;
		
		//перерасчет удовлетворения работой
		if (spec.attributes.workbalance > consts.workOverflow*4) {
			spec.attributes.health-=spec.shadow.workHealthMult;
			spec.attributes.workbalance = consts.workOverflow*4;
			spec.attributes.workSatisfaction--;
		}
		if (spec.attributes.workbalance > consts.workOverflow) spec.attributes.workSatisfaction--;
		if (spec.attributes.workbalance < -consts.workOverflow) spec.attributes.workSatisfaction++;
		if (spec.attributes.workbalance < -consts.workOverflow*4) {
			spec.attributes.workbalance = -consts.workOverflow*4;
		}
		
		if (spec.attributes.workSatisfaction<-100) spec.attributes.workSatisfaction = -100;
		if (spec.attributes.workSatisfaction>100) spec.attributes.workSatisfaction = 100;
		
		//перерасчет оплаты
		utils.calcPayout(spec);
		if (game.player.resources.money.value > 0) {
			let x = spec.attributes.currentPayout-game.player.resources.money.value;
			
			//средств более чем достаточно, снимаем все запрошенные
			if (x<=0) x = spec.attributes.currentPayout;	
			//средств меньше, чем выставил игрок, но достаточно для удовлетворения потребностей
			else if (game.player.resources.money.value>(spec.attributes.payout+spec.attributes.unpaid)) x = (spec.attributes.payout+spec.attributes.unpaid);
			//средств не хватает и на это, снимаем все
			else x = game.player.resources.money.value;
			
			spec.attributes.lastPayout = x;
			game.player.resources.money.value -= x;
			
			//платишь меньше требуемого
			if (x<(spec.attributes.payout*0.8)){
				spec.attributes.unpaid += spec.attributes.payout*0.8-x;
			}
			//выставлено меньше требуемого
			else if (spec.attributes.currentPayout<(spec.attributes.payout*0.8)) {
				spec.attributes.unpaid += spec.attributes.payout*0.8-spec.attributes.currentPayout;
			}
			//платишь больше
			else if (spec.attributes.unpaid>0) {
				spec.attributes.unpaid -= x-spec.attributes.payout*0.8;
			}
		}
		else {
			spec.attributes.unpaid+=spec.attributes.payout*0.8;
			spec.attributes.lastPayout = 0;
		}
		
		//payout satisfaction
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
		let w = (utils.getCurrentWork(spec).id!='w_sys_relaxing');
		let f = (!w?'onIdleTick':'onTaskTick');
		spec.perks.forEach (function (s, i, a) {
			if (content.perks.c[s][f] != undefined) content.perks.c[s][f](spec);
		});
		//только для Голденблада
		if (spec.internalId == 'GB') {
			spec.counters.main += consts.gameSpeed[3];
			if (world.currentSpeed == 1) spec.attributes.health-=0.1;
			if (world.currentSpeed == 3 && spec.attributes.health < spec.attributes.maxHealth) spec.attributes.health+=0.05;
			if (spec.stats.health<=0) utils.deadSpec(spec);
			return;
		}
		
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
		
		spec.counters.main += consts.specUpdateInterval;
		
		if (spec.attributes.health<=0) utils.deadSpec(spec);
	},
	
	destroyWork(work, res) {
		let pat = content.works[work.id];
		
		let playerSpecs = true;
		for (let j=0; j<work.workers.length; j++) {
			if (!utils.ownedByPlayer(world.specs[work.workers[j]])) {
				playerSpecs = false;
				break;
			}
		};
		if (playerSpecs) {
			if (res == 0) utils.addNotify('specs', work.workers, 2, strings.UI.messages.workCompleted.replace('%work%', pat.name));
			else if (res == 3) utils.addNotify('specs', work.workers, 0, strings.UI.messages.workFailed.replace('%work%', pat.name));
		}
			
		for (let i=0; i<work.workers.length; i++) {
			let spec = world.specs[work.workers[i]]
			let s = spec.tasks;
			for (let j=0; j<s.length; j++) {
				if (s[j] == work.internalId) {
					s.splice(j, 1);
					for (let j=0; j<spec.perks.length; j++) {
						content.perks.c[spec.perks[j]].onIdle(spec, (res+1)/2);
					}
					
					if ((spec.internalId == 'GB') && (spec.location != world.homecity) && (spec.tasks.length == 0))
						utils.startTask(content.works.w_movement, [spec.id], spec.ministry, world.homecity);
					break;
				}
			}
		}
		delete world.tasks[work.internalId];
	},
	
	failTask(work) {
		let pat = content.works[work.id]; 
		pat.whenFailed(work);
		utils.destroyWork(work, 3);
	},

	removeTask(work) {
		utils.destroyWork(work, 8);
	},
	
	completeTask(work) {
		let pat = content.works[work.id]; 
		pat.whenComplete(work);
		utils.destroyWork(work, 0);
	},
	
	stopTask(work, spec, reason) {
		let pat = content.works[work.id]; 
		let i;
		let playerSpecs = true;
		for (let j=0; j<work.workers.length; j++) {
			if (!utils.ownedByPlayer(world.specs[work.workers[j]])) {
				playerSpecs = false;
				break;
			}
		};
		if ((work.workers.length == pat.minWorkers) && playerSpecs) {
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
		
		if ((spec.internalId == 'GB') && (spec.location != world.homecity) && (spec.tasks.length == 0))
			utils.startTask(content.works.w_movement, [spec.id], spec.ministry, world.homecity);
		
		if (work.workers.length < pat.minWorkers) {
			if (work.hasStarted) pat.whenStopped(work);
			utils.destroyWork(work, reason);
			return 1;
		}
		if (utils.ownedByPlayer(spec)) {
			if (reason == 1) utils.addNotify('specs', spec.id, 1, strings.UI.messages.workCanceledForSpec.replace('%work%', pat.name));
			else if (reason == 2) utils.addNotify('specs', spec.id, 0, strings.UI.messages.workImpossibleForSpec.replace('%work%', pat.name));
		}
		return 0;
	},
	
	workPercent(work, nums, spec) {
		let s = parseInt(100*work.value/work.target);
		let n;
		if (spec != undefined) {
			for (n=0; n<work.workers.length; n++) if (work.workers[n] == spec.id) break;
			if (!work.hasStartedPerSpec[n]) return (nums?0:'В очереди');
		}
		else {
			if (!work.hasStarted) return (nums?0:'В очереди');
		}
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
				if ((work.id != 'w_movement') && (work.id != 'w_sys_companyHandler') && (world.specs[worker].location != work.location)) {
					utils.startTask(content.works.w_movement, [worker], world.specs[worker].ministry, work.location, true);
				}
				else working++;
			}
		});
		if (working>=pat.minWorkers && !work.hasStarted) {
			utils.startWork(pat, work);
			work.timeBeforeUpdate += pat.updateInterval;
			return;
		}
		if (working>=pat.minWorkers) {
			work.workers.forEach(function (worker, i, a) {
				if (world.specs[worker].tasks[0] == work.internalId) {
					if (!work.hasStartedPerSpec[i]) {
						work.hasStartedPerSpec[i] = true;
						let spec = world.specs[worker];
						pat.whenStartPerSpec(work, spec);
						for (let j=0; j<spec.perks.length; j++) {
							content.perks.c[spec.perks[j]].onTask(spec);
						}
					}
				}
			});
		}
		
		//обновление работы
		if (working>=pat.minWorkers) {
			work.workers.forEach(function (worker, i, a) {
				if (world.specs[worker].tasks[0] == work.internalId) {
					pat.updatePerSpec(work, world.specs[worker]);
				}
			});
			pat.update(work);
		}
		
		//выполнение
		if ((work.value < work.target) || work.target == -1) {
			if (work.hasStarted) work.timeBeforeUpdate += pat.updateInterval;
			else work.timeBeforeUpdate += consts.workCheckInterval;
		}
		else if (work.target>=0) utils.completeTask(work);
	},
	
	makePerkVisible(spec, perkId) {
		if (spec.owner == game.player.ministry.id) utils.addNotify('specs', spec.id, 1, strings.UI.messages.perkFound.replace('%perk%', content.perks.c[spec.perks[perkId]].name));
		spec.isPerkExplored[perkId] = true;
	},
	
	startTask(task, spec, ministry, location, insertBefore) {
		let maxTimeout = 0;
		for (let j=0; j<spec.length; j++) {
			let s = world.specs[spec[j]].location;
			if (maxTimeout<Math.pow(world.roadmap[world.homecity][s],0.75)*world.data.taskStartTimeout) maxTimeout = Math.pow(world.roadmap[world.homecity][s],0.75)*world.data.taskStartTimeout;
		}
		let timeout = maxTimeout;
		let i;
		for (i=0; world.tasks[i]!=undefined; i++) 0;
		if (insertBefore) timeout = 0;
		world.tasks[i] = new work(task.id, spec, location, ministry, i, timeout);
		let workO = world.tasks[i];
		for (let s=0; s<spec.length; s++) {
			if (insertBefore) world.specs[spec[s]].tasks.unshift(i);
			else world.specs[spec[s]].tasks.push(i);
			workO.hasStartedPerSpec[s] = false;
		}
	},
	
	
	closeTaskWindow() {
		document.getElementById("selectSpecs").classList.remove('d');
		game.UI.bottomSelectionMode = 'view';
		game.UI.bottomRenderCounter = 0;
		world.currentSpeed = game.UI.tspeed;
	},
	
	callTaskWindow() {
		document.getElementById("selectSpecs").classList.add('d');
		game.UI.bottomRenderCounter = 0;
		game.UI.bottomSelectionMode = 'addToTask';
		game.UI.taskBackHandlerType = 'none';
		utils.sortSpecList(game.player.ministry.id, game.player.specs, 'workPriority');
		
		if (world.currentSpeed != 0) game.UI.tspeed = world.currentSpeed;
		world.currentSpeed = 0;
	},
	
	prepareTaskWindow(task, location, ministry) {
		let popUp = {buttons:[]};
		game.UI.taskAddedWorkers = [];
		for (let i=0; i<world.tasks.length; i++) {
			if (world.tasks[i] != undefined) {
				if (world.tasks[i].id == task.id && world.tasks[i].location == location && world.tasks[i].ministry == ministry && !content.works[world.tasks[i].id].unstoppable) {
					if (content.works[world.tasks[i].id].onlyOne) {
						//switch to current work
						game.UI.taskHandling = world.tasks[i];
						utils.callTaskWindow();
						return;
					}
					else {
						popUp.buttons.push({
							text:'Присоединить к заданию №'+i,
							callback:function() {
								game.UI.taskHandling = world.tasks[i];
								utils.callTaskWindow();
								utils.closePopup();
								//switch to work
							}
						});
						game.UI.taskBackHandlerType = 'recreate';
					}
				}
			}
		}
		if (popUp.buttons.length>0) {
			popUp.buttons.push({
				text:'Создать новое',
				callback:function() {
					game.UI.taskHandling = {};
					game.UI.taskHandling.id = task.id;
					game.UI.taskHandling.location = location;
					game.UI.taskHandling.ministry = ministry;
					game.UI.taskHandling.workers = [];
					utils.closePopup();
					utils.callTaskWindow();
				}
			});
			popUp.text = 'Выберите, к какому подобному заданию добавить специалиста, или начните новое задание.';
			popUp.buttons.push({
				text:strings.UI.messages.cancel,
				callback:function() {utils.closePopup()}
			});
			utils.callPopup(popUp);
		}
		else {
			//create new
			game.UI.taskHandling = {};
			game.UI.taskHandling.id = task.id;
			game.UI.taskHandling.location = location;
			game.UI.taskHandling.ministry = ministry;
			game.UI.taskHandling.workers = [];
			utils.callTaskWindow();
			game.UI.taskBackHandlerType = 'none';
		}
	},
	
	ownedByPlayer(spec) {
		return (spec.owner == game.player.ministry.id || spec.ministry == game.player.ministry.id);
	},
	
	getSpecSecrecy(spec) {
		if (spec.ministry == undefined || spec.ministry == game.player.ministry.id) return spec.attributes.secrecy;
		let i, m = world.ministries[spec.ministry];
		if (m == undefined || m.stats == undefined || m.stats.loyalty == undefined) return spec.attributes.secrecy;
		for (i=0; i<m.specs.length; i++) if (m.specs[i] == spec.id) break;
		if (m.owner == spec.id) i = 5;
		let u = parseInt(m.stats.loyalty*2*(100-spec.attributes.secrecy)*(i+3)/1000-9);
		if (u>100) u = 100;
		if (u<0) u = 0;
		return 100-u;
	},
	
	normalCityTick(city) {
		/*
			Oh, you expected something usefull here? 
			But hey, what city should do every day? That it, nothing.
		*/
		
		/*
			*Few weeks after*
			
			Well, I changed my mind. I should add resources and stuff.
		*/
		
		/*
			*Few days after*
			
			Yeah, someday there will be some code.
		*/
	},
	
	newDayTick() {
		if (world.data.weekDay == 0) {
			world.data.weekDay = 7;
			game.player.resources.money.value += (world.data.specs<10?world.data.specs:10)*1000;
			world.data.specs = game.player.ministry.specs.length-1;
		}
		if (game.player.ministry.specs.length-1 < world.data.specs) world.data.specs = game.player.ministry.specs.length-1;
		world.data.weekDay--;
		
		let tpartSum = 0;
		for (let i=0; i<consts.actualMinistries.length; i++) {
			world.ministries[consts.actualMinistries[i]].stats.part = 0;
			world.ministries[consts.actualMinistries[i]].stats.tpart = 1;
			tpartSum += 1;
		}
		for (let city in world.cities) {
			content.cities[city].tick(world.cities[city]);
			for (let ministry in content.cities[city].ministriesPart) {
				if (world.ministries[ministry] != undefined) {
					world.ministries[ministry].stats.tpart += content.cities[city].ministriesPart[ministry];
					tpartSum += content.cities[city].ministriesPart[ministry];
				}
			}
		}
		for (let i=0; i<consts.actualMinistries.length; i++) {
			world.ministries[consts.actualMinistries[i]].stats.part = parseInt(100*world.ministries[consts.actualMinistries[i]].stats.tpart/tpartSum);
		}
		for (let ministry in world.ministries) {
			for (let i=0; i<world.ministries[ministry].ministryTicks.length; i++) world.ministries[ministry].ministryTicks[i](world.ministries[ministry]);
		}
		
	},
	
	ministryTick(m) {
		if (m.stats.loyalty>30) m.stats.loyalty-=0.05;
		if (m.specs.length < 8) {
			if (m.stats.loyalty > -40+20*m.specs.length) m.stats.loyalty = 20*m.specs.length-40;
		}
		m.specs.forEach(function (s,i,a){
			world.specs[s].stats.experience += parseInt((10-(i<10?i:9))/4)*2;
		});
		if (m.stats.part<11 && m.stats.loyalty>50) m.stats.loyalty -= 1;
		if (m.stats.part<6) m.stats.loyalty -= 1;
		if (m.stats.loyalty <= 0) {
			//code for gameover?
			//or it's gonna be unique?
			//oh well, there is no gameover right now
		}
	},
	
	getCityStatSum(city) {return city.attributes.techPart+city.attributes.militaryPart+city.attributes.industrialPart},
	
	getCityMilitary(city) {return city.attributes.militaryPart/utils.getCityStatSum(city)},
	
	getCityTech(city) {return city.attributes.techPart/utils.getCityStatSum(city)},
	
	getCityIndustrial(city) {return city.attributes.industrialPart/utils.getCityStatSum(city)},
	
	getCityActualMilitary(city) {return parseInt(utils.getCityMilitary(city)*city.attributes.militaryMult*city.attributes.ponyCount)},
	
	getCityActualTech(city) {return parseInt(utils.getCityTech(city)*city.attributes.techMult*city.attributes.ponyCount)},
	
	getCityActualIndustrial(city) {return parseInt(utils.getCityIndustrial(city)*city.attributes.industrialMult*city.attributes.ponyCount)},
	
	hsv2rgb(h, s, v) {
		let r, g, b, i, f, p, q, t;
		if (arguments.length === 1) {
			s = h.s, v = h.v, h = h.h;
		}
		if (h>1) h /= 360;
		if (s>1) s /= 100;
		if (v>1) v /= 100;
		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);
		let st = ((r << 16)+(g << 8)+b).toString(16);
		while (st.length<6) st = '0'+st;
		return '#'+st;
	}
};

Array.prototype.has = function(val) {
	if (this == undefined) return false;
	let x = this.find(function(v,i,a) {return (v == val)});
	if (x!=undefined) return true;
	return false;
};

Array.prototype.get = function(val) {
	if (this == undefined) return 0;
	let x = this.findIndex(function(v,i,a) {return (v == val)});
	if (x!=-1) return x;
	return this.length;
};

 
function m_init() {
	return 0;
}