// w/ <3 — oldee
// fuk utube — stsyn
plapi.mods.push(function() {
	let whats_wrong_with_you_youtube = function () {
		player.loadPlaylist({list:'PLcHa462awHPlRxfq9Y17FwtBKXtsWNozR'});
		setTimeout(function() {
			if (player.getPlaylist() == null) whats_wrong_with_you_youtube();
			else {
				player.setShuffle(plapi.random);
				playerSetPlaying();
				player.nextVideo();
			}
		}, 2000)
	};
	whats_wrong_with_you_youtube();
});