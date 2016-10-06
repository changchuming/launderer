
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
 
//##############################################################################################
// Display home page
//##############################################################################################
exports.display = function(req, res){
  	// commenting out the main index page
  	res.render('index', {
  		title: 'Launderer',
  	});
};

//##############################################################################################
//Display about page
//##############################################################################################
exports.about = function(req, res){
	res.render('about');
};