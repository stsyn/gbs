"use strict";
class spec {
	constructor(spec = {
		stats:{name:'',charisma:0,intellect:0,endurance:0,level:undefined,experience:undefined,gender:0,specie:undefined,
			portrait:{url:''}},
		attributes:{payout:undefined,maxHealth:0,involvement:0,payoutSatisfaction:0,workSatisfaction:90,worktypeSatisfaction:50,workbalance:0,secrecy:100},
		ministry:null,owner:null,location:null,perks:null,isPerkExplored:[],tasks:[],messages:[],notifyLevel:null
	}) {
		this.id = world.specs.length;
		this.internalId = spec.id;
		this.shadow = {};
		this.shadow.charismaMult = 1;
		this.shadow.intellectMult = 1;
		this.shadow.enduranceMult = 1;
		this.shadow.maxHealthMult = 1;
		this.shadow.levelUpExpMult = 1;
		this.shadow.payoutSatisfactionMult = 1;
		this.shadow.payoutLoyaltyMult = 1;
		this.shadow.satisfactionLoyaltyMult = 1;
		this.shadow.speedMult = 1;
		this.shadow.workSatisfactionMult = 1;
		this.shadow.workTypeSatisfactionMult = 1;
		this.shadow.workHealthMult = 1;
		this.shadow.relaxSatisfactionMult = 1;
		this.shadow.workPenaltyMult = 1;
		this.shadow.workbalanceMult = consts.sleepOverWork;
		
		this.shadow.failChanceMult = 1;
		this.shadow.badTasksMult = 0.5;
		this.shadow.zebraTasksMult = 1;
		
		this.shadow.loyaltyBonus = 0;
		this.shadow.satisfactionBonus = 0;
		
		this.shadow.excludePerkLists = {};
		
		this.messages = [];
		this.notifyLevel = -1;
		
		this.counters = {};
		this.counters.updateMult = 1;
		this.counters.main = consts.specUpdateInterval;
		
		if (spec.stats == undefined) spec.stats = {};
		if (spec.stats.portrait == undefined) spec.stats.portrait = {};
		if (spec.attributes == undefined) spec.attributes = {};
		
		this.stats = spec.stats;
		this.attributes = spec.attributes;
		if (this.attributes == undefined) this.attributes = {};
		if (this.attributes.loyalty == undefined) this.attributes.loyalty=50;
		if (this.attributes.involvement == undefined) this.attributes.involvement=0;
		if (this.attributes.workSatisfaction == undefined) this.attributes.workSatisfaction=90;
		if (this.attributes.worktypeSatisfaction == undefined) this.attributes.worktypeSatisfaction=100;
		if (this.attributes.payoutSatisfaction == undefined) this.attributes.payoutSatisfaction=0;
		if (this.attributes.workbalance == undefined) this.attributes.workbalance=0;
		if (this.attributes.secrecy == undefined) this.attributes.secrecy=100;
		if (this.attributes.unspecified == undefined) this.attributes.unspecified=[];
		this.ministry = spec.ministry;
		this.owner = spec.owner;
		this.location = spec.location;
		this.perks = (spec.perks!=undefined)?spec.perks:null;
		this.isPerkExplored = spec.isPerkExplored;
		this.tasks = (spec.tasks!=undefined)?spec.tasks:[];
		
		if (this.stats.specie == undefined) this.stats.specie = parseInt(Math.random()*consts.species.length);
        
		if (this.stats.portrait.bodyColor == undefined || this.stats.portrait.bodyColor.length != 7) {
			this.stats.portrait.bodyHSV = {};
			this.stats.portrait.bodyHSV.h = parseInt(Math.random() * 360);
			this.stats.portrait.bodyHSV.s = parseInt(Math.random() * 100);
			this.stats.portrait.bodyHSV.v = parseInt((1-Math.random()*Math.random()) * 50);
		}
		if (this.stats.portrait.maneColor == undefined ||this.stats.portrait.maneColor.length != 7) {
			this.stats.portrait.maneHSV = {};
			let i = parseInt(Math.random()*4);
			if (i == 0) 
				this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 180) % 360;
			else if (i == 1) {
				if (Math.random() > 0.5) 
					this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 30) % 360;
				else 
					this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 330) % 360;
			}
			else if (i == 2) {
				if (Math.random() > 0.5) 
					this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 120) % 360;
				else 
					this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 240) % 360;
			}
			else {
				if (Math.random() > 0.5) 
					this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 150) % 360;
				else 
					this.stats.portrait.maneHSV.h = (this.stats.portrait.bodyHSV.h + 210) % 360;
			}
			this.stats.portrait.maneHSV.s = this.stats.portrait.bodyHSV.s + parseInt(Math.random()*Math.random() * (100 - this.stats.portrait.bodyHSV.s));
			this.stats.portrait.maneHSV.v = this.stats.portrait.bodyHSV.v + parseInt(Math.random()*Math.random() * (100 - this.stats.portrait.bodyHSV.v));
			this.stats.portrait.bodyColor = utils.hsv2rgb(this.stats.portrait.bodyHSV);
			this.stats.portrait.maneColor = utils.hsv2rgb(this.stats.portrait.maneHSV);
		}
		
		if (this.stats.intellect+this.stats.endurance+this.stats.charisma != 300) utils.generateStats(this);
		if (this.stats.level == undefined) this.stats.level = parseInt(Math.random()*Math.random()*Math.random()*3);
		
		if (this.isPerkExplored == null || this.isPerkExplored.length != this.perks) this.isPerkExplored = [];
		if (this.perks == null) utils.generatePerks(this);
		else {
			this.perks = [];
			for (let i=0; i<spec.perks.length; i++) utils.addPerk(this, spec.perks[i]);
		}
	
		if (this.attributes.payout == undefined) utils.calcPayout(this);
		this.attributes.currentPayout = this.attributes.payout;
		if (this.stats.name == '' || this.stats.name == undefined) {
			let t = utils[consts.speciesNameGenerFunction[this.stats.specie]](this);
			this.stats.name = t.n;
			this.stats.gender = t.g;
			if (this.stats.gender == 0) this.stats.gender = parseInt(Math.random()*2+1);
			let portrait = this.stats.portrait;
			portrait.id = content.portraitsListing[this.stats.specie][parseInt(content.portraitsListing[this.stats.specie].length*Math.random())];
			let currentPortrait = content.portraits[portrait.id];
			portrait.gender = this.stats.gender;
			portrait.wings = (this.stats.specie == 2 || this.stats.specie == 3)?1:0;
			portrait.horn = (this.stats.specie == 1 || this.stats.specie == 3)?1:0;
			portrait.mane = parseInt(currentPortrait.parts.mane.content.length*Math.random());
			portrait.mirrored = (Math.random()<0.5);
			
		}
		if (this.stats.gender == 0) this.stats.gender = parseInt(Math.random()*2+1);
		
		this.attributes.maxHealth = utils.generateMaxHealth(this);
		if (this.attributes.health == undefined) this.attributes.health=this.attributes.maxHealth;
		if (this.stats.experience == undefined) {
			if (this.stats.level<3) {
				this.stats.experience = consts.nextLevel[this.stats.level];
				for (let i=0; i<=this.stats.level; i++) this.stats.experience*=Math.random();
				this.stats.experience = parseInt(this.stats.experience);
			}
			else this.stats.experience = 0;
		}
		
	}
}
function m_init() {return 0}