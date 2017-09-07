"use strict";

/*
	Ministry	Extend		Requires
	MAS			Tech		Industrial
	MWT			Industrial	Tech
	MoA			Military	Tech
	MoP			<>			Industrial
	MI			<ratio>		Tech
	MoM			<loyalty>	Industrial

*/

content.ministryTicks.MAS.push(function(m) {
	if (m.data.cityMultAplied == undefined) m.data.cityMultAplied = {};
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') continue;
		if (city.ministriesPart.MAS == undefined) continue;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		
		if ((m.energy>(100+100/Math.pow(utils.getCityActualIndustrial(city),0.5)+Math.pow(city.ministriesPart.MAS,1.3))) && (Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta.MAS(city))) {
			let u = utils.getCityActualIndustrial(city)/50;
			console.log(u);
			if (u>avpart) u = avpart;
			city.ministriesPart.MAS += u;
			city.ministriesUsed+=u;
			m.energy -= 100/Math.pow(utils.getCityActualIndustrial(city),0.33)+Math.pow(city.ministriesPart.MAS,0.5);
		}
		
		if ((m.energy>utils.getCityActualTech(city)+50) && Math.random()>city.attributes.techPart/100) {
			m.energy-=utils.getCityActualTech(city);
			city.attributes.techPart += city.ministriesPart.MAS/50;
			city.attributes.industrialPart -= city.ministriesPart.MAS/100;
			city.attributes.militaryPart -= city.ministriesPart.MAS/100;
		}
		if (city.ministriesDisplayPart.MAS > 50 && !m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = true;
			city.attributes.techMult *= 3;
		}
		if (city.ministriesDisplayPart.MAS <= 50 && m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = false;
			city.attributes.techMult /= 3;
		}
	}
	if (m.energy>2000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MAS > 0) break;
			if (m.energy>2000+city.attributes.ponyCount*10 && utils.getCityActualIndustrial(city)>5) {
				city.ministriesPart.MAS = utils.getCityActualIndustrial(city)/5;
				m.energy-=(1850+city.attributes.ponyCount*10);
				break;
			}
		}
	}
});

content.ministryTicks.MWT.push(function(m) {
	if (m.data.cityMultAplied == undefined) m.data.cityMultAplied = {};
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') continue;
		if (city.ministriesPart.MWT == undefined) continue;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		if ((m.energy>(100+100/Math.pow(utils.getCityActualTech(city),0.5)+Math.pow(city.ministriesPart.MWT,1.3))) && (Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta.MWT(city))) {
			let u = utils.getCityActualTech(city)/50;
			if (u>avpart) u = avpart;
			city.ministriesPart.MWT += u;
			city.ministriesUsed+=u;
			m.energy -= 100/Math.pow(utils.getCityActualTech(city),0.33)+Math.pow(city.ministriesPart.MWT,0.5);
		}
		if ((m.energy>utils.getCityActualIndustrial(city)+50) && Math.random()>city.attributes.industrialPart/100) {
			m.energy-=utils.getCityActualIndustrial(city);
			city.attributes.techPart -= city.ministriesPart.MWT/100;
			city.attributes.industrialPart += city.ministriesPart.MWT/50;
			city.attributes.militaryPart -= city.ministriesPart.MWT/100;
		}
		if (city.ministriesDisplayPart.MWT > 50 && !m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = true;
			city.attributes.industrialMult *= 3;
		}
		if (city.ministriesDisplayPart.MWT <= 50 && m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = false;
			city.attributes.industrialMult /= 3;
		}
	}
	if (m.energy>2000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MWT > 0) break;
			if (m.energy>2000+city.attributes.ponyCount*10 && utils.getCityActualTech(city)>5) {
				city.ministriesPart.MWT = utils.getCityActualTech(city)/5;
				m.energy-=(1850+city.attributes.ponyCount*10);
				break;
			}
		}
	}
});

content.ministryTicks.MoA.push(function(m) {
	if (m.data.cityMultAplied == undefined) m.data.cityMultAplied = {};
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') continue;
		if (city.ministriesPart.MoA == undefined) continue;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		if ((m.energy>(100+100/Math.pow(utils.getCityActualTech(city),0.5)+Math.pow(city.ministriesPart.MoA,1.3))) && (Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta.MoA(city))) {
			let u = utils.getCityActualTech(city)/50;
			if (u>avpart) u = avpart;
			city.ministriesPart.MoA += u;
			city.ministriesUsed+=u;
			m.energy -= 100/Math.pow(utils.getCityActualTech(city),0.33)+Math.pow(city.ministriesPart.MoA,0.5);
		}
		if ((m.energy>utils.getCityActualMilitary(city)+50) && Math.random()>city.attributes.militaryPart/100) {
			m.energy-=utils.getCityActualMilitary(city);
			city.attributes.techPart -= city.ministriesPart.MoA/100;
			city.attributes.industrialPart -= city.ministriesPart.MoA/100;
			city.attributes.militaryPart += city.ministriesPart.MoA/50;
		}
		if (city.ministriesDisplayPart.MoA > 50 && !m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = true;
			city.attributes.militaryMult *= 3;
		}
		if (city.ministriesDisplayPart.MoA <= 50 && m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = false;
			city.attributes.militaryMult /= 3;
		}
	}
	if (m.energy>2000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MWT > 0) break;
			if (m.energy>2000+city.attributes.ponyCount*10 && utils.getCityActualTech(city)>5) {
				city.ministriesPart.MWT = utils.getCityActualTech(city)/5;
				m.energy-=(1850+city.attributes.ponyCount*10);
				break;
			}
		}
	}
});

