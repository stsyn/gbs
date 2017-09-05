"use strict";
for (let i=0; i<m.length; i++) {
	if (m[i] == "toki/src/player.js") {
		m.splice(i+1, 0, "https://www.youtube.com/iframe_api");
		break;
	}
}

var player, plapi = {state:-1, mods:[], random:false, loop:false, name:'XXXX', c:0, c2:0, loaded:true, ready:false};
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '1',
        width: '1',
		playerVars: {
			listType: 'playlist',
			//list: 'PLdlZZmhB8NZKBTAHgh7YkHjVvwKJJEdsH',
			//list: 'PLcHa462awHPlRxfq9Y17FwtBKXtsWNozR',
			list: 'PLBLUz3xoZ6bkr3UC0lFa0GC-ZQBY5deCG',
			loop: 1
		},
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
			'onStateChange': onPlayerStateChange
        }
    });
}

function setVolume(vol) {
	if (vol == 6) player.setVolume(0);
	else player.setVolume(100/Math.pow(vol, 1.25));
}

function onPlayerReady(event) {
	plapi.loaded = false;
	if (!plapi.ready) return;
	
	player.setShuffle(plapi.random = !plapi.random);
	setVolume(plapi.volume = 3);
	let i, cc = document.querySelector('#player .cc .table').getElementsByClassName('t2')[0].getElementsByClassName('t')[7];
	for (i=0; i<(6-plapi.volume); i++) cc.getElementsByTagName('svg')[i].style.opacity = '1';
	for (i; i<5; i++) cc.getElementsByTagName('svg')[i].style.opacity = '0';
	playerTrackName();
	playerOrder();
	for (i=0; i<plapi.mods.length; i++) plapi.mods[i]();
	
	plapi.loaded = true;
}

function onPlayerStateChange(event) {
    plapi.state = event.data;
	if (plapi.state == 1) {
		playerTrackName();
		plapi.continueBack = false;
		let req = new XMLHttpRequest();
		req.onreadystatechange = playerHeaderUpd(req);
		plapi.apiKey = 'AIzaSyAHJ0dU77qI7glFOhA1ZkEtFINyne65mNo';
		req.open('GET', 'https://www.googleapis.com/youtube/v3/videos?id='+player.getVideoUrl().split('=').pop()+'&key='+plapi.apiKey+'&fields=items(id,snippet(title))&part=snippet');
		req.send();
		playerOrder();
		document.querySelector('#player .cc .line').getElementsByClassName('b')[1].href = player.getVideoUrl();
		plapi.c=0;
		if (plapi.prevstate != 2) plapi.c2=0;
		player.getPlaylist()
	}
	plapi.prevstate = plapi.state;
}

function playerHeaderUpd(req) {
	return function () {
		if (req.readyState === 4) {
			if (req.status === 200) {
				let x = JSON.parse(req.responseText);
				plapi.name = x.items[0].snippet.title;
				return 0;
			}
			else {
				plapi.name = 'Cannot get video name';
				return req.status;
			}
		}
	};
}

function onPlayerError(event) {
	if (event.data >= 100) {
		if (plapi.continueBack) player.previousVideo();
		else player.nextVideo();
	}
}

function playerTrackName() {
	let x = plapi.name+'\u2007\u2007\u2007***\u2007\u2007\u2007'+plapi.name+'\u2007\u2007\u2007***\u2007\u2007\u2007'+plapi.name;
	document.querySelector('#player .cc .line a').innerHTML = x.substring(plapi.c2);
}

function playerOrder() {
	if (player.getPlaylist() == null) {
		document.querySelector('#player .cc .line').getElementsByClassName('b')[0].innerHTML = (player.getPlaylistIndex()+1)+'/??';
		console.log('fuck youtube api');
		return;
	}
	document.querySelector('#player .cc .line').getElementsByClassName('b')[0].innerHTML = (player.getPlaylistIndex()+1)+'/'+player.getPlaylist().length;
}

