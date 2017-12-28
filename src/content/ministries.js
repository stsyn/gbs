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

let mins = {
	extend:function(m, ax) {
		if (m.energy>2000) {
			let x = parseInt(Math.random()*world.cities.length);
			for (let cityName in world.cities) {
				if (x>0) {
					x--;
					continue;
				}
				let city = world.cities[cityName];
				if (city.ministriesPart[m.id] > 0) break;
				if (m.energy>2000+city.attributes.ponyCount*10 && ax(city)>5) {
					city.ministriesPart[m.id] = ax(city)/5;
					m.energy-=(1850+city.attributes.ponyCount*10);
					break;
				}
			}
		}
	},
	cityExtend:function(m, city) {
		if (city.owner == 'Z') return;
		if (city.ministriesPart[m.id] == undefined) return;
		let avpart = city.attributes.ponyCount-city.ministriesUsed;
		
		for (let i=0; i<m.energy/500; i++) {
			if (
				(m.energy>(100+100/Math.pow(content.ministryCityPartDelta[m.id]*5,0.5)+Math.pow(city.ministriesPart[m.id],1.3))) && 
				(Math.random()*Math.random()>city.ministriesDisplayPart[m.id]/100) && (city.ministriesPart[m.id]/50<avpart+content.ministryCityPartDelta[m.id](city))
			) {
				let u = content.ministryCityPartDelta[m.id]/10;
				console.log(u);
				if (u>avpart) u = avpart;
				city.ministriesPart[m.id] += u;
				city.ministriesUsed+=u;
				m.energy -= 100/Math.pow(content.ministryCityPartDelta[m.id]*5,0.33)+Math.pow(city.ministriesPart[m.id],0.5);
			}
		}
	}
};

content.ministryTicks.MAS.push(function(m) {
	if (m.data.cityMultAplied == undefined) m.data.cityMultAplied = {};
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		
		mins.cityExtend(m, city);
		
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
	mins.extend(m,utils.getCityActualIndustrial);
});

content.ministryTicks.MWT.push(function(m) {
	if (m.data.cityMultAplied == undefined) m.data.cityMultAplied = {};
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		mins.cityExtend(m, city);
		
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
	mins.extend(m,utils.getCityActualTech);
});

content.ministryTicks.MoA.push(function(m) {
	if (m.data.cityMultAplied == undefined) m.data.cityMultAplied = {};
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		mins.cityExtend(m, city);
		
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
	mins.extend(m,utils.getCityActualTech);
});

content.ministryTicks.MoP.push(function(m) {
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		mins.cityExtend(m, city);
		
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
	mins.extend(m,utils.getCityActualIndustrial);
});

content.ministryTicks.MI.push(function(m) {
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		mins.cityExtend(m, city);
		
		if (city.ministriesDisplayPart.MI > 50) {
			for (let cityName2 in world.cities) {
				world.cities[cityName2].attributes.ratio+=0.12;
			}
		}
	}
	mins.extend(m,utils.getCityActualTech);
});

content.ministryTicks.MoM.push(function(m) {
	for (let cityName in world.cities) {
		let city = world.cities[cityName];
		mins.cityExtend(m, city);
		
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
	mins.extend(m,utils.getCityActualIndustrial);
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