content.ministryTicks.MoP.push(function(m) {
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') continue;
		if (city.ministriesPart.MoP == undefined) continue;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		if ((m.energy>(100+100/Math.pow(utils.getCityActualIndustrial(city),0.5)+Math.pow(city.ministriesPart.MoP,1.3))) && (Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta.MoP(city))) {
			let u = utils.getCityActualIndustrial(city)/50;
			if (u>avpart) u = avpart;
			city.ministriesPart.MoP += u;
			city.ministriesUsed+=u;
			m.energy -= 100/Math.pow(utils.getCityActualIndustrial(city),0.33)+Math.pow(city.ministriesPart.MoP,0.5);
		}
		if (city.ministriesDisplayPart.MoP > 50) {
			city.attributes.ratio+=0.12;
			let specs = world.specs.filter(function(spec) {
				return (spec.location == city.id && utils.ownedByPlayer(spec))
			});
			for (let i=0; i<specs.length; i++) {
				specs[i].attributes.health+=0.25;
				if (specs[i].attributes.health>specs[i].attributes.maxHealth) specs[i].attributes.health=specs[i].attributes.maxHealth;
			}
		}
	}
	if (m.energy>2000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MoP > 0) break;
			if (m.energy>2000+city.attributes.ponyCount*10 && utils.getCityActualIndustrial(city)>5) {
				city.ministriesPart.MoP = utils.getCityActualIndustrial(city)/5;
				m.energy-=(1850+city.attributes.ponyCount*10);
				break;
			}
			break;
		}
	}
});

content.ministryTicks.MI.push(function(m) {
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') continue;
		if (city.ministriesPart.MI == undefined) continue;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		if ((m.energy>(100+100/Math.pow(utils.getCityActualTech(city),0.5)+Math.pow(city.ministriesPart.MI,1.3))) && (Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta.MI(city))) {
			let u = utils.getCityActualTech(city)/50;
			if (u>avpart) u = avpart;
			city.ministriesPart.MI += u;
			city.ministriesUsed+=u;
			m.energy -= 100/Math.pow(utils.getCityActualTech(city),0.33)+Math.pow(city.ministriesPart.MI,0.5);
		}
		if (city.ministriesDisplayPart.MI > 50) {
			for (let cityName2 in world.cities) {
				world.cities[cityName2].attributes.ratio+=0.12;
			}
		}
	}
	if (m.energy>2000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MI > 0) break;
			if (m.energy>2000+city.attributes.ponyCount*10 && utils.getCityActualTech(city)>5) {
				city.ministriesPart.MI = utils.getCityActualTech(city)/5;
				m.energy-=(1850+city.attributes.ponyCount*10);
				break;
			}
			break;
		}
	}
});

content.ministryTicks.MoM.push(function(m) {
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') continue;
		if (city.ministriesPart.MoM == undefined) continue;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		if ((m.energy>(100+100/Math.pow(utils.getCityActualIndustrial(city),0.5)+Math.pow(city.ministriesPart.MoM,1.3))) && (Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta.MoM(city))) {
			let u = utils.getCityActualIndustrial(city)/50;
			if (u>avpart) u = avpart;
			city.ministriesPart.MoM += u;
			city.ministriesUsed+=u;
			m.energy -= 100/Math.pow(utils.getCityActualIndustrial(city),0.33)+Math.pow(city.ministriesPart.MoM,0.5);
		}
		if (city.ministriesDisplayPart.MoM > 50) {
			let specs = world.specs.filter(function(spec) {
				return (spec.location == city.id && utils.ownedByPlayer(spec))
			});
			for (let i=0; i<specs.length; i++) {
				specs[i].attributes.worktypeLoyalty+=0.1;
				if (specs[i].attributes.worktypeLoyalty>100) specs[i].attributes.worktypeLoyalty=100;
			}
			world.ministries.EQ.stats.loyalty+=0.1;
		}
	}
	
	if (m.energy>2000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MoM > 0) break;
			if (m.energy>2000+city.attributes.ponyCount*10 && utils.getCityActualIndustrial(city)>5) {
				city.ministriesPart.MoM = utils.getCityActualIndustrial(city)/5;
				m.energy-=(1850+city.attributes.ponyCount*10);
				break;
			}
			break;
		}
	}
});

content.ministryTicks.EQ.push(function(m) {
	m.stats.military = 0;
	let me = 0, ze = 0, pc=0, ratio=0;
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner == 'Z') ze+=utils.getCityActualMilitary(city)*3;
		else {
			me+=utils.getCityActualMilitary(city);
			pc+=city.attributes.ponyCount;
			ratio+=city.attributes.ponyCount*city.attributes.ratio;
		}
		
	}
	if (me<ze) {
		m.stats.military = me*50/ze;
		m.stats.treat = 100-50*me/ze;
	}
	else {
		m.stats.military = 100-ze*50/me;
		m.stats.treat = 50*ze/me;
	}
	
	m.stats.ratio = ratio/pc;
});

content.ministryTicks.Z.push(function(m) {
	m.stats.military = 0;
	let me = 0, ze = 0, pc=0, ratio=0;
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		if (city.owner != 'Z') ze+=utils.getCityActualMilitary(city);
		else {
			me+=utils.getCityActualMilitary(city)*3;
			pc+=city.attributes.ponyCount;
			ratio+=city.attributes.ponyCount*city.attributes.ratio;
		}
		
	}
	if (me<ze) {
		m.stats.military = me*50/ze;
		m.stats.treat = 100-50*me/ze;
	}
	else {
		m.stats.military = 100-ze*50/me;
		m.stats.treat = 50*ze/me;
	}
	
	m.stats.ratio = ratio/pc;
});