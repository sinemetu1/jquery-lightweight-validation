[Lightweight jQuery Validation](http://samonstuff.blogspot.com/2011/03/jquery-lightweight-validation-plugin.html)
================================================================================================================


## Using the plugin

 1.   <pre><code>$('.selector').validateHandle();</code></pre> to initialize where selector is the set of elements you would like validated.
		  a. Add default rule keys as classes to elements that you would like the default rule to apply to.
		  		<pre><code><div>
					<input type="text" class="validate username"/>
				</div></code></pre>
			 The username class denotes that it will be validated against the default username rule first and then validated against any other rules that are added to the element.

		  It is good practice to surround validated inputs with a <div> so that the message is shown below the input instead of at the end of the form.

		  For <input type="radio" /> the desired structure is:
		  <pre><code> 
		  <!--The top div has the same name attribute as the radio buttons.-->
		  <!--This is so that the error label gets appended to the right div and the error class gets added to the right div as well.-->
		  <!--Otherwise we see the error message but not an error class.-->
		  <div id="someid" name="isRadioSet" style="display:inline-block;">
			  <div>
				  <input type="radio" name="isRadioSet">Some Text1</input>
				  <br />
				  <input type="radio" name="isRadioSet">Some Text2</input>
				  <br />
				  <input type="radio" name="isRadioSet">Some Text3</input>
			  </div>
		  </div>
		  </code></pre>
		  b. Options: errorClass - an error class that gets added to the displayed error message: 
		  						   <pre><code>$('.selector').validateHandle({ errorClass : "someClass" });</code></pre>
					  appendTo - an element that you would like to append the error messages to:
					  			   <pre><code>$('.selector').validateHandle({ appendTo : $('#div_error_area') });</code></pre>


 2.   Adding custom rules to elements:
			  <pre><code>$('.selector').addRule({ "rule": new RegExp("^[a-zA-Z0-9]{4,24}$"), "message": "Must be 4-24 characters in length." });</code></pre>
			  or
			  <pre><code>// Applies to <select>, <input type="checkbox" />, <input type="radio" /> elements
			  $('.selector').addRule({ "rule": { "minLength" : 1 }, "message": "Must select at least 1" });</code></pre> 
			  or
			  <pre><code>// Using boolean returning function for validation:
			  $('.selector').addRule({ "bool" : function(){ return $('#example').val() !== '';}, "message": "Input cannot be blank." });</code></pre>
		  	  *** When using a "bool" property for validation it is important to understand that the function being passed does not preserve context
			  instead of using $(this), explicitly declare the element like $('#theElementYouWantToUse').val()
			  or
			  <pre><code>// Using minLength operation and appendTo option:
			  $('.selector').addRule({"rule": {"minLength" : 1}, "message": "Must select at least 1.", "appendTo": $('#div_error_area')});</code></pre>

 3.   Call <pre><code>$('.selector').validate();</code></pre> when you would like to see whether the inputs are valid.
