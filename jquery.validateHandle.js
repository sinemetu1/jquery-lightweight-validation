/**
 * jquery.lightweight-validation.js
 * Written by Sam Garrett
 *
 *
 *
 * <html>
 * <head>
 * <!--First include jquery.js and then this plugin like:-->
 * <script type="text/javascript" src="jquery.js"></script>
 * <script type="text/javascript" src="jquery.lightweight-validation.js
 *
 * <script type="text/javascript">
 * 	$(document).ready(function () {
 * 		$('#someElement').validateHandle();
 *
 * 		$('#someButton').click(function () {
 *  		$('#someElement').validate();
 * 		});
 * 	});
 * </script>
 * </head>
 *
 *	<body>
 *		<input id="someElement" type="text" class="validate email" />
 *		<button id="someButton">Validate</button>
 *	</body>
 * </html>
 */
(function ($) {
    $.fn.extend({
        //Function that initializes the validateHandle plugin
        //@param settings the settings for the plugin
        validateHandle: function (settings) {
            var options = $.extend({}, $.fn.validateHandle.defaults, settings);

            return this.each(function () {
                var that = $(this);
                $.each(options.defaultRule, function (key, value) {
					//cache appendTo and errorClass for later calls with .addRule
					that.data('appendTo', options.appendTo);
					that.data('errorClass', options.errorClass);

                    //If the rule is in the $.fn.validateHandle.defaults.defaultRule
                    if (that.hasClass(key)) {
                        that.addRule(value);
                    }
                    if (that.hasClass("strongPassword")) {
                        bindValidateStrength(that);
                    }
                });
                
				var validateWithTimeout = function () {
					var tag = $(this).get(0).tagName;
					if (tag !== 'DIV') {
						setTimeout(function () { that.validate(); }, 200);
					}
                };

                that.bind('focusout.validateHandle', validateWithTimeout);
            });
        },
        //Function that adds a rule to the selected elements
        //@param rule the rule object that gets added to the element rules set
        //@return returns each element so that this function call can be chained.
        addRule: function (rule) {
            return this.each(function () {
                var element = $(this);
                if (element.data('rules') === null || element.data('rules') === undefined) {
                    element.data('rules', []);
                }
                var array = element.data('rules').push(rule);
                if (element.hasClass('quiet')) {
                    element.data('required', false);
                }
            });
        },
        //Function that applies a rule to an element
        //@param rule the rule object that is getting applied to the element
        applyRule: function (rule) {
            var that = $(this),
                tag = that.get(0).tagName;
            switch (tag) {
                case 'SELECT':
                    if (((rule.bool !== undefined && !rule.bool()) || (rule.rule !== undefined && rule.rule.minLength !== undefined && (that.val() !== null ? that.val().length : -1) < rule.rule.minLength))) {
                        that.raiseError(rule);
                    } else if ($(this).data('errored') && that.hasClass('error')) {
                        that.removeError();
                    }
                    break;
                case 'INPUT':
                    if (that.attr('type') === 'text' || that.attr('type') === 'password') {
                        if ((rule.rule !== undefined && !rule.rule.test(that.val())) || (rule.bool !== undefined && !rule.bool())) {
                            that.raiseError(rule);
                        } else if (that.data('errored') && that.hasClass('error')) {
                            that.removeError();
                        }
                    } else if (that.attr('type') === 'radio' || that.attr('type') === 'checkbox') {
                        if (((rule.rule !== undefined && rule.rule.minLength !== undefined && that.parent().find('[name=' + that.attr('name') + ']:checked').length < rule.rule.minLength)) || (rule.bool !== undefined && !rule.bool())) {
                            that.raiseError(rule);
                        } else if (that.data('errored') && that.parent().hasClass('error')) {
                            that.removeError();
                        }
                    }
                    break;
                case 'TEXTAREA':
                    if ((rule.rule !== undefined && !rule.rule.test(that.val())) || (rule.bool !== undefined && !rule.bool())) {
                        that.raiseError(rule);
                    } else if (that.data('errored') && that.hasClass('error')) {
                        that.removeError();
                    }
                    break;
                case 'DIV':
                    if ((rule.rule !== undefined && !rule.rule.test(that.val())) || (rule.bool !== undefined && !rule.bool())) {
                        that.raiseError(rule);
                    } else if (that.data('errored') && that.hasClass('error')) {
                        that.removeError();
                    }
                    break;
            }
            return !that.data('errored');
        },
        //Function that validates all of the selected elements
        //@return returns true if the elements are valid and false if they are not
        validate: function () {
            this.each(function () {
                var that = $(this);
                var rules = that.data('rules');
                if (rules === null || rules === undefined) {
                    return true;
                    //                    throw "validateHandle has not been initialized for this element (" + that.attr('id') +  ") or this element does not have any rules.";
                }
                if (that.data('required') === false && $.trim(that.val()) === '') {
                    //If the element is not required and it has been left blank then remove it's error and return
                    if (that.data('errored')) {
                        that.removeError();
                    }
                    return true;
                }
                //Similar to a do/while
                var valid = true;
                $.each(rules, function (index, rule) {
                    //If the element is still valid
                    if (valid) {
                        valid = that.applyRule(rule);
                    }
                });
            });
            if ($(this).filter('.error').length > 0) {
                //                $(this).filter('.error').first().focus();
                return false;
            } else {
                return true;
            }
        },
        //Function that removes the error class, data, and label from an element
        //@return returns each element so that this function call can be chained.
        removeError: function () {
            return this.each(function () {
                var tag = $(this).get(0).tagName,
                    that = $(this),
                    errorLabel = $('#' + that.attr('id') + '_error_label');
                //If it is a set of radio elements or checkbox elements
                if ((that.attr('type') === 'radio' || that.attr('type') === 'checkbox') && tag === 'INPUT') {
                    errorLabel = $('#' + that.attr('name') + '_error_label');
                }
                errorLabel.prev('br').remove();
                errorLabel.next('br').remove();
                errorLabel.remove();
                that.removeClass('error');
                that.data('errored', false);
                that.parent().removeClass('error');
                that.parent().find('[name=' + that.attr('name') + '].error').removeClass('error');
            });
        },
        //Function that adds an error to an element
        //@param rule the rule object
        //@return returns each element so that this function call can be chained.
        raiseError: function (rule) {
            var message = rule.message;
            return this.each(function () {
                var that = $(this),
                    tag = $(this).get(0).tagName,
                    id = that.attr('id'),
                    errorLabel = $('#' + id + '_error_label'),
                    thatAppendTo = (that.data('appendTo') !== undefined ? that.data('appendTo') : rule.appendTo),
                    errorClass = that.data('errorClass');

                //If it is a set of radio elements or checkbox elements
                if ((that.attr('type') === 'radio' || that.attr('type') === 'checkbox') && tag === 'INPUT') {
                    if (that.attr('name') !== undefined && thatAppendTo === undefined) {
                        errorLabel2 = that.parent().parent().find('[id=' + that.attr('name') + '_error_label]');
                        errorLabel2.prev('br').remove();
                        errorLabel2.next('br').remove();
                        errorLabel2.remove();
                    } else if (that.attr('name') !== undefined && thatAppendTo !== undefined) {
                        errorLabel2 = thatAppendTo.find('[id=' + that.attr('name') + '_error_label]');
                        errorLabel2.prev('br').remove();
                        errorLabel2.next('br').remove();
                        errorLabel2.remove();
                    }
                    id = that.attr('name');
                    that.parent().addClass('error');
                }

                errorLabel.prev('br').remove();
                errorLabel.next('br').remove();
                errorLabel.remove();
                if (thatAppendTo !== undefined && thatAppendTo !== "undefined") {
                    $('<br/><label id="' + id + '_error_label" class="labelerror ' + errorClass + '">' + message + '</label><br/>').appendTo(thatAppendTo);
                } else if (that.attr('type') === 'radio' || that.attr('type') === 'checkbox') {
                    $('<br/><label id="' + id + '_error_label" class="labelerror ' + errorClass + '">' + message + '</label><br/>').appendTo(that.parents('[name=' + that.attr('name') + ']').first());
                } else {
                    $('<br/><label id="' + id + '_error_label" class="labelerror ' + errorClass + '">' + message + '</label><br/>').appendTo(that.parent());
                }
                that.data('errored', true);
                that.addClass('error');
            });
        },
        //Function to get the default rules
        getDefaultRules: function () {
            return $.fn.validateHandle.defaults.defaultRule;
        }
    });
    $.extend({
        validateHandle: function (settings) {
            return $().validateHandle(settings);
        },
        addRule: function (rule, errorMessage) {
            return $().addRule(rule, errorMessage);
        },
        validate: function () {
            return $().validate();
        },
        removeError: function () {
            return $().removeError();
        },
        raiseError: function (rule) {
            return $().raiseError(rule);
        },
        getDefaultRules: function () {
            return $().getDefaultRules();
        }
    });
    $.fn.validateHandle.defaults = {
        defaultRule: {  //Default Rules are always executed before any other rule on an element.
				password: {rule:/^[a-zA-Z0-9]{6,100}$/,
					message:"Must be 6-100 characters in length."},
				username: {rule:/^[a-z0-9]{1,50}$/,
					message:"Must be 1-50 characters(a-z and 0-9) in length."},
				unicodeNonSpecial: {rule:/^([\s]*[a-zA-Z\u00C0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{1}[\s]*){1,100}$/,
					message:"Must be 1-100 characters in length. No special characters (!.*%@#)."},
				telephone: {rule:/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
					message:"Must be a valid telephone number."},
				email: {rule:/\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}/,
					message:"Must be a valid email address." }
           },
        appendTo: undefined,
        errorClass: ""
    };
})(jQuery);
