'use strict'; 
class cityTemplate {
	constructor() {
		this.id = null;
		this.name = '';
		this.owner = null;
		
		this.attributesStatic = {};
		this.attributesStatic.ponyCountMin = 0;
		this.attributesStatic.ponyCountMax = 1;
		
		this.attributesStatic.techPart = 0;
		this.attributesStatic.militaryPart = 0;
		this.attributesStatic.industrialPart = 0;
		
		this.attributesStatic.techMult = 1;
		this.attributesStatic.militaryMult = 1;
		this.attributesStatic.industrialMult = 1;
		
		this.tick = function(city) {return 0}
	}
}

class city {
	constructor(template) {
		this.owner = template.owner;
		this.locatedSpecs = [];
		
		this.messages = [];
		this.notifyLevel = -1;
		
		this.attributes = {};
		this.attributes.ponyCount = template.attributesStatic.ponyCountMin;
		this.attributes.ponyCountMax = template.attributesStatic.ponyCountMax;
		this.attributes.techPart = template.attributesStatic.techPart;
		this.attributes.militaryPart = template.attributesStatic.militaryPart;
		this.attributes.industrialPart = template.attributesStatic.industrialPart;
		
		this.attributes.techMult = template.attributesStatic.techMult;
		this.attributes.militaryMult = template.attributesStatic.militaryMult;
		this.attributes.industrialMult = template.attributesStatic.industrialMult;
		
		if (template.ministriesPart == undefined) this.ministriesPart = {};
		else this.ministriesPart = template.ministriesPart;
		this.maxMinistriesPart = 0;
	}
}