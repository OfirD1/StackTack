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
    
    // Inject the stylesheet into the current page
    // [TODO]
    
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
        parameters['key']  = options['key'];
        parameters['site'] = site_domain;
        
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
            
            element.html(instance_data['title']);
            
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
        
        /*
        
                // appended as last step
                var containerElement = $('<div class="stacktack-container"></div>');
                if (itemOptions.width) {
                    containerElement.css('width', itemOptions.width);
                }
                
                var contentElement = $('<div class="stacktack-content"><a href="http://www.stacktack.com/" target="_blank" title="StackTack" class="stacktack-logo"><h2>StackTack</h2></a></div>');
                containerElement.append(contentElement);
                var loadingElement = $('<p class="stacktack-loading">Loading Question ID ' + questionId + '</p>');
                contentElement.append(loadingElement);

                        var questionElement = $('<div class="stacktack-question"> <div class="stacktack-question-header clearfix">' + createProfile(question.owner) + '<h3><a href="http://' + options.site + '/questions/' + question.question_id + '" target="_blank">' + question.title + '</a></h3><div class="stacktack-votes">' + question.score + ' Votes</div></div><div class="stacktack-question-body">' + question.body + '</div></div>');
                        contentElement.append(questionElement);

                        if (itemOptions.showTags) {
                            var tagsElement = $('<ul class="stacktack-tags"></ul>');
                            for (var i = 0; i < question.tags.length; i++) {
                                var tagElement = $('<li>' + question.tags[i] + '</li>');
                                tagsElement.append(tagElement);
                            }
                            questionElement.append(tagsElement);
                        }

                        var answersElement = $('<div class="stacktack-answers"></div>');
                        contentElement.append(answersElement);

                        // filter the answers
                        var visibleAnswers = [];
                        if (question.answers.length > 0) {
                            if (itemOptions.onlyShowAcceptedAnswer) {
                                for (var i = 0; i < question.answers.length; i++) {
                                    if (question.answers[i].accepted) {
                                        visibleAnswers.push(i);
                                    }
                                }
                            }
                            else if (itemOptions.filterAnswers.length > 0) {
                                for (var i = 0; i < question.answers.length; i++) {
                                    if ($.inArray(question.answers[i].answer_id.toString(), itemOptions.filterAnswers) > -1) {
                                        visibleAnswers.push(i);
                                    }
                                }
                            }
                            else if (itemOptions.answerLimit > 0) {
                                for (var i = 0; i < itemOptions.answerLimit; i++) {
                                    visibleAnswers.push(i);
                                }
                            }
                        }

                        // render the answers
                        for (var i = 0; i < question.answers.length; i++) {
                            var answer = question.answers[i];
                            
                            var answerElement = $('<div class="stacktack-answer"><div class="stacktack-answer-header clearfix">' + createProfile(answer.owner) + '<h4><a href="http://' + options.site + '/questions/' + question.question_id + '#' + answer.answer_id + '" target="_blank">Answer ' + (i + 1) + '</a></h4><div class="stacktack-votes">' + answer.score + ' Votes</div></div><div class="stacktack-answer-body">' + answer.body + '</div></div>');
                            if (answer.accepted) {
                                answerElement.addClass('stacktack-answer-accepted');
                                answerElement.find('.stacktack-answer-header h4').prepend('<span alt="Accepted" title="Accepted" class="stacktack-answer-check"></span>');
                                answerElement.find('.stacktack-votes').append(' | Accepted');
                            }
                            // hide answer if it isn't in the visible list
                            if (visibleAnswers.length > 0) {
                                if ($.inArray(i, visibleAnswers) == -1) {
                                    answerElement.hide();
                                }
                            }
                            answersElement.append(answerElement);
                        }
                        
                        // make all links open in a new window
                        containerElement.find('a').attr('target', '_blank');
                        
                        // render "more answers" button if the answers were filtered at all
                        if (visibleAnswers.length > 0) {
                            var moreElement = $('<a href="#" class="stacktack-answers-more">+ More Answers</a>"');
                            moreElement.click(function() {
                                $(this).hide();
                                answersElement.find('.stacktack-answer:hidden').slideDown('fast');
                                return false;
                            });
                            answersElement.append(moreElement);
                        }
                    }
                });

                item.append(containerElement);
            });
        });
        */
    };

    // These are the default settings that are applied to each element in the matched set
    $.fn.stacktack.defaults = {
        key: '',
        secure: false,
        stylesheet: 'styles/base.min.css',
        answerLimit: 0,
        onlyShowAcceptedAnswer: false,
        filterAnswers: [],
        showTags: true,
        width: null
    };

})(jQuery);
