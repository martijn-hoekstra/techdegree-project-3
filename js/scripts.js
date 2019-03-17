// Global variables
const colors = $('#color').children();
const labels = $('.activities label');
const name = $('#name');
const mail = $('#mail');
const creditCardNum = $('#cc-num');
const zipCode = $('#zip');
const cvv = $('#cvv');
let grandTotal = 0;

$('#color').empty();
$('#colors-js-puns').hide();

// Select credit card as default payment option, and hide other payment information
$('#payment option:contains("Credit Card")').prop('selected',true);
$('#paypal, #bitcoin').hide();

$('.activities').append('<div class="grandTotal"></div>');

// Diplays or hides the job role input field
$('#other-title').hide();
$('#title').on('change', e => {
  if($(e.target).val() === 'other') {
    $('#other-title').show();
  } else {
    $('#other-title').hide();
  }
}); // end event listener

// Generates error messages based on the input field's id
const errorMessage = (parent, type, value) => {
  let fieldType = '';
  const error = parent.find('.errorMessage');
  switch(type){
    case 'name':
      fieldType = 'name';
      break;
    case 'mail':
      fieldType = 'email address';
      break;
    case 'cc-num':
      fieldType = 'credit card number';
      break;
    case 'zip':
      fieldType = 'zip code';
      break;
    case 'cvv':
      fieldType = 'CVV number';
      break;
  }

  // Checks if there's already an error message displayed
  const outputError = message => {
    if(error.length) {
      error.text(message);
    } else {
      parent.append(`<span class="errorMessage">${message}</span>`);
    }
  }

  // Only check credit card information when credit card is selected as payment method
  if(value.length) {
    if($('#payment').val() === 'credit card') {
      if(fieldType === 'credit card number' && (value.length < 13 || value.length > 16)) {
        outputError(`Please enter a ${fieldType} that is between 13 and 16 digits long.`);
      }
      if(fieldType === 'zip code' && value.length !== 5) {
        outputError(`Please enter a ${fieldType} that is 5 digits long.`);
      }
      if(fieldType === 'CVV number' && value.length !== 3) {
        outputError(`Please enter a ${fieldType} that is 3 digits long.`);
      }
    }
  } else {
    outputError(`Please enter your ${fieldType}.`);
  }
}

/***
  Validate data and add or remove 'invalid' class to elements.
  Also calls errorMessage function to display error messages.
  ***/
const validate = (regex, element) => {
  const value = element.val();
  const parent = element.parent();
  const fieldType = element.attr('id');

  if(regex.test(value)) {
    if(element.hasClass('invalid')) {
      element.removeClass('invalid');
      if(parent.find('.errorMessage').length) {
        parent.find('.errorMessage').remove();
      }
    }
    return true;
  } else {
    if(!(element.hasClass('invalid'))) {
      element.addClass('invalid');
    }
    errorMessage(parent, fieldType, value);
    return false;
  }
}; // end function

/***
  Changes t-shirt colors based on what theme is selected by the user.
  Colors are shown only when a theme is selected.
***/
$('#design').on('change', e => {
  $('#color').empty();
  if($(e.target).val() === 'js puns') {
    $('#colors-js-puns').show();
    colors.each(function(){
      if($(this).val() === 'cornflowerblue' || $(this).val() === 'darkslategrey' || $(this).val() === 'gold'){
        $('#color').append($(this));
      }
    });
  } else if($(e.target).val() === 'heart js') {
    $('#colors-js-puns').show();
    colors.each(function(){
      if($(this).val() === 'tomato' || $(this).val() === 'steelblue' || $(this).val() === 'dimgrey'){
        $('#color').append($(this));
      }
    });
  } else {
    $('#colors-js-puns').hide();
    $('#color').empty();
  }
}); // end event listener

/***
  Adds event listener to activities list. Whenever an activity is checked,
  the price will be added to a total price underneath the acitivity section.
  Also the time and day of the activity is checked and compared to other
  activities. When there are other acitivities on the same day and time,
  they will be disabled to select for the user.
***/

