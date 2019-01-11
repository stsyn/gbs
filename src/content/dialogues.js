"use strict";
content.dialogues.Luna_Dialogue1 = {
	id:'Luna_Dialogue1',
	checkAvailibility:function() {return true},
	startingNode:function() {return 'start1'},
	tree:{
		start1:{
			text:'Привет, мир!'
		},
		start2:{
			text:'Тестирование скорости текста 80001041324 2451515867 ,,,,,,!....,,!?',
			choices:[
				{text:'Повторить', newNode:'start2'},
				{text:'Дальше',newNode:'start3'}
			]
		},
		start3:{
			text:'Тестирование выбора',
			choices:[
				{text:'В начало', newNode:'start1'},
				{text:'Повторить', newNode:'start3'},
				{text:'Выйти',newNode:'_end'}
			]
		}
	}
}