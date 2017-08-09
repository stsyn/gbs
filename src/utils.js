"use strict";
function consts_proto() {
	this.baseSpeed = 48;
	this.fps = 30;
	this.gameSpeed = [0, this.baseSpeed/3, this.baseSpeed, this.baseSpeed*4] //per second
	this.specUpdateInterval = 12*60;
	this.sleepOverWork = 4;
	this.workOverflow = 6;
	
	this.nextLevel = [200,600,1600,3200,6200,10600,18000,28400,45000]; //+200 +400 +600+400 +800+800 +1000+1200+800 +1200+1600+1600 +1400+2000+2400+1600 +1600+2400+3200+3200 +1800+2800+4000+4800+3200
	this.maxLevel = this.nextLevel.length;
	this.ministries = ['OIA','MAS','MI','MoP','MoA','MWT','MoM','Z','EQ'];
	this.species = ['earthpony', 'unicorn', 'pegasus', 'alicorn', 'zebra'];
	this.speciesNameGenerFunction = ['generateName', 'generateName', 'generateName', 'generateName', 'generateZebraName']
	this.gender = ['r', 'm', 'f', 'u']
};
var consts = new consts_proto();
var utils = {
	getTime() {
		let t = '';
		let d = new Date(parseInt(world.time * 120000));
		t += ((parseInt(world.time/60) % 12)<10?'0'+(parseInt(world.time/60) % 12):(parseInt(world.time/60) % 12)) + ':';
		t += ((parseInt(world.time) % 60)<10?'0'+(parseInt(world.time) % 60):(parseInt(world.time) % 60)) + ' ';
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
		
	
	statsSum(spec) {return spec.stats.charisma+spec.stats.intellect+spec.stats.endurance},
	
	levelAmplifier(spec) {return 1024*Math.pow(utils.getLevel(spec),1.25)},
	
	levelPercent(spec) {return (spec.stats.level==consts.maxLevel?100:spec.stats.experience*100/consts.nextLevel[spec.stats.level])},
	
	getCharisma(spec) {return spec.stats.charisma/utils.statsSum(spec)},
	
	getIntellect(spec) {return spec.stats.intellect/utils.statsSum(spec)},
	
	getEndurance(spec) {return spec.stats.endurance/utils.statsSum(spec)},
	
	getClass(spec) {
		if (utils.getCharisma(spec) > 0.66) return 0;
		if (utils.getIntellect(spec) > 0.66) return 1;
		if (utils.getEndurance(spec) > 0.66) return 2;
		if ((utils.getIntellect(spec)+utils.getEndurance(spec) > 0.90) || (utils.getCharisma(spec)+utils.getEndurance(spec) > 0.90) || (utils.getCharisma(spec)+utils.getIntellect(spec) > 0.90)) {
			let mx = (utils.getIntellect(spec)+utils.getEndurance(spec)), id=0;
			if (utils.getCharisma(spec)+utils.getEndurance(spec) > mx) {
				id = 1;
				mx = utils.getCharisma(spec)+utils.getEndurance(spec);
			}
			if (utils.getCharisma(spec)+utils.getIntellect(spec) > mx) return 5;
			if (id == 1) return 4;
			return 3;
		}
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
	
	/*generateSpecialist(spec, reqSpecie = parseInt(Math.random()*consts.species.length), preDefined = {}) {
		for (key in preDefined) {
			spec[key] = preDefined[key];
		}
		spec.stats.specie = reqSpecie;
		utils.generateStats(spec);
		spec.stats.level = parseInt(Math.random()*Math.random()*3);
		utils.calcPayout(spec);
		let t = utils[consts.speciesNameGenerFunction[reqSpecie]](spec);
		spec.stats.name = t.n;
		spec.stats.gender = t.g;
		if (spec.stats.gender == 0) spec.stats.gender = parseInt(Math.random()*2+1);
		spec.stats.portraitURL = 'res\\portraits\\new\\0.png';	//ToDo: more universal system
	},*/
	
	generateMaxHealth(spec) {
		return parseInt(10+Math.sqrt(utils.getActualEndurance(spec))*spec.shadow.maxHealthMult/3);
	},
	
	spec2ministry(id, ministry) {
		world.specs[id].owner = ministry;
		world.specs[id].ministry = ministry;
		world.ministries[ministry].specs.push(id);
	},
	
	specTick(spec) {
		let m = 1/spec.counters.updateMult;
		
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
		utils.calcPayout(spec);
		
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
	
	makePerkVisible(spec, perkId) {
		//TODO add notification
		spec.isPerkExplored[perkId] = true;
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