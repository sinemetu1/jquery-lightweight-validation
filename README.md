[Lightweight jQuery Validation](http://samonstuff.blogspot.com/2011/03/jquery-lightweight-validation-plugin.html)
==
##1. Init the plugin
  `$('.selector').validateHandle();` to initialize where selector is the set of elements you would like validated.
		  
  <h4>A. Add default rule keys as classes to elements that you would like the default rule to apply to.</h4>
  
  ```html
  <div>
  	  <input type="text" class="validate username"/>
  </div>
  ```
  
  The username class denotes that it will be validated against the default username rule first and then validated against any other rules that are added to the element.***It is good practice to surround validated inputs with a `<div>` so that the message is shown below the input instead of at the end of the form.

  For `<input type="radio" />` the desired structure is for there to be a top div which has the same name attribute as the radio buttons.This is so that the error label gets appended to the right div and the error class gets added to the right div as well.Otherwise we see the error message but not an error class.

  ```html
  <div id="someid" name="isRadioSet" style="display:inline-block;">
	  <div>
		  <input type="radio" name="isRadioSet">Some Text1</input>
		  <br />
		  <input type="radio" name="isRadioSet">Some Text2</input>
		  <br />
		  <input type="radio" name="isRadioSet">Some Text3</input>
	  </div>
  </div>
  ```

  <h4>B. Options:</h4>

  errorClass - an error class that gets added to the displayed error message: 
  ```
  $('.selector').validateHandle({ errorClass : "someClass" });
  ```

  appendTo - an element that you would like to append the error messages to:
  ```
  $('.selector').validateHandle({ appendTo : $('#div_error_area') });
  ```

##2. Add custom rules to elements

  ```
  $('.selector').addRule({
      "rule": /^[a-zA-Z0-9]{4,24}$/,
	  "message": "Must be 4-24 characters in length."
  });
  ```

  or using `"minLength"` which applies to `<select>`, `<input type="checkbox" />`, `<input type="radio" />` elements:

  ```
  $('.selector').addRule({
      "rule": { "minLength" : 1 },
  	  "message": "Must select at least 1"
  });
  ```

  or using boolean returning function for validation:

  ```
  $('.selector').addRule({
      "bool" : function () {
		  return $('#example').val() !== '';
	  }, 
	  "message": "Input cannot be blank." 
  });
  ```

  *** When using a "bool" property for validation it is important to understand that the function being passed does not preserve context
  instead of using `$(this)`, explicitly declare the element like `$('#theElementYouWantToUse')`

  or using minLength operation and appendTo option:
  
  ```
  $('.selector').addRule({
	  "rule": { "minLength" : 1 },
	  "message": "Must select at least 1.",
	  "appendTo": $('#div_error_area')
  });
  ```

##3. Validate the elements
Call `$('.selector').validate();` when you would like to see whether the inputs are valid.
