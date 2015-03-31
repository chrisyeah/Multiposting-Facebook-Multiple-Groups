	var PAGEINPUTFIELDS = 0;
	
	var curUser;
	var curPage;
	var userGroups;
	var userPages = [];
	var pagesToPost = [];
	var imgFiles;
	
	var triedPostings = 0;			// number of pages that should be posted on
	var succeededPostings = 0;		// number of successfully posted pages

	
	// Login functions:
	
	var usedScope = 'publish_actions'+
					',manage_pages'+
					',user_groups'+
					',share_item'+
					',photo_upload';
		
	/**
		Connects asynchronous with facebook
	*/
	window.fbAsyncInit = function() {
		FB.init({ 	appId: '204548616410109', 	// appYeah Multiposting
					// appId: '189856911046789', // PartyLexy Events
					status: true,
					cookie: true,
					xfbml: true,
					oauth: true});

		function checkLogin(response) {
			button = document.getElementById('fb-auth');

			FB.getLoginStatus(function(logResponse) {
				if (logResponse.status === 'connected') { // user is already logged in and connected
					FB.api('/me?fields=id,name,picture,groups.fields(icon,id,name)', function(info) {
						login(info);
					});
					
					button.innerHTML = 'Logout';
					button.onclick = function() {
						FB.logout(function(response) {
							showAfterLogout();
						});
					};
					// run once with current status and whenever the status changes
					FB.Event.subscribe('auth.statusChange', checkLogin);
				} else {
					//user is not connected to the app or logged out
					button.innerHTML = 'Facebook Login';
					button.onclick = function() {
						FB.login(function(response) {
							if (response.authResponse) {
								checkLogin(response);
							} else {
								//user cancelled login or did not grant authorization
								showAfterLogout();
							}
						}, {scope:usedScope});
					}
					
					buttonGo = document.getElementById('fb-auth_go');
					buttonGo.onclick = function() {
						FB.login(function(response) {
							if (response.authResponse) {
								checkLogin(response);
							} else {
								//user cancelled login or did not grant authorization
								showAfterLogout();
							}
						}, {scope:usedScope});
					}
				}
			});
		}

		checkLogin();
	};
	(function() {
		var e = document.createElement('script'); e.async = true;
		e.src = document.location.protocol
			+ '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(e);
	}());
	
	
	function login(user){
		curUser = user;
		userGroups = user.groups;
		setUserInfo(user.name, user.picture.data.url);
		loadOwnPages(user.id);
		addFiveInputFields();
		addFiveInputFields();
		loadOwnGroups(user.groups);
		showAfterLogin();
		showAd();
	}
	
	
	// FB Functions:

	function loadOwnPages(userId) {
		FB.api('/'+userId+'/accounts?fields=id,name,access_token,picture', function(response) {
			if(response.data)
				emptyPageDropdown();
		
			for (var i=0; i<response.data.length; i++) {
				var page = response.data[i];
				addPageToDropdown(page.name, page.id, page.picture.data.url);
				userPages[page.id] = page;
			}
		});
	}
	
	function loadOwnGroups(groups) {
		if(groups.data) {
			for(var i=0; i<PAGEINPUTFIELDS; i++) {
				emptyInputDropdown(i);
				for (var j=0; j<groups.data.length; j++) {
					var group = groups.data[j];
					addGroupToDropdown(group.name, group.id, group.icon, i);
				}
			}
		}
	}
	
	function checkPage(number, pageId) {
		if(!pageId || pageId==='') {
			resetShowPageToPost(number);
			loadOwnGroups(userGroups);
			return;
		}
	
		FB.api('/'+pageId+'?fields=id,name,picture', function(response) {
			if(response && response.name) {
				pagesToPost[number] = response;
				showPageToPost(number, response.id, response.name, response.picture.data.url);
			} else {
				pagesToPost[number] = 0;
				showPageToPostFail(number);
			}
		});
	}
	
	function postToPage(nr, targetId, text, linkURL, imgURL, pageAccessToken) {
		if(imgURL && imgURL!='') {
			postImage(nr, targetId, text, linkURL, imgURL, pageAccessToken);
			return;
		}
		
		addLoaderToInput(nr);
		
		var tempPostURL = '/'+targetId+'/feed';
		if(pageAccessToken)
			tempPostURL += '?access_token='+pageAccessToken;
		
		triedPostings++;
		FB.api(tempPostURL, 'POST',
		{
			link:		linkURL,
			message:	text
		},
		function(response) {
			if (!response || response.error) {
				postingResponseFail(response);
			} else {
				postingResponseSuccess(targetId, response);
			}
			removeLoaderFromInput(nr);
		});
	}
	
	function postImage(nr, targetId, text, linkURL, imgURL, pageAccessToken) {
		addLoaderToInput(nr);
		
		var tempPostURL = '/'+targetId+'/photos';
		if(pageAccessToken)
			tempPostURL += '?access_token='+pageAccessToken;
		
		triedPostings++;
		FB.api(
			tempPostURL,
			'POST',
			{
				"url": 	imgURL,
				"message":	text
			},
			function (response) {
			  if (response && !response.error) {
				postingResponseSuccess(targetId, response);
			  } else {
				postingResponseFail(response);
			  }
			  removeLoaderFromInput(nr);
			}
		);
	}
	
	function postingResponseSuccess(targetId, response) {
		succeededPostings++;
		hideFailMsg();
		showSuccessMsg();
		getSuccessPage(targetId, response.id);
		console.log('Success!! '+response.id);
	}
	function postingResponseFail(response) {
		console.log(response.error.message+', Code: '+response.error.code+', Subcode: '+response.error.error_subcode);
		if(response.error.code===100)
			showFailMsg(response.error.message);
		else if(succeededPostings===0)
			showFailMsg('Es wurden 0 von '+triedPostings+' Nachrichten versendet!');
	}
	
	function getSuccessPage(pageId, postId) {
		FB.api('/'+pageId+'?fields=name', function(response) {
			if(response.name)
				addSuccessPageToView(response.name, pageId, postId);
		});
	}
	
	
	// Intern Functions:
	
	function startPostingToPages(targetIds, text, linkURL, imgURL) {
		if(targetIds.length===0) {
			showFailMsg('Es wurde keine Ziel-Page angegeben!');
			return;
		}
	
		var tempAccessToken = 0;
		if(curPage)
			tempAccessToken = curPage.access_token;
		
		for(var i=0; i<targetIds.length; i++) {
			postToPage(i, targetIds[i],text,linkURL,imgURL,tempAccessToken);
//			console.log(targetIds[i]+': '+text+', '+linkURL+', '+tempAccessToken);
		}
	}
	
	function actAsPage(pageId) {
		curPage = userPages[pageId];
	
		setUserInfo(curPage.name, curPage.picture.data.url);
		addUserToDropdown(curUser.name, curUser.picture.data.url);
	}
	
	function actAsUser() {
		curPage = 0;
		setUserInfo(curUser.name, curUser.picture.data.url);
		loadOwnPages(curUser.id);
	}
	
	function resetLastPosting() {
		triedPostings = 0;
		succeededPostings = 0;
		hideFailMsg();
		hideSuccessMsg();
		hideSuccessPages();
		for(var i=0; i<PAGEINPUTFIELDS; i++) {
			resetShowPageToPost(i);
		}
		loadOwnGroups(userGroups);
	}
	
	function moreInputFields(element) {
		removeElementFromDOM(element.parentNode);
		addFiveInputFields();
		addFiveInputFields();
		loadOwnGroups(userGroups);
	}
	
	
	// Assisting Functions:
	
	function getShortPostId(longPostId) {
		var shortPostId = longPostId.split('_', 2);
		return shortPostId[1];
	}