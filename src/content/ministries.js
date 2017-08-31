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
		if ((m.energy>(100+utils.getCityActualIndustrial(city)/5)) && (city.ministriesPart.MAS<city.attributes.ponyCount+utils.getCityActualIndustrial(city))) {
			city.ministriesPart.MAS += utils.getCityActualIndustrial(city)/50;
			m.energy -= utils.getCityActualIndustrial(city)/5;
		}
		city.attributes.techPart += city.ministriesPart.MAS/50;
		city.attributes.industrialPart -= city.ministriesPart.MAS/100;
		city.attributes.militaryPart -= city.ministriesPart.MAS/100;
		if (city.ministriesPart.MAS > 50 && !m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = true;
			city.attributes.techMult *= 3;
		}
		if (city.ministriesPart.MAS <= 50 && m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = false;
			city.attributes.techMult /= 3;
		}
	}
	if (m.energy>5000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MAS > 0) break;
			if (m.energy>5000+city.attributes.ponyCount*10 && utils.getCityActualIndustrial(city)>5) {
				city.ministriesPart.MAS = utils.getCityActualIndustrial(city)/5;
				m.energy-=(5000+city.attributes.ponyCount*10);
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
		if ((m.energy>(100+utils.getCityActualTech(city)/5)) && (city.ministriesPart.MWT<city.attributes.ponyCount+utils.getCityActualTech(city))) {
			city.ministriesPart.MWT += utils.getCityActualTech(city)/50;
			m.energy -= utils.getCityActualTech(city)/5;
		}
		city.attributes.techPart += city.ministriesPart.MWT/100;
		city.attributes.industrialPart -= city.ministriesPart.MWT/50;
		city.attributes.militaryPart -= city.ministriesPart.MWT/100;
		if (city.ministriesPart.MWT > 50 && !m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = true;
			city.attributes.industrialMult *= 3;
		}
		if (city.ministriesPart.MWT <= 50 && m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = false;
			city.attributes.industrialMult /= 3;
		}
	}
	if (m.energy>5000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MWT > 0) break;
			if (m.energy>5000+city.attributes.ponyCount*10 && utils.getCityActualTech(city)>5) {
				city.ministriesPart.MWT = utils.getCityActualTech(city)/5;
				m.energy-=(5000+city.attributes.ponyCount*10);
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
		if ((m.energy>(100+utils.getCityActualTech(city)/5)) && (city.ministriesPart.MoA<city.attributes.ponyCount+utils.getCityActualTech(city))) {
			city.ministriesPart.MoA += utils.getCityActualTech(city)/50;
			m.energy -= utils.getCityActualTech(city)/5;
		}
		city.attributes.techPart += city.ministriesPart.MoA/100;
		city.attributes.industrialPart -= city.ministriesPart.MoA/100;
		city.attributes.militaryPart -= city.ministriesPart.MoA/50;
		if (city.ministriesPart.MoA > 50 && !m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = true;
			city.attributes.militaryMult *= 3;
		}
		if (city.ministriesPart.MoA <= 50 && m.data.cityMultAplied[cityName]) {
			m.data.cityMultAplied[cityName] = false;
			city.attributes.militaryMult /= 3;
		}
	}
	if (m.energy>5000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MWT > 0) break;
			if (m.energy>5000+city.attributes.ponyCount*10 && utils.getCityActualTech(city)>5) {
				city.ministriesPart.MWT = utils.getCityActualTech(city)/5;
				m.energy-=(5000+city.attributes.ponyCount*10);
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
		if ((m.energy>(100+utils.getCityActualIndustrial(city)/5)) && (city.ministriesPart.MoP<city.attributes.ponyCount+utils.getCityActualIndustrial(city))) {
			city.ministriesPart.MoP += utils.getCityActualIndustrial(city)/50;
			m.energy -= utils.getCityActualIndustrial(city)/5;
		}
		if (city.ministriesPart.MoP > 50) {
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
	if (m.energy>5000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MoP > 0) break;
			if (m.energy>5000+city.attributes.ponyCount*10 && utils.getCityActualIndustrial(city)>5) {
				city.ministriesPart.MoP = utils.getCityActualIndustrial(city)/5;
				m.energy-=(5000+city.attributes.ponyCount*10);
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
		if ((m.energy>(100+utils.getCityActualTech(city)/5)) && (city.ministriesPart.MI<city.attributes.ponyCount+utils.getCityActualTech(city))) {
			city.ministriesPart.MI += utils.getCityActualTech(city)/50;
			m.energy -= utils.getCityActualTech(city)/5;
		}
		if (city.ministriesPart.MI > 50) {
			for (let cityName2 in world.cities) {
				world.cities[cityName2].attributes.ratio+=0.12;
			}
		}
	}
	if (m.energy>5000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MI > 0) break;
			if (m.energy>5000+city.attributes.ponyCount*10 && utils.getCityActualTech(city)>5) {
				city.ministriesPart.MI = utils.getCityActualTech(city)/5;
				m.energy-=(5000+city.attributes.ponyCount*10);
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
		if ((m.energy>(100+utils.getCityActualIndustrial(city)/5)) && (city.ministriesPart.MoM<city.attributes.ponyCount+utils.getCityActualIndustrial(city))) {
			city.ministriesPart.MoM += utils.getCityActualIndustrial(city)/50;
			m.energy -= utils.getCityActualIndustrial(city)/5;
		}
		if (city.ministriesPart.MoM > 50) {
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
	
	if (m.energy>5000) {
		let x = parseInt(Math.random()*world.cities.length);
		for (let cityName in world.cities) {
			if (x>0) {
				x--;
				continue;
			}
			let city = world.cities[cityName];
			if (city.ministriesPart.MoM > 0) break;
			if (m.energy>5000+city.attributes.ponyCount*10 && utils.getCityActualIndustrial(city)>5) {
				city.ministriesPart.MoM = utils.getCityActualIndustrial(city)/5;
				m.energy-=(5000+city.attributes.ponyCount*10);
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
		if (city.owner == 'Z') ze+=utils.getCityActualMilitary(city)*10;
		else {
			me+=utils.getCityActualMilitary(city);
			pc+=city.attributes.ponyCount;
			ratio+=city.attributes.ponyCount*city.attributes.ratio;
		}
		
	}
	if (me<ze) m.stats.military = me*50/ze;
	else m.stats.military = 100-50*ze/me
	
	m.stats.ratio = ratio/pc;
});