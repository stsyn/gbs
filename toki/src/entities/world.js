'use strict';
function world_proto() {
	this.ministries = {};
	this.specs = [];
	this.tasks = [];
	this.cities = {};
	this.messages = [];
	this.lastMessageId = 0;
	this.time = 0;
	
	this.data = {};
	this.data.weekDay = 0;
	this.data.specs = 0;
	this.data.taskStartTimeout = 240;
	this.data.travelSpeed = 300;
	this.roadmap = content.roadmap;
	this.homecity = 'canterlot';
};
var world = new world_proto();
content.worldCreators.push(function(w) {
	w.time = 0;
	w.dcounter = utils.time2ms({date:1});
	document.querySelectorAll('#top .ico1')[1].classList.add('sel');
	for (let i=0; i<consts.ministries.length; i++) w.ministries[consts.ministries[i]] = new ministry();
	w.specs.push(new spec(content.presetedSpecs.GB));
	w.specs.push(new spec(content.presetedSpecs.TS));
	w.specs.push(new spec(content.presetedSpecs.Rarara));
	w.specs.push(new spec(content.presetedSpecs.FS));
	w.specs.push(new spec(content.presetedSpecs.RD));
	w.specs.push(new spec(content.presetedSpecs.AJ));
	w.specs.push(new spec(content.presetedSpecs.PP));
	
	w.specs.push(new spec(content.presetedSpecs.Luna));
	
	
	let uI = function(city) {return utils.getCityActualIndustrial(city)/5;};
	let uT = function(city) {return utils.getCityActualTech(city)/5;};
	content.ministryCityPartDelta.MAS = uI;
	content.ministryCityPartDelta.MoM = uI;
	content.ministryCityPartDelta.MI  = uT;
	content.ministryCityPartDelta.MoP = uI;
	content.ministryCityPartDelta.MWT = uT;
	content.ministryCityPartDelta.MoA = uT;
	
	content.ministryCityTicks.EQ.push(utils.normalCityTick);
	
	for (cityTemplate in content.cities) {
		if (cityTemplate != 'hoofington') {
			world.cities[cityTemplate] = new city(content.cities[cityTemplate]);
			world.cities[cityTemplate].tick = utils.normalCityTick;
		}
	}
	
	for (let i=0; i<consts.ministries.length; i++) {
		w.ministries[consts.ministries[i]] = {
			id:consts.ministries[i],
			isCountry:false,
			isEnemy:false,
			owner:null,
			specs:[],
			technologies:[],
			
			info:{
				name:strings.ministries.names[consts.ministries[i]],
				iconUrl:strings.ministries.icons[consts.ministries[i]],
				iconOffset:strings.ministries.iconOffsets[consts.ministries[i]],
				bigIconUrl:strings.ministries.bigPictures[consts.ministries[i]],
			},
			
			stats:{
				military:0,
				loyalty:50.15,
				treat:0,
				money:0,
				part:0
			},
			data:{
				
			},
			energy:0
		};
	}
	w.ministries.DDD = {id:'DDD',specs:[],info:{iconUrl:strings.ministries.icons.DDD,iconOffset:strings.ministries.iconOffsets.DDD},ministryTicks:[],specTicks:[],priorities:function(spec){return spec.id}}
	w.ministries.Z.isCountry = true;
	w.ministries.Z.isEnemy = true;
	w.ministries.Z.stats.loyalty = 10;
	w.ministries.EQ.stats.loyalty = 50;
	w.ministries.EQ.money = {value:500000};
	w.ministries.OIA.money = {value:5000};
	w.ministries.EQ.isCountry = true;
	w.ministries.OIA.stats.part = null;
	w.playerMinistry = 'OIA';
	content.ministrySpecTicks.OIA.push(utils.OIAspecTick);
	
	
	for (let i=0; i<7; i++) {
		w.ministries[consts.ministries[i]].owner = i;
		utils.spec2ministry(i, consts.ministries[i]);
	}
	
	
	w.ministries.EQ.owner = utils.getSpecById('Luna').id;
	utils.spec2ministry(utils.getSpecById('Luna').id, 'EQ');
	
	let tarr = [];
	for (let i=0; i<60; i++) {
		w.specs.push(new spec({location:'canterlot', stats:{specie:parseInt(Math.random()*3)}, attributes:{involvement:10}}));
		tarr.push(w.specs.length-1);
	}
	for (let i=0; i<consts.actualMinistries.length; i++) {
		content.ministryTicks[consts.actualMinistries[i]].push(utils.ministryTick);
	}
	
	w.ministries.MoM.priorities = function(spec) {return utils.getActualEndurance(spec)+utils.getActualCharisma(spec)};
	w.ministries.MAS.priorities = function(spec) {return utils.getActualIntellect(spec)};
	w.ministries.MI.priorities = function(spec) {return utils.getActualCharisma(spec)};
	w.ministries.MoP.priorities = function(spec) {return utils.getActualIntellect(spec)+utils.getActualCharisma(spec)};
	w.ministries.MoA.priorities = function(spec) {return utils.getActualEndurance(spec)};
	w.ministries.MWT.priorities = function(spec) {return utils.getActualEndurance(spec)+utils.getActualIntellect(spec)};
	
	w.ministries.EQ.priorities = function(spec) {return utils.getActualEndurance(spec)+utils.getActualIntellect(spec)+utils.getActualCharisma(spec)};
	w.ministries.Z.priorities = function(spec) {return utils.getActualEndurance(spec)+utils.getActualIntellect(spec)+utils.getActualCharisma(spec)};
	w.ministries.OIA.priorities = function(spec) {return utils.getActualEndurance(spec)+utils.getActualIntellect(spec)+utils.getActualCharisma(spec)};
	
	let currentMinistry = parseInt(Math.random()*6);
	for (let i=0; i<60; i++) {
		let max = 0, id = 0;
		for (let j=0; j<tarr.length; j++) {
				if (max < w.ministries[consts.ministries[currentMinistry+1]].priorities(world.specs[tarr[j]])) {
				max = w.ministries[consts.ministries[currentMinistry+1]].priorities(world.specs[tarr[j]]);
				id = j;
			}
		}
		utils.spec2ministry(tarr[id], consts.ministries[currentMinistry+1]);
		world.specs[tarr[id]].attributes.secrecy = 80;
		tarr.splice(id, 1);
		currentMinistry = ++currentMinistry%6;
	}
});
function m_init() {return 0}