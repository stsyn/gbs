'use strict';
class questModel {
	constructor() {
		this.id = 'id';
		this.hidden = true;
		this.name = 'Quest Name';
		this.description = function(questState) {return 'Quest description'};
		this.finalDescription = function(questState) {return 'Quest description upon completion'};
		this.target = 10;
		this.initateAfter = function(questState) {['nextQuestId']};
		this.whenStarted = function(questState) {return 0;};
		this.update = function(questState) {return 0;};
		this.whenCompleted = function(questState) {return 0;};
		this.whenAborted = function(questState) {return 0;};	//equialent to fail
		this.commands = [{
			text:'Command action',
			availability:function (questState) {return true;};
			action:function (questState) {return 0;};
		}];
		this.data = {};		//lang data, constant custom data
	}
}

class questState {
	constructor() {
		this.id = 'id';
		this.processing = false;
		this.state = 0;
		this.data = {};		//custom not static data
	}
}