'use strict';
class message {
	constructor(containerType, containerId, level, text, num) {
		this.text = text;
		this.level = level;
		this.read = false;
		this.date = world.time;
		this.id = num;
		this.containerType = containerType;
		let t = [];
		if (containerId.length == undefined) this.containerId = [containerId];
		else containerId.forEach(function (m,i,a) {t.push(m)});
		this.containerId = t;
		
		
		for (let j=0; j<this.containerId.length; j++) world[containerType][containerId[j]].messages.unshift(num);
		
	}
}