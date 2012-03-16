/* Copyright (c) 2012 Ian Zamojc, Marco Ceppi, & Nathan Osman.
   All rights reserved.
   
   Redistribution and use in source and binary forms are permitted
   provided that the above copyright notice and this paragraph are
   duplicated in all such forms and that any documentation,
   advertising materials, and other materials related to such
   distribution and use acknowledge that the software was developed
   by Ian Zamojc.  The name of the University may not be used to
   endorse or promote products derived from this software without
   specific prior written permission. THIS SOFTWARE IS PROVIDED
   ``AS IS'' AND WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
   WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE. */

(function($) {
    
    // When building StackTack (using the build script), there is an option
    // to generate JS code that will inject the CSS into the page dynamically
    // instead of depending on an external CSS file. This may be beneficial in
    // some cases. Therefore please do not remove the comment below until after
    // the build process is complete.
    
    /* INJECTED_STYLESHEET_PLACEHOLDER */
    
    // Utility method to retrieve a data attribute of an HTML element
    function RetrieveDataAttribute(element, attribute, default_value) {
        
        // If the dataset is available, then return the default value
        if(typeof element.dataset != 'undefined')
            return (typeof element.dataset[attribute] != 'undefined')?element.dataset[attribute]:default_value;
        
        // Otherwise, attempt to access the attribute the old-fashioned way
        var attr_value = element.getAttribute('data-' + attribute);
        return (attr_value != null)?attr_value:default_value;
        
    }
    
    // Utility method that sends a request to the API
    function SendAPIRequest(options, site_domain, method, parameters, success_callback, error_callback) {
        
        // Begin by constructing the URL that will be used for the request
        var url = (options['secure']?'https://':'http://') + 'api.stackexchange.com/2.0' + method;
        
        // Add the API key and site to the list of parameters
        parameters['key']    = options['key'];
        parameters['site']   = site_domain;
        parameters['filter'] = options['question_filter'];
        
        // Lastly, make the request
        $.ajax({ 'url': url, 'data': parameters, 'dataType': 'jsonp',
                 'success': function(data) {
                     
                     // If an error message was supplied, then invoke the error callback
                     if(typeof data['error_message'] != 'undefined')
                         error_callback(data['error_message']);
                     else
                         success_callback(data['items']);
                     
                 }});
    }
    
    // Utility method that generates the HTML for a user profile
    function GenerateProfileHTML(user) {
        
        return (user)?'<div class="stacktack-profile"><img src="http://www.gravatar.com/avatar/' + user.email_hash + '?d=identicon&s=32" class="stacktack-gravatar" /><a href="http://' + options.site + '/users/' + user.user_id  + '" target="_blank">' + user.display_name + '</a><br/>' + user.reputation + '</div>':'';
        
    }
    
    // Generates the HTML for an answer
    function GenerateAnswerHTML(answer) {
        
        return '<div class="heading answer-count">' + answer['score'] + ' votes</div>' + answer['body'];
        
    }
    
    // Processes a list of questions for a particular site
    function ProcessQuestionList(question_list, api_data) {
        
        // First, convert the data into a map [question ID] => [API data]
        var questions = {};
        $.each(api_data, function(key, question) { questions[question['question_id']] = question; });
        
        // Now go through each instance in question list, generating the HTML for it
        $.each(question_list, function(key, instance) {
            
            // Find the right API data for the instance and generate it
            var instance_data = questions[instance['question_id']];
            var element = $(instance['element']);
            
            // Set the element's style
            element.addClass('stacktack-container');
            
            // Generate the contents
            var contents = '<div class="branding">Stack<span>Tack</span></div>';
            contents += '<a href="' + instance_data['link'] + '" target="_blank" class="heading">' + instance_data['title'] + '</a><div class="hr" />';
            contents += instance_data['body'] + '<div class="hr" />';
            
            // Check for answers
            if(instance_data['answer_count']) {
                
                // Unfortunately we need to manually sort the answers because the API does not do this for us
                var sorted_answers = instance_data['answers'].sort(function (a, b) { return b['score'] - a['score']; });
                
                // Generate the HTML for each of them
                var answer_html = [];
                $.each(instance_data['answers'], function(key, answer) { answer_html.push(GenerateAnswerHTML(answer)); });
                
                // Concatenate the output to the question
                contents += answer_html.join('<div class="hr" />');
                
            } else
                contents += '<p class="tip">There are currently no answers.</p>';
            
            element.html(contents);
            
        });
    }
    
    // Here we create a jquery method named 'stacktack' that can be invoked with options
    // for the specific set of matched elements that will override the defaults
    $.fn.stacktack = function(custom_options) {
        
        // Determine the final options that will be applied
        var options = $.extend($.fn.stacktack.defaults, custom_options);
        
        // As we loop over the elements, we will be generating a list of post IDs for various
        // sites in the Stack Exchange network. Keep a list of them here:
        var site_list = {};
        
        // Begin looping over the current set of matched elements, applying StackTack to them
        this.each(function() {
            
            // Retrieve the options for the current element - ID is required
            var question_id = RetrieveDataAttribute(this, 'id', null);
            if(question_id !== null) {
                
                // Determine the site (and remove '.com' from the end for consistency)
                var site = RetrieveDataAttribute(this, 'site', 'stackoverflow').replace(/\.com$/, '');
                
                // Add the item to the list for that site
                if(typeof site_list[site] == 'undefined')
                    site_list[site] = [];
                
                // Create a map of all of the properties for this particular instance
                var instance_details = { 'element':     this,
                                         'question_id': question_id };
                
                site_list[site].push(instance_details);
                
            }
        });
        
        // Now loop over each site and fetch the questions for that site
        $.each(site_list, function(site, question_list) {
            
            // Concatenate the list of question IDs
            var question_id_list = [];
            $.each(question_list, function(key, instance) { question_id_list.push(instance['question_id']); });
            var question_id_str = $.unique(question_id_list).join(';');
            
            // Make the API request for the question data
            SendAPIRequest(options, site, '/questions/' + question_id_str, {},
                           function(data) { ProcessQuestionList(question_list, data); },
                           /* TODO */
                           function(error_message) {});
            
        });
    };

    // These are the default settings that are applied to each element in the matched set
    $.fn.stacktack.defaults = {
        secure:          false,                       // true to use HTTPS when accessing the API
        key:             'CRspH1WAlZKCeCinkGOLHw((',  // the API key to use with StackTack
        question_filter: '!-)dQB3E8g_ab'              // the filter to use when fetching question data
    };

})(jQuery);
