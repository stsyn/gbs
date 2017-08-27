'use strict',
content.cities.canterlot = {
	id:'canterlot',
	name:'Кантерлот',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:60,
		ponyCountMax:75,
		
		techPart:80,
		militaryPart:10,
		industrialPart:10,
		
		techMult:1,
		militaryMult:1,
		industrialMult:1,
		racesEffectiencyMult:[1,1,1,1,0.5]
	},
	ministriesPart:{
		MoA:9,
		MI:9,
		MWT:9,
		MAS:9,
		MoM:9,
		MoP:9
	},
	tick:function(city) {return 0}
};

content.cities.ponyville = {
	id:'ponyville',
	name:'Понивилль',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:30,
		ponyCountMax:60,
		
		techPart:30,
		militaryPart:30,
		industrialPart:40,
		
		techMult:1,
		militaryMult:1,
		industrialMult:1,
		
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.manehattan = {
	id:'manehattan',
	name:'Мейнхеттен',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:150,
		ponyCountMax:200,
		
		techPart:20,
		militaryPart:20,
		industrialPart:60,
		
		techMult:1,
		militaryMult:1,
		industrialMult:1,
		
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.cloudsdale = {
	id:'cloudsdale',
	name:'Клаудсдейл',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:40,
		ponyCountMax:80,
		
		techPart:5,
		militaryPart:90,
		industrialPart:5,
		
		techMult:0.8,
		militaryMult:1.2,
		industrialMult:0.8,
		
		racesEffectiencyMult:[0,0.1,2,1,0.0]
	},
	tick:function(city) {return 0}
};

content.cities.stalliongrad = {
	id:'stalliongrad',
	name:'Сталлионград',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:120,
		ponyCountMax:180,
		
		techPart:30,
		militaryPart:30,
		industrialPart:40,
		
		techMult:1,
		militaryMult:1,
		industrialMult:1.2,
		
		racesEffectiencyMult:[2,0.5,0.5,0.25,1]
	},
	tick:function(city) {return 0}
};

content.cities.fillydelphia = {
	id:'fillydelphia',
	name:'Филлидельфия',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:150,
		ponyCountMax:200,
		
		techPart:20,
		militaryPart:10,
		industrialPart:70,
		
		techMult:1,
		militaryMult:1,
		industrialMult:1.1,
		
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.hoofington = {
	id:'hoofington',
	name:'Хуффингтон',
	owner:'EQ',
	
	attributesStatic:{
		ponyCountMin:10,
		ponyCountMax:250,
		
		techPart:30,
		militaryPart:40,
		industrialPart:30,
		
		techMult:1.5,
		militaryMult:1.5,
		industrialMult:1.5,
		
		racesEffectiencyMult:[1,1,1,1,1]
	},
	tick:function(city) {return 0}
};

content.cities.roam = {
	id:'roam',
	name:'Роам',
	owner:'Z',
	
	attributesStatic:{
		ponyCountMin:100,
		ponyCountMax:350,
		
		techPart:30,
		militaryPart:40,
		industrialPart:30,
		
		techMult:1.2,
		militaryMult:1.2,
		industrialMult:1.2,
		
		racesEffectiencyMult:[0.8,0.8,0.8,1,1.2]
	},
	tick:function(city) {return 0}
};

content.roadmap.canterlot = {
	canterlot:1,
	ponyville:3,
	manehattan:9,
	cloudsdale:4,
	stalliongrad:15,
	fillydelphia:12,
	hoofington:10,
	roam:45
};

content.roadmap.ponyville = {
	canterlot:3,
	ponyville:1,
	manehattan:8,
	cloudsdale:3,
	stalliongrad:18,
	fillydelphia:10,
	hoofington:13,
	roam:44
};

content.roadmap.manehattan = {
	canterlot:9,
	ponyville:8,
	manehattan:1,
	cloudsdale:6,
	stalliongrad:21,
	fillydelphia:11,
	hoofington:16,
	roam:40
};

content.roadmap.cloudsdale = {
	canterlot:4,
	ponyville:3,
	manehattan:6,
	cloudsdale:1,
	stalliongrad:17,
	fillydelphia:10,
	hoofington:13,
	roam:46
};

content.roadmap.stalliongrad = {
	canterlot:15,
	ponyville:18,
	manehattan:21,
	cloudsdale:17,
	stalliongrad:1,
	fillydelphia:27,
	hoofington:5,
	roam:49
};

content.roadmap.fillydelphia = {
	canterlot:12,
	ponyville:10,
	manehattan:11,
	cloudsdale:10,
	stalliongrad:27,
	fillydelphia:1,
	hoofington:22,
	roam:33
};

content.roadmap.hoofington = {
	canterlot:10,
	ponyville:13,
	manehattan:16,
	cloudsdale:13,
	stalliongrad:5,
	fillydelphia:22,
	hoofington:1,
	roam:52
};

content.roadmap.roam = {
	canterlot:45,
	ponyville:44,
	manehattan:40,
	cloudsdale:46,
	stalliongrad:49,
	fillydelphia:33,
	hoofington:52,
	roam:1
};