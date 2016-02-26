"use strict";

tutao.provide('tutao.tutanota.security.CajaSanitizer');

/**
 * Uses the sanitizer of google-caja.
 * @interface
 */
tutao.tutanota.security.CajaSanitizer = function() {
	tutao.util.FunctionUtils.bindPrototypeMethodsToThis(this);
	this._blockExternalContent = false;
	this._urlReplacementMap = [];
};

tutao.tutanota.security.CajaSanitizer.prototype._urlTransformer = function(url) {
	//console.log(url);
	if (this._blockExternalContent){
		// only external links
		if (url.getScheme() && tutao.util.StringUtils.startsWith( url.getScheme(),  "http") ){
			var originalUrl = url.toString();
			// Replace the external url with a non existing local reference and store
			// the replacement in a map.
			url = URI.parse("replacement_" + (this._urlReplacementMap.length + 1));
			var replacementUrl = url.toString();
			this._urlReplacementMap.push( {replacement:replacementUrl, original: originalUrl, isLink: false });
		}
	}
	return url;
};

tutao.tutanota.security.CajaSanitizer.prototype._nameIdClassTransformer = function(s) {
	//console.log(s);
	return s;
};

/**
 * @inherit
 */
tutao.tutanota.security.CajaSanitizer.prototype.sanitize = function(html, blockExternalContent) {
	try {
		// To prevent external image loading we replace all external image references (including background images)
		// with a local reference to a special icon: PREVENT_EXTERNAL_IMAGE_LOADING_ICON.
		// To find img tags and background images we use the jQuery parseHTML method. Because this method may load
		// external images in some browsers (e.g. Safari on OSX or IE10 on WIN7) we replace all external images
		// with non existing references first using the _urlTransform callback. After replacing the external images
		// with the PREVENT_EXTERNAL_IMAGE_LOADING_ICON all other replaced external links are restored to the original links.

		// reset replacement map first.
		this._urlReplacementMap = [];
		// must be set to use in _urlTransformer callback
		this._blockExternalContent = blockExternalContent;

		// clean html contains only local references to non existing resources now (images and links)
		var cleanHtml = html_sanitize(html, this._urlTransformer, this._nameIdClassTransformer);

		// parse html for image references and replace them with the local prevent icon.
		var externalImages = [];
		if (this._blockExternalContent){
			var htmlNodes = $.parseHTML(cleanHtml);
            // htmlNodes may be null if the body text is empty
            if (htmlNodes) {
                this._preventExternalImageLoading(htmlNodes);
            }
			for ( var i=0;i< this._urlReplacementMap.length; i++){
				if (this._urlReplacementMap[i].isLink == false ) {
					externalImages.push(this._urlReplacementMap[i].original)
				}
			}
			cleanHtml = $('<div>').append(htmlNodes).html();
		}

		// set target="_blank" for all links
		var domHtml = $('<div>').append(cleanHtml);
		domHtml.find("a").attr("target", "_blank");

		return {"text" : domHtml.html(), "externalImages" : externalImages };
	} catch (e) {
		console.log("error in html: " + html, e);
		return "";
	}
};



tutao.tutanota.security.CajaSanitizer.prototype._preventExternalImageLoading = function(htmlNodes) {
	for( var i=0; i<htmlNodes.length; i++) {
		var htmlNode = htmlNodes[i];
		if (htmlNode.attributes){
			// find external images
			this._replaceImageTags(htmlNode);
			// find external background images
			this._replaceBackgroundImages(htmlNode);
			// restore html links
			this._restoreHtmlLink(htmlNode);

			this._preventExternalImageLoading(htmlNodes[i].childNodes);
		}
	}
};


tutao.tutanota.security.CajaSanitizer.prototype._replaceImageTags = function(htmlNode) {
	var imageSrcAttr = htmlNode.attributes.getNamedItem('src') || htmlNode.attributes.getNamedItem('poster');
	if (imageSrcAttr){
		var replacementEntry = this._getReplacementEntry(imageSrcAttr.value);
		if (replacementEntry){
			imageSrcAttr.value = tutao.entity.tutanota.TutanotaConstants.PREVENT_EXTERNAL_IMAGE_LOADING_ICON;
			htmlNode.attributes.setNamedItem(imageSrcAttr);
		}
	}
};

tutao.tutanota.security.CajaSanitizer.prototype._replaceBackgroundImages = function(htmlNode) {
	var htmlNodeStyleAttr = htmlNode.attributes.getNamedItem('style');
	if (htmlNodeStyleAttr){
		var styleElement = document.createElement("STYLE");
		styleElement.style.cssText = htmlNodeStyleAttr.value;
		var backgroundImage = styleElement.style.backgroundImage;
		if ( backgroundImage){
			//htmlNode.attributes.removeNamedItem('style');
			// remove surrounding url definition. url(<link>)
			backgroundImage = backgroundImage.replace(/^url\("*/, "");
			backgroundImage = backgroundImage.replace(/"*\)$/, "");

			var replacementEntry = this._getReplacementEntry(backgroundImage);
			if(replacementEntry){
				styleElement.style.backgroundImage =  "url(" + tutao.entity.tutanota.TutanotaConstants.PREVENT_EXTERNAL_IMAGE_LOADING_ICON + ")";
				htmlNodeStyleAttr.value = styleElement.style.cssText;
				htmlNode.attributes.setNamedItem(htmlNodeStyleAttr);
			}
		}
	}
};

tutao.tutanota.security.CajaSanitizer.prototype._restoreHtmlLink = function(htmlNode) {
	if (htmlNode.localName == "a" ){
		var hrefAttr = htmlNode.attributes.getNamedItem('href');
		if (hrefAttr) {
			var replacementEntry = this._getReplacementEntry(hrefAttr.value);
			if (replacementEntry){
				hrefAttr.value = replacementEntry.original;
				htmlNode.attributes.setNamedItem(hrefAttr);
				replacementEntry.isLink = true;
			}
		}
	}
};



/**
 * Returns the original link for the given link from the replacement map. Returns null if the link
 * is not available.
 */
tutao.tutanota.security.CajaSanitizer.prototype._getReplacementEntry = function(link) {
	for( var i=0; i<this._urlReplacementMap.length; i++){
		if (tutao.util.StringUtils.endsWith(link, this._urlReplacementMap[i].replacement)){
			return this._urlReplacementMap[i];
		}
	}
	return null;
};

