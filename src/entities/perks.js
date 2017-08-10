"use strict";
class perk {
	constructor() {
		this.id = null;
		this.name = null;
		this.description = null;
		this.secrecy = 0;
		this.whenGet = function(spec) {};
		this.onTask = function(spec) {};
		this.onIdle = function(spec) {};
	}
}

class perkVarPool {
	constructor() {
		this.id = null;
		this.list = [];
		this.chance = 0;
		
		this.chanceCalc = function(spec, world) {};
	}
}

class perkExclusions {
	constructor() {
		this.id = null;
		this.list1 = [];
		this.list2 = [];
	}
}

class perkRerolls {
	constructor() {
		this.id = null;
		this.initator = null;
		this.chance = 0;
		this.list = [];
		
		this.amplifiers = [];
		this.dividers = [];
	}
}
function m_init() {return 0}