function playerStateUpdate() {
	if (plapi.state == -1) return;
	if (plapi.state == 1) plapi.c++;
	if (plapi.c >= consts.fps/(plapi.c2==0?1:4)) {
		plapi.c = 0;
		playerTrackName();
		plapi.c2++;
		if (plapi.c2>plapi.name.length+9) plapi.c2=0;
	}
	if (parseInt(document.querySelector('#player .cc .line').getElementsByClassName('b')[0].innerHTML) != player.getPlaylistIndex()) playerOrder();
	let x1 = player.getCurrentTime(), x2 = player.getDuration();
	let line1 = document.querySelector('#player .cc .table').getElementsByClassName('t2')[0];
	line1.getElementsByClassName('t')[5].getElementsByClassName('b')[0].innerHTML = parseInt(x1/60)+':'+(parseInt(x1%60)<10?'0'+parseInt(x1%60):parseInt(x1%60))+' / '+parseInt(x2/60)+':'+(parseInt(x2%60)<10?'0'+parseInt(x2%60):parseInt(x2%60));
	if (x1 >= x2-0.5 && plapi.loop) player.seekTo(0);
}

function playerSetPlaying() {
	let cc = document.querySelector('#player .cc .table');
	let line1 = cc.getElementsByClassName('t2')[0];
	if (plapi.state != 1) {
		line1.querySelectorAll('.t:nth-child(2) svg')[0].style.display = 'inline';
		line1.querySelectorAll('.t:nth-child(2) svg')[1].style.display = 'none';
	}
	else {
		line1.querySelectorAll('.t:nth-child(2) svg')[1].style.display = 'inline';
		line1.querySelectorAll('.t:nth-child(2) svg')[0].style.display = 'none';
	}
}

function m_init() {
	let cc = document.querySelector('#player .cc .table');
	let line1 = cc.getElementsByClassName('t2')[0];
	line1.getElementsByClassName('t')[0].addEventListener("click", function() {
		plapi.prevstate = 1;
		player.previousVideo();
		plapi.continueBack = true;
		line1.querySelectorAll('.t:nth-child(2) svg')[0].style.display = 'inline';
		line1.querySelectorAll('.t:nth-child(2) svg')[1].style.display = 'none';
	});
	line1.getElementsByClassName('t')[1].addEventListener("click", function() {
		if (plapi.state != 1) player.playVideo();
		else player.pauseVideo();
		playerSetPlaying();
	});
	line1.getElementsByClassName('t')[2].addEventListener("click", function() {
		plapi.prevstate = 1;
		player.nextVideo();
		line1.querySelectorAll('.t:nth-child(2) svg')[0].style.display = 'inline';
		line1.querySelectorAll('.t:nth-child(2) svg')[1].style.display = 'none';
	});
	line1.getElementsByClassName('t')[3].addEventListener("click", function() {
		player.setShuffle(plapi.random = !plapi.random);
		if (plapi.random) line1.getElementsByClassName('t')[3].getElementsByClassName('b')[0].classList.add('sel');
		else line1.getElementsByClassName('t')[3].getElementsByClassName('b')[0].classList.remove('sel');
		playerOrder();
	});
	line1.getElementsByClassName('t')[4].addEventListener("click", function() {
		plapi.loop = !plapi.loop;
		if (plapi.loop) line1.getElementsByClassName('t')[4].getElementsByClassName('b')[0].classList.add('sel');
		else line1.getElementsByClassName('t')[4].getElementsByClassName('b')[0].classList.remove('sel');
		playerOrder();
	});
	line1.getElementsByClassName('t')[6].addEventListener("click", function() {
		player.unMute();
		if (plapi.volume == 6) return;
		setVolume(++plapi.volume);
		let cc2 = line1.getElementsByClassName('t')[7];
		let i;
		for (i=0; i<(6-plapi.volume); i++) cc2.getElementsByTagName('svg')[i].style.opacity = '1';
		for (i; i<5; i++) cc2.getElementsByTagName('svg')[i].style.opacity = '0';
	});
	line1.getElementsByClassName('t')[7].addEventListener("click", function() {
		let cc2 = line1.getElementsByClassName('t')[7];
		if (player.isMuted()) {
			for (let i=0; i<(6-plapi.volume); i++) cc2.getElementsByTagName('svg')[i].style.opacity = '1';
			player.unMute();
		}
		else {
			player.mute();
			for (let i=0; i<5; i++) cc2.getElementsByTagName('svg')[i].style.opacity = '0';
		}
	});
	line1.getElementsByClassName('t')[8].addEventListener("click", function() {
		player.unMute();
		if (plapi.volume == 1) return;
		setVolume(--plapi.volume);
		let cc2 = line1.getElementsByClassName('t')[7];
		let i;
		for (i=0; i<(6-plapi.volume); i++) cc2.getElementsByTagName('svg')[i].style.opacity = '1';
		for (i; i<5; i++) cc2.getElementsByTagName('svg')[i].style.opacity = '0';
	});
	plapi.ready = true;
	if (!plapi.loaded) onPlayerReady();
}
