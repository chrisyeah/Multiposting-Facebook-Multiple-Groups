	function showAfterLogin() {
		document.getElementById('after_login').style.display = 'block';
		document.getElementById('jumbo').style.display = 'none';
	}
	
	function addFiveInputFields() {
		var fields = document.createElement('div');
		fields.className='col-md-6 fiveFields';
		for(var i=0; i<5; i++) {
			fields.innerHTML += getInputGroup(PAGEINPUTFIELDS++);
		}
		document.getElementById('input_fields').appendChild(fields);
	}
	
	function getInputGroup(nr) {
		var temp =
			'<div class="input-group">'+
				'<span id="sign_page'+nr+'" class="input-group-addon">'+
					'<div class="dropdown" style="display:inline;">'+
						'<a data-toggle="dropdown" href="#">'+
						'<span class="glyphicon glyphicon-chevron-right"></span>'+
						'</a>'+
						'<ul id="input'+nr+'_dropdown" class="dropdown-menu" role="menu">'+
						'<li role="presentation" class="dropdown-header">Keine Gruppen vorhanden</li>'+
						'</ul>'+
					'</div>'+
				'</span>'+
				'<input id="text_page'+nr+'" type="text" class="form-control" placeholder="pageId #'+(nr+1)+'" onblur="checkPage('+nr+', this.value);" />'+
			'</div><!-- /input-group -->';
		
		return temp;
	}
	
	function showAfterLogout() {
		document.getElementById('after_login').style.display = 'none';
		document.getElementById('jumbo').style.display = 'block';
	}
	
	function setUserInfo(name,imgUrl) {
		document.getElementById('user_info').innerHTML = '<img src="'+imgUrl+'" alt="" style="width:40px; border-radius:40px;" /> '+name+' ';
		
		if(name.length>25)
			name = name.slice(0, 17).concat("...");
		document.getElementById('send_as').innerHTML = name;
	}

	function emptyPageDropdown() {
		document.getElementById('page_dropdown').innerHTML = '<li role="presentation" class="dropdown-header">Pages:</li>';
	}
	function emptyInputDropdown(nr) {
		document.getElementById('input'+nr+'_dropdown').innerHTML = '<li role="presentation" class="dropdown-header">Groups:</li>';
	}
	
	function addPageToDropdown(name,pageId,imgURL) {
		document.getElementById('page_dropdown').innerHTML += '<li role="presentation">'+
			'<a role="menuitem" tabindex="-1" href="#" onclick="actAsPage(\''+pageId+'\'); removeElementFromDOM(this.parentNode); return false;"><img src="'+imgURL+'" alt="" style="height:20px; margin-top:-2px;" /> '+name+'</a>'+
			'</li>';
	}
	function addGroupToDropdown(name,groupId,icon,nr) {
		document.getElementById('input'+nr+'_dropdown').innerHTML += '<li role="presentation">'+
			'<a role="menuitem" tabindex="-1" href="#" onclick="putValueInInput(\''+nr+'\', \''+groupId+'\'); return false;"><img src="'+icon+'" alt="" style="height:16px; margin-top:-2px;" /> '+name+'</a>'+
			'</li>';
	}
	
	function addUserToDropdown(name, imgURL) {
		var tempElement = document.getElementById('page_dropdown');
	
		var tempUserInfo = document.createElement('li');
		tempUserInfo.setAttribute('role','presentation');
		tempUserInfo.className = 'divider';
		tempElement.insertBefore(tempUserInfo, tempElement.firstChild);
		
		tempUserInfo = document.createElement('li');
		tempUserInfo.setAttribute('role','presentation');
		tempUserInfo.innerHTML = '<a role="menuitem" tabindex="-1" href="#" onclick="actAsUser();return false;"><img src="'+imgURL+'" alt="" style="height:20px;" /> '+name+'</a>';
		tempElement.insertBefore(tempUserInfo, tempElement.firstChild);
	}
	
	function showPageToPost(number, pageId, pageName, imgURL) {
		document.getElementById('text_page'+number).value = pageId;
		document.getElementById('sign_page'+number).innerHTML = '<img src="'+imgURL+'" alt="'+pageName+'" style="height:20px;" data-toggle="tooltip" title="'+pageName+'" onmouseover="showToolTip(this);" />';
	}
	function resetShowPageToPost(number) {
		document.getElementById('sign_page'+number).innerHTML = '<div class="dropdown" style="display:inline;">'+
									'<a data-toggle="dropdown" href="#">'+
									'<span class="glyphicon glyphicon-chevron-right"></span>'+
									'</a>'+
									'<ul id="input'+number+'_dropdown" class="dropdown-menu" role="menu">'+
									'<li role="presentation" class="dropdown-header">Keine Gruppen vorhanden</li>'+
									'</ul>'+
								'</div>';
	}
	function showPageToPostFail(number) {
		document.getElementById('sign_page'+number).innerHTML = '<span class="glyphicon glyphicon-warning-sign" style="color:#b94a48;" data-toggle="tooltip" title="Falsche Id!" onmouseover="showToolTip(this);"></span>';
	}
	
	function addLoaderToInput(nr) {
		document.getElementById('sign_page'+nr).parentNode.innerHTML += '<span id="loader_'+nr+'" class="input-group-addon"><img src="images/loader.gif" alt="" style="height:20px;" /></span>';
	}
	function removeLoaderFromInput(nr) {
		removeElementFromDOM(document.getElementById('loader_'+nr));
	}
	
	function preparePostingToPages() {	
		var tempLink = "";
		if(document.getElementById('link_input').value) {
			tempLink = document.getElementById('link_input').value;
		}
		
		var tempImg = "";
		if(document.getElementById('image_input').value) {
			tempImg = document.getElementById('image_input').value;
		}
		
	
		var targetIds = [];
		for(var i=0; i<PAGEINPUTFIELDS; i++) {
			if(document.getElementById('text_page'+i).value)
				targetIds[i] = document.getElementById('text_page'+i).value;
		}
	
	
		startPostingToPages(targetIds, document.getElementById('new_post').value, tempLink, tempImg);
	}
	
	function showSuccessMsg() {
		document.getElementById('success_msg_txt').innerHTML = 'Es wurden <strong>'+succeededPostings+'</strong> von '+triedPostings+' Nachrichten erfolgreich versendet:';
		document.getElementById('success_msg').style.display = 'block';
	}
	function hideSuccessMsg() {
		document.getElementById('success_msg').style.display = 'none';
		document.getElementById('success_msg_txt').innerHTML = '';
	}
	function addSuccessPageToView(pageName, pageId, postId) {
		document.getElementById('success_pages').style.display = 'block';
		var tempInfo = '<a href="https://www.facebook.com/'+pageId+'/posts/'+getShortPostId(postId)+'" target="_blank" class="list-group-item"><span class="glyphicon glyphicon-ok-circle" style="color:#468847;"></span> '+pageName+'</a>';
		document.getElementById('success_pages').innerHTML += tempInfo;
	}
	function hideSuccessPages() {
		document.getElementById('success_pages').style.display = 'none';
		document.getElementById('success_pages').innerHTML = '';
	}
	
	function showFailMsg(message) {
		document.getElementById('fail_msg').innerHTML = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="glyphicon glyphicon-warning-sign"></span> '+message;
		document.getElementById('fail_msg').style.display = 'block';
	}
	function hideFailMsg() {
		document.getElementById('fail_msg').style.display = 'none';
		document.getElementById('fail_msg').innerHTML = '';
	}
	
	// Common Functions:
	
	function putValueInInput(nr, value) {
		document.getElementById('text_page'+nr).value = value;
		checkPage(nr,value);
	}
	
	function showToolTip(element) {
		$(element).tooltip('toggle');
	}
	
	function removeElementFromDOM(element) {
		element.parentNode.removeChild(element);
	}
	
	function setHttpToValue(inputElement) {
		if(inputElement.value==='')
			inputElement.value = 'http://';
	}
	
	function previewImg(input) {
		var file = input.files[0];
		var reader = new FileReader();
	
		reader.onloadend = function () {
			imgFiles = reader.result;
			document.getElementById('img_preview').src = reader.result;
			document.getElementById('img_preview').style.display = 'inline';
		}
		
		if(file)
			reader.readAsDataURL(file);
	}