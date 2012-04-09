// ==UserScript==
// @name			VK Music Downloader v1.0.3
// @namespace		name.x-code::vkontakte::music::download
// @date			2012.04.09
// @description		Download Music From VK
// @author			.DeV!L
// @include			http://vkontakte.ru*
// @include			http://vk.com*
// ==/UserScript==

var icon_download = 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ\
bWFnZVJlYWR5ccllPAAAAhBJREFUeNqkk79v00AUx78X26GJkzQqP4qKqLoQMWMhkBASLOyIAYQy\
wVBGJv6OrFX5sUSoYoCpFagSVKpgac1SFmABofJDpE3t1Mn57LN5F+LEDoWFk55P9967z33P7x2L\
4xj/M3T1ufTwR8bJGFugyUq5bDpoPp2zdmt6BIikHAdb16/MWEEQQ9cZnqx+/beCMAz/CHiehOuG\
KJf1A+MZgNNqoVipZAKchwQQpCBGIEQm1nVd+s6OAJ7jIPA5zMrkMEkICd8PEQQaQt8fKXMdCO5n\
FaihTunstXGoUBwAQjgEZsyAGAD8Xhdy7Dp6eqGC3NuHpulo0bV2dtrI56sIOIeUIaIoOvgfUIkW\
EP0um4wkgSR6EYPQDXCwRMFmsonybZrmR1UQYp2c1rWbF6xPP7sqAdtegE7ehBQaaudrluq3qmng\
9YptU5+sJ7DcgNgkSGPp0Uu7OFXC1r6Gz/EEdgtlfEEB77mBuGxi7dkbW+Wp/AwggdCPbDxfXLbn\
TlaxN1Ea2uHpSWw8fmEHY5v7XavkVs7V+/dmR2rA1Kk6+e7O3qlbH6jccybwfbGpZDew+7Eptp4i\
+PYOwzc0/phyx05Dv3ivbly9vzmzGsdqVmvlTw+1T1lfAdGVzyA7TnZUKcuduX0ZJ87ewPbGUvT2\
wavBvjaZehg8OTgN0MhKZKqT2F9av0fWUYVLAL8EGAB/dRts9he48AAAAABJRU5ErkJggg==';

function add_link(to, url, title){
	var wrap = document.createElement("div");
		wrap.setAttribute('class', 'fl_r');
		wrap.setAttribute('style', 'padding-left: 2px');
	
	var dl_img = document.createElement('img');
		dl_img.alt = title;
		dl_img.src = icon_download;
	
	var dl_link = document.createElement("a");
		dl_link.href = url;
		dl_link.appendChild(dl_img);
		dl_link.setAttribute("title", title);
		dl_link.setAttribute("alt", title);
	
	wrap.appendChild(dl_link)
	var status = to.getAttribute('_done');
	if (!status) {
		to.appendChild(wrap);
		to.setAttribute('_done', true);
	}
}

function get_info(obj){
	var val = obj.getAttribute('value').split(','),
		url = val[0],
		length = val[1],
		next_node = obj.parentNode.nextSibling.nextSibling,
		title_node = document.getElementById('title' + id);
	if (!title_node) {
		var title_node = document.getElementById('audio' + id).getElementsByClassName('title')[0];
	};
	var title = title_node.innerHTML.replace(/<[^>]+>/g,"").replace('amp;', ''),
		artist_node = next_node.getElementsByTagName('b')[0],
		artist = artist_node.innerHTML.replace(/<[^>]+>/g,"").replace('amp;', '');
	var dur = next_node.getElementsByClassName('duration')[0];
	return {
		'target': dur,
		'artist': artist,
		'title' : title,
		'url'   : url,
		'length': length
	};
}

function process(node){
	_id = /audio(-?[0-9_]+)/.exec(node.id);
	if (_id) {
		var audio_info_node = document.getElementById('audio_info' + _id[1]);
		if (audio_info_node) {
			var info = get_info(audio_info_node);
			add_link(info.target, info.url, info.artist + ' - ' + info.title);
		}
	}
}

function find_audios(){
	// audios page
	var audios = document.getElementsByClassName('audio');
	if (audios) {
		for(var ind in audios){
			audio = audios[ind];
			process(audio);
		}
	}
}

function onChange(e){
	if (e.target.tagName == 'DIV'){
		if(/class\="[a-z_ ]*\baudio\b[a-z_ ]*?"/.test(e.target.innerHTML)){
			audios = e.target.getElementsByClassName('audio');
			if (audios) {
				for(var ind in audios){
					audio = audios[ind];
					process(audio);
				}
			}
		}
		
		if (/class\="[a-z_ ]*\brepeat_wrap\b[a-z_ ]*?"/.test(e.target.innerHTML)) {
			process(e.target);
		}
	}
}

window.addEventListener('load', function() {
	find_audios();
	
	var obj = document.evaluate('//div[@id="page_body"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (obj.snapshotLength > 0){
		obj.snapshotItem(0).addEventListener('DOMNodeInserted', onChange, false);
	}
}, true);