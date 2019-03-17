/***
  TODO LIST
  v User cannot select two activities that are at the same time.
  - Let the form submit when all info is correct
  v Add invalid style for activities checkboxes
  - Display real-time error messages for user input
    . Form provides at least one error message in real time, before the form is submitted.
      For example, the error message appears near the email field when the user begins to type,
      and disappears as soon as the user has entered a complete and correctly formatted email address.
    . Form provides at least one error message that changes depending on the error.
      For example, the email field displays a different error message when the email
      field is empty than it does when the email address is formatted incorrectly.
      *This is accomplished without the use of HTML5's built-in field validation.
  - Check when JavaScript is disabled, all form fields and payment information is displayed,
    including the "Other" field under the "Job Role" section.
***/

// Global variables
const colors = $('#color').children();
const labels = $('.activities label');
const name = $('#name');
const mail = $('#mail');
const creditCardNum = $('#cc-num');
const zipCode = $('#zip');
const cvv = $('#cvv');
$('#color').empty();
$('#colors-js-puns').hide();

let grandTotal = 0;

$('#payment option:contains("Credit Card")').prop('selected',true);
$('#paypal, #bitcoin').hide();

$('.activities').append('<div class="grandTotal"></div>');

// Job role
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

  // checks if there's already an error message displayed
  const outputError = message => {
    if(error.length) {
      error.text(message);
    } else {
      parent.append(`<span class="errorMessage">${message}</span>`);
    }
  }

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

// Validate data and add or remove 'invalid' class to elements
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

// T-shirt info
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

// Register for activities
$('.activities').on('change', e => {
  const regexNew = /^([a-zA-Z\s\.]+\s—\s)([\w\s-]+)?(,\s)?\$([\d]+)$/;
  const activity = $(e.target).parent().text();
  const checked = $(e.target).is(':checked');
  // if($(e.target).is(':checked')) {
  const time = activity.replace(regexNew, '$2');
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

// Payment info
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

name.on('keyup blur', e => {
  validate(/^[a-zA-Z\s]{2,}$/, $(e.target));
});

mail.on('keyup blur', e => {
  validate(/^[^@]+@[^@]+\.[a-z]+$/i, $(e.target));
});

creditCardNum.on('keyup blur', e => {
  validate(/^\d{13,16}$/, $(e.target));
});

zipCode.on('keyup blur', e => {
  validate(/^\d{5}$/, $(e.target));
});

cvv.on('keyup blur', e => {
  validate(/^\d{3}$/, $(e.target));
});

// Validate form
const validateForm = form => {
  validate(/^[a-zA-Z\s]{2,}$/, name);
  validate(/^[^@]+@[^@]+\.[a-z]+$/i, mail);

  // Validate Register for Activities (only one checkbox has to be checked)
  if ($(".activities :checkbox:checked").length === 0) {
    $('.activities').addClass('invalid');
  } else {
    $('.activities').removeClass('invalid');
  }

  // Validate creditcard information
  if($('#payment').val() === 'credit card') {
    validate(/^\d{13,16}$/, creditCardNum);
    validate(/^\d{5}$/, zipCode);
    validate(/^\d{3}$/, cvv);
  }
}; // end function

$('form').on('submit', e => {
  e.preventDefault();
  validateForm();
}); // end event listener
