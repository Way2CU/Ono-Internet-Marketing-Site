/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Handle clicking on submit button in contact form dialog.
 * @param object event
 */
Site.handle_submit_click = function(event) {
	event.preventDefault();
	Caracal.ContactForm.list[0]._form.submit();
};

/**
 * Handle clicking on download link.
 * @param object event
 */
Site.handle_download_click = function(event) {
	// prevent default link behavior
	event.preventDefault();

	// store download URL for later
	Site.download_url = event.target.dataset.download;

	// configure dialog
	Site.form_dialog.set_title(event.target.dataset.title);
	Site.submit_button.innerHTML = event.target.dataset.button;

	// show contact form
	Site.form_dialog.open();
};

/**
 * Handle successful data submision.
 * @param object response_data
 */
Site.handle_submit_success = function(response_data) {
	if (!data.error)
		return;

	// send analytics event
	window.dataLayer = window.dataLayer || new Object();
	window.dataLayer.push({'event': 'leadSent'});

	// make sure no server side errors occurred
	setTimeout(function() {
		window.location = Site.download_url;
	}, 1000);
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	// storage variable for download link
	Site.download_url = null;

	// create dialog for contact form
	Site.submit_button = document.createElement('a');
	Site.submit_button.addEventListener('click', Site.handle_submit_click);

	Site.form_dialog = new Caracal.Dialog();
	Site.form_dialog
		.set_clear_on_close(false)
		.set_content_from_dom('div#contact_form')
		.add_control(Site.submit_button);

	// connect download links with dialog
	var links = document.querySelectorAll('a.download');
	for (var i=0,count=links.length; i<count; i++)
		links[i].addEventListener('click', Site.handle_download_click);

	// connect form successful submision to download handler
	Caracal.ContactForm.list[0].events.connect('submit-success', Site.handle_submit_success);
};


// connect document `load` event with handler function
$(Site.on_load);
