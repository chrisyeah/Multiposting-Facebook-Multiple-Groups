<!DOCTYPE html>
<html>
	<head>
		<title>Multiposting Open Source</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="robots" content="noindex">
		<meta name="description" content="Mit nur einem Klick in mehrere Facebook-Gruppen posten." />
		<link rel="shortcut icon" href="favicon.ico">
		<!-- Bootstrap -->
		<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
		  <script src="../../assets/js/html5shiv.js"></script>
		  <script src="../../assets/js/respond.min.js"></script>
		<![endif]-->

		<!-- Custom styles for this template -->
		<link href="css/sticky-footer-navbar.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet">

		<script type="text/javascript" src="js/view.js"></script>
	</head>
  
  <body>
  
	<div id="fb-root"></div>
	<script type="text/javascript" src="js/fb-controller.js"></script>

    <!-- Wrap all page content here -->
    <div id="wrap">

      <!-- Fixed navbar -->
      <div class="navbar navbar-default navbar-fixed-top">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="http://www.appyeah.de" title="appYeah Tools"><img src="images/appyeah-logo.png" alt="appYeah" style="height:32px; margin-top:-3px;" /></a>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li class="active"><a href="http://multiposting.appyeah.de/"><strong>Multiposting</strong> (Open Source)</a></li>
              <li><a href="http://www.herr-yeah.de/auf-mehrere-facebook-seiten-auf-einmal-posten-210/" title="Auf mehrere Facebook-Seiten auf einmal posten">Anleitung</a></li>
			  <li><a href="http://www.herr-yeah.de/feedback">Feedback</a></li>
            </ul>
			
			<ul class="nav navbar-nav navbar-right">
				<li><button id="fb-auth" type="button" class="btn btn-fb navbar-btn">Facebook Login</button></li>
			</ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>

		<!-- Begin page content -->
		<div class="container">
		
			<noscript>
				<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="glyphicon glyphicon-warning-sign"></span> JavaScript muss aktiviert sein, um dieses Tool nutzen zu können.</div>
			</noscript>
		  
			<!-- Jumbotron -->
			<div id="jumbo" class="jumbotron" style="display:block;">
				<p style="text-align:center;"><button id="fb-auth_go" type="button" class="btn btn-lg btn-fb" href="#" <?php if($notPaid) { echo 'disabled="disabled"'; } ?>>Facebook Login</button></p>
				
				<p style="text-align:center;"><span class="glyphicon glyphicon-hand-right"></span> <a href="http://multiposting.appyeah.de/erste-schritte.html" target="_blank">Erste Schritte</a>: Geben Sie der App alle Berechtigungen und stellen Sie das Posten auf <u>öffentlich</u>!</p>
			
				<div id="error_user"></div>
			</div>
			
			
			<div class="row" style="background-color:#fff; border-radius:6px;">
				<div class="col-md-1 hidden-sm hidden-xs"></div>
				
				<div id="after_login" class="col-md-10" style="display:none;">
					<h1>appYeah Multiposting (Open Source)</h1>
					
					<p>&nbsp;</p>
					
					<p><strong>Sie posten als:</strong></p>
					<span id="user_info"> User Name </span>
					<div class="dropdown" style="display:inline;">(<a data-toggle="dropdown" href="#">Als Seite posten <span class="caret"></span></a>)
						<ul id="page_dropdown" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
							<li role="presentation" class="dropdown-header">Keine Pages vorhanden</li>
						</ul>
					</div>
					
					<p><br /><br /><strong>Favoriten:</strong> <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Multiposting merkt sich Ihre persönliche Favoriten-Liste für noch schnelleres Posten" onmouseover="showToolTip(this);"></span></p>
					<div class="col-md-6">
						<div class="input-group">
						  <input id="favText" type="text" class="form-control" placeholder="PageId oder GruppenId" />
						  <span class="input-group-btn">
							<button class="btn btn-default" type="button" onclick="addFavorite(document.getElementById('favText'));"><span class="glyphicon glyphicon-star"></span> Hinzufügen</button>
						  </span>
						</div><!-- /input-group -->
						<div id="fav_msg" style="clear:both;"></div>
					</div>
					
					
					<p style="clear:both;"><br /><br /><strong>Pages und Gruppen auf die Sie posten möchten:</strong> <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Verwenden Sie den eindeutigen Namen oder die ID der Facebook-Page bzw. Group" onmouseover="showToolTip(this);"></span></p>
					
					<div id="input_fields">
						
					</div>

					<p style="clear:both;"><br /><strong>Der Post:</strong></p>
					<form action="" method="post" enctype="multipart/form-data">
					<div class="input-group">
						<span class="input-group-addon"><span class="glyphicon glyphicon-comment"></span></span>
						<textarea id="new_post" class="form-control" rows="3" placeholder="Text hinzufügen (erforderlich)"></textarea>
					</div><!-- /input-group -->
					<div class="input-group" style="margin-left:20px;">
						<span class="input-group-addon"><span class="glyphicon glyphicon-link"></span></span>
						<input id="link_input" type="url" class="form-control" placeholder="Link hinzufügen (optional)"  onfocus="setHttpToValue(this);" />
					</div><!-- /input-group -->
					<div class="input-group" style="margin-left:20px;">
						<span class="input-group-addon"><span class="glyphicon glyphicon-picture"></span></span>
						<input id="image_input" type="url" class="form-control" placeholder="Bild von URL hochladen (optional)" />
					</div><!-- /input-group -->
						<img id="img_preview" src="" alt="" style="display:none; max-height:50px; margin-left:60px;" />
					
					<p>
						<button class="btn btn-default pull-right" type="button" onclick="resetLastPosting(); preparePostingToPages();">Senden als <span id="send_as" style="font-weight:bold;"></span></button>
						<br /><br />
					</p>
					</form>
					
					<div id="fail_msg" class="alert alert-danger alert-dismissable" style="display:none; clear:right;"></div>					
					<div id="success_msg" class="alert alert-success alert-dismissable" style="display:none; clear:right;">
						<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
						<span class="glyphicon glyphicon-ok-circle"></span> <span id="success_msg_txt"></span>
						<br /><br />
						<div id="success_pages" class="list-group" style="margin-bottom:0;"></div>
					</div>
					
				</div>
			</div><!-- .row -->
		
			<hr style="clear:both;" />
			
			<!-- More FB-Tools -->
			<div class="row">
				<div class="col-lg-4">
				  
				</div>
				<div class="col-lg-4">
				  
			   </div>
				<div class="col-lg-4">
					
				</div>
			</div><!-- row -->
			
			<hr />
			
		</div> <!-- container -->
    </div>
	

    <div id="footer">
      <div class="container">
        <p class="text-muted credit">all credits to <a href="http://www.herr-yeah.de" title="appYeah">Herr Yeah</a> | © 2014</p>
      </div>
    </div>
	

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/bootstrap/jquery-2.0.3.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap/bootstrap.min.js"></script>
  </body>
</html>