$('.activities').on('change', e => {
  const regexNew = /^([a-zA-Z\s\.]+\s—\s)([\w\s-]+)?(,\s)?\$([\d]+)$/;
  const activity = $(e.target).parent().text();
  const checked = $(e.target).is(':checked');
  const time = activity.replace(regexNew, '$2');
  // Compares time and day of activity and disables activities when needed
  if(time !== '') {
    labels.each(function(index, element){
      if(time === $(this).text().replace(regexNew, '$2') && $(this).text() !== activity) {
        if(checked) {
          $(this).find(":checkbox").attr('disabled',true);
        } else {
          $(this).find(":checkbox").attr('disabled',false);
        }
      }
    });
  }
  // Adds price of activity to total price
  if(checked){
    grandTotal += parseInt(activity.replace(regexNew, '$4'));
    $('.grandTotal').html(`<p>Total: $${grandTotal}</p>`);
  } else {
    grandTotal -= parseInt(activity.replace(regexNew, '$4'));
    if(grandTotal > 0) {
      $('.grandTotal').html(`<p>Total: $${grandTotal}</p>`);
    } else {
      $('.grandTotal').html('');
    }
  }
}); // end event listener

// Hides and shows payment information based on what payment method is selected by the user
$('#payment').on('change', e => {
  if($(e.target).val() === 'paypal') {
    $('#credit-card, #bitcoin').hide();
    $('#paypal').fadeIn(1000);
  } else if($(e.target).val() === 'bitcoin') {
    $('#credit-card, #paypal').hide();
    $('#bitcoin').fadeIn(1000);
  } else if($(e.target).val() === 'credit card') {
    $('#paypal, #bitcoin').hide();
    $('#credit-card').fadeIn(1000);
  } else {
    $('#payment option:contains("Credit Card")').prop('selected',true);
    $('#paypal, #bitcoin').hide();
    $('#credit-card').fadeIn(1000);
  }
}); // end event listener

// Adds event listener to name input field
name.on('keyup blur', e => {
  validate(/^[a-zA-Z\s]{2,}$/, $(e.target));
});
// Adds event listener to email input field
mail.on('keyup blur', e => {
  validate(/^[^@]+@[^@]+\.[a-z]+$/i, $(e.target));
});

// Adds event listener to credit card number input field
creditCardNum.on('keyup blur', e => {
  validate(/^\d{13,16}$/, $(e.target));
});

// Adds event listener to zip code input field
zipCode.on('keyup blur', e => {
  validate(/^\d{5}$/, $(e.target));
});

// Adds event listener to CVV number input field
cvv.on('keyup blur', e => {
  validate(/^\d{3}$/, $(e.target));
});

/***
  Checks if all the required input fields are entered correctly
  and if at least one activity is checked.
  Returns true if all is fine, false if something isn't right.
***/
const validateForm = () => {
  const nameCorrect = validate(/^[a-zA-Z\s]{2,}$/, name);
  const mailCorrect = validate(/^[^@]+@[^@]+\.[a-z]+$/i, mail);
  const activitiesCorrect = Boolean($('.activities :checkbox:checked').length);

  // Validate Register for Activities (only one checkbox has to be checked)
  if ($(".activities :checkbox:checked").length === 0) {
    $('.activities').addClass('invalid');
  } else {
    $('.activities').removeClass('invalid');
  }

  // Validates creditcard information and then checks the whole form.
  if($('#payment').val() === 'credit card') {
    const creditCardNumCorrect = validate(/^\d{13,16}$/, creditCardNum);
    const zipCodeCorrect = validate(/^\d{5}$/, zipCode);
    const cvvCorrect = validate(/^\d{3}$/, cvv);

    if(nameCorrect && mailCorrect && creditCardNumCorrect && zipCodeCorrect && cvvCorrect && activitiesCorrect) {
      return true;
    }
  } else {
    if(nameCorrect && mailCorrect && activitiesCorrect) {
      return true;
    }
  }
}; // end function

// Adds event listener to submit button. If the form has errors, the user won't be able to submit.
$('form').on('submit', e => {
  if(!validateForm()) {
    e.preventDefault();
  }
}); // end event listener
