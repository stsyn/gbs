'use strict';
class dialogueModel {
	constructor() {
		this.id = 'id';
		this.defaultSpecialist = 'unique_named_char_id';							//optional, only if differs from attached
		this.checkAvailibility = function(dialState) {/*return true/false*/};
		this.startingNode = function(dialState) {/*return node object name*/}; 		//executes when dialogue calls, preparations can be done here
		this.tree = {
			// _end is reserved
			functional_node_example:{
				onShow:function(dialState) {return 0;}, 							//optional
				overrideSpecialist:function(dialState) {/*return specialistId*/},	//optional, -1 - keep original, null - empty
				text:function(dialState) {/*return message text*/}, 				//required
				choices:function(dialState) {return []}, 							//optional
				next:function(dialState) {/*return node name*/}						//if no choices. However, if node name ends with a number, will be incremented, so optional
			},
			static_node_example:{
				onShow:function(dialState) {return 0;},
				overrideSpecialist:"unique_named_char_id",
				
				text:"Example text",
				choices:[
					{text:"Switch node", newNode:"targetNode"},
					{text:"Do smthng & switch node", action:function(dialState) {return 0;}, newNode:"targetNode"},
					{text:"Unavailable choice", unavailable:true},
					{generator:function(dialState) {return {};}}
				],
				next:"Unreachable node in this scenario"
			}
		};
	}
}

class dialState {
	//subfield specialist.dialState
	constructor(spec, dialogue) {
		this.background = false;
		this.attachedSpecialistId = spec.id;
		this.overridingSpecialistId = -1;
		this.dialogueId = dialogue.id;
		this.currentNode = '';
		this.isAvailable = true;
		this.data = {};
	}
}

/*utils.setDialogueToSpecialist(specialist, dialogue)
utils.isDialoguePossible(specialist)
utils.startDialogue(specialist)
utils.changeDialogueNode(dialState, node)
utils.stopDialogue(dialState)*/