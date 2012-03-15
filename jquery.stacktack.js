/* Copyright (c) 2010 Ian Zamojc.
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
    
    // Here we create a jquery method named 'stacktack' that can be invoked with options
    // for the specific set of matched elements that will override the defaults
    $.fn.stacktack = function(custom_options) {
        
        // Determine the final options that will be applied
        var options = $.extend($.fn.stacktack.defaults, custom_options);
        
        // a list of options suitable for per-item overrides, lowercase for comparison
        var optionKeys = ['width', 'onlyshowacceptedanswer', 'answerlimit', 'filteranswers', 'showtags'];
        
        if (options.stylesheet) {
            // only include the stylesheet once
            if ($('link[href="' + options.stylesheet + '"]').length === 0) {
                // necessary for IE to dynamically load stylesheet
                if (document.createStyleSheet) {
                    document.createStyleSheet(options.stylesheet);
                } else {
                    $('<link rel="stylesheet" type="text/css" href="' + options.stylesheet + '" />').appendTo('head'); 
                }
            }
        }
        
        // Utility method that generates the HTML for a user profile
        function GenerateProfileHTML(user) {
            
            return (user)?'<div class="stacktack-profile"><img src="http://www.gravatar.com/avatar/' + user.email_hash + '?d=identicon&s=32" class="stacktack-gravatar" /><a href="http://' + options.site + '/users/' + user.user_id  + '" target="_blank">' + user.display_name + '</a><br/>' + user.reputation + '</div>':'';
            
        }
        
        // Utility method that sends a request to the API
        function SendAPIRequest(site_domain, method, parameters, success_callback, error_callback) {
            
            // Begin by constructing the URL that will be used for the request
            var url = (options['secure']?'https://':'http://') + 'api.stackexchange.com/2.0' + method;
            
            // Generate the query string that will be used for the request
            parameters['key'] = options['key'];  // add the API key
            var encoded_query_string = [];
            
            for(name in parameters)
                encoded_query_string.push(encodeURIComponent(name) + '=' + encodeURIComponent(parameters[name]));
            
            // Append the parameters to the URL
            url += encoded_query_string;
            
            // Lastly, make the request
            $.ajax({ 'url': url, 'dataType': 'jsonp',
                     'success': function(data) {
                         
                         // If an error message was supplied, then invoke the error callback
                         if(typeof data['error_message'] != 'undefined')
                             error_callback(data['error_message']);
                         else
                             success_callback(data['items']);
                         
                     }});
            
        }
        
        // Loop over each element on the page with the 'stacktack' class
        return this.each(function() {
            var $this = $(this);
            $this.filter('[id^=stacktack], [class^=stacktack]').add($this.find('[id^=stacktack], [class^=stacktack]')).each(function(index, value) {
                var item = $(value);
                // try to retrieve the question id from the id attribute
                var questionId = '';
                if (value.id) {
                    var matches = /\d+$/.exec(value.id);
                    if (matches.length > 0) {
                        questionId = matches[0];
                    }
                }

                // parse override options from classes
                var itemOptions = $.extend({}, options);
                var classAttr = item.attr('class');
                if (classAttr && classAttr.length) {
                    classes = item.attr('class').split(' ');
                    for (var i = 0; i < classes.length; i++) {
                        clas = classes[i];
                        classTokens = clas.split('-');
                        // if there was a split
                        if (classTokens.length > 1) {
                            // search for a stacktack id class and use if it if the questionId hasn't been set yet
                            if (classTokens[0].toLowerCase() == 'stacktack') {
                                questionId = classTokens[1];
                                continue;
                            }
                            
                            // convert special value strings
                            for (var j = 1; j < classTokens.length; j++) {
                                classToken = classTokens[j].toLowerCase();
                                // replace booleans
                                if (classToken === 'true' || classToken === 'false') {
                                    classTokens[j] = (classToken==="true");
                                    continue;
                                }
                                // replace percentages since the % is not a valid class name character
                                classTokens[j] = classToken.replace(/percent/i, '%');
                            }
                            // if the first token of the class is an override option
                            if ($.inArray(classTokens[0].toLowerCase(), optionKeys) > -1) {
                                // it's a list
                                if (classTokens.length > 2 || classTokens[0].toLowerCase() == 'filteranswers') {
                                    itemOptions[classTokens[0]] = classTokens.slice(1);
                                }
                                // it's a single value
                                else {
                                    itemOptions[classTokens[0]] = classTokens[1];
                                }
                            }
                        }
                    }
                }
                // appended as last step
                var containerElement = $('<div class="stacktack-container"></div>');
                if (itemOptions.width) {
                    containerElement.css('width', itemOptions.width);
                }
                
                var contentElement = $('<div class="stacktack-content"><a href="http://www.stacktack.com/" target="_blank" title="StackTack" class="stacktack-logo"><h2>StackTack</h2></a></div>');
                containerElement.append(contentElement);
                var loadingElement = $('<p class="stacktack-loading">Loading Question ID ' + questionId + '</p>');
                contentElement.append(loadingElement);

                $.ajax({
                    dataType: 'jsonp',
                    data: {
                        'apikey':'kz4oNmbazUGoJIUyUbSaLg',
                        'answers': 'true',
                        'body': 'true'
                    },
                    url: 'http://api.' + options.site + '/' + options.apiVersion + '/questions/' + questionId + '?jsonp=?',
                    success: function(data) {
                        loadingElement.remove();
                        
                        var question = data.questions[0];

